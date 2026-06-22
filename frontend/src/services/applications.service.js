import { http } from './http';

const BASE = '/api/applications';

/** Adoption-application endpoints (all require authentication). */
export const applicationsService = {
  /** Apply to adopt a pet. Idempotent server-side. @param {string} petId */
  apply: (petId) => http.post(BASE, { petId }, { auth: true }),
  /** The current user's applications (pet populated). */
  listMine: () => http.get(`${BASE}/me`, { auth: true }),
  /** Withdraw an application. @param {string} id */
  cancel: (id) => http.remove(`${BASE}/${id}`, { auth: true }),
};
