import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Alert from './components/Alert';
import { fetchPublicEvent, markNotificationRead } from './services/api';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadEvent = async () => {
      try {
        setLoading(true);
        const data = await fetchPublicEvent(id);
        if (active) {
          setEventData(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'No se pudo cargar el evento');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEvent();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const notificationId = params.get('notification');
    if (!notificationId) return;
    markNotificationRead(notificationId).catch(() => {});
  }, [location.search]);

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');
  const event = eventData?.event;
  const place = eventData?.place;

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <div className="min-h-[70vh] flex items-center justify-center px-4 md:px-6">
        {loading ? (
          <div className="text-sm text-slate-600">Cargando evento...</div>
        ) : error || !event ? (
          <div className="w-full flex items-center justify-center">
            <div className="rounded-2xl border border-green-200 bg-green-50/80 p-6 flex items-center gap-4 mb-8 mx-auto max-w-md">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-green-800 text-lg mb-1">El evento no está disponible en este momento.</div>
                <div className="text-green-700 text-sm">Es posible que haya sido eliminado o ya no sea visible.</div>
                <button
                  onClick={() => navigate('/turista/coleccion')}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Explorar colección
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Evento</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{event.title}</h1>
            {event.starts_at && (
              <p className="mt-1 text-sm text-slate-600">{formatDate(event.starts_at)}</p>
            )}
            {event.image && (
              <img loading="lazy"
                src={storageUrl(event.image)}
                alt={event.title}
                className="mt-4 h-64 w-full rounded-2xl object-cover"
              />
            )}
            {event.description && (
              <p className="mt-4 text-sm text-slate-700 leading-relaxed">{event.description}</p>
            )}
            {place && (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Sitio</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{place.name}</p>
                <button
                  type="button"
                  onClick={() => navigate(`/turista/sitio/${place.id}`)}
                  className="mt-3 inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Ver sitio
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
