const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const WS_URL = import.meta.env.VITE_WS_URL || API_BASE_URL;

/** Build an absolute API URL from a path. Retained for backward compatibility. */
export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export { API_BASE_URL, WS_URL };
