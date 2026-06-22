import { useAuthStore } from '../stores/auth';

/**
 * Global navigation guard: redirects to the login page when a route marked with
 * `meta.requiresAuth` is visited without an authenticated session.
 * @type {import('vue-router').NavigationGuard}
 */
export function authGuard(to, from, next) {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}
