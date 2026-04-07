import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración global del ícono esmeralda de Leaflet
const greenMarkerSvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">'
  + '<path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#16a34a" stroke="#0f6b2a" stroke-width="1"/>'
  + '<circle cx="12.5" cy="12.5" r="4.5" fill="#ffffff" fill-opacity="0.9"/>'
  + '</svg>'
)}`;

// Merge configuration (solo lo hace una vez en el ciclo de vida del componente)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: greenMarkerSvg,
  iconRetinaUrl: greenMarkerSvg,
  shadowUrl: markerShadow,
});

/**
 * Componente modular del Visor Cartográfico (HU005)
 * @param {Array} sitios - Arreglo con la data (lat, lng, nombre, imágenes) traída del backend.
 */
export default function InteractiveMap({ sitios = [] }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersLayerRef = useRef(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = !user;

  // 1. Inicializar mapa y tiles
  useEffect(() => {
    if (isGuest) return; // Si es invitado ignoramos cargar el mapa pesado
    if (!mapContainerRef.current || mapRef.current) return;

    // Viewport inicial (Eje Cafetero aprox)
    const map = L.map(mapContainerRef.current, { scrollWheelZoom: false }).setView([4.8087, -75.6906], 9);
    
    // Controles de UX móviles y desktop
    map.on('click', () => { map.scrollWheelZoom.enable(); });
    map.on('mouseout', () => { map.scrollWheelZoom.disable(); });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    
    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => { 
      map.remove(); 
      mapRef.current = null; 
      markersLayerRef.current = null; 
    };
  }, [isGuest]);

  // 2. Graficar Pines Interactivos y Centrar Viweport
  useEffect(() => {
    if (isGuest) return;
    if (!mapRef.current || !markersLayerRef.current) return;
    
    const layer = markersLayerRef.current;
    layer.clearLayers();

    const customPin = L.divIcon({
      className: 'custom-pin',
      html: `<div style="width: 20px; height: 20px; background-color: #059669; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);"></div>`,
      iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -12]
    });

    const bounds = [];
    
    sitios.forEach((sitio) => {
      const lat = parseFloat(sitio.lat);
      const lng = parseFloat(sitio.lng);
      
      // Si la API mandó latitud y longitud válidas
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        const marker = L.marker([lat, lng], { icon: customPin });
        
        // Extracción de etiquetas y estilos
        const labelsList = Array.isArray(sitio.label) ? sitio.label : (Array.isArray(sitio.labels) ? sitio.labels : []);
        const badgesHtml = labelsList.filter(Boolean).slice(0, 3).map(labelObj => {
          const name = labelObj?.name || (typeof labelObj === 'string' ? labelObj : null);
          if (!name || name === 'Sin etiquetas') return '';
          let color = '#059669'; 
          if (labelObj?.color) color = labelObj.color.startsWith('#') ? labelObj.color : `#${labelObj.color}`;
          let bgColor = color + '26'; let borderColor = color + '66';
          return `<span style="color: ${color}; background-color: ${bgColor}; border: 1px solid ${borderColor}; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; white-space: nowrap;">${name}</span>`;
        }).join('');
        const labelsContainerHtml = badgesHtml ? `<div style="display:flex; flex-wrap:wrap; gap:4px; justify-content:center; margin-top:2px;">${badgesHtml}</div>` : '';
        
        // Extracción de Imagen para el Popup
        let imageUrl = '';
        if (sitio.cover) imageUrl = sitio.cover.startsWith('http') ? sitio.cover : `${import.meta.env.VITE_API_URL}/api/files/${sitio.cover}`;
        else if (sitio.portada) imageUrl = sitio.portada.startsWith('http') ? sitio.portada : `${import.meta.env.VITE_API_URL}/api/files/${sitio.portada}`;
        else if (sitio.imagen) imageUrl = sitio.imagen.startsWith('http') ? sitio.imagen : `${import.meta.env.VITE_API_URL}/api/files/${sitio.imagen}`;
        
        const popupHtml = `
          <div class="popup-card" style="display:flex;flex-direction:column;gap:6px;cursor:pointer;max-width:220px;align-items:center;">
            <strong style="font-size:14px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;display:block;">${sitio.name || 'Sitio'}</strong>
            ${imageUrl ? `<img loading="lazy" src='${imageUrl}' alt='${sitio.name || 'Sitio'}' style='width:100%;max-width:180px;max-height:110px;object-fit:cover;border-radius:10px;margin:4px 0;'/>` : ''}
            ${labelsContainerHtml}
          </div>
        `;
        
        marker.bindPopup(popupHtml);
        
        // Enrrutamiento dinámico por Roles al hacer click en el Popup del mapa
        marker.on('popupopen', (e) => {
          const popupEl = e.popup.getElement();
          const card = popupEl?.querySelector('.popup-card');
          if (card && !card.dataset.bound) {
            card.dataset.bound = 'true';
            card.addEventListener('click', () => {
              if (user?.role === 'admin') navigate(`/admin/sitio/${sitio.id}`);
              else if (user && user.role !== 'operator') navigate(`/turista/sitio/${sitio.id}`);
              else navigate(`/sitio/${sitio.id}`);
            });
          }
        });

        marker.addTo(layer);
        bounds.push([lat, lng]);
      }
    });

    // Ajustar el Viewport global para que todos los continentes/pines encajen dinámicamente
    if (bounds.length > 0) mapRef.current.fitBounds(bounds, { padding: [30, 30] });

  }, [sitios, isGuest, navigate, user]);

  return (
    <div className="w-full relative">
      {!isGuest ? (
        <div ref={mapContainerRef} className="w-full h-[520px] rounded-2xl ring-1 ring-emerald-100 shadow-lg z-0" />
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center">
          <h3 className="text-xl font-semibold text-emerald-700 mb-2">Registrate para ver el mapa completo</h3>
          <p className="text-sm text-slate-600">Accede a ubicaciones exactas y rutas sugeridas.</p>
        </div>
      )}
    </div>
  );
}