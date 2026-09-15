import axios from 'axios';

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Normalizes VITE_API_URL so it works whether it's set to the bare backend
 * origin (e.g. https://your-backend.onrender.com) or already includes the
 * /api prefix (e.g. https://your-backend.onrender.com/api) - strips any
 * trailing slash(es) first, then appends /api only if it isn't already
 * there. Every service file calls api.get('/jobs') etc. (relative paths,
 * never '/api/...'), so this one normalization is the single source of
 * truth for the prefix - it can never be doubled and never missing.
 */
export const normalizeApiUrl = (url) => {
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiUrl(RAW_API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lj_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lj_token');
      localStorage.removeItem('lj_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0] ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

export default api;
