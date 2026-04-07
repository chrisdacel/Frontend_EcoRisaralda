import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getAdminDashboard } from './services/adminApi';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Error cargando dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="rounded-full bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center gap-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 flex flex-col gap-3 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-emerald-100 p-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats?.active_turistas || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Turistas activos</h3>
            </div>

            <div className="bg-white rounded-lg p-4 flex flex-col gap-3 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-indigo-100 p-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h6M9 10h6M4 6h1m-1 4h1m-1 4h1" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats?.active_operators || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Operadores activos</h3>
            </div>

            <div className="bg-white rounded-lg p-4 flex flex-col gap-3 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-amber-100 p-3">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724a1 1 0 01-.553-.894V5a1 1 0 01.553-.894L9 1.382a1 1 0 011 0l5.447 2.724a1 1 0 01.553.894v11.382a1 1 0 01-.553.894L10 20a1 1 0 01-1 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4l5.447 2.724M9 10l5.447 2.724M9 16l5.447 2.724" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats?.active_places || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Sitios activos</h3>
            </div>

            <div className="bg-white rounded-lg p-4 flex flex-col gap-3 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-rose-100 p-3">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats?.active_events || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Eventos activos</h3>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/admin/sites')}
              className="group bg-white rounded-lg p-6 hover:ring-emerald-200 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-emerald-50 p-3 group-hover:bg-emerald-100 transition">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 11h14M7 15h10M9 19h6" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Gestionar Sitios</h3>
              <p className="text-sm text-slate-600">Ver, editar y eliminar sitios turísticos</p>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="group bg-white rounded-lg p-6 hover:ring-emerald-200 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-emerald-50 p-3 group-hover:bg-emerald-100 transition">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Gestionar Usuarios</h3>
              <p className="text-sm text-slate-600">Ver, editar y administrar todos los usuarios</p>
            </button>


            <button
              onClick={() => navigate('/admin/events')}
              className="group bg-white rounded-lg p-6 hover:ring-amber-200 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-amber-50 p-3 group-hover:bg-amber-100 transition">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l2 2 4-4" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Gestionar eventos</h3>
              <p className="text-sm text-slate-600">Ver, aprobar y administrar eventos turísticos</p>
            </button>

            <button
              onClick={() => navigate('/admin/comentarios')}
              className="group bg-white rounded-lg p-6 hover:ring-emerald-200 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-red-50 p-3 group-hover:bg-red-100 transition">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-9 4h8M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Gestionar Comentarios</h3>
              <p className="text-sm text-slate-600">Ver y eliminar reseñas de los sitios</p>
            </button>

            <button
              onClick={() => navigate('/admin/etiquetas')}
              className="group bg-white rounded-lg p-6 hover:ring-emerald-200 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-emerald-50 p-3 group-hover:bg-emerald-100 transition">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10l4 4-8 8-8-8V7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7v-2a2 2 0 012-2h6a2 2 0 012 2v2" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Gestionar Etiquetas</h3>
              <p className="text-sm text-slate-600">Crear, editar y eliminar etiquetas</p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
