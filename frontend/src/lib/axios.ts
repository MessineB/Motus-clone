// src/lib/axios.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        if (
          config.headers &&
          typeof config.headers.set === 'function'
        ) {
          // ✅ Méthode propre pour Axios >= 1.3
          config.headers.set('Authorization', `Bearer ${token}`);
        } else if (config.headers && typeof config.headers === 'object') {
          // ✅ Fallback pour d'anciennes versions
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
