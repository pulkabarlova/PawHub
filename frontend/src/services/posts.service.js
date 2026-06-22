import { http } from './http';

const BASE = '/api/posts';

/** Community post CRUD endpoints. */
export const postsService = {
  list: () => http.get(BASE),
  /** @param {string} id */
  get: (id) => http.get(`${BASE}/${id}`),
  /** @param {object} post */
  create: (post) => http.post(BASE, post, { auth: true }),
  /** @param {string} id @param {object} patch */
  update: (id, patch) => http.put(`${BASE}/${id}`, patch, { auth: true }),
  /** @param {string} id */
  remove: (id) => http.remove(`${BASE}/${id}`, { auth: true }),
};
