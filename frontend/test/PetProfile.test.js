import { vi, describe, test, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';

const { applyMock, cancelMock, listMineMock } = vi.hoisted(() => ({
  applyMock: vi.fn(),
  cancelMock: vi.fn(),
  listMineMock: vi.fn(),
}));

vi.mock('../src/services/pets.service', () => ({
  petsService: {
    get: vi.fn(() =>
      Promise.resolve({
        _id: 'p1',
        name: 'Rex',
        species: 'Dog',
        breed: 'Mix',
        age: 2,
        status: 'adoptable',
        pictures: [],
        healthNotes: 'Healthy',
      })
    ),
  },
}));

vi.mock('../src/services/applications.service', () => ({
  applicationsService: {
    apply: (...a) => applyMock(...a),
    listMine: (...a) => listMineMock(...a),
    cancel: (...a) => cancelMock(...a),
  },
}));

import PetProfile from '../src/views/PetProfile.vue';
import { useAuthStore } from '../src/stores/auth';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/pet/:id', component: PetProfile },
    { path: '/adopt', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
  ],
});

async function mountAtPet() {
  router.push('/pet/p1');
  await router.isReady();
  const wrapper = mount(PetProfile, { global: { plugins: [router] } });
  await flushPromises();
  return wrapper;
}

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
  applyMock.mockReset();
  cancelMock.mockReset();
  listMineMock.mockReset();
  listMineMock.mockResolvedValue([]);
});

describe('PetProfile adoption flow', () => {
  test('clicking Apply while logged out redirects to /login (no fake success)', async () => {
    const wrapper = await mountAtPet();
    const btn = wrapper.findAll('button').find((b) => b.text().includes('Apply to Adopt'));
    await btn.trigger('click');
    await flushPromises();
    expect(applyMock).not.toHaveBeenCalled();
    expect(router.currentRoute.value.path).toBe('/login');
  });

  test('logged-in user can apply, sees the applied state, and can cancel', async () => {
    useAuthStore().setAuth('tok', { _id: 'u1' });
    applyMock.mockResolvedValue({ _id: 'app1', petId: 'p1', applicantId: 'u1' });
    cancelMock.mockResolvedValue({ message: 'Application withdrawn' });

    const wrapper = await mountAtPet();

    const applyBtn = wrapper.findAll('button').find((b) => b.text().includes('Apply to Adopt'));
    await applyBtn.trigger('click');
    await flushPromises();

    expect(applyMock).toHaveBeenCalledWith('p1');
    expect(wrapper.text()).toContain("You've applied to adopt Rex");

    const cancelBtn = wrapper.findAll('button').find((b) => b.text().includes('Cancel application'));
    expect(cancelBtn).toBeTruthy();
    await cancelBtn.trigger('click');
    await flushPromises();

    expect(cancelMock).toHaveBeenCalledWith('app1');
    expect(wrapper.text()).not.toContain("You've applied to adopt Rex");
    expect(wrapper.findAll('button').some((b) => b.text().includes('Apply to Adopt'))).toBe(true);
  });

  test('shows already-applied state on load when an application exists', async () => {
    useAuthStore().setAuth('tok', { _id: 'u1' });
    listMineMock.mockResolvedValue([{ _id: 'app9', petId: { _id: 'p1', name: 'Rex' } }]);

    const wrapper = await mountAtPet();
    expect(wrapper.text()).toContain("You've applied to adopt Rex");
    expect(applyMock).not.toHaveBeenCalled();
  });
});
