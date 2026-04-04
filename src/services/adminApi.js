import axios from 'axios';

function resolveApiOrigin() {
  const raw = (import.meta.env.VITE_API_URL || '').trim();
  const origin = raw.replace(/\/+$/, '');

  if (!origin && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  return origin;
}

const API_ORIGIN = resolveApiOrigin();

// Usar la misma instancia de axios con configuración CSRF
const api = axios.create({
  
  // OJO: aquí NO agregamos /api porque en los paths ya viene "/api/..."
  // (Si no, termina quedando /api/api/... y da "route not found")
  baseURL: `${API_ORIGIN}`,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Aplicar token Bearer si existe en localStorage
if (typeof window !== 'undefined') {
  const stored = window.localStorage.getItem('ecorisaralda_auth_token');
  if (stored) {
    api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
  }
}

// Interceptor para CSRF
api.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match) {
    try {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    } catch (e) {
      config.headers['X-XSRF-TOKEN'] = match[1];
    }
  }
  return config;
});

// ============ ADMIN DASHBOARD ============
export async function getAdminDashboard() {
  try {
    const { data } = await api.get('/api/admin/dashboard');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo estadísticas' };
  }
}

// ============ USERS MANAGEMENT ============
export async function getAllUsers(filters = {}) {
  try {
    const { data } = await api.get('/api/admin/users', { params: filters });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo usuarios' };
  }
}

export async function getUser(id) {
  try {
    const { data } = await api.get(`/api/admin/users/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo usuario' };
  }
}

export async function createUser(userData) {
  try {
    const { data } = await api.post('/api/admin/users', userData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creando usuario' };
  }
}

export async function updateUser(id, userData) {
  try {
    const { data } = await api.put(`/api/admin/users/${id}`, userData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando usuario' };
  }
}

export async function deleteUser(id) {
  try {
    const { data } = await api.delete(`/api/admin/users/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando usuario' };
  }
}

// ============ OPERATORS MANAGEMENT ============
export async function getPendingOperators() {
  try {
    const { data } = await api.get('/api/admin/operators/pending');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo operadores pendientes' };
  }
}

export async function approveOperator(id) {
  try {
    const { data } = await api.post(`/api/admin/operators/${id}/approve`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error aprobando operador' };
  }
}

export async function rejectOperator(id) {
  try {
    const { data } = await api.post(`/api/admin/operators/${id}/reject`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error rechazando operador' };
  }
}

// ============ PLACES MANAGEMENT ============
export async function updateAdminPlace(id, payload) {
  try {
    const { data } = await api.put(`/api/admin/places/${id}`, payload);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando sitio' };
  }
}
export async function getAdminPlaces() {
  try {
    const { data } = await api.get('/api/admin/places');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo sitios' };
  }
}

export async function deletePlace(id) {
  try {
    const { data } = await api.delete(`/api/admin/places/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando sitio' };
  }
}

// ============ REVIEWS MANAGEMENT ============
export async function getAdminReviews() {
  try {
    const { data } = await api.get('/api/admin/reviews');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo reseñas' };
  }
}

export async function restrictReview(id) {
  try {
    const { data } = await api.post(`/api/admin/reviews/${id}/restrict`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error restringiendo reseña' };
  }
}

export async function unrestrictReview(id) {
  try {
    const { data } = await api.post(`/api/admin/reviews/${id}/unrestrict`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desrestringiendo reseña' };
  }
}

// ============ PREFERENCES MANAGEMENT ============
export async function getAdminPreferences() {
  try {
    const { data } = await api.get('/api/admin/preferences');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo etiquetas' };
  }
}

export async function createAdminPreference(payload) {
  try {
    const { data } = await api.post('/api/admin/preferences', payload);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creando etiqueta' };
  }
}

export async function updateAdminPreference(id, payload) {
  try {
    const { data } = await api.put(`/api/admin/preferences/${id}`, payload);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando etiqueta' };
  }
}

export async function deleteAdminPreference(id) {
  try {
    const { data } = await api.delete(`/api/admin/preferences/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando etiqueta' };
  }
}
