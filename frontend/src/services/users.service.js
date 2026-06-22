import { http } from './http';

const BASE = '/api/users';

/** User profile endpoints. */
export const usersService = {
  list: () => http.get(BASE),
  /** @param {string} id */
  get: (id) => http.get(`${BASE}/${id}`),
  /** @param {string} id @param {object} patch */
  update: (id, patch) => http.put(`${BASE}/${id}`, patch, { auth: true }),
};
