<template>
  <article
    class="bg-white shadow-sm border border-slate-100 hover:shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
  >
    <div class="relative h-56 bg-slate-50 overflow-hidden">
      <img
        v-if="product.imageUrl"
        :src="resolveMediaUrl(product.imageUrl)"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
      <span
        class="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm"
        >{{ product.category }}</span
      >
    </div>
    <div class="p-8 flex flex-col flex-1">
      <h3 class="text-xl font-bold text-slate-900 mb-2">{{ product.name }}</h3>
      <p class="text-slate-600 mb-6 flex-1 line-clamp-2">{{ product.description }}</p>
      <div class="flex items-center justify-between pt-4 border-t border-slate-100">
        <span class="text-2xl font-extrabold text-slate-900">${{ product.price.toFixed(2) }}</span>
        <button
          @click="addToCart"
          class="bg-sky-50 text-sky-600 font-bold px-6 py-3 rounded-full hover:bg-orange-500 hover:text-white transition-colors"
        >
          {{ added ? 'Added ✓' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../../stores/cart';
import { resolveMediaUrl } from '../../utils/media';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const cart = useCartStore();
const added = ref(false);
const addToCart = () => {
  cart.add(props.product);
  added.value = true;
  setTimeout(() => {
    added.value = false;
  }, 1500);
};
</script>
