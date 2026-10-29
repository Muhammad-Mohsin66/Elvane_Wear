import axios from 'axios';

// In production on Vercel, VITE_API_URL points to the Render backend (e.g. https://elvane-wear-backend.onrender.com)
// In local dev, defaults to '/api' which Vite proxies to http://127.0.0.1:5001
const rawBase = import.meta.env.VITE_API_URL;
const baseURL = rawBase ? `${rawBase.replace(/\/$/, '')}/api` : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('elvane-auth') || localStorage.getItem('tommy-auth');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('elvane-auth');
      localStorage.removeItem('tommy-auth');
    }
    return Promise.reject(error);
  }
);

export default api;

export const formatPKR = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};
