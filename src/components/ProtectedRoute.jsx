import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de protección de rutas
 * Redirige a /login si el usuario no está autenticado
 * Evita acceso por copia/pegado de links sin sesión activa
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Mientras carga el estado de autenticación, mostrar loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-emerald-100/70">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Usuario autenticado: renderizar contenido protegido
  return children;
}
