import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Footer from './components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getAllPlaces } from './services/placesApi';
import { api, fetchRecommendations } from './services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SitioCard from './components/SitioCard';

// 👉 NUEVO (HU004): Importamos nuestro componente avanzado
import SearchBar from './components/SearchBar';

// Fix para los iconos de Leaflet en Vite/React
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const greenMarkerSvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">'
  + '<path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#16a34a" stroke="#0f6b2a" stroke-width="1"/>'
  + '<circle cx="12.5" cy="12.5" r="4.5" fill="#ffffff" fill-opacity="0.9"/>'
  + '</svg>'
)}`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: greenMarkerSvg,
  iconRetinaUrl: greenMarkerSvg,
  shadowUrl: markerShadow,
});

export default function ColeccionPage({ onNavigateHome, onNavigateLogin, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [scrollToTop, setScrollToTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState([0, 0, 0]);
  const [sitiosAPI, setSitiosAPI] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const tagMenuRef = useRef(null);
  const sortMenuRef = useRef(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [randomRecommendations, setRandomRecommendations] = useState([]);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const loadSites = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);
      const data = await getAllPlaces('');
      setSitiosAPI(data);
      if (!Array.isArray(data) || data.length === 0) {
        setApiError('La API respondió vacío o no hay sitios disponibles.');
        console.warn('API /api/places respondió vacío:', data);
      }
    } catch (error) {
      setApiError('Error cargando sitios: ' + (error?.message || 'Error desconocido'));
      setSitiosAPI([]);
      console.error('Error cargando sitios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar sitios desde la API
  useEffect(() => {
    loadSites();
  }, [user, location.pathname, loadSites]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target)) {
        setTagMenuOpen(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.hash !== '#recomendaciones') return;
    const target = document.getElementById('recomendaciones');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const isTourist = user && user.role !== 'admin' && user.role !== 'operator';
  const isAdminOrOperator = user && (user.role === 'admin' || user.role === 'operator');
  const isGuest = !user;
  const shortText = (value, max = 110) => {
    if (!value) return '';
    const text = value.toString().trim();
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
  };

  const loadFavorites = useCallback(async () => {
    if (!isTourist) return;
    try {
      const response = await api.get('/api/favorites');
      const ids = new Set((response.data || []).map((fav) => fav.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  }, [isTourist]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!isTourist) return;
      try {
        setRecommendationsLoading(true);
        const data = await fetchRecommendations();
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (error) {
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };
    loadRecommendations();
  }, [isTourist]);

  useEffect(() => {
    if (isTourist) {
      if (recommendations.length > 0) {
        setRandomRecommendations([]);
        return;
      }
      if (sitiosAPI.length === 0) return;
      const shuffled = [...sitiosAPI].sort(() => Math.random() - 0.5);
      setRandomRecommendations(shuffled);
      return;
    }
    if (!isAdminOrOperator && !isGuest) return;
    if (sitiosAPI.length === 0) {
      setRandomRecommendations([]);
      return;
    }
    const shuffled = [...sitiosAPI].sort(() => Math.random() - 0.5);
    setRandomRecommendations(shuffled);
  }, [isTourist, isAdminOrOperator, isGuest, recommendations, sitiosAPI]);

  const handleToggleFavorite = async (event, sitioId) => {
    event.stopPropagation();
    if (!user) {
      onNavigateLogin?.();
      return;
    }
    if (!isTourist) return;
    const isFavorite = favoriteIds.has(sitioId);
    try {
      if (isFavorite) {
        await api.delete(`/api/places/${sitioId}/favorite`);
      } else {
        await api.post(`/api/places/${sitioId}/favorite`);
      }
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) {
          next.delete(sitioId);
        } else {
          next.add(sitioId);
        }
        return next;
      });
    } catch (error) {
      console.error('Error actualizando favorito:', error);
    }
  };

  const uniqueTags = useMemo(() => {
    const tags = new Set();
    sitiosAPI.forEach(sitio => {
      const labelNames = Array.isArray(sitio.label)
        ? sitio.label.map((label) => label?.name ?? label)
        : Array.isArray(sitio.labels)
          ? sitio.labels.map((label) => label?.name ?? label)
          : [];
      labelNames.forEach(t => { if (t) tags.add(t); });
    });
    return Array.from(tags).sort();
  }, [sitiosAPI]);

  // 👉 NUEVO (HU004): Cálculo inteligente de sugerencias al vuelo (hasta 5)
  const searchSuggestions = useMemo(() => {
    if (!searchText.trim()) return [];
    const lower = searchText.toLowerCase();
    return sitiosAPI.filter(s => {
      const nameMatches = (s.name || s.nombre || '').toLowerCase().includes(lower);
      const textMatches = (s.slogan || s.description || '').toLowerCase().includes(lower) || 
                          (s.localization || '').toLowerCase().includes(lower);
      return nameMatches || textMatches;
    }).slice(0, 5);
  }, [sitiosAPI, searchText]);

  const filteredSitios = useMemo(() => {
    let result = [...sitiosAPI];
    // 1. Text Search (ahora alimentado por el SearchBar optimizado)
    if (searchText.trim()) {
       const lower = searchText.toLowerCase();
       result = result.filter(s => {
         const nameMatches = (s.name || s.nombre || '').toLowerCase().includes(lower);
         const textMatches = (s.slogan || s.description || '').toLowerCase().includes(lower) || 
                             (s.localization || '').toLowerCase().includes(lower);
         return nameMatches || textMatches;
       });
    }
    // 2. Tag Filter
    if (selectedTag) {
       result = result.filter(s => {
          const tags = Array.isArray(s.label) ? s.label.map(t => t?.name || t) : 
                       Array.isArray(s.labels) ? s.labels.map(t => t?.name || t) : [];
          return tags.includes(selectedTag);
       });
    }
    // 3. Sorting
    if (sortBy === 'recent') {
       result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'az') {
       result.sort((a, b) => (a.name || a.nombre || '').localeCompare(b.name || b.nombre || ''));
    } else if (sortBy === 'za') {
       result.sort((a, b) => (b.name || b.nombre || '').localeCompare(a.name || a.nombre || ''));
    }
    return result;
  }, [sitiosAPI, searchText, selectedTag, sortBy]);

  // Datos de sitios fake...
  const sitios = [
    { id: 1, nombre: 'Santuario Fauna Flora Otún', ubicación: 'Via Pereira- La virginia', imagen: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.webp' }
  ];

  const recomendaciones = [
    { id: 1, nombre: 'Ecoturismo en Risaralda', imagen: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.webp' }
  ];

  const heroShots = [
    { id: 'h1', nombre: 'Palmas de cera', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_01.webp' },
    { id: 'h2', nombre: 'Bandera de Colombia', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_02.webp' },
    { id: 'h3', nombre: 'Colibrí en juncos', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_03.webp' },
  ];

  useEffect(() => {
    if (isGuest) return;
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, { scrollWheelZoom: false }).setView([4.8087, -75.6906], 9);
    map.on('click', () => { map.scrollWheelZoom.enable(); });
    map.on('mouseout', () => { map.scrollWheelZoom.disable(); });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    return () => { map.remove(); mapRef.current = null; markersLayerRef.current = null; };
  }, [isGuest]);

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
    sitiosAPI.forEach((sitio) => {
      const lat = parseFloat(sitio.lat);
      const lng = parseFloat(sitio.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        const marker = L.marker([lat, lng], { icon: customPin });
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

    if (bounds.length > 0) mapRef.current.fitBounds(bounds, { padding: [30, 30] });
  }, [sitiosAPI, isGuest, navigate, user]);

  const baseFallback = recommendations.length === 0 ? randomRecommendations : sitiosAPI;
  const fallbackRecommendations = baseFallback.filter((item) => item?.id && !recommendations.some((rec) => rec.id === item.id));
  const recommendedList = isTourist
    ? [...recommendations, ...fallbackRecommendations].slice(0, 8)
    : ((isAdminOrOperator || isGuest) ? randomRecommendations.slice(0, 8) : recomendaciones);
  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');

  return (
    <div className="min-h-screen coleccion-shell text-slate-900 overflow-x-hidden pt-14">
      <main className="pt-0">
        {/* Sección 1: Hero con trío de imágenes y buscador */}
        <section className="relative w-full pt-16 pb-28 sm:py-16 md:py-12 lg:py-20 coleccion-hero z-40">
          <div className="relative z-10 flex flex-col items-center gap-12 px-6 xl:flex-row xl:items-center xl:justify-center xl:gap-16 2xl:gap-24 md:px-12 max-w-[1536px] mx-auto">
            
            <div className="w-full xl:w-auto flex justify-center">
              <div className="flex w-full md:w-auto gap-4 lg:gap-6 xl:gap-8 justify-center">
                {heroShots.map((shot, idx) => (
                  <div key={shot.id} className="flex items-end w-[30vw] sm:w-[130px] md:w-[150px] lg:w-[180px] xl:w-[210px]">
                    <img fetchpriority="high" decoding="async" src={shot.imagen} alt={shot.nombre} style={{ opacity: 0, transition: `opacity 0.8s ease ${idx * 0.2}s, transform 0.8s ease ${idx * 0.2}s`, transform: 'translateY(18px)' }}
                      onLoad={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      className={`object-cover rounded-[18px] sm:rounded-[22px] shadow-lg w-full h-[220px] min-[400px]:h-[320px] md:h-[260px] lg:h-[440px] xl:h-[480px] ${idx === 1 ? 'h-[240px] min-[400px]:h-[340px] md:h-[290px] lg:h-[470px] xl:h-[510px]' : ''}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Derecha: Título y Buscador Avanzado */}
            <div className="relative z-[60] w-full xl:w-[500px] flex flex-col items-center xl:items-start gap-6 xl:gap-8 shrink-0">
              <div className="text-center xl:text-left space-y-2">
                <h1 className="text-3xl min-[400px]:text-4xl md:text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">Explora y conecta con la naturaleza</h1>
                <p className="text-slate-700 md:text-sm lg:text-base">Busca sitios, actividades y experiencias sostenibles.</p>
              </div>
              
              <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[500px]">
                
                {/* 👉 NUEVO (HU004): Inyectamos el Componente Inteligente aquí */}
                <SearchBar 
                  onSearch={(val) => setSearchText(val)}
                  suggestions={searchSuggestions}
                  onSelectSuggestion={(item) => setSearchText(item.nombre || item.name || '')}
                />
                
                {/* Filters Menu */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full relative z-[50]">
                  <div className="relative flex-1" ref={tagMenuRef}>
                    <button type="button" onClick={() => setTagMenuOpen((prev) => !prev)} className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50 shadow-sm">
                      <span className="truncate">{selectedTag || 'Todas las etiquetas'}</span>
                      <svg className={`h-4 w-4 shrink-0 transition-transform duration-200 ${tagMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {tagMenuOpen && (
                      <div className="absolute left-0 right-0 mt-2 rounded-xl bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open max-h-[80px] sm:max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
                        <button type="button" onClick={() => { setSelectedTag(''); setTagMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">Todas las etiquetas</button>
                        {uniqueTags.map(tag => (
                          <button key={tag} type="button" onClick={() => { setSelectedTag(tag); setTagMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">{tag}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1" ref={sortMenuRef}>
                    <button type="button" onClick={() => setSortMenuOpen((prev) => !prev)} className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50 shadow-sm">
                      <span className="truncate">{sortBy === 'recent' ? 'Más recientes' : sortBy === 'az' ? 'A - Z' : 'Z - A'}</span>
                      <svg className={`h-4 w-4 shrink-0 transition-transform duration-200 ${sortMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {sortMenuOpen && (
                      <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open max-h-[80px] sm:max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
                        <button type="button" onClick={() => { setSortBy('recent'); setSortMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">Más recientes</button>
                        <button type="button" onClick={() => { setSortBy('az'); setSortMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">A - Z</button>
                        <button type="button" onClick={() => { setSortBy('za'); setSortMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">Z - A</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Sección 2: Sitios Creados desde la API */}
        <section className="w-full bg-white py-16 px-4 sm:px-8 md:px-0 relative">
            <div className="px-6 md:px-12 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
              <h2 className="text-3xl font-bold">Sitios Ecoturísticos</h2>
              {(user?.role === 'admin' || user?.role === 'operator') && (
                <button
                  onClick={() => navigate('/crear-sitio')}
                  className="rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600 transition md:px-6 md:py-3 md:text-lg"
                >
                  + Crear Sitio
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
              </div>
            ) : filteredSitios.length === 0 ? (
              <div className="px-6 md:px-12 py-12 text-center text-rose-600 font-semibold">
                No hay sitios disponibles para mostrar según los filtros seleccionados.<br />
                {apiError && <span className="block text-xs text-rose-700 mt-2">{apiError}</span>}
                <span className="block text-xs text-slate-500 mt-2">(Intenta limpiar tu búsqueda o selecciona otra etiqueta.)</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 md:px-12">
                {filteredSitios.map((sitio, index) => (
                  <SitioCard 
                    key={sitio.id}
                    sitio={sitio}
                    index={index}
                    user={user}
                    isTourist={isTourist}
                    isGuest={isGuest}
                    isFavorite={favoriteIds.has(sitio.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onNavigate={navigate}
                  />
                ))}
              </div>
            )}
          </section>
        

        {/* Botón de Crear Sitio si no hay sitios */}
        {sitiosAPI.length === 0 && !loading && searchText.trim() === '' && (user?.role === 'admin' || user?.role === 'operator') && (
          <section className="w-full bg-white py-16 px-6 md:px-12">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Aún no hay sitios creados</h2>
              <p className="text-slate-600">Sé el primero en agregar un sitio ecoturístico</p>
              <button
                onClick={() => navigate('/crear-sitio')}
                className="rounded-full bg-emerald-500 px-8 py-4 font-semibold text-white hover:bg-emerald-600 transition"
              >
                + Crear Primer Sitio
              </button>
            </div>
          </section>
        )}

        {/* Sección 3: Recomendaciones (scroll lateral) */}
        <section id="recomendaciones" className="w-full bg-white py-16 pb-20 px-0 md:px-0">
          <div className="mb-8 px-6 md:px-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Recomendaciones</h2>
            <div className="flex items-center rounded-full border border-emerald-100 bg-white shadow-sm overflow-hidden">
              <button 
                type="button"
                onClick={() => document.getElementById('recomendaciones-scroll')?.scrollBy({ left: -340, behavior: 'smooth' })}
                className="grid place-items-center w-10 h-8 px-2 text-emerald-600/60 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:bg-emerald-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="w-[1px] h-4 bg-emerald-100/60"></div>
              <button 
                type="button"
                onClick={() => document.getElementById('recomendaciones-scroll')?.scrollBy({ left: 340, behavior: 'smooth' })}
                className="grid place-items-center w-10 h-8 px-2 text-emerald-600/60 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:bg-emerald-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div id="recomendaciones-scroll" className="overflow-x-auto scrollbar-none px-6 md:px-12">
            <div className="flex gap-6 md:gap-8 snap-x snap-mandatory pr-6 md:pr-12">
              {recommendationsLoading ? (
                <div className="text-sm text-slate-600">Cargando recomendaciones...</div>
              ) : recommendedList.length === 0 ? (
                <div className="text-sm text-slate-600">No hay recomendaciones disponibles.</div>
              ) : (
                recommendedList.map((rec, index) => (
                  <article
                    key={rec.id}
                    className="group relative shrink-0 snap-start w-[260px] sm:w-[300px] md:w-[340px] aspect-[9/16] rounded-[26px] overflow-hidden shadow-xl cursor-pointer stagger-item"
                    style={{ '--stagger-delay': `${Math.min(index, 10) * 50}ms` }}
                    onClick={() => {
                      if (user?.role === 'admin') navigate(`/admin/sitio/${rec.id}`);
                      else if (user && user.role !== 'operator') navigate(`/turista/sitio/${rec.id}`);
                      else navigate(`/sitio/${rec.id}`);
                    }}
                  >
                    <img loading={index < 3 ? "eager" : "lazy"} decoding="async" src={rec.imagen || storageUrl(rec.cover)} alt={rec.nombre || rec.name} className="absolute inset-0 h-full w-full object-cover rounded-[26px] origin-center transform transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]" />
                    <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]">
                      <div className="relative z-10 space-y-1 text-white">
                        <p className="text-white/80 text-xs font-semibold">Recomendado</p>
                        <h3 className="text-2xl font-bold leading-tight">{shortText(rec.nombre || rec.name, 38)}</h3>
                        <p className="text-sm">{shortText(rec.slogan || 'Explora este destino increíble', 84)}</p>
                      </div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(rec.label) && rec.label.length > 0 ? rec.label : [{ id: 'none', name: 'Sin etiquetas' }]).slice(0, 3).map((label, idx) => (
                              <span key={label.id ?? `${rec.id}-label-${idx}`} className="rounded-full bg-white/20 text-white text-xs px-3 py-1 backdrop-blur">{label.name || 'Etiqueta'}</span>
                          ))}
                        </div>
                        <button className="grid place-items-center h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition">+</button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Sección 4: Mapa de sitios turísticos */}
        {!isGuest ? (
          <section className="w-full bg-white pb-20">
            <div className="px-6 md:px-12 mb-6">
              <h2 className="text-3xl font-bold">Mapa de sitios turísticos</h2>
              <p className="text-slate-600 mt-2">Explora los sitios agregados en tiempo real.</p>
            </div>
            <div className="px-6 md:px-12">
              <div ref={mapContainerRef} className="w-full h-[520px] rounded-2xl ring-1 ring-emerald-100 shadow-lg" />
            </div>
          </section>
        ) : (
          <section className="w-full bg-white pb-20">
            <div className="px-6 md:px-12">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center">
                <h3 className="text-xl font-semibold text-emerald-700 mb-2">Registrate para ver el mapa completo</h3>
                <p className="text-sm text-slate-600">Accede a ubicaciones exactas y rutas sugeridas.</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer onNavigateSobreNosotros={() => window.location.href = '/sobre-nosotros'} onNavigatePrivacidad={() => window.location.href = '/privacidad'} onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'} onNavigateColeccion={() => window.location.href = '/coleccion'} onNavigateLogin={() => window.location.href = '/login'} onNavigateInicio={() => window.location.href = '/'} />
    </div>
  );
}
