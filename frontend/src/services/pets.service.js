import { http } from './http';

const BASE = '/api/pets';

/** Pet CRUD endpoints. Creating an adoptable pet triggers the adoption alert. */
export const petsService = {
  list: () => http.get(BASE),
  /** @param {string} id */
  get: (id) => http.get(`${BASE}/${id}`),
  /** @param {object} pet */
  create: (pet) => http.post(BASE, pet, { auth: true }),
  /** @param {string} id @param {object} patch */
  update: (id, patch) => http.put(`${BASE}/${id}`, patch, { auth: true }),
  /** @param {string} id */
  remove: (id) => http.remove(`${BASE}/${id}`, { auth: true }),
};
