<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-[1000px] mx-auto">
    <header class="mb-10">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Your Cart</h1>
    </header>

    <p v-if="message" class="mb-8 text-sky-800 font-bold bg-sky-50 border border-sky-100 px-6 py-4 rounded-2xl">
      {{ message }}
    </p>

    <div
      v-if="cart.items.length === 0"
      class="bg-slate-50 p-16 text-center rounded-[3rem] border border-slate-100 text-slate-500"
    >
      <p class="text-2xl font-bold text-slate-700">Your cart is empty.</p>
      <router-link to="/shop" class="inline-block mt-6 text-sky-600 font-bold hover:underline">
        Browse the shop &rarr;
      </router-link>
    </div>

    <div v-else>
      <ul class="space-y-4 mb-10">
        <li
          v-for="item in cart.items"
          :key="item._id"
          class="bg-white border border-slate-100 shadow-sm rounded-3xl p-5 flex items-center gap-4"
        >
          <div class="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
            <img
              v-if="item.imageUrl"
              :src="resolveMediaUrl(item.imageUrl)"
              :alt="item.name"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-slate-900 truncate">{{ item.name }}</h3>
            <p class="text-slate-500 font-medium">${{ item.price.toFixed(2) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="cart.setQty(item._id, item.qty - 1)"
              class="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span class="w-6 text-center font-bold">{{ item.qty }}</span>
            <button
              @click="cart.setQty(item._id, item.qty + 1)"
              class="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            @click="cart.remove(item._id)"
            class="bg-white border-2 border-red-100 text-red-600 px-5 py-2.5 rounded-full font-bold hover:bg-red-50 transition-all shrink-0"
          >
            Remove
          </button>
        </li>
      </ul>

      <div
        class="bg-white border border-slate-100 shadow-sm rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-center gap-6"
      >
        <div class="text-2xl font-extrabold text-slate-900">Total: ${{ cart.total.toFixed(2) }}</div>
        <div class="flex gap-4 w-full sm:w-auto">
          <button
            @click="cart.clear()"
            class="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-6 py-4 rounded-full font-bold hover:bg-slate-200 transition-all"
          >
            Clear cart
          </button>
          <button
            @click="checkout"
            class="flex-1 sm:flex-none bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all shadow-md"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { resolveMediaUrl } from '../utils/media';

const cart = useCartStore();
const message = ref('');

const checkout = () => {
  // Honest demo: there is no payment backend, so we just confirm and empty the cart.
  message.value = `Thank you! This is a demo store — no payment was taken. (${cart.count} item${cart.count === 1 ? '' : 's'}, $${cart.total.toFixed(2)})`;
  cart.clear();
};
</script>
