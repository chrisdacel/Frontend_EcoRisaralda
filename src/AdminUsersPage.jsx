import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUser } from './services/adminApi';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Pagination from './components/Pagination';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [roleBusyId, setRoleBusyId] = useState(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [roleRowMenuOpen, setRoleRowMenuOpen] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const roleMenuRef = useRef(null);
  const statusMenuRef = useRef(null);
  const [confirmState, setConfirmState] = useState({ open: false });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setStatusMenuOpen(false);
      }
      if (roleRowMenuOpen !== null) {
        const rowMenu = document.querySelector(`[data-role-menu-id="${roleRowMenuOpen}"]`);
        if (rowMenu && !rowMenu.contains(event.target)) {
          setRoleRowMenuOpen(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [roleRowMenuOpen]);

  const loadUsers = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getAllUsers(filters);
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (nextRole = filterRole, nextStatus = filterStatus) => {
    const params = {};
    if (nextRole) params.role = nextRole;
    if (nextStatus) params.status = nextStatus;
    loadUsers(params);
  };

  const handleDeactivate = async (id) => {
    setConfirmState({
      open: true,
      title: 'Desactivar usuario',
      message: '¿Desea desactivar este usuario? El usuario no podrá iniciar sesión y su correo podrá ser reutilizado.',
      confirmLabel: 'Desactivar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          setBusyId(id);
          const { user } = await updateUser(id, { status: 'inactive' });
          setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 'inactive' } : u));
          setError('');
        } catch (err) {
          setError(err.message || 'No se pudo desactivar');
        } finally {
          setBusyId(null);
          setConfirmState({ open: false });
        }
      },
    });
  };

  const handleReactivate = async (id) => {
    const userObj = users.find(u => u.id === id);
    const originalEmail = userObj?.original_email || userObj?.email;
    setConfirmState({
      open: true,
      title: 'Reactivar usuario',
      message: '¿Desea reactivar este usuario? El usuario podrá volver a iniciar sesión.',
      confirmLabel: 'Reactivar',
      tone: 'success',
      onConfirm: async () => {
        try {
          setBusyId(id);
          const { user } = await updateUser(id, { status: 'active' });
          setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 'active' } : u));
          setError('');
          setConfirmState({ open: false });
        } catch (err) {
          // Si el error es por conflicto de email, mostrar opción de asignar correo temporal
          if (err?.response?.data?.error?.includes('correo original ya está en uso')) {
            setConfirmState({
              open: true,
              title: 'Correo en uso',
              message: 'El correo original ya está en uso por otro usuario. ¿Desea reactivar asignando un correo temporal?',
              confirmLabel: 'Asignar temporal',
              tone: 'warning',
              onConfirm: async () => {
                try {
                  setBusyId(id);
                  const { user } = await updateUser(id, { status: 'active' });
                  setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 'active' } : u));
                  setError('');
                  setConfirmState({ open: false });
                } catch (err2) {
                  setError(err2.message || 'No se pudo reactivar con correo temporal');
                  setConfirmState({ open: false });
                } finally {
                  setBusyId(null);
                }
              },
            });
          } else {
            setError(err.message || 'No se pudo reactivar');
            setConfirmState({ open: false });
          }
        } finally {
          setBusyId(null);
        }
      },
    });
  };

  const updateUserRole = async (id, role) => {
    const previousUsers = users;
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    try {
      setRoleBusyId(id);
      const { user } = await updateUser(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: user?.role || role } : u)));
      setError('');
    } catch (err) {
      setUsers(previousUsers);
      setError(err.message || 'No se pudo actualizar el rol');
    } finally {
      setRoleBusyId(null);
    }
  };

  const roleLabels = {
    '': 'Todos los roles',
    admin: 'Admin',
    operator: 'Operador',
    user: 'Turista',
  };

  const statusLabels = {
    '': 'Todos los estados',
    active: 'Activo',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };

  const roleOptions = [
    { value: '', label: 'Todos los roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'operator', label: 'Operador' },
    { value: 'user', label: 'Turista' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  const filteredUsers = users.filter((u) => {
    const name = `${u.name || ''} ${u.last_name || ''}`.trim();
    const email = u.email || '';
    const searchValue = `${name} ${email}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.trim().toLowerCase());
    return matchesSearch;
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-slate-900">Gestion de usuarios</h1>
              <p className="text-sm text-slate-600">Gestiona todos los usuarios del sistema</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

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
            <div className="relative w-full md:w-56" ref={roleMenuRef}>
              <button
                type="button"
                onClick={() => setRoleMenuOpen((prev) => !prev)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
              >
                <span className="truncate">{roleLabels[filterRole] || 'Todos los roles'}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${roleMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {roleMenuOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFilterRole(option.value);
                        setRoleMenuOpen(false);
                        handleFilter(option.value, filterStatus);
                      }}
                      className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-full md:w-56" ref={statusMenuRef}>
              <button
                type="button"
                onClick={() => setStatusMenuOpen((prev) => !prev)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
              >
                <span className="truncate">{statusLabels[filterStatus] || 'Todos los estados'}</span>
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
                        setFilterStatus(option.value);
                        setStatusMenuOpen(false);
                        handleFilter(filterRole, option.value);
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
          {currentUsers.map((u) => (
            <div key={u.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{u.name} {u.last_name || ''}</p>
              <p className="mt-1 text-xs text-slate-600">{u.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                <span>Estado: {statusLabels[u.status] || 'Activo'}</span>
                <span>Rol: {roleLabels[u.role ?? 'user'] || 'Turista'}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="relative" data-role-menu-id={`mobile-role-${u.id}`}>
                  <button
                    type="button"
                    onClick={() => setRoleRowMenuOpen((prev) => (prev === `mobile-role-${u.id}` ? null : `mobile-role-${u.id}`))}
                    disabled={roleBusyId === u.id}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50 disabled:opacity-60"
                  >
                    <span>{roleLabels[u.role ?? 'user'] || 'Turista'}</span>
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${roleRowMenuOpen === `mobile-role-${u.id}` ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {roleRowMenuOpen === `mobile-role-${u.id}` && (
                    <div className="absolute left-0 mt-2 w-40 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                      {roleOptions
                        .filter((option) => option.value)
                        .map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              updateUserRole(u.id, option.value);
                              setRoleRowMenuOpen(null);
                            }}
                            disabled={roleBusyId === u.id}
                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                          >
                            {option.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                {roleBusyId === u.id && (
                  <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                )}
                {u.status === 'inactive' ? (
                  <button
                    onClick={() => handleReactivate(u.id)}
                    disabled={busyId === u.id}
                    className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                  >
                    Reactivar
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeactivate(u.id)}
                    disabled={busyId === u.id}
                    className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-60"
                  >
                    Desactivar
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
              No hay usuarios para mostrar
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto bg-white border-b border-slate-200 pb-44">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Rol</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">{u.name} {u.last_name || ''}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.status === 'inactive' ? '[email inactivo]' : u.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {u.status === 'inactive' ? 'Inactivo' : (statusLabels[u.status] || 'Activo')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="relative" data-role-menu-id={`table-role-${u.id}`}> 
                        <button
                          type="button"
                          onClick={() =>
                            setRoleRowMenuOpen((prev) => (prev === `table-role-${u.id}` ? null : `table-role-${u.id}`))
                          }
                          disabled={roleBusyId === u.id || u.status === 'inactive'}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50 disabled:opacity-60"
                        >
                          <span>{roleLabels[u.role ?? 'user'] || 'Turista'}</span>
                          <svg
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                              roleRowMenuOpen === `table-role-${u.id}` ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {roleRowMenuOpen === `table-role-${u.id}` && u.status !== 'inactive' && (
                          <div className="absolute left-0 mt-2 w-40 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                            {roleOptions
                              .filter((option) => option.value)
                              .map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    updateUserRole(u.id, option.value);
                                    setRoleRowMenuOpen(null);
                                  }}
                                  disabled={roleBusyId === u.id}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                                >
                                  {option.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                      {roleBusyId === u.id && (
                        <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {u.status === 'inactive' ? (
                      <button
                        onClick={() => handleReactivate(u.id)}
                        disabled={busyId === u.id}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/80 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                      >
                        {busyId === u.id ? 'Reactivando...' : 'Reactivar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeactivate(u.id)}
                        disabled={busyId === u.id}
                        className="inline-flex items-center gap-1 rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                      >
                        {busyId === u.id ? 'Desactivando...' : 'Desactivar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-600">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
