import { vi, describe, test, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

vi.mock('../src/services/products.service', () => ({
  productsService: {
    list: vi.fn(() => Promise.resolve([])),
  },
}));

import Shop from '../src/views/Shop.vue';
import { productsService } from '../src/services/products.service';

beforeEach(() => vi.clearAllMocks());

describe('Shop category filter buttons', () => {
  test('loads all products on mount, then filters by category on click', async () => {
    const wrapper = mount(Shop);
    await flushPromises();

    // Initial load requests the unfiltered list.
    expect(productsService.list).toHaveBeenCalledWith('');

    const foodBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Food');
    expect(foodBtn).toBeTruthy();
    await foodBtn.trigger('click');
    await flushPromises();

    expect(productsService.list).toHaveBeenCalledWith('food');
  });
});
