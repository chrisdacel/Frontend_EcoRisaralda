import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlace } from './services/placesApi';
import { fetchPreferencesOptions } from './services/api';

export default function CreateSitioPageSimple() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preferencesOptions, setPreferencesOptions] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miercoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sabado' },
    { key: 'domingo', label: 'Domingo' },
  ];

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
    event_title: '',
    event_description: '',
    event_datetime: '',
  });
  const [openDays, setOpenDays] = useState({
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: true,
    domingo: true,
  });
  const [showEventFields, setShowEventFields] = useState(false);

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
  const [eventImage, setEventImage] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState(null);

  useEffect(() => {
    if (formData.event_title || formData.event_description || formData.event_datetime) {
      setShowEventFields(true);
    }
  }, [formData.event_title, formData.event_description, formData.event_datetime]);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setImages({
        ...images,
        [fieldName]: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews({
          ...imagePreviews,
          [fieldName]: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      setError('Por favor ingresa las coordenadas (latitud y longitud)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!images.portada || !images.clima_img || !images.caracteristicas_img || !images.flora_img || !images.infraestructura_img) {
      setError('Todas las imágenes son requeridas');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (selectedPreferences.length === 0) {
      setError('Selecciona al menos una etiqueta');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      
      // Agregar textos
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append('dias_abiertos', JSON.stringify(openDays));
      selectedPreferences.forEach((prefId) => {
        formDataToSend.append('preferences[]', prefId);
      });

      // Agregar imágenes
      Object.keys(images).forEach(key => {
        if (images[key]) {
          formDataToSend.append(key, images[key]);
        }
      });
      if (eventImage) {
        formDataToSend.append('event_image', eventImage);
      }

      await createPlace(formDataToSend);

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigate('/coleccion');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error creando sitio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-14">
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Crear Sitio Turístico</h1>
            <p className="text-slate-600">
              Completa todos los campos para agregar un nuevo sitio ecoturístico
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Reserva natural parque la Nona"
                  />
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: ¡Conéctate con la naturaleza!"
                  />
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Describe el sitio turístico..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Portada *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'portada')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.portada && (
                    <img loading="lazy" src={imagePreviews.portada} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Se encuentra en el municipio de Marsella, a 7 km del casco urbano..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Latitud * <span className="text-xs text-slate-500">(Ej: 4.8087)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="4.8087"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Longitud * <span className="text-xs text-slate-500">(Ej: -75.6906)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="-75.6906"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  💡 Tip: Puedes buscar las coordenadas en <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Maps</a> haciendo clic derecho en un lugar
                </p>
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Clima templado y húmedo, con temperaturas entre 17°C y 26°C..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen del Clima *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'clima_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.clima_img && (
                    <img loading="lazy" src={imagePreviews.clima_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Senderos ecológicos, zonas de descanso, miradores..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Características *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'caracteristicas_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.caracteristicas_img && (
                    <img loading="lazy" src={imagePreviews.caracteristicas_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Diversidad de especies nativas, aves endémicas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Flora/Fauna *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'flora_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.flora_img && (
                    <img loading="lazy" src={imagePreviews.flora_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Cabañas, zonas de camping, restaurante..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Infraestructura *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => handleImageChange(e, 'infraestructura_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.infraestructura_img && (
                    <img loading="lazy" src={imagePreviews.infraestructura_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="Ej: Llevar ropa impermeable, calzado adecuado..."
                />
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
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: +57 312 000 0000, contacto@ejemplo.com"
                  />
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

            {/* Evento (opcional) */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Evento (opcional)</h2>
                  <p className="text-sm text-slate-600">Agrega un evento para este sitio sin que sea obligatorio.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEventFields((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  {showEventFields ? 'Ocultar evento' : 'Agregar evento'}
                  <span className={`text-base transition ${showEventFields ? 'rotate-180' : ''}`} aria-hidden>
                    ▼
                  </span>
                </button>
              </div>
              {showEventFields && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre del evento
                    </label>
                    <input
                      type="text"
                      name="event_title"
                      value={formData.event_title}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="Ej: Avistamiento en Ucumarí"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Descripción del evento
                    </label>
                    <textarea
                      name="event_description"
                      value={formData.event_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="Detalles breves del evento"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha y hora
                    </label>
                    <input
                      type="datetime-local"
                      name="event_datetime"
                      value={formData.event_datetime}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Imagen del evento (opcional)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                      onChange={handleEventImageChange}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    />
                    {eventImagePreview && (
                      <img loading="lazy" src={eventImagePreview} alt="Evento" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                    )}
                  </div>
                </div>
              )}
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
                    Creando...
                  </>
                ) : (
                  'Crear Sitio'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
