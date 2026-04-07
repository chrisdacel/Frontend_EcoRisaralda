import React, { useEffect, useRef, useState } from 'react';
import { getAdminReviews, restrictReview, unrestrictReview } from './services/adminApi';
import { useNavigate } from 'react-router-dom';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Pagination from './components/Pagination';

export default function AdminCommentsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedComments, setExpandedComments] = useState(() => new Set());
  const [expandedPlaceNames, setExpandedPlaceNames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const dateMenuRef = useRef(null);
  const navigate = useNavigate();
  const [confirmState, setConfirmState] = useState({ open: false });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter]);

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Error cargando reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setDateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRestrict = async (id) => {
    setConfirmState({
      open: true,
      title: 'Ocultar reseña',
      message: '¿Ocultar esta reseña por incumplir las normas?',
      confirmLabel: 'Ocultar',
      tone: 'warning',
      onConfirm: async () => {
        try {
          await restrictReview(id);
          setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_restricted: true } : r));
          setError('');
        } catch (err) {
          setError(err?.message || 'Error restringiendo reseña');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  const handleUnrestrict = async (id) => {
    setConfirmState({
      open: true,
      title: 'Mostrar reseña',
      message: '¿Mostrar nuevamente esta reseña?',
      confirmLabel: 'Mostrar',
      tone: 'info',
      onConfirm: async () => {
        try {
          await unrestrictReview(id);
          setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_restricted: false } : r));
          setError('');
        } catch (err) {
          setError(err?.message || 'Error desrestringiendo reseña');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  const toggleComment = (id) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const shouldTruncateName = (value) => (value || '').length > 39;

  const togglePlaceName = (key) => {
    setExpandedPlaceNames((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderPlaceName = (value, key, spanClass = '') => {
    const expanded = !!expandedPlaceNames[key];
    const canToggle = shouldTruncateName(value);
    return (
      <div className="flex flex-col gap-1">
        <span
          className={`max-w-[260px] ${
            expanded ? 'whitespace-normal break-words' : 'line-clamp-1'
          } ${spanClass}`}
        >
          {value}
        </span>
        {canToggle && (
          <button
            type="button"
            onClick={() => togglePlaceName(key)}
            className="self-start text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {expanded ? 'Ver menos' : 'Ver mas'}
          </button>
        )}
      </div>
    );
  };

  const getPreviewText = (text, limit = 140) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return `${text.slice(0, limit)}...`;
  };

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    return (
      <div className="flex items-center gap-1 text-amber-400" aria-label={`Calificacion ${safeRating} de 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            className={`h-4 w-4 ${index < safeRating ? 'fill-current' : 'fill-transparent'} stroke-current`}
            viewBox="0 0 24 24"
          >
            <path d="M11.049 2.927a1 1 0 011.902 0l2.021 4.094a1 1 0 00.753.547l4.518.656a1 1 0 01.554 1.706l-3.27 3.187a1 1 0 00-.287.885l.772 4.5a1 1 0 01-1.451 1.054L12 17.77a1 1 0 00-.93 0l-4.031 2.12a1 1 0 01-1.451-1.054l.772-4.5a1 1 0 00-.287-.885L2.804 9.274a1 1 0 01.554-1.706l4.518-.656a1 1 0 00.753-.547l2.021-4.094z" />
          </svg>
        ))}
      </div>
    );
  };

  const dateLabels = {
    all: 'Todas las fechas',
    today: 'Hoy',
    last7: 'Ultimos 7 dias',
    last30: 'Ultimos 30 dias',
  };

  const dateOptions = [
    { value: 'all', label: 'Todas las fechas' },
    { value: 'today', label: 'Hoy' },
    { value: 'last7', label: 'Ultimos 7 dias' },
    { value: 'last30', label: 'Ultimos 30 dias' },
  ];

  const matchesDateFilter = (createdAt) => {
    if (dateFilter === 'all') return true;
    if (!createdAt) return false;
    const reviewDate = new Date(createdAt);
    if (Number.isNaN(reviewDate.getTime())) return false;
    const now = new Date();
    if (dateFilter === 'today') {
      return reviewDate.toDateString() === now.toDateString();
    }
    const days = dateFilter === 'last7' ? 7 : 30;
    const diffMs = now - reviewDate;
    return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
  };

  const filteredReviews = reviews.filter((review) => {
    const placeName = review.place?.name || '';
    const userName = review.user?.name || '';
    const commentText = review.comment || '';
    const searchValue = `${placeName} ${userName} ${commentText}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.trim().toLowerCase());
    const matchesDate = matchesDateFilter(review.created_at);
    return matchesSearch && matchesDate;
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const currentReviews = filteredReviews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/admin');
            }
          }}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestionar Comentarios</h1>
            <p className="text-sm text-slate-600">Revisa y restringe reseñas de todos los sitios</p>
          </div>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando reseñas…</div>
        ) : (
          <>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4 gap-3 w-full max-w-4xl">
              {/* Search bar */}
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 flex-1 min-w-[250px]">
                <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.6-4.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por sitio, usuario o comentario"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>
              {/* Filtros en fila en desktop, columna en móvil */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-56" ref={dateMenuRef}>
                  <button
                    type="button"
                    onClick={() => setDateMenuOpen((prev) => !prev)}
                    className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                  >
                    <span className="truncate">{dateLabels[dateFilter] || 'Todas las fechas'}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${dateMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dateMenuOpen && (
                    <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                      {dateOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setDateFilter(option.value);
                            setDateMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="md:hidden space-y-3 mb-4">
              {currentReviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  {renderPlaceName(r.place?.name || '—', `mobile-place-${r.id}`, 'text-sm font-semibold text-slate-900')}
                  <p className="mt-1 text-xs text-slate-600">{r.user ? (r.user?.name || 'Usuario') : '[usuario no encontrado]'}</p>
                  <div className="mt-2">{renderStars(r.rating)}</div>
                  <div className="mt-2 text-xs text-slate-700">
                    {r.is_restricted ? (
                      '[ Contenido restringido ]'
                    ) : (
                      <div className="space-y-1">
                        <p>
                          {expandedComments.has(r.id)
                            ? r.comment
                            : getPreviewText(r.comment)}
                        </p>
                        {r.comment && r.comment.length > 140 && (
                          <button
                            type="button"
                            onClick={() => toggleComment(r.id)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                          >
                            {expandedComments.has(r.id) ? 'Ver menos' : 'Ver mas'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                  </p>
                  <div className="mt-3">
                    {r.is_restricted ? (
                      <button
                        className="inline-flex items-center rounded-full bg-green-500 px-3 py-1.5 text-white text-xs shadow-sm hover:bg-green-600"
                        onClick={() => handleUnrestrict(r.id)}
                      >
                        Mostrar
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1.5 text-white text-xs shadow-sm hover:bg-orange-600"
                        onClick={() => handleRestrict(r.id)}
                      >
                        Ocultar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredReviews.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                  No hay reseñas registradas
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto bg-white border-b border-slate-200 pb-44">
              <table className="min-w-full text-sm">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Sitio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Calificación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Comentario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-800">
                      {renderPlaceName(r.place?.name || '—', `table-place-${r.id}`, 'text-slate-800')}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{r.user ? (r.user?.name || 'Usuario') : '[usuario no encontrado]'}</td>
                    <td className="px-4 py-3 text-slate-800">{renderStars(r.rating)}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs break-words">
                      {r.is_restricted ? (
                        '[ Contenido restringido ]'
                      ) : (
                        <div className="space-y-1">
                          <p>
                            {expandedComments.has(r.id)
                              ? r.comment
                              : getPreviewText(r.comment)}
                          </p>
                          {r.comment && r.comment.length > 140 && (
                            <button
                              type="button"
                              onClick={() => toggleComment(r.id)}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                              {expandedComments.has(r.id) ? 'Ver menos' : 'Ver mas'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      {r.is_restricted ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-gray-500 font-semibold">Restringido</span>
                          <button
                            className="inline-flex items-center rounded-full bg-green-500 px-3 py-1.5 text-white text-xs shadow-sm hover:bg-green-600"
                            onClick={() => handleUnrestrict(r.id)}
                          >
                            Mostrar
                          </button>
                        </div>
                      ) : (
                        <button
                          className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1.5 text-white text-xs shadow-sm hover:bg-orange-600"
                          onClick={() => handleRestrict(r.id)}
                        >
                          Ocultar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredReviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-600">No hay reseñas registradas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredReviews.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
          </>
        )}
      </div>
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        tone={confirmState.tone}
        onClose={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}
