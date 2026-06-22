import { describe, test, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ProductCard from '../src/components/products/ProductCard.vue';
import { useCartStore } from '../src/stores/cart';

const product = {
  _id: 'p1',
  name: 'Chew Toy',
  description: 'Durable',
  price: 9.99,
  category: 'toys',
  imageUrl: '',
};

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe('ProductCard "Add to Cart" button', () => {
  test('renders the price and category', () => {
    const wrapper = mount(ProductCard, { props: { product } });
    expect(wrapper.text()).toContain('$9.99');
    expect(wrapper.text()).toContain('toys');
  });

  test('adds the product to the cart and shows "Added ✓"', async () => {
    const wrapper = mount(ProductCard, { props: { product } });
    const btn = wrapper.find('button');
    expect(btn.text()).toBe('Add to Cart');

    await btn.trigger('click');

    expect(btn.text()).toContain('Added');
    expect(useCartStore().count).toBe(1);
  });
});
