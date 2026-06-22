import { http } from './http';

const BASE = '/api/events';

/**
 * Event endpoints. The UI only browses events (read-only), so just `list`/`get`
 * are exposed here even though the backend supports full CRUD.
 */
export const eventsService = {
  list: () => http.get(BASE),
  /** @param {string} id */
  get: (id) => http.get(`${BASE}/${id}`),
};
