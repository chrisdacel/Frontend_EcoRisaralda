import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de protección de rutas ADMIN/OPERADOR
 * Solo permite acceso a usuarios con role === 'admin' o 'operator'
 */
export default function AdminOperatorRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // No autenticado: redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero no admin ni operador: redirigir a home
  if (user.role !== 'admin' && user.role !== 'operator') {
    return <Navigate to="/" replace />;
  }

  // Usuario es admin u operador: renderizar contenido
  return (
    <>
      {children}
    </>
  );
}
