import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserHistory, fetchUserReviews } from './services/api';
import Alert from './components/Alert';
import Pagination from './components/Pagination';

export default function HistorialPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [currentPageReviews, setCurrentPageReviews] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [historyData, reviewData] = await Promise.all([
          fetchUserHistory(500),
          fetchUserReviews(500),
        ]);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (err) {
        setError(err?.message || 'No se pudo cargar el historial');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ITEMS_PER_PAGE = 20;
  const totalHistoryPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const currentHistory = history.slice((currentPageHistory - 1) * ITEMS_PER_PAGE, currentPageHistory * ITEMS_PER_PAGE);

  const totalReviewsPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentReviews = reviews.slice((currentPageReviews - 1) * ITEMS_PER_PAGE, currentPageReviews * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Historial</h1>
          <p className="text-sm text-slate-600">Consulta tus sitios visitados y comentarios recientes</p>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando historial...</div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Sitios visitados recientemente</h2>
              <div className="md:hidden space-y-3">
                {currentHistory.map((item) => {
                  const placeName = item.place?.name || item.place_name || '—';
                  const placeLocalization = item.place?.localization || item.place_localization || '—';
                  const key = item.id || `${item.place_id || placeName}-${item.visited_at || ''}`;
                  return (
                    <div key={key} className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">{placeName}</p>
                      <p className="mt-1 text-xs text-slate-600">{placeLocalization}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          Última visita: {item.visited_at ? new Date(item.visited_at).toLocaleString() : '—'}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {history.length === 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                    No hay visitas recientes
                  </div>
                )}
              </div>
              <div className="hidden md:block bg-white border-b border-slate-200">
                <table className="w-full text-sm table-fixed">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 w-1/3 truncate">Sitio</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 w-1/3 truncate">Ubicación</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 w-1/3 truncate">Última visita</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentHistory.map((item) => {
                      const placeName = item.place?.name || item.place_name || '—';
                      const placeLocalization = item.place?.localization || item.place_localization || '—';
                      const key = item.id || `${item.place_id || placeName}-${item.visited_at || ''}`;

                      return (
                        <tr key={key} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-800 break-words max-w-xs">{placeName}</td>
                          <td className="px-4 py-3 text-slate-600 break-words max-w-xs">{placeLocalization}</td>
                          <td className="px-4 py-3 text-slate-600 text-xs break-words max-w-xs">{item.visited_at ? new Date(item.visited_at).toLocaleString() : '—'}</td>
                        </tr>
                      );
                    })}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-4 py-6 text-center text-slate-600">No hay visitas recientes</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {history.length > 0 && (
                <Pagination
                  currentPage={currentPageHistory}
                  totalPages={totalHistoryPages}
                  onPageChange={setCurrentPageHistory}
                />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Comentarios realizados</h2>
              <div className="md:hidden space-y-3">
                {currentReviews.map((rev) => {
                  const isLong = rev.comment && rev.comment.length > 40;
                  const showFull = expanded[rev.id];
                  return (
                    <div key={rev.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">{rev.place?.name || '—'}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        Calificación: {Array.from({length: 5}, (_, i) => (
                          <span key={i} style={{color: i < rev.rating ? '#FFD700' : '#E5E7EB'}}>&#9733;</span>
                        ))}
                      </p>
                      <p className="mt-2 text-xs text-slate-700">
                        {rev.is_restricted
                          ? '[ Contenido restringido ]'
                          : isLong && !showFull
                            ? rev.comment.slice(0, 40) + '...'
                            : rev.comment}
                        {isLong && !showFull && (
                          <button
                            className="ml-2 text-emerald-600 hover:underline text-xs"
                            onClick={() => setExpanded((prev) => ({ ...prev, [rev.id]: true }))}
                          >Ver más</button>
                        )}
                        {isLong && showFull && (
                          <button
                            className="ml-2 text-emerald-600 hover:underline text-xs"
                            onClick={() => setExpanded((prev) => ({ ...prev, [rev.id]: false }))}
                          >Ver menos</button>
                        )}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {rev.created_at ? new Date(rev.created_at).toLocaleString() : '—'}
                      </p>
                    </div>
                  );
                })}
                {reviews.length === 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                    No hay comentarios recientes
                  </div>
                )}
              </div>
              <div className="hidden md:block bg-white border-b border-slate-200">
                <table className="w-full text-sm table-fixed">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 w-1/4 truncate">Sitio</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 w-1/6 truncate">Calificación</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 w-2/6 truncate">Comentario</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 w-1/4 truncate">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentReviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-800 break-words max-w-xs">{rev.place?.name || '—'}</td>
                        <td className="px-4 py-3 text-slate-700 break-words max-w-xs">
                          {Array.from({length: 5}, (_, i) => (
                            <span key={i} style={{color: i < rev.rating ? '#FFD700' : '#E5E7EB'}}>&#9733;</span>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-slate-700 break-words max-w-xs">
                          {(() => {
                            const isLong = rev.comment && rev.comment.length > 40;
                            const showFull = expanded[rev.id];
                            if (rev.is_restricted) return '[ Contenido restringido ]';
                            if (isLong && !showFull) return (
                              <>
                                {rev.comment.slice(0, 40) + '...'}
                                <button
                                  className="ml-2 text-emerald-600 hover:underline text-xs"
                                  onClick={() => setExpanded((prev) => ({ ...prev, [rev.id]: true }))}
                                >Ver más</button>
                              </>
                            );
                            if (isLong && showFull) return (
                              <>
                                {rev.comment}
                                <button
                                  className="ml-2 text-emerald-600 hover:underline text-xs"
                                  onClick={() => setExpanded((prev) => ({ ...prev, [rev.id]: false }))}
                                >Ver menos</button>
                              </>
                            );
                            return rev.comment;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {rev.created_at ? new Date(rev.created_at).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-slate-600">No hay comentarios recientes</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {reviews.length > 0 && (
                <Pagination
                  currentPage={currentPageReviews}
                  totalPages={totalReviewsPages}
                  onPageChange={setCurrentPageReviews}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
