import { describe, test, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../src/stores/cart';

const food = { _id: 'a', name: 'Food', price: 10, imageUrl: '' };
const toy = { _id: 'b', name: 'Toy', price: 5, imageUrl: '' };

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe('cart store', () => {
  test('adds items and computes count + total (same product increments qty)', () => {
    const cart = useCartStore();
    cart.add(food);
    cart.add(food);
    cart.add(toy);
    expect(cart.count).toBe(3);
    expect(cart.total).toBe(25);
    expect(cart.items.length).toBe(2);
  });

  test('setQty updates quantity and removes at zero', () => {
    const cart = useCartStore();
    cart.add(food);
    cart.setQty('a', 4);
    expect(cart.count).toBe(4);
    cart.setQty('a', 0);
    expect(cart.items.length).toBe(0);
  });

  test('remove and clear work', () => {
    const cart = useCartStore();
    cart.add(food);
    cart.add(toy);
    cart.remove('a');
    expect(cart.items.length).toBe(1);
    cart.clear();
    expect(cart.count).toBe(0);
  });

  test('persists to localStorage', () => {
    useCartStore().add(food);
    expect(JSON.parse(localStorage.getItem('cart'))).toHaveLength(1);
  });
});
