import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de protección de rutas ADMIN
 * Solo permite acceso a usuarios con role === 'admin'
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-emerald-100/70">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // No autenticado: redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero no admin: redirigir a home
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Usuario es admin: renderizar contenido
  return (
    <>
      {children}
    </>
  );
}
