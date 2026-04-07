import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from './components/Alert';
import { fetchNotifications, archiveAllNotifications, archiveNotification } from './services/api';
import Pagination from './components/Pagination';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchNotifications(20);
        if (active) {
          setItems(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'No se pudieron cargar las notificaciones');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  const handleArchiveAll = async () => {
    try {
      await archiveAllNotifications();
      setItems([]);
    } catch (err) {
      setError(err?.message || 'No se pudieron archivar las notificaciones');
    }
  };

  const handleArchiveOne = async (id) => {
    try {
      await archiveNotification(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err?.message || 'No se pudo archivar la notificacion');
    }
  };
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const getTarget = (item) => {
    if (item?.target_type === 'event') {
      return {
        label: 'Ver evento',
        path: `/turista/evento/${item.target_id}`,
      };
    }
    return {
      label: 'Ver sitio',
      path: `/turista/sitio/${item.target_id}`,
    };
  };

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <div className="mx-auto max-w-5xl px-4 md:px-6 py-10">
        <button
          onClick={() => navigate('/turista/home')}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">Notificaciones</h1>
            <p className="text-sm text-slate-600">Novedades segun tus preferencias</p>
          </div>
          <button
            type="button"
            onClick={handleArchiveAll}
            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Borrar todas
          </button>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando notificaciones...</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-sm text-slate-700">
            No hay notificaciones disponibles por ahora.
          </div>
        ) : (
          <div className="grid gap-4">
            {currentItems.map((item) => {
              const target = getTarget(item);
              const isRead = Boolean(item.read_at);
              return (
                <div
                  key={item.id}
                  className="group flex w-full flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-4 text-left shadow-sm"
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      {formatDate(item.created_at)}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {item.title || item.place_name || item.name}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isRead ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}
                      >
                        {isRead ? 'Leida' : 'Nueva'}
                      </span>
                    </div>
                    {item.message && (
                      <p className="mt-2 text-sm text-slate-700">{item.message}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleArchiveOne(item.id)}
                      className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Borrar
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`${target.path}?notification=${item.id}`)}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      {target.label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {items.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
