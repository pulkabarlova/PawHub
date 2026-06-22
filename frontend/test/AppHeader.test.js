import { describe, test, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import AppHeader from '../src/components/layout/AppHeader.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: ['/', '/adopt', '/events', '/shop', '/cart', '/community', '/login', '/profile'].map((path) => ({
    path,
    component: { template: '<div />' },
  })),
});

beforeEach(() => setActivePinia(createPinia()));

describe('AppHeader navigation', () => {
  test('renders the Events and Shop nav links', async () => {
    router.push('/');
    await router.isReady();
    const wrapper = mount(AppHeader, { global: { plugins: [router] } });
    expect(wrapper.text()).toContain('Events');
    expect(wrapper.text()).toContain('Shop');
  });

  test('hamburger button toggles the mobile nav open and closed', async () => {
    router.push('/');
    await router.isReady();
    const wrapper = mount(AppHeader, { global: { plugins: [router] } });
    // Only the desktop <nav> is present initially.
    expect(wrapper.findAll('nav')).toHaveLength(1);
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAll('nav')).toHaveLength(2);
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAll('nav')).toHaveLength(1);
  });
});
