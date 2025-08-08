// src/lib/axios.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production'
    ? 'https://api.web-o-lab.fr'
    : 'http://localhost:3000');

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  timeout: 15000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('token');
      const token =
        raw && raw !== 'undefined' && raw !== 'null' ? raw : null;

      if (token) {
        if (config.headers && typeof (config.headers as any).set === 'function') {
          // Axios >= 1.3
          (config.headers as any).set('Authorization', `Bearer ${token}`);
        } else {
          // Fallback
          config.headers = {
            ...(config.headers as Record<string, string>),
            Authorization: `Bearer ${token}`,
          };
        }
      } else {
        // Nettoyage si jamais un header invalide traîne
        if (config.headers && typeof (config.headers as any).delete === 'function') {
          (config.headers as any).delete('Authorization');
        } else if (config.headers) {
          delete (config.headers as any)['Authorization'];
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionnel: si 401 et token pourri dans le LS, on le purge
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined' && err?.response?.status === 401) {
      const t = localStorage.getItem('token');
      if (t && (t === 'undefined' || t === 'null')) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
