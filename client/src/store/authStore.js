import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API = '/api/auth';

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
          const { data } = await axios.post(`${API}/register`, { name, email, password });
          set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return data;
        } catch (err) {
          set({ loading: false, error: err.response?.data?.message || 'Registration failed' });
          throw err;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.post(`${API}/login`, { email, password });
          set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return data;
        } catch (err) {
          set({ loading: false, error: err.response?.data?.message || 'Login failed' });
          throw err;
        }
      },

      verifyEmail: async (otp) => {
        const { token } = get();
        try {
          const { data } = await axios.post(`${API}/verify-email`, { otp }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: { ...get().user, isEmailVerified: true } });
          return data;
        } catch (err) {
          throw err;
        }
      },

      resendOTP: async () => {
        const { token } = get();
        return axios.post(`${API}/resend-otp`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        delete axios.defaults.headers.common['Authorization'];
      },

      fetchMe: async () => {
        const { token } = get();
        if (!token) return;
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await axios.get(`${API}/me`);
          set({ user: data, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      toggleWishlist: async (productId) => {
        const { token } = get();
        if (!token) return;
        try {
          const { data } = await axios.post(`${API}/wishlist/${productId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: { ...get().user, wishlist: data.wishlist } });
          return data;
        } catch (err) {
          throw err;
        }
      },
    }),
    { name: 'tommy-auth' }
  )
);
