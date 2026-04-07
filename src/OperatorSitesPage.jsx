import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserPlaces, api } from './services/api';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Pagination from './components/Pagination';

export default function OperatorSitesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef(null);
  const navigate = useNavigate();
  const [confirmState, setConfirmState] = useState({ open: false });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const loadPlaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUserPlaces();
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goEdit = (id) => navigate(`/operador/sitio/${id}/editar`);
  const goDetail = (id) => navigate(`/operador/sitio/${id}`);

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

  const statusLabels = {
    all: 'Todos los estados',
    open: 'Abierto',
    closed_temporarily: 'Cerrado temporalmente',
    open_with_restrictions: 'Abierto con restricciones',
  };

  const approvalLabels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'open', label: 'Abierto' },
    { value: 'closed_temporarily', label: 'Cerrado temporalmente' },
    { value: 'open_with_restrictions', label: 'Abierto con restricciones' },
  ];

  const filteredPlaces = places.filter((place) => {
    const name = place?.name || place?.nombre || '';
    const slogan = place?.slogan || '';
    const searchValue = `${name} ${slogan}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.trim().toLowerCase());
    const matchesStatus = statusFilter === 'all' || (place?.opening_status || place?.estado_apertura) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE);
  const currentPlaces = filteredPlaces.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mis Sitios</h1>
              <p className="text-sm text-slate-600">Administra, edita y elimina los sitios que has creado</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/operador/comentarios')}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50"
              >
                Gestionar comentarios
              </button>
              <button
                onClick={() => navigate('/crear-sitio')}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                Crear sitio
              </button>
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
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2">
                <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.6-4.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o slogan"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>
              <div className="relative" ref={statusMenuRef}>
                <button
                  type="button"
                  onClick={() => setStatusMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                >
                  <span>{statusLabels[statusFilter] || 'Todos los estados'}</span>
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
                  <div className="absolute right-0 mt-2 w-56 max-h-none rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
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
                      <p className="mt-1 text-xs text-slate-600">{p.slogan || '—'}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                        <span>Estado: {statusLabels[p.opening_status || p.estado_apertura] || '—'}</span>
                        <span>Aprobacion: {approvalLabels[p.approval_status] || 'Pendiente'}</span>
                      </div>
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
                  Aun no has creado sitios
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto bg-white border-b border-slate-200 pb-44">
              <table className="min-w-full text-sm">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Slogan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Aprobacion</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentPlaces.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
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
                        <button
                          className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4"
                          onClick={() => goDetail(p.id)}
                        >
                          {p.nombre || p.name || '—'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{p.slogan || '—'}</td>
                    <td className="px-4 py-4 text-slate-700">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.opening_status === 'open' || p.estado_apertura === 'open' ? 'bg-emerald-100 text-emerald-800' :
                        p.opening_status === 'closed_temporarily' || p.estado_apertura === 'closed_temporarily' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {statusLabels[p.opening_status || p.estado_apertura] || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        p.approval_status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {approvalLabels[p.approval_status] || 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
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
                {filteredPlaces.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-slate-600">Aún no has creado sitios</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredPlaces.length > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
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
