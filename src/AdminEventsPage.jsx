import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';

import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Pagination from './components/Pagination';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [approvalMenuOpen, setApprovalMenuOpen] = useState(false);
  const approvalMenuRef = useRef(null);
  const [approvalBusyId, setApprovalBusyId] = useState(null);
  const [approvalEditOpen, setApprovalEditOpen] = useState(null);
  const [approvalEditDirection, setApprovalEditDirection] = useState('down');
  const [confirmState, setConfirmState] = useState({ open: false });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, approvalFilter]);

  const approvalLabels = {
    all: 'Todas las aprobaciones',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };
  const approvalOptions = [
    { value: 'all', label: 'Todas las aprobaciones' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  const getApprovalButtonClass = (status) => {
    switch (status) {
      case 'approved':
        return 'ring-emerald-200 hover:bg-emerald-50';
      case 'rejected':
        return 'ring-rose-200 hover:bg-rose-50';
      default:
        return 'ring-amber-200 hover:bg-amber-50';
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/admin/events');
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err?.message || 'Error cargando eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const updateEventApproval = async (id, approval_status) => {
    try {
      setApprovalBusyId(id);
      if (approval_status === 'approved') {
        await api.post(`/api/admin/events/${id}/approve`);
      } else if (approval_status === 'rejected') {
        await api.post(`/api/admin/events/${id}/reject`);
      } else if (approval_status === 'pending') {
        await api.post(`/api/admin/events/${id}/pending`);
      }
      await loadEvents();
      setError('');
    } catch (err) {
      setError(err?.message || 'Error actualizando la aprobación');
    } finally {
      setApprovalBusyId(null);
    }
  };

  const deleteEventById = async (id) => {
    setConfirmState({
      open: true,
      title: 'Eliminar evento',
      message: '¿Eliminar este evento? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/admin/events/${id}`);
          await loadEvents();
          setError('');
        } catch (err) {
          setError(err?.message || 'Error eliminando evento');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  // Filtro y buscador
  const filteredEvents = events.filter((event) => {
    const searchValue = `${event.title || ''} ${event.place_name || ''}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.trim().toLowerCase());
    const matchesApproval = approvalFilter === 'all' || (event.approval_status || 'pending') === approvalFilter;
    return matchesSearch && matchesApproval;
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const currentEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="mb-6">
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestión de Eventos</h1>
              <p className="text-sm text-slate-600">Administra, aprueba y elimina eventos turísticos</p>
            </div>
          </div>
        </div>

        {/* Buscador y filtro de aprobación */}
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
              placeholder="Buscar por nombre o sitio"
              className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
          {/* Filtros en fila en desktop, columna en móvil */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-56" ref={approvalMenuRef}>
              <button
                type="button"
                onClick={() => setApprovalMenuOpen((prev) => !prev)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
              >
                <span className="truncate">{approvalLabels[approvalFilter] || 'Todas las aprobaciones'}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${approvalMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {approvalMenuOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                  {approvalOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setApprovalFilter(option.value);
                        setApprovalMenuOpen(false);
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

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}
        {loading ? (
          <div className="text-sm text-slate-600">Cargando eventos…</div>
        ) : (
          <>
            {/* Vista de tabla para escritorio */}
            <div className="hidden md:block overflow-x-auto bg-white border-b border-slate-200 pb-44">
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Evento</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Fecha</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Aprobación</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-2">
                          {event.image ? (
                            <img loading="lazy"
                              src={event.image.startsWith('http') ? event.image : `${import.meta.env.VITE_API_URL}/api/files/${event.image}`}
                              alt={event.title}
                              className="w-32 h-20 rounded-md object-cover border border-slate-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-32 h-20 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <button
                            className="max-w-[260px] text-left text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4"
                            onClick={() => {
                              if (event.place_id) {
                                navigate(`/sitio/${event.place_id}#evento-${event.id}`);
                              }
                            }}
                          >
                            {event.title}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">{event.starts_at ? new Date(event.starts_at).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-flex items-center gap-2" data-approval-edit-id={`table-${event.id}`}>
                          <button
                            type="button"
                            onClick={(eventBtn) => {
                              const rect = eventBtn.currentTarget.getBoundingClientRect();
                              const spaceBelow = window.innerHeight - rect.bottom;
                              setApprovalEditDirection(spaceBelow < 260 ? 'up' : 'down');
                              setApprovalEditOpen((prev) => (prev === `table-${event.id}` ? null : `table-${event.id}`));
                            }}
                            disabled={approvalBusyId === event.id}
                            className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 transition disabled:opacity-60 ${getApprovalButtonClass(event.approval_status || 'pending')}`}
                          >
                            {approvalLabels[event.approval_status] || 'Pendiente'}
                            <svg
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                approvalEditOpen === `table-${event.id}` ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {approvalEditOpen === `table-${event.id}` && (
                            <div
                              className={`absolute right-0 w-44 rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-[999] ${
                                approvalEditDirection === 'up'
                                  ? 'bottom-full mb-2 origin-bottom-right'
                                  : 'top-full mt-2 origin-top-right'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  updateEventApproval(event.id, 'pending');
                                  setApprovalEditOpen(null);
                                }}
                                disabled={approvalBusyId === event.id}
                                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                              >
                                Pendiente
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateEventApproval(event.id, 'approved');
                                  setApprovalEditOpen(null);
                                }}
                                disabled={approvalBusyId === event.id}
                                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                              >
                                Aprobado
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateEventApproval(event.id, 'rejected');
                                  setApprovalEditOpen(null);
                                }}
                                disabled={approvalBusyId === event.id}
                                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                              >
                                Rechazado
                              </button>
                            </div>
                          )}
                          {approvalBusyId === event.id && (
                            <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Editar evento"
                            onClick={() => navigate(`/admin/evento/${event.id}/editar`)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar evento"
                            onClick={() => deleteEventById(event.id)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {events.length === 0 && (
                <div className="px-6 py-6 text-center text-slate-600">No hay eventos que coincidan con el filtro.</div>
              )}
            </div>

            {/* Vista de lista para móvil */}
            <div className="block md:hidden">
              {filteredEvents.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-600">No hay eventos que coincidan con el filtro.</div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {currentEvents.map((event) => (
                    <li key={event.id} className="rounded-xl border border-slate-200 bg-white shadow p-4 flex flex-col gap-2">
                      <div className="flex gap-3 items-center">
                        {event.image ? (
                          <img loading="lazy"
                            src={event.image.startsWith('http') ? event.image : `${import.meta.env.VITE_API_URL}/api/files/${event.image}`}
                            alt={event.title}
                            className="w-20 h-14 rounded-md object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-20 h-14 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-emerald-700 text-base leading-tight mb-1">{event.title}</div>
                          <div className="text-xs text-slate-500 mb-1">{event.starts_at ? new Date(event.starts_at).toLocaleDateString() : ''}</div>
                          <div className="inline-block mr-2 mt-1 mb-1 relative">
                            <div className={`relative inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 transition ${getApprovalButtonClass(event.approval_status || 'pending')}`}
                              onClick={() => setApprovalEditOpen((prev) => prev === `mobile-${event.id}` ? null : `mobile-${event.id}`)}
                              style={{ cursor: 'pointer', minWidth: 90 }}
                            >
                              <span>{approvalLabels[event.approval_status] || 'Pendiente'}</span>
                              <svg className={`h-3.5 w-3.5 ml-1 text-slate-400 transition-transform duration-200 ${approvalEditOpen === `mobile-${event.id}` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            {approvalEditOpen === `mobile-${event.id}` && (
                              <div className="absolute left-0 mt-2 w-44 rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-[999]">
                                <button
                                  type="button"
                                  onClick={async () => { await updateEventApproval(event.id, 'pending'); setApprovalEditOpen(null); }}
                                  disabled={approvalBusyId === event.id}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                                >Pendiente</button>
                                <button
                                  type="button"
                                  onClick={async () => { await updateEventApproval(event.id, 'approved'); setApprovalEditOpen(null); }}
                                  disabled={approvalBusyId === event.id}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                                >Aprobado</button>
                                <button
                                  type="button"
                                  onClick={async () => { await updateEventApproval(event.id, 'rejected'); setApprovalEditOpen(null); }}
                                  disabled={approvalBusyId === event.id}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                                >Rechazado</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="flex-1 rounded bg-emerald-50 text-emerald-700 py-1 text-xs font-medium hover:bg-emerald-100 transition"
                          onClick={() => navigate(`/admin/evento/${event.id}/editar`)}
                        >Editar</button>
                        <button
                          className="flex-1 rounded bg-red-50 text-red-700 py-1 text-xs font-medium hover:bg-red-100 transition"
                          onClick={() => deleteEventById(event.id)}
                        >Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {filteredEvents.length > 0 && (
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
