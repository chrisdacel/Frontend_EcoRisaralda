import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';

const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');

const toInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user?.role === 'admin' ? '/admin' : '/operador';
  const fieldLimits = {
    title: { min: 5, max: 120 },
    description: { min: 20, max: 800, optional: false },
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [place, setPlace] = useState(null);
  const [dateError, setDateError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
  });
  const [endDateError, setEndDateError] = useState('');
  const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const getDateLimits = () => {
    const now = new Date();
    const minDate = new Date(now);
    minDate.setDate(minDate.getDate() + 5);
    const maxDate = new Date(now);
    maxDate.setMonth(maxDate.getMonth() + 3);
    return { minDate, maxDate };
  };

  const toDateTimeLocal = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const getDateError = (value) => {
    if (!value) return '';
    const inputDate = new Date(value);
    if (Number.isNaN(inputDate.getTime())) return 'La fecha no es valida.';
    const { minDate, maxDate } = getDateLimits();
    if (inputDate < minDate || inputDate > maxDate) {
      return 'La fecha debe ser mayor a 5 dias y menor a 3 meses desde hoy.';
    }
    return '';
  };

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/api/events/${id}`);
        if (!isMounted) return;

        const event = data?.event || null;
        const placeData = data?.place || null;

        setPlace(placeData);
        // Force ends_at to always be formatted for input
        let endsAtValue = '';
        if (event?.ends_at) {
          const d = new Date(event.ends_at);
          if (!Number.isNaN(d.getTime())) {
            const pad = (num) => String(num).padStart(2, '0');
            endsAtValue = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          } else {
            endsAtValue = '';
          }
        }
        setFormData({
          title: event?.title ?? '',
          description: event?.description ?? '',
          starts_at: event?.starts_at ? toInputValue(event?.starts_at) : '',
          ends_at: endsAtValue,
        });
        setDateError(getDateError(toInputValue(event?.starts_at)));
        setEndDateError(getEndDateError(toInputValue(event?.starts_at), toInputValue(event?.ends_at)));
        setImagePreview(storageUrl(event?.image));
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Error cargando el evento';
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEvent();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
    if (e.target.name === 'starts_at') {
      setDateError(getDateError(e.target.value));
      setEndDateError(getEndDateError(e.target.value, formData.ends_at));
    }
    if (e.target.name === 'ends_at') {
      setEndDateError(getEndDateError(formData.starts_at, e.target.value));
    }
  };

  const getEndDateError = (start, end) => {
    if (!end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(endDate.getTime()) || Number.isNaN(startDate.getTime())) return 'La fecha no es valida.';
    // Si la fecha de finalización es menor o igual a la de inicio
    if (endDate <= startDate) return 'La fecha de finalización debe ser posterior a la de inicio.';
    // Si la diferencia es menor a 1 hora
    if ((endDate - startDate) < 3600000) return 'El evento debe durar mínimo 1 hora.';
    return '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageError('La imagen supera el límite de 5MB.');
      setImageFile(null);
      setImagePreview('');
      return;
    } else {
      setImageError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('El titulo del evento es obligatorio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.starts_at) {
      setError('La fecha y hora del evento es obligatoria');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.ends_at) {
      setError('La fecha y hora de finalización es obligatoria');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const currentDateError = getDateError(formData.starts_at);
    if (currentDateError) {
      setDateError(currentDateError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const currentEndDateError = getEndDateError(formData.starts_at, formData.ends_at);
    if (currentEndDateError) {
      setEndDateError(currentEndDateError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!imageFile && !imagePreview) {
      setError('La imagen del evento es obligatoria');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (imageError) {
      setError(imageError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSaving(true);
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description || '');
      payload.append('starts_at', formData.starts_at);
        payload.append('ends_at', formData.ends_at);
      if (imageFile) {
        payload.append('image', imageFile);
      }
      payload.append('_method', 'PUT');

      await api.post(`/api/events/${id}`, payload);

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (place?.id) {
        setTimeout(() => {
          navigate(`${basePath}/sitio/${place.id}#evento`);
        }, 1200);
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Error actualizando el evento';
      setError(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Editar evento</h1>
            <p className="text-slate-600">
              {place?.name ? `Actualiza el evento del sitio ${place.name}` : 'Actualiza la informacion del evento'}
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800">Evento actualizado exitosamente.</p>
              </div>
            </div>
          )}

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

          {loading ? (
            <div className="rounded-xl border border-emerald-100 bg-white p-6 text-slate-600">
              Cargando evento...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50 p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Informacion del evento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Titulo del evento *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      minLength={fieldLimits.title.min}
                      maxLength={fieldLimits.title.max}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="Ej: Avistamiento en Ucumari"
                    />
                    {renderCounter(formData.title, fieldLimits.title)}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Descripcion
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      minLength={fieldLimits.description.min}
                      maxLength={fieldLimits.description.max}
                      required
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="Detalles del evento"
                    />
                    {renderCounter(formData.description, fieldLimits.description)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha y hora de inicio *
                    </label>
                    {(() => {
                      const { minDate, maxDate } = getDateLimits();
                      return (
                        <input
                          type="datetime-local"
                          name="starts_at"
                          value={formData.starts_at}
                          onChange={handleChange}
                          required
                          min={toDateTimeLocal(minDate)}
                          max={toDateTimeLocal(maxDate)}
                          className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus-border-emerald-400 outline-none transition"
                        />
                      );
                    })()}
                    <p className={"mt-2 text-xs " + (dateError ? "text-rose-600" : "text-slate-500")}>{dateError ? dateError : "La fecha debe ser mayor a 5 dias y menor a 3 meses desde hoy."}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha y hora de finalización *
                    </label>
                    <input
                      type="datetime-local"
                      name="ends_at"
                      value={formData.ends_at}
                      onChange={handleChange}
                      required
                      min={formData.starts_at ? formData.starts_at : ''}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus-border-emerald-400 outline-none transition"
                    />
                    <p className={"mt-2 text-xs " + (endDateError ? "text-rose-600" : "text-slate-500")}>{endDateError ? endDateError : "La fecha de finalización debe ser posterior a la de inicio y el evento debe durar mínimo 1 hora."}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Imagen del evento *
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                      onChange={handleImageChange}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus-border-emerald-400 outline-none transition"
                    />
                    <p className={"mt-2 text-xs " + (imageError ? "text-rose-600" : "text-slate-500")}>Límite de imagen: 5MB.{imageError ? ` ${imageError}` : ''}</p>
                    {imagePreview && (
                      <img loading="lazy" src={imagePreview} alt="Evento" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || Boolean(dateError) || Boolean(endDateError) || Boolean(imageError)}
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
