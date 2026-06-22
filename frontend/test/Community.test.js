import { vi, describe, test, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../src/services/posts.service', () => ({
  postsService: {
    list: vi.fn(() => Promise.resolve([])),
    create: vi.fn((post) =>
      Promise.resolve({ ...post, _id: 'new1', authorId: 'u1', createdAt: '2026-01-01T00:00:00Z' })
    ),
  },
}));

import Community from '../src/views/Community.vue';
import { postsService } from '../src/services/posts.service';
import { useAuthStore } from '../src/stores/auth';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: Community },
    { path: '/login', component: { template: '<div />' } },
  ],
});

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
  vi.clearAllMocks();
});

describe('Community create-post flow', () => {
  test('logged-in user can open the form, submit, and see the new post', async () => {
    useAuthStore().setAuth('tok', { _id: 'u1', name: 'Tester' });
    router.push('/');
    await router.isReady();
    const wrapper = mount(Community, { global: { plugins: [router] } });
    await flushPromises();

    // The "Create New Post" toggle is visible for authenticated users.
    const toggle = wrapper.findAll('button').find((b) => b.text().includes('Create New Post'));
    expect(toggle).toBeTruthy();
    await toggle.trigger('click');

    // Fill the form and submit.
    await wrapper.find('input[type="text"]').setValue('My Title');
    await wrapper.find('textarea').setValue('My content');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(postsService.create).toHaveBeenCalledWith({ title: 'My Title', content: 'My content' });
    expect(wrapper.text()).toContain('My Title');
  });

  test('anonymous visitor sees a login prompt instead of the post button', async () => {
    router.push('/');
    await router.isReady();
    const wrapper = mount(Community, { global: { plugins: [router] } });
    await flushPromises();
    expect(wrapper.text()).toContain('to start a discussion');
    expect(wrapper.findAll('button').some((b) => b.text().includes('Create New Post'))).toBe(false);
  });
});
