import { describe, test, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ToastNotification from '../src/components/ui/ToastNotification.vue';
import { useNotificationsStore } from '../src/stores/notifications';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('ToastNotification.vue', () => {
  test('renders nothing when there is no notification', () => {
    const wrapper = mount(ToastNotification);
    expect(wrapper.text()).toBe('');
  });

  test('renders the adoption alert message from the store', async () => {
    const wrapper = mount(ToastNotification);
    const notifications = useNotificationsStore();

    notifications.pushAdoptionAlert({ name: 'Rex', species: 'Dog' });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('New pet up for adoption: Rex the Dog!');
  });
});
