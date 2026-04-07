import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';

export default function AdminOperatorsPage() {
  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [error, setError] = useState('');
  const [eventApprovalBusyId, setEventApprovalBusyId] = useState(null);
  const [eventMenuOpen, setEventMenuOpen] = useState(null);
  const [eventMenuDirection, setEventMenuDirection] = useState('down');
  const [expandedPlaceNames, setExpandedPlaceNames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [approvalMenuOpen, setApprovalMenuOpen] = useState(false);
  const approvalMenuRef = useRef(null);
  const [confirmState, setConfirmState] = useState({ open: false });

  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');
  const goEventDetail = (event) => {
    const placeId = event?.place?.id;
    if (placeId) {
      navigate(`/admin/sitio/${placeId}#evento`);
      return;
    }
    navigate(`/admin/evento/${event?.id}/editar`);
  };


  useEffect(() => {
    loadApprovals();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventMenuOpen !== null) {
        const eventMenu = document.querySelector(`[data-event-menu-id="${eventMenuOpen}"]`);
        if (eventMenu && !eventMenu.contains(event.target)) {
          setEventMenuOpen(null);
        }
      }
      if (approvalMenuRef.current && !approvalMenuRef.current.contains(event.target)) {
        setApprovalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [eventMenuOpen]);

  const loadApprovals = async () => {
    try {
      setLoadingApprovals(true);
      const { data } = await api.get('/api/user-places');
      const list = Array.isArray(data) ? data : [];
      const allEvents = list.flatMap((place) => (
        Array.isArray(place.events)
          ? place.events.map((event) => ({ ...event, place }))
          : []
      ));
      const pendingEventList = allEvents.filter((event) => (event.approval_status || 'pending') === 'pending');
      const historyEventList = allEvents.filter((event) => {
        const status = event.approval_status || 'pending';
        return status === 'approved' || status === 'rejected';
      });
      setPendingEvents(pendingEventList);
      setHistoryEvents(historyEventList);
      setError('');
    } catch (err) {
      setError(err?.message || 'Error cargando aprobaciones');
    } finally {
      setLoadingApprovals(false);
    }
  };

  const updateEventApproval = async (eventId, status) => {
    const pendingSnapshot = pendingEvents;
    const historySnapshot = historyEvents;
    const existing = pendingEvents.find((event) => event.id === eventId)
      || historyEvents.find((event) => event.id === eventId);

    if (existing) {
      const updated = { ...existing, approval_status: status };
      const nextPending = pendingEvents.filter((event) => event.id !== eventId);
      const nextHistory = historyEvents.filter((event) => event.id !== eventId);
      if (status === 'pending') {
        setPendingEvents([updated, ...nextPending]);
        setHistoryEvents(nextHistory);
      } else {
        setPendingEvents(nextPending);
        setHistoryEvents([updated, ...nextHistory]);
      }
    }
    try {
      setEventApprovalBusyId(eventId);
      await api.post(`/api/admin/events/${eventId}/approval`, { status });
      setError('');
    } catch (err) {
      setPendingEvents(pendingSnapshot);
      setHistoryEvents(historySnapshot);
      const message = err?.response?.data?.message || err?.message || 'No se pudo actualizar el evento';
      setError(message);
    } finally {
      setEventApprovalBusyId(null);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setConfirmState({
      open: true,
      title: 'Eliminar evento',
      message: '¿Eliminar este evento? Esta accion no se puede deshacer.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/events/${eventId}`);
          setPendingEvents((prev) => prev.filter((event) => event.id !== eventId));
          setHistoryEvents((prev) => prev.filter((event) => event.id !== eventId));
          setError('');
        } catch (err) {
          const message = err?.response?.data?.message || err?.message || 'Error eliminando evento';
          setError(message);
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  const approvalLabels = {
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
        return 'text-emerald-700 ring-emerald-200 hover:bg-emerald-50';
      case 'rejected':
        return 'text-rose-700 ring-rose-200 hover:bg-rose-50';
      default:
        return 'text-amber-700 ring-amber-200 hover:bg-amber-50';
    }
  };

  const shouldTruncate = (value) => (value || '').length > 40;

  const togglePlaceName = (key) => {
    setExpandedPlaceNames((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderPlaceName = (value, key) => {
    const expanded = !!expandedPlaceNames[key];
    const canToggle = shouldTruncate(value);
    return (
      <div className="flex flex-col gap-1">
        <span
          className={`max-w-[260px] ${
            expanded ? 'whitespace-normal break-words' : 'line-clamp-1'
          }`}
        >
          {value}
        </span>
        {canToggle && (
          <button
            type="button"
            onClick={() => togglePlaceName(key)}
            className="self-start text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            {expanded ? 'Ver menos' : 'Ver mas'}
          </button>
        )}
      </div>
    );
  };

  const renderEventRow = (event, rowKey) => {
    const place = event.place || {};
    const menuKey = `table-${event.id}`;
    return (
      <tr key={rowKey} className="hover:bg-slate-50">
        <td className="px-6 py-6 text-sm font-medium text-slate-900">
          <div className="flex flex-col items-start gap-2">
            {event.image ? (
              <img loading="lazy"
                src={storageUrl(event.image)}
                alt={event.title || event.name || event.nombre || 'Evento'}
                className="w-32 h-20 rounded-md object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-32 h-20 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200 text-xs text-slate-400">
                Sin imagen
              </div>
            )}
            <button
              type="button"
              onClick={() => goEventDetail(event)}
              className="text-left text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4 line-clamp-2"
            >
              {event.title || event.name || event.nombre || '—'}
            </button>
          </div>
        </td>
        <td className="px-6 py-6 text-sm text-slate-700">
          {renderPlaceName(place.name || place.nombre || '—', `event-place-${rowKey}`)}
        </td>
        <td className="px-6 py-6 text-sm text-slate-700">
          <span className="line-clamp-2">{place.user?.email || '—'}</span>
        </td>
        <td className="px-6 py-6 text-sm text-slate-700">
          <div className="relative inline-flex items-center gap-2" data-event-menu-id={menuKey}>
            <button
              type="button"
              onClick={(eventTarget) => {
                const rect = eventTarget.currentTarget.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setEventMenuDirection(spaceBelow < 260 ? 'up' : 'down');
                setEventMenuOpen((prev) => (prev === menuKey ? null : menuKey));
              }}
              disabled={eventApprovalBusyId === event.id}
              className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs ring-1 transition disabled:opacity-60 ${getApprovalButtonClass(event.approval_status || 'pending')}`}
            >
              {approvalLabels[event.approval_status] || 'Pendiente'}
              <svg
                className={`h-3.5 w-3.5 text-current transition-transform duration-200 ${
                  eventMenuOpen === menuKey ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {eventMenuOpen === menuKey && (
              <div
                className={`absolute right-0 w-44 rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-[999] ${
                  eventMenuDirection === 'up' ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    updateEventApproval(event.id, 'pending');
                    setEventMenuOpen(null);
                  }}
                  disabled={eventApprovalBusyId === event.id}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                >
                  Pendiente
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateEventApproval(event.id, 'approved');
                    setEventMenuOpen(null);
                  }}
                  disabled={eventApprovalBusyId === event.id}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                >
                  Aprobado
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateEventApproval(event.id, 'rejected');
                    setEventMenuOpen(null);
                  }}
                  disabled={eventApprovalBusyId === event.id}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                >
                  Rechazado
                </button>
                {eventApprovalBusyId === event.id && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                    Cargando...
                  </div>
                )}
              </div>
            )}
            {eventApprovalBusyId === event.id && (
              <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
            )}
          </div>
        </td>
        <td className="px-6 py-6 text-sm text-slate-700">
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
              onClick={() => handleDeleteEvent(event.id)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (loadingApprovals) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  const allEvents = [...pendingEvents, ...historyEvents];
  const filteredEvents = allEvents.filter((event) => {
    const title = event.title || event.name || event.nombre || '';
    const placeName = event.place?.name || event.place?.nombre || '';
    const operator = event.place?.user?.email || '';
    const searchValue = `${title} ${placeName} ${operator}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.trim().toLowerCase());
    const status = event.approval_status || 'pending';
    const matchesApproval = approvalFilter === 'all' || status === approvalFilter;
    return matchesSearch && matchesApproval;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 pb-16 overflow-x-hidden pt-14">
      <div className="max-w-7xl mx-auto pt-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Gestionar eventos</h1>
            <p className="text-slate-600">Administra eventos y su estado de aprobacion</p>
          </div>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        <>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2">
              <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.6-4.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por evento, sitio u operador"
                className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
            <div className="relative" ref={approvalMenuRef}>
              <button
                type="button"
                onClick={() => setApprovalMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
              >
                <span>{approvalLabels[approvalFilter] || 'Todas las aprobaciones'}</span>
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
                <div className="absolute right-0 mt-2 w-56 max-h-none rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
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
          <div className="mt-10"></div>

          <div className="mt-4 md:hidden space-y-3">
            {filteredEvents.map((event) => {
              const menuKey = `mobile-${event.id}`;
              return (
                <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  {event.image ? (
                    <img loading="lazy"
                      src={storageUrl(event.image)}
                      alt={event.title || event.name || event.nombre || 'Evento'}
                      className="mb-3 h-32 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="mb-3 h-32 w-full rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                      Sin imagen
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => goEventDetail(event)}
                    className="text-left text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    {event.title || event.name || event.nombre || '—'}
                  </button>
                  <p className="mt-1 text-xs text-slate-600">{event.place?.name || event.place?.nombre || '—'}</p>
                  <p className="mt-1 text-xs text-slate-600">{event.place?.user?.email || '—'}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-600" data-event-menu-id={menuKey}>
                    <span>Estado:</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(eventTarget) => {
                          const rect = eventTarget.currentTarget.getBoundingClientRect();
                          const spaceBelow = window.innerHeight - rect.bottom;
                          setEventMenuDirection(spaceBelow < 260 ? 'up' : 'down');
                          setEventMenuOpen((prev) => (prev === menuKey ? null : menuKey));
                        }}
                        disabled={eventApprovalBusyId === event.id}
                        className={`inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 text-xs ring-1 transition disabled:opacity-60 ${getApprovalButtonClass(event.approval_status || 'pending')}`}
                      >
                        {approvalLabels[event.approval_status] || 'Pendiente'}
                        <svg
                          className={`h-3.5 w-3.5 text-current transition-transform duration-200 ${
                            eventMenuOpen === menuKey ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {eventMenuOpen === menuKey && (
                        <div
                          className={`absolute right-0 w-44 rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-[999] ${
                            eventMenuDirection === 'up' ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              updateEventApproval(event.id, 'pending');
                              setEventMenuOpen(null);
                            }}
                            disabled={eventApprovalBusyId === event.id}
                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                          >
                            Pendiente
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateEventApproval(event.id, 'approved');
                              setEventMenuOpen(null);
                            }}
                            disabled={eventApprovalBusyId === event.id}
                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                          >
                            Aprobado
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateEventApproval(event.id, 'rejected');
                              setEventMenuOpen(null);
                            }}
                            disabled={eventApprovalBusyId === event.id}
                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                          >
                            Rechazado
                          </button>
                          {eventApprovalBusyId === event.id && (
                            <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500">
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                              Cargando...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                      onClick={() => navigate(`/admin/evento/${event.id}/editar`)}
                    >
                      Editar
                    </button>
                    <button
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
            {!loadingApprovals && filteredEvents.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                No hay eventos registrados
              </div>
            )}
          </div>

          <div className="mt-4 hidden md:block min-h-[360px] overflow-visible bg-white border-b border-slate-200 pb-44">
            <div className="relative overflow-x-auto overflow-y-visible">
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Evento</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Sitio</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Operador</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Estado de aprobacion</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEvents.map((event) => renderEventRow(event, event.id))}
                  {!loadingApprovals && filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-slate-600">No hay eventos registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
