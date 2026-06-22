import { API_BASE_URL } from '../config/api';

/**
 * Resolve an image URL coming from the API to something the browser can load.
 *  - Backend-relative paths (`/pictures/...`) are prefixed with the API base.
 *  - Legacy absolute URLs on the old `:5000` port are rewritten to the API base.
 *  - External URLs (Unsplash, DiceBear, placehold.co, ...) are returned as-is.
 * @param {string} url
 * @returns {string}
 */
export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://localhost:5000')) {
    return url.replace('http://localhost:5000', API_BASE_URL);
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};
