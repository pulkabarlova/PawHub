import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

/**
 * Backward-compatible composable that delegates to the Pinia auth store. Lets
 * components keep using `useAuth()` while the store remains the source of truth.
 * Prefer `useAuthStore()` directly in new code.
 */
export function useAuth() {
  const store = useAuthStore();
  const { token, user, isAuthenticated } = storeToRefs(store);

  return {
    token,
    user,
    isAuthenticated,
    setAuth: (newToken, newUser) => store.setAuth(newToken, newUser),
    logout: () => {
      store.logout();
      window.location.href = '/login';
    },
    getHeaders: () =>
      token.value
        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` }
        : { 'Content-Type': 'application/json' },
  };
}
