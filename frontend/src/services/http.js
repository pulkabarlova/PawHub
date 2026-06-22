import { API_BASE_URL } from '../config/api';

/**
 * Read the JWT from localStorage (the auth store mirrors it there). Kept here —
 * rather than importing the store — so the HTTP layer has no dependency on
 * Pinia and there is no service <-> store import cycle.
 */
function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * @typedef {Object} RequestOptions
 * @property {string} [method]
 * @property {any} [body]
 * @property {boolean} [auth]   attach the Authorization header
 * @property {Record<string,string>} [headers]
 */

/**
 * Core request helper: prefixes the API base URL, sends/receives JSON, and
 * normalizes errors to a thrown `Error` carrying the server's `error` message.
 * @param {string} path
 * @param {RequestOptions} [options]
 */
async function request(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(auth ? authHeader() : {}),
    ...headers,
  };

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    if (res.status === 401 && auth) {
      // The token is missing/expired — clear the dead session so the UI stops
      // pretending the user is logged in.
      const { useAuthStore } = await import('../stores/auth');
      useAuthStore().logout();
    }
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  remove: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
