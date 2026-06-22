import { defineStore } from 'pinia';

/**
 * Shopping cart store — a real, persistent client-side cart. Items survive
 * reloads via localStorage. (This demo store has no checkout/payment backend.)
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    /** @type {Array<{_id:string,name:string,price:number,imageUrl:string,qty:number}>} */
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
  }),

  getters: {
    count: (state) => state.items.reduce((n, i) => n + i.qty, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
  },

  actions: {
    add(product) {
      const existing = this.items.find((i) => i._id === product._id);
      if (existing) {
        existing.qty += 1;
      } else {
        this.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty: 1,
        });
      }
      this._persist();
    },

    setQty(id, qty) {
      const item = this.items.find((i) => i._id === id);
      if (!item) return;
      if (qty <= 0) {
        this.remove(id);
        return;
      }
      item.qty = qty;
      this._persist();
    },

    remove(id) {
      this.items = this.items.filter((i) => i._id !== id);
      this._persist();
    },

    clear() {
      this.items = [];
      this._persist();
    },

    _persist() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
  },
});
