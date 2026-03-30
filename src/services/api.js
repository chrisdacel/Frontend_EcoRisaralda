import axios from 'axios';

// Variable para controlar reintentos
let isRefreshing = false;

// Clave para guardar el token en localStorage
const AUTH_TOKEN_KEY = 'ecorisaralda_auth_token';

function resolveApiOrigin() {
  const raw = (import.meta.env.VITE_API_URL || '').trim();
  const origin = raw.replace(/\/+$/, ''); 

  if (!origin && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  return origin;
}

const API_ORIGIN = resolveApiOrigin();

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: `${API_ORIGIN}/`,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
});

// ====== Helpers para manejar el token Bearer (Sanctum) ======
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
}

export function loadAuthTokenFromStorage() {
  if (typeof window === 'undefined') return null;
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return token;
}

// Interceptores de Axios para CSRF
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 419 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.get(`${API_ORIGIN}/sanctum/csrf-cookie`, { withCredentials: true });
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

loadAuthTokenFromStorage();
export { api };

// ============ INICIALIZACIÓN ============
export async function initializeCsrfToken() {
  try {
    await axios.get(`${API_ORIGIN}/sanctum/csrf-cookie`, { withCredentials: true });
  } catch (error) {
    console.error('Error getting CSRF token:', error);
  }
}

export async function fetchCountries() {
  try {
    const { data } = await api.get('/api/countries');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo países' };
  }
}

// ============ AUTENTICACIÓN (HU001) ============
export async function register(name, email, password, role = 'turist', lastName = null, country = null, birthDate = null) {
  try {
    const payload = { name, last_name: lastName, email, password, role };
    if (country) payload.country = country;
    if (birthDate) payload.birth_date = birthDate; 

    const { data } = await api.post('/api/register', payload);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en registro' };
  }
}

export async function login(email, password) {
  try {
    const { data } = await api.post('/api/login', { email, password });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Credenciales inválidas' };
  }
}

export async function requestPasswordReset(email) {
  try {
    const { data } = await api.post('/api/forgot-password', { email });
    return data.message || 'Revisa tu correo para el enlace de recuperación';
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo enviar el enlace' };
  }
}

export async function resetPassword(token, email, password, passwordConfirmation) {
  try {
    const { data } = await api.post('/api/reset-password', {
      token, email, password, password_confirmation: passwordConfirmation,
    });
    return data.message || 'Contraseña restablecida';
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo restablecer la contraseña' };
  }
}

export async function logout() {
  try {
    await api.post('/api/logout');
    setAuthToken(null);
  } catch (error) {
    throw error.response?.data || { message: 'Error al cerrar sesión' };
  }
}

export async function getCurrentUser() {
  if (typeof window !== 'undefined' && !window.localStorage.getItem(AUTH_TOKEN_KEY)) {
    return null;
  }
  try {
    const { data } = await api.get('/api/user');
    return data;
  } catch (error) {
    return null;
  }
}
export async function fetchNotifications() { return []; }