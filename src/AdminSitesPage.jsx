import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';
import { getAdminPlaces } from './services/adminApi';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Pagination from './components/Pagination';

export default function AdminSitesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [approvalMenuOpen, setApprovalMenuOpen] = useState(false);
  const [approvalBusyId, setApprovalBusyId] = useState(null);
  const [approvalEditOpen, setApprovalEditOpen] = useState(null);
  const [approvalEditDirection, setApprovalEditDirection] = useState('down');
  const [statusBusyId, setStatusBusyId] = useState(null);
  const [statusEditOpen, setStatusEditOpen] = useState(null);
  const [statusEditDirection, setStatusEditDirection] = useState('down');
  const statusMenuRef = useRef(null);
  const approvalMenuRef = useRef(null);
  const navigate = useNavigate();
  const [confirmState, setConfirmState] = useState({ open: false });
  const [expandedSiteNames, setExpandedSiteNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, approvalFilter]);

  const loadPlaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminPlaces();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Error cargando sitios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setStatusMenuOpen(false);
      }
      if (approvalMenuRef.current && !approvalMenuRef.current.contains(event.target)) {
        setApprovalMenuOpen(false);
      }
      if (approvalEditOpen !== null) {
        const editMenu = document.querySelector(`[data-approval-edit-id="${approvalEditOpen}"]`);
        if (editMenu && !editMenu.contains(event.target)) {
          setApprovalEditOpen(null);
        }
      }
      if (statusEditOpen !== null) {
        const statusMenu = document.querySelector(`[data-status-edit-id="${statusEditOpen}"]`);
        if (statusMenu && !statusMenu.contains(event.target)) {
          setStatusEditOpen(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [approvalEditOpen, statusEditOpen]);

  const goEdit = (id) => navigate(`/admin/sitio/${id}/editar`);

  const deletePlaceById = async (id) => {
    setConfirmState({
      open: true,
      title: 'Eliminar sitio',
      message: '¿Eliminar este sitio? Esta accion no se puede deshacer.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/places/${id}`);
          await loadPlaces();
          setError('');
        } catch (err) {
          setError(err?.message || 'Error eliminando sitio');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  const updatePlaceApproval = async (id, approval_status) => {
    try {
      setApprovalBusyId(id);
      await api.put(`/api/admin/places/${id}`, { approval_status });
      setPlaces((prev) => prev.map((p) => (
        p.id === id ? { ...p, approval_status } : p
      )));
      setError('');
    } catch (err) {
      setError(err?.message || 'Error actualizando la aprobación');
    } finally {
      setApprovalBusyId(null);
    }
  };

  const updatePlaceStatus = async (id, opening_status) => {
    try {
      setStatusBusyId(id);
      await api.put(`/api/admin/places/${id}`, { opening_status });
      setPlaces((prev) => prev.map((p) => (
        p.id === id ? { ...p, opening_status } : p
      )));
      setError('');
    } catch (err) {
      setError(err?.message || 'Error actualizando el estado');
    } finally {
      setStatusBusyId(null);
    }
  };

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

  const getStatusButtonClass = (status) => {
    switch (status) {
      case 'closed_temporarily':
        return 'text-rose-700 ring-rose-200 hover:bg-rose-50';
      case 'open':
        return 'text-emerald-700 ring-emerald-200 hover:bg-emerald-50';
      case 'open_with_restrictions':
        return 'text-amber-700 ring-amber-200 hover:bg-amber-50';
      default:
        return 'text-amber-700 ring-amber-200 hover:bg-amber-50';
    }
  };


  const goDetail = (id) => navigate(`/admin/sitio/${id}`);

  const statusLabels = {
    all: 'Todos los estados',
    open: 'Abierto',
    closed_temporarily: 'Cerrado temporalmente',
    open_with_restrictions: 'Abierto con restricciones',
  };

  const approvalLabels = {
    all: 'Todas las aprobaciones',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };


  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'open', label: 'Abierto' },
    { value: 'open_with_restrictions', label: 'Abierto con restricciones' },
    { value: 'closed_temporarily', label: 'Cerrado temporalmente' },
  ];

  const approvalOptions = [
    { value: 'all', label: 'Todas las aprobaciones' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  const shouldTruncate = (value) => (value || '').length > 40;

  const toggleSiteName = (key) => {
    setExpandedSiteNames((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredPlaces = places.filter((place) => {
    const name = place?.name || place?.nombre || '';
    const email = place?.user?.email || place?.creator_email || '';
    const searchValue = `${name} ${email}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.trim().toLowerCase());
    const matchesStatus = statusFilter === 'all' || (place?.opening_status || place?.estado_apertura) === statusFilter;
    const matchesApproval = approvalFilter === 'all' || (place?.approval_status || 'pending') === approvalFilter;
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE);
  const currentPlaces = filteredPlaces.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
              <h1 className="text-3xl font-bold text-slate-900">Gestión de Sitios</h1>
              <p className="text-sm text-slate-600">Administra, edita y elimina sitios turísticos</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando sitios…</div>
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
                  placeholder="Buscar por nombre o email"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>
              {/* Filtros en fila en desktop, columna en móvil */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-56" ref={statusMenuRef}>
                  <button
                    type="button"
                    onClick={() => setStatusMenuOpen((prev) => !prev)}
                    className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                  >
                    <span className="truncate">{statusLabels[statusFilter] || 'Todos los estados'}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${statusMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {statusMenuOpen && (
                    <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(option.value);
                            setStatusMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
            <div className="md:hidden space-y-3 mb-4">
              {currentPlaces.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    {p.cover ? (
                      <img loading="lazy"
                        src={`${import.meta.env.VITE_API_URL}/api/files/${p.cover}`}
                        alt={p.nombre || p.name}
                        className="h-16 w-24 rounded-md object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-16 w-24 rounded-md bg-slate-100 border border-slate-200 grid place-items-center text-xs text-slate-400">
                        Sin imagen
                      </div>
                    )}
                    <div className="flex-1">
                      <button
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                        onClick={() => goDetail(p.id)}
                      >
                        {p.nombre || p.name || '—'}
                      </button>
                      <p className="mt-1 text-xs text-slate-600">{p.user?.email || p.creator_email || '—'}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2" data-status-edit-id={`mobile-status-${p.id}`}>
                          <span>Estado:</span>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(event) => {
                                const rect = event.currentTarget.getBoundingClientRect();
                                const spaceBelow = window.innerHeight - rect.bottom;
                                setStatusEditDirection(spaceBelow < 220 ? 'up' : 'down');
                                setStatusEditOpen((prev) => (prev === `mobile-status-${p.id}` ? null : `mobile-status-${p.id}`));
                              }}
                              disabled={statusBusyId === p.id}
                              className={`inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 text-xs text-slate-700 ring-1 transition disabled:opacity-60 ${getStatusButtonClass(p.opening_status || p.estado_apertura)}`}
                            >
                              {statusLabels[p.opening_status || p.estado_apertura] || '—'}
                              <svg
                                className={`h-3.5 w-3.5 text-current transition-transform duration-200 ${
                                  statusEditOpen === `mobile-status-${p.id}` ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {statusEditOpen === `mobile-status-${p.id}` && (
                              <div
                                className={`absolute right-0 w-52 rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-[999] ${
                                  statusEditDirection === 'up'
                                    ? 'bottom-full mb-2 origin-bottom-right'
                                    : 'top-full mt-2 origin-top-right'
                                }`}
                              >
                                {statusOptions.filter((option) => option.value !== 'all').map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                      updatePlaceStatus(p.id, option.value);
                                      setStatusEditOpen(null);
                                    }}
                                    disabled={statusBusyId === p.id}
                                    className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {statusBusyId === p.id && (
                            <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Aprobacion:</span>
                          <div className="relative" data-approval-edit-id={`mobile-${p.id}`}>
                            <button
                              type="button"
                              onClick={(event) => {
                                const rect = event.currentTarget.getBoundingClientRect();
                                const spaceBelow = window.innerHeight - rect.bottom;
                                setApprovalEditDirection(spaceBelow < 260 ? 'up' : 'down');
                                setApprovalEditOpen((prev) => (prev === `mobile-${p.id}` ? null : `mobile-${p.id}`));
                              }}
                              disabled={approvalBusyId === p.id}
                              className={`inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 text-xs text-slate-700 ring-1 transition disabled:opacity-60 ${getApprovalButtonClass(p.approval_status || 'pending')}`}
                            >
                              {approvalLabels[p.approval_status] || 'Pendiente'}
                              <svg
                                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                  approvalEditOpen === `mobile-${p.id}` ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {approvalEditOpen === `mobile-${p.id}` && (
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
                                    updatePlaceApproval(p.id, 'pending');
                                    setApprovalEditOpen(null);
                                  }}
                                  disabled={approvalBusyId === p.id}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                                >
                                  Pendiente
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updatePlaceApproval(p.id, 'approved');
                                    setApprovalEditOpen(null);
                                  }}
                                  disabled={approvalBusyId === p.id}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                                >
                                  Aprobado
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updatePlaceApproval(p.id, 'rejected');
                                    setApprovalEditOpen(null);
                                  }}
                                  disabled={approvalBusyId === p.id}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                                >
                                  Rechazado
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {approvalBusyId === p.id && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                          Cargando...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                      onClick={() => goEdit(p.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      onClick={() => deletePlaceById(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {filteredPlaces.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                  No hay sitios que coincidan con el filtro.
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto bg-white border-b border-slate-200 pb-44">
              <table className="min-w-full text-sm">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Nombre</th>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Email</th>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Estado</th>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Aprobacion</th>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentPlaces.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-2">
                        {p.cover ? (
                          <img loading="lazy"
                            src={`${import.meta.env.VITE_API_URL}/api/files/${p.cover}`}
                            alt={p.nombre || p.name}
                            className="w-32 h-20 rounded-md object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-32 h-20 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex flex-col items-start gap-1">
                          <button
                            className={`max-w-[260px] text-left text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4 ${
                              expandedSiteNames[`site-${p.id}`]
                                ? 'whitespace-normal break-words'
                                : 'line-clamp-1'
                            }`}
                            onClick={() => goDetail(p.id)}
                          >
                            {p.nombre || p.name || '—'}
                          </button>
                          {shouldTruncate(p.nombre || p.name || '—') && (
                            <button
                              type="button"
                              onClick={() => toggleSiteName(`site-${p.id}`)}
                              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                            >
                              {expandedSiteNames[`site-${p.id}`] ? 'Ver menos' : 'Ver mas'}
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{p.user?.email || p.creator_email || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-flex items-center gap-2" data-status-edit-id={`table-status-${p.id}`}>
                        <button
                          type="button"
                          onClick={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;
                            setStatusEditDirection(spaceBelow < 260 ? 'up' : 'down');
                            setStatusEditOpen((prev) => (prev === `table-status-${p.id}` ? null : `table-status-${p.id}`));
                          }}
                          disabled={statusBusyId === p.id}
                          className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 transition disabled:opacity-60 ${getStatusButtonClass(p.opening_status || p.estado_apertura)}`}
                        >
                          {statusLabels[p.opening_status || p.estado_apertura] || '—'}
                          <svg
                            className={`h-3.5 w-3.5 text-current transition-transform duration-200 ${
                              statusEditOpen === `table-status-${p.id}` ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {statusEditOpen === `table-status-${p.id}` && (
                          <div
                            className={`absolute right-0 w-52 rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-[999] ${
                              statusEditDirection === 'up'
                                ? 'bottom-full mb-2 origin-bottom-right'
                                : 'top-full mt-2 origin-top-right'
                            }`}
                          >
                            {statusOptions.filter((option) => option.value !== 'all').map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  updatePlaceStatus(p.id, option.value);
                                  setStatusEditOpen(null);
                                }}
                                disabled={statusBusyId === p.id}
                                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                        {statusBusyId === p.id && (
                          <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-flex items-center gap-2" data-approval-edit-id={`table-${p.id}`}>
                        <button
                          type="button"
                          onClick={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;
                            setApprovalEditDirection(spaceBelow < 220 ? 'up' : 'down');
                            setApprovalEditOpen((prev) => (prev === `table-${p.id}` ? null : `table-${p.id}`));
                          }}
                          disabled={approvalBusyId === p.id}
                          className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 transition disabled:opacity-60 ${getApprovalButtonClass(p.approval_status || 'pending')}`}
                        >
                          {approvalLabels[p.approval_status] || 'Pendiente'}
                          <svg
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                              approvalEditOpen === `table-${p.id}` ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {approvalEditOpen === `table-${p.id}` && (
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
                                updatePlaceApproval(p.id, 'pending');
                                setApprovalEditOpen(null);
                              }}
                              disabled={approvalBusyId === p.id}
                              className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                            >
                              Pendiente
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updatePlaceApproval(p.id, 'approved');
                                setApprovalEditOpen(null);
                              }}
                              disabled={approvalBusyId === p.id}
                              className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                            >
                              Aprobado
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updatePlaceApproval(p.id, 'rejected');
                                setApprovalEditOpen(null);
                              }}
                              disabled={approvalBusyId === p.id}
                              className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                            >
                              Rechazado
                            </button>
                          </div>
                        )}
                        {approvalBusyId === p.id && (
                          <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Editar sitio"
                          onClick={() => goEdit(p.id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar sitio"
                          onClick={() => deletePlaceById(p.id)}
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
            {filteredPlaces.length === 0 && (
              <div className="px-6 py-6 text-center text-slate-600">No hay sitios que coincidan con el filtro.</div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
