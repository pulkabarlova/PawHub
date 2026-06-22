import { http } from './http';

const BASE = '/api/products';

/**
 * Product (shop) endpoints. Browse-only in the UI; the backend supports full
 * CRUD. `list` accepts an optional category filter.
 */
export const productsService = {
  /** @param {string} [category] */
  list: (category) => http.get(category ? `${BASE}?category=${encodeURIComponent(category)}` : BASE),
  /** @param {string} id */
  get: (id) => http.get(`${BASE}/${id}`),
};
