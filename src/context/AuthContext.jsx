import { createContext, useState, useEffect, useContext } from 'react';
import { api, getCurrentUser, logout as apiLogout, initializeCsrfToken, loadAuthTokenFromStorage } from '../services/api';
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inicializar auth al montar el componente
  useEffect(() => {
    async function initAuth() {
      try {
        // Restaurar token Bearer desde localStorage (si existe)
        loadAuthTokenFromStorage();
  
        // Obtener CSRF token una sola vez
        await initializeCsrfToken();
        
        // Intentar obtener usuario actual
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        setError('');
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const logout = async () => {
    try {
      // Refresca el token CSRF antes de cerrar sesión para evitar 419
      await initializeCsrfToken();
      await apiLogout();
      // Asegurar que ya no se envíe el header Authorization
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Error al cerrar sesión');
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
