<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <header class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Adopt a Pet</h1>
      <p class="mt-4 text-xl text-slate-500 font-medium max-w-2xl mx-auto">Give a loving home to a pet in need. Browse our available companions below.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Filters Sidebar -->
      <aside class="lg:col-span-1">
        <div class="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 sticky top-28">
          <h2 class="text-2xl font-extrabold text-slate-900 mb-6">Filters</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-3">Species</label>
              <select v-model="filterSpecies" class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-slate-50 font-medium">
                <option value="">All Species</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
                <option value="Bird">Birds</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <button @click="filterSpecies = ''" class="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors mt-4">
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      <!-- Pet Grid -->
      <section class="lg:col-span-3">
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           <!-- Skeleton Loader -->
           <div v-for="i in 6" :key="i" class="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100 animate-pulse">
             <div class="bg-slate-100 h-64 rounded-[2rem] mb-5"></div>
             <div class="h-6 bg-slate-100 w-1/2 rounded mb-3"></div>
             <div class="h-4 bg-slate-100 w-1/3 rounded"></div>
           </div>
        </div>
        <div v-else-if="filteredPets.length === 0" class="bg-slate-50 p-16 text-center rounded-[3rem] border border-slate-100 text-slate-500">
          <p class="text-2xl font-bold text-slate-700">No pets found.</p>
          <p class="text-lg mt-2 font-medium">Try adjusting your filters to see more results.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="pet in filteredPets" :key="pet._id" class="bg-white shadow-sm border border-slate-100 hover:shadow-xl rounded-[2.5rem] p-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer" @click="$router.push(`/pet/${pet._id}`)">
            <div class="relative overflow-hidden rounded-[2rem] h-64 mb-5 bg-slate-50">
              <img v-if="pet.pictures && pet.pictures.length" :src="resolveMediaUrl(pet.pictures[0])" :alt="pet.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
              <div v-else class="w-full h-full flex items-center justify-center text-5xl text-slate-300 font-bold uppercase">{{ pet.name.charAt(0) }}</div>
            </div>
            <div class="px-3 pb-2 text-center">
              <h3 class="text-2xl font-bold text-slate-900 mb-1">{{ pet.name }}</h3>
              <p class="text-slate-500 font-medium mb-5">{{ pet.species }} &bull; {{ pet.breed || 'Mixed' }} &bull; {{ pet.age || '?' }} yrs</p>
              <button class="w-full bg-sky-50 text-sky-600 font-bold py-3 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors text-lg">
                Meet {{ pet.name }}
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { apiUrl } from '../config/api';
import { resolveMediaUrl } from '../utils/media';

const pets = ref([]);
const loading = ref(true);
const filterSpecies = ref('');

const filteredPets = computed(() => {
  let result = pets.value.filter(p => p.status === 'adoptable'); // Only show adoptable pets here
  if (!filterSpecies.value) return result;
  return result.filter(p => p.species?.toLowerCase() === filterSpecies.value.toLowerCase());
});

onMounted(async () => {
  try {
    const res = await fetch(apiUrl('/api/pets'));
    if (res.ok) {
      pets.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch pets:', err);
  } finally {
    loading.value = false;
  }
});
</script>