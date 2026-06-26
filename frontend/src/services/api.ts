import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { isDemoToken } from '../utils/demoUser';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('luminary_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors — skip redirect for demo token
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('luminary_token');
      if (isDemoToken(token)) {
        // Demo mode: backend rejects demo token — swallow silently
        return Promise.reject(error);
      }
      localStorage.removeItem('luminary_token');
      localStorage.removeItem('luminary_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
