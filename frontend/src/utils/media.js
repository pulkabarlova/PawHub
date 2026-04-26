import { API_BASE_URL } from '../config/api';

export const resolveMediaUrl = (url) => {
  if (!url) return '';

  // Keep external images as-is (e.g. Unsplash, DiceBear).
  if (/^https?:\/\/(?!localhost:5000)/i.test(url)) {
    return url;
  }

  // Backward compatibility for already-seeded local URLs on old port.
  return url.replace('http://localhost:5000', API_BASE_URL);
};
