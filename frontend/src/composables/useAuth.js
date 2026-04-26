import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user')) || null);

export function useAuth() {

  const setAuth = (newToken, newUser) => {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getHeaders = () => {
    if (token.value) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      };
    }
    return { 'Content-Type': 'application/json' };
  };

  return {
    token,
    user,
    isAuthenticated: computed(() => !!token.value),
    setAuth,
    logout,
    getHeaders
  };
}