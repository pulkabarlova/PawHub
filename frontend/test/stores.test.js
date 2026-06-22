import { describe, test, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../src/stores/auth';
import { useNotificationsStore } from '../src/stores/notifications';

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

describe('auth store', () => {
  test('starts unauthenticated', () => {
    const auth = useAuthStore();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.token).toBe(null);
  });

  test('setAuth stores token + user and persists to localStorage', () => {
    const auth = useAuthStore();
    auth.setAuth('jwt-123', { _id: 'u1', name: 'Alice' });
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.token).toBe('jwt-123');
    expect(auth.user.name).toBe('Alice');
    expect(localStorage.getItem('token')).toBe('jwt-123');
    expect(JSON.parse(localStorage.getItem('user')).name).toBe('Alice');
  });

  test('logout clears state and localStorage', () => {
    const auth = useAuthStore();
    auth.setAuth('jwt-123', { _id: 'u1', name: 'Alice' });
    auth.logout();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.token).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
  });
});

describe('notifications store', () => {
  test('pushAdoptionAlert sets a message then auto-clears after 5s', () => {
    vi.useFakeTimers();
    const notifications = useNotificationsStore();

    notifications.pushAdoptionAlert({ name: 'Rex', species: 'Dog' });
    expect(notifications.current).toBe('New pet up for adoption: Rex the Dog!');

    vi.advanceTimersByTime(5000);
    expect(notifications.current).toBe(null);

    vi.useRealTimers();
  });

  test('clear() removes the current message', () => {
    const notifications = useNotificationsStore();
    notifications.pushAdoptionAlert({ name: 'Luna', species: 'Cat' });
    notifications.clear();
    expect(notifications.current).toBe(null);
  });
});
