import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setAuth: (user, token) => set({ user, token, isAuthenticated: !!user, error: null }),

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
          return data;
        } catch (err) {
          set({ loading: false, error: err.response?.data?.message || 'Registration failed' });
          throw err;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
          return data;
        } catch (err) {
          set({ loading: false, error: err.response?.data?.message || 'Login failed' });
          throw err;
        }
      },

      verifyEmail: async (otp) => {
        try {
          const { data } = await api.post('/auth/verify-email', { otp });
          set({ user: { ...get().user, isEmailVerified: true } });
          return data;
        } catch (err) {
          throw err;
        }
      },

      resendOTP: async () => {
        return api.post('/auth/resend-otp', {});
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      fetchMe: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      toggleWishlist: async (productId) => {
        const { token } = get();
        if (!token) return;
        try {
          const { data } = await api.post(`/auth/wishlist/${productId}`, {});
          set({ user: { ...get().user, wishlist: data.wishlist } });
          return data;
        } catch (err) {
          throw err;
        }
      },
    }),
    { name: 'elvane-auth' }
  )
);
