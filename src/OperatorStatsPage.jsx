import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { fetchOperatorStats } from './services/api';
import Alert from './components/Alert';
import Pagination from './components/Pagination';

function OperatorStatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recentComments = stats.recent_comments || [];
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      if (!user || user.role !== 'operator') {
        if (active) {
          setStats({});
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await fetchOperatorStats();
        if (active) {
          setStats(data || {});
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Error cargando estadisticas');
          setStats({});
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando estadisticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md">
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Sitios registrados',
      value: stats.places_count ?? 0,
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bg: 'bg-emerald-100',
    },
    {
      label: 'Visitas totales',
      value: stats.visits ?? 0,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bg: 'bg-blue-100',
    },
    {
      label: 'Favoritos',
      value: stats.favorites ?? 0,
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      bg: 'bg-pink-100',
    },
    {
      label: 'Comentarios',
      value: stats.reviews_count ?? 0,
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      bg: 'bg-amber-100',
    },
    {
      label: 'Eventos',
      value: stats.events_count ?? 0,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'bg-purple-100',
    },
    {
      label: 'Calificacion promedio',
      value: stats.avg_rating ?? '0.0',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.52 4.674a1 1 0 00.95.69h4.912c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.364 1.118l1.52 4.674c.3.921-.755 1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.98 10.101c-.783-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.52-4.674z" />
        </svg>
      ),
      bg: 'bg-yellow-100',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Estadisticas del operador
              </h1>
              <p className="text-sm text-slate-600">
                Resumen de interacciones de tus sitios registrados.
              </p>
            </div>
            <div className="flex items-center gap-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-lg p-4 flex flex-col gap-3 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className={`rounded-full ${card.bg} p-3`}>
                    {card.icon}
                  </div>
                  <span className="text-3xl font-bold text-slate-900">{card.value}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600">{card.label}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Comentarios recientes</h3>
              <span className="text-xs text-slate-400">Total: {recentComments.length}</span>
            </div>

            {(() => {
              const ITEMS_PER_PAGE = 20;
              const totalPages = Math.ceil(recentComments.length / ITEMS_PER_PAGE);
              const currentComments = recentComments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

              return (
                <>
                  <div className="space-y-3 text-sm text-slate-700">
                    {recentComments.length > 0 ? (
                      currentComments.map((comment, index) => (
                        <div key={`comment-${index}`} className="rounded-lg bg-slate-50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                              {comment.place_name || 'Sitio'}
                            </p>
                            {comment.rating != null && (
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <svg
                                    key={i}
                                    className="w-3.5 h-3.5"
                                    fill={i < comment.rating ? '#f59e0b' : 'none'}
                                    stroke={i < comment.rating ? '#f59e0b' : '#cbd5e1'}
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{comment.user_name || 'Usuario'}</span>
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{comment.comment || ''}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">Sin comentarios recientes.</p>
                    )}
                  </div>
                  {recentComments.length > 0 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OperatorStatsPage;
