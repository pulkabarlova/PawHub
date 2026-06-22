<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Pet Shop</h1>
      <p class="mt-4 text-xl text-slate-500 font-medium max-w-2xl mx-auto">
        Everything your companion needs — food, toys, accessories and health essentials.
      </p>
    </header>

    <!-- Category filter -->
    <nav class="flex flex-wrap justify-center gap-3 mb-12">
      <button
        v-for="cat in categories"
        :key="cat.value"
        @click="selectCategory(cat.value)"
        :class="[
          'px-6 py-3 rounded-full font-bold transition-all',
          activeCategory === cat.value
            ? 'bg-sky-500 text-white shadow-md'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
        ]"
      >
        {{ cat.label }}
      </button>
    </nav>

    <section v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <SkeletonCard v-for="i in 8" :key="i" />
    </section>
    <section
      v-else-if="products.length === 0"
      class="bg-slate-50 p-16 text-center rounded-[3rem] border border-slate-100 text-slate-500"
    >
      <p class="text-2xl font-bold text-slate-700">No products found.</p>
      <p class="text-lg mt-2 font-medium">Try a different category.</p>
    </section>
    <section v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <ProductCard v-for="product in products" :key="product._id" :product="product" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '../components/products/ProductCard.vue';
import SkeletonCard from '../components/ui/SkeletonCard.vue';
import { productsService } from '../services/products.service';

const products = ref([]);
const loading = ref(true);
const activeCategory = ref('');

const categories = [
  { value: '', label: 'All' },
  { value: 'food', label: 'Food' },
  { value: 'toys', label: 'Toys' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'health', label: 'Health' },
];

const loadProducts = async () => {
  loading.value = true;
  try {
    products.value = await productsService.list(activeCategory.value);
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
};

const selectCategory = (value) => {
  activeCategory.value = value;
  loadProducts();
};

onMounted(loadProducts);
</script>
