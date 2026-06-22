import { http } from './http';

const BASE = '/api/users';

/** Authentication endpoints. */
export const authService = {
  /** @param {string} email @param {string} password */
  login: (email, password) => http.post(`${BASE}/login`, { email, password }),
  /** @param {{ name: string, email: string, password: string, role?: string }} payload */
  register: (payload) => http.post(`${BASE}/register`, payload),
  /** Current authenticated user. */
  me: () => http.get(`${BASE}/me`, { auth: true }),
};
