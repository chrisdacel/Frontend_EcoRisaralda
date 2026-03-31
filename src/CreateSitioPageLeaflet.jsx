import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPlace, getPlaceById } from './services/placesApi';
import { updatePlace, fetchPreferencesOptions } from './services/api';
import { useAuth } from './context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite/React
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/** Coincide con validación Laravel: max 4096 KB por imagen */
const MAX_PLACE_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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

export default function CreateSitioPageLeaflet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isEdit = Boolean(id);
  const [preferencesOptions, setPreferencesOptions] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const isOperatorOrAdmin = user?.role === 'operator' || user?.role === 'admin';
  const eventBasePath = user?.role === 'admin' ? '/admin' : '/operador';
  const daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miercoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sabado' },
    { key: 'domingo', label: 'Domingo' },
  ];
  const defaultOpenDays = {
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: true,
    domingo: true,
  };
  const fieldLimits = {
    nombre: { min: 5, max: 80 },
    slogan: { min: 5, max: 120 },
    descripcion: { min: 30, max: 1000 },
    localizacion: { min: 10, max: 500 },
    clima: { min: 20, max: 600 },
    caracteristicas: { min: 20, max: 600 },
    flora: { min: 20, max: 600 },
    infraestructura: { min: 20, max: 600 },
    recomendacion: { min: 20, max: 600 },
    contacto: { min: 0, max: 200, optional: true },
  };

  const getCounterClass = (length, min, max, optional = false) => {
    if (optional && length === 0) return 'text-slate-500';
    if (length > max) return 'text-red-600';
    if (length < min) return 'text-amber-600';
    return 'text-slate-500';
  };

  const renderCounter = (value, limits) => {
    const length = value ? value.length : 0;
    const { min, max, optional } = limits;
    const helper = optional ? 'opcional' : `minimo ${min}`;
    return (
      <div className={`text-xs font-medium ${getCounterClass(length, min, max, optional)}`}>
        {length}/{max} caracteres ({helper})
      </div>
    );
  };

  const [formData, setFormData] = useState({
    nombre: '',
    slogan: '',
    descripcion: '',
    localizacion: '',
    lat: '',
    lng: '',
    clima: '',
    caracteristicas: '',
    flora: '',
    infraestructura: '',
    recomendacion: '',
    contacto: '',
    estado_apertura: 'open',
  });

  // Asegura que el estado_apertura siempre sea válido antes de enviar
  function getValidEstadoApertura(value) {
    const valid = ['open', 'closed_temporarily', 'open_with_restrictions'];
    return valid.includes(value) ? value : 'open';
  }
  const [openDays, setOpenDays] = useState(defaultOpenDays);

  const [images, setImages] = useState({
    portada: null,
    clima_img: null,
    caracteristicas_img: null,
    flora_img: null,
    infraestructura_img: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    portada: null,
    clima_img: null,
    caracteristicas_img: null,
    flora_img: null,
    infraestructura_img: null,
  });

  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');

  useEffect(() => {
    async function loadPreferences() {
      try {
        const data = await fetchPreferencesOptions();
        setPreferencesOptions(Array.isArray(data) ? data : []);
      } catch (e) {
        setPreferencesOptions([]);
      }
    }
    loadPreferences();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    let isMounted = true;
    const loadPlace = async () => {
      try {
        const data = await getPlaceById(id);
        const place = data?.place || data;
        if (!isMounted || !place) return;

        setFormData({
          nombre: place.name ?? '',
          slogan: place.slogan ?? '',
          descripcion: place.description ?? '',
          localizacion: place.localization ?? '',
          lat: place.lat?.toString() ?? '',
          lng: place.lng?.toString() ?? '',
          clima: place.Weather ?? '',
          caracteristicas: place.features ?? '',
          flora: place.flora ?? '',
          infraestructura: place.estructure ?? '',
          recomendacion: place.tips ?? '',
          contacto: place.contact_info ?? '',
          estado_apertura: place.opening_status ?? 'open',
        });

        const labels = Array.isArray(place.label)
          ? place.label
          : Array.isArray(place.labels)
            ? place.labels
            : [];
        const labelIds = labels
          .map((label) => (typeof label === 'number' ? label : label?.id))
          .filter(Boolean);
        setSelectedPreferences(labelIds);

        const placeOpenDays = (place.open_days && typeof place.open_days === 'object') ? place.open_days : {};
        setOpenDays({ ...defaultOpenDays, ...placeOpenDays });

        setImagePreviews({
          portada: storageUrl(place.cover),
          clima_img: storageUrl(place.Weather_img),
          caracteristicas_img: storageUrl(place.features_img),
          flora_img: storageUrl(place.flora_img),
          infraestructura_img: storageUrl(place.estructure_img),
        });
      } catch (err) {
        setError(err.message || 'Error cargando sitio');
      }
    };

    loadPlace();
    return () => {
      isMounted = false;
    };
  }, [id, isEdit]);

  useEffect(() => {
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng], 13);
    }
  }, [formData.lat, formData.lng]);

  // Inicializar mapa de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear mapa centrado en Risaralda
    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom: false // Desactivado por defecto
    }).setView([4.8087, -75.6906], 10);

    // Activar zoom de scroll solo tras hacer clic; desactivarlo al sacar el mouse
    map.on('click', () => {
      map.scrollWheelZoom.enable();
    });
    map.on('mouseout', () => {
      map.scrollWheelZoom.disable();
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const customPin = L.divIcon({
      className: 'custom-pin',
      html: `<div style="width: 20px; height: 20px; background-color: #059669; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });

    // Crear marcador inicial
    const marker = L.marker([4.8087, -75.6906], { icon: customPin }).addTo(map);
    markerRef.current = marker;

    // Evento de clic en el mapa
    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      setFormData(prev => ({
        ...prev,
        lat: e.latlng.lat.toFixed(8),
        lng: e.latlng.lng.toFixed(8),
      }));
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_PLACE_IMAGE_BYTES) {
      setError(
        `La imagen supera el máximo de 4 MB (${fieldName}). Los PNG suelen pesar más que JPG; comprime o convierte el archivo.`
      );
      e.target.value = '';
      return;
    }
    const mime = (file.type || '').toLowerCase();
    if (mime && !ALLOWED_IMAGE_TYPES.includes(mime)) {
      setError('Formato no permitido. Usa JPG, PNG o WebP.');
      e.target.value = '';
      return;
    }

    setImages((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        [fieldName]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const togglePreference = (prefId) => {
    setSelectedPreferences((prev) => {
      if (prev.includes(prefId)) {
        return prev.filter((id) => id !== prefId);
      }
      return [...prev, prefId];
    });
  };

  const toggleOpenDay = (dayKey) => {
    setOpenDays((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.lat || !formData.lng) {
      setError('Por favor selecciona una ubicación en el mapa');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (selectedPreferences.length === 0) {
      setError('Selecciona al menos una etiqueta');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!isEdit) {
      if (!images.portada || !images.clima_img || !images.caracteristicas_img || !images.flora_img || !images.infraestructura_img) {
        setError('Todas las imágenes son requeridas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updatePlace(
          id,
          { ...formData, 
            estado_apertura: getValidEstadoApertura(formData.estado_apertura),
            preferences: selectedPreferences, 
            dias_abiertos: openDays 
          },
          images.portada,
          images.clima_img,
          images.caracteristicas_img,
          images.flora_img,
          images.infraestructura_img
        );
      } else {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
        formDataToSend.append('dias_abiertos', JSON.stringify(openDays));
        selectedPreferences.forEach((prefId) => {
          formDataToSend.append('preferences[]', prefId);
        });
        Object.keys(images).forEach(key => {
          if (images[key]) {
            formDataToSend.append(key, images[key]);
          }
        });
        // Debug: Mostrar datos que se envían
        console.log('=== Datos del formulario ===');
        for (let [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
            console.log(`${key}: [File] ${value.name} (${(value.size / 1024).toFixed(2)} KB)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        const response = await createPlace(formDataToSend);
        const createdId = response?.place?.id || response?.id;
        if (createdId) {
          setTimeout(() => {
            navigate(`${eventBasePath}/sitio/${createdId}`);
          }, 1200);
        }
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (isEdit) {
        setTimeout(() => {
          navigate(`${eventBasePath}/sitio/${id}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error creando sitio');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll hacia arriba para ver el error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-14">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{isEdit ? 'Editar Sitio Turístico' : 'Crear Sitio Turístico'}</h1>
            <p className="text-slate-600">
              {isEdit ? 'Actualiza la información del sitio' : 'Completa todos los campos para agregar un nuevo sitio ecoturístico'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800">Sitio creado exitosamente. Redirigiendo...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 mb-2">Por favor corrige los siguientes errores:</p>
                  <div className="text-red-800 whitespace-pre-line">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50 p-8 space-y-8">
            
            {/* Información Básica */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Sitio *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    minLength={fieldLimits.nombre.min}
                    maxLength={fieldLimits.nombre.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Reserva natural parque la Nona"
                  />
                  {renderCounter(formData.nombre, fieldLimits.nombre)}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slogan *
                  </label>
                  <input
                    type="text"
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleChange}
                    required
                    minLength={fieldLimits.slogan.min}
                    maxLength={fieldLimits.slogan.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: ¡Conéctate con la naturaleza!"
                  />
                  {renderCounter(formData.slogan, fieldLimits.slogan)}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    rows={4}
                    minLength={fieldLimits.descripcion.min}
                    maxLength={fieldLimits.descripcion.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Describe el sitio turístico..."
                  />
                  {renderCounter(formData.descripcion, fieldLimits.descripcion)}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Portada {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'portada')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.portada && (
                    <img loading="lazy" src={imagePreviews.portada} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.portada && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Etiquetas */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Etiquetas</h2>
              <p className="text-sm text-slate-600 mb-4">Selecciona una o varias etiquetas para clasificar el sitio.</p>
              <div className="flex flex-wrap gap-2">
                {preferencesOptions.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref.id);
                  const rawColor = pref.color || '#10b981';
                  const color = rawColor.startsWith('#') ? rawColor : `#${rawColor}`;
                  const style = isSelected
                    ? { backgroundColor: color, borderColor: color, color: '#ffffff' }
                    : { borderColor: color, color, backgroundColor: 'transparent' };
                  return (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => togglePreference(pref.id)}
                      style={style}
                      className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                    >
                      {pref.name}
                    </button>
                  );
                })}
                {preferencesOptions.length === 0 && (
                  <span className="text-sm text-slate-500">No hay etiquetas disponibles.</span>
                )}
              </div>
            </div>

            {/* Localización */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Localización</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción de la Ubicación *
                  </label>
                  <textarea
                    name="localizacion"
                    value={formData.localizacion}
                    onChange={handleChange}
                    required
                    rows={3}
                    minLength={fieldLimits.localizacion.min}
                    maxLength={fieldLimits.localizacion.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Se encuentra en el municipio de Marsella, a 7 km del casco urbano..."
                  />
                  {renderCounter(formData.localizacion, fieldLimits.localizacion)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Selecciona la ubicación en el mapa * (Haz clic en el mapa)
                  </label>
                  {formData.lat && formData.lng && (
                    <p className="text-sm text-emerald-600 mb-2">
                      📍 Ubicación seleccionada: {formData.lat}, {formData.lng}
                    </p>
                  )}
                  <div 
                    ref={mapContainerRef} 
                    style={{ height: '400px', width: '100%' }}
                    className="rounded-lg border border-emerald-200"
                  ></div>
                  <p className="text-xs text-slate-500 mt-2">
                    Haz clic en el mapa para seleccionar la ubicación exacta del sitio
                  </p>
                </div>
              </div>
            </div>

            {/* Clima */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Clima</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción del Clima *
                  </label>
                  <textarea
                    name="clima"
                    value={formData.clima}
                    onChange={handleChange}
                    required
                    rows={3}
                    minLength={fieldLimits.clima.min}
                    maxLength={fieldLimits.clima.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Clima templado y húmedo, con temperaturas entre 17°C y 26°C..."
                  />
                  {renderCounter(formData.clima, fieldLimits.clima)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen del Clima {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'clima_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.clima_img && (
                    <img loading="lazy" src={imagePreviews.clima_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.clima_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Características</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Características del Sitio *
                  </label>
                  <textarea
                    name="caracteristicas"
                    value={formData.caracteristicas}
                    onChange={handleChange}
                    required
                    rows={3}
                    minLength={fieldLimits.caracteristicas.min}
                    maxLength={fieldLimits.caracteristicas.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Senderos ecológicos, zonas de descanso, miradores..."
                  />
                  {renderCounter(formData.caracteristicas, fieldLimits.caracteristicas)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Características {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'caracteristicas_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.caracteristicas_img && (
                    <img loading="lazy" src={imagePreviews.caracteristicas_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.caracteristicas_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Flora */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Flora y Fauna</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción de Flora y Fauna *
                  </label>
                  <textarea
                    name="flora"
                    value={formData.flora}
                    onChange={handleChange}
                    required
                    rows={3}
                    minLength={fieldLimits.flora.min}
                    maxLength={fieldLimits.flora.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Diversidad de especies nativas, aves endémicas..."
                  />
                  {renderCounter(formData.flora, fieldLimits.flora)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Flora/Fauna {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'flora_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.flora_img && (
                    <img loading="lazy" src={imagePreviews.flora_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.flora_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Infraestructura */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Infraestructura</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción de la Infraestructura *
                  </label>
                  <textarea
                    name="infraestructura"
                    value={formData.infraestructura}
                    onChange={handleChange}
                    required
                    rows={3}
                    minLength={fieldLimits.infraestructura.min}
                    maxLength={fieldLimits.infraestructura.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Cabañas, zonas de camping, restaurante..."
                  />
                  {renderCounter(formData.infraestructura, fieldLimits.infraestructura)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Infraestructura {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'infraestructura_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.infraestructura_img && (
                    <img loading="lazy" src={imagePreviews.infraestructura_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.infraestructura_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Recomendaciones</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tips y Recomendaciones *
                </label>
                <textarea
                  name="recomendacion"
                  value={formData.recomendacion}
                  onChange={handleChange}
                  required
                  rows={3}
                  minLength={fieldLimits.recomendacion.min}
                  maxLength={fieldLimits.recomendacion.max}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="Ej: Llevar ropa impermeable, calzado adecuado..."
                />
                {renderCounter(formData.recomendacion, fieldLimits.recomendacion)}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contacto y disponibilidad</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contacto (telefonos o correo)
                  </label>
                  <textarea
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleChange}
                    rows={3}
                    maxLength={fieldLimits.contacto.max}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: +57 312 000 0000, contacto@ejemplo.com"
                  />
                  {renderCounter(formData.contacto, fieldLimits.contacto)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dias abiertos</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day) => (
                      <label key={day.key} className="flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(openDays[day.key])}
                          onChange={() => toggleOpenDay(day.key)}
                          className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
                        />
                        {day.label}
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Si un dia no esta marcado, se considera cerrado.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estado del sitio</label>
                  <select
                    name="estado_apertura"
                    value={formData.estado_apertura}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  >
                    <option value="open">Abierto</option>
                    <option value="closed_temporarily">Cerrado temporalmente</option>
                    <option value="open_with_restrictions">Abierto con restricciones</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-full px-6 py-3 text-slate-700 hover:bg-slate-100 border border-emerald-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Guardando...
                  </>
                ) : (
                  isEdit ? 'Actualizar Sitio' : 'Crear Sitio'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
