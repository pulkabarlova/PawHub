import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';

/**
 * Authentication store — the single source of truth for the logged-in user and
 * JWT. State is hydrated from (and persisted to) localStorage so a refresh keeps
 * the session. The token is also mirrored in localStorage for the HTTP layer.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    /** Persist a token + user object. */
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },

    async login(email, password) {
      const data = await authService.login(email, password);
      const { token, ...user } = data;
      this.setAuth(token, user);
      return data;
    },

    async register(payload) {
      const data = await authService.register(payload);
      const { token, ...user } = data;
      this.setAuth(token, user);
      return data;
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});
