<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <div v-if="loading" class="text-center py-20 text-slate-500 animate-pulse font-medium text-lg">
      Loading pet profile...
    </div>
    <div v-else-if="!pet" class="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-slate-500">
      <p class="text-3xl font-extrabold text-slate-900 mb-4">Pet not found</p>
      <p class="text-lg">This pet may have been removed or already adopted.</p>
      <router-link to="/adopt" class="inline-block mt-8 text-sky-600 font-bold hover:underline">
        &larr; Back to adoption
      </router-link>
    </div>
    <div v-else class="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
      <!-- Pet Image Sidebar -->
      <div class="w-full lg:w-2/5 bg-slate-50 relative min-h-[400px]">
        <img v-if="pet.pictures && pet.pictures.length" :src="resolveMediaUrl(pet.pictures[0])" :alt="pet.name" class="w-full h-full object-cover absolute inset-0">
        <div v-else class="w-full h-full flex items-center justify-center text-7xl text-slate-300 font-bold absolute inset-0 uppercase">{{ pet.name.charAt(0) }}</div>
        
        <div class="absolute top-6 left-6">
           <router-link to="/adopt" class="bg-white/90 backdrop-blur-md text-slate-800 p-3 rounded-full shadow-sm hover:shadow hover:-translate-y-0.5 transition-all inline-flex items-center justify-center font-bold text-sm">
             &larr; Back
           </router-link>
        </div>
      </div>

      <!-- Pet Info Content -->
      <div class="w-full lg:w-3/5 p-10 lg:p-16 flex flex-col">
        <div class="mb-4">
           <span v-if="pet.status === 'adoptable'" class="bg-orange-100 text-orange-800 text-sm font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4 inline-block">
            Looking for a home
           </span>
           <span v-else class="bg-slate-100 text-slate-600 text-sm font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4 inline-block">
            Already Adopted
           </span>
        </div>
        
        <h1 class="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-2">{{ pet.name }}</h1>
        <p class="text-2xl text-slate-500 font-medium mb-8">{{ pet.species }} &bull; {{ pet.breed || 'Mixed' }} &bull; {{ pet.age || '?' }} years old</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
           <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6">
             <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Health Notes</h3>
             <p class="text-lg text-slate-900 font-medium">{{ pet.healthNotes || 'No specific health notes provided.' }}</p>
           </div>
           <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6">
             <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Location</h3>
             <p class="text-lg text-slate-900 font-medium">PawHub Central Shelter</p>
           </div>
        </div>

        <div class="mt-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
          <button v-if="pet.status === 'adoptable'" class="w-full sm:w-auto bg-orange-500 text-white px-10 py-5 rounded-full font-bold hover:bg-orange-600 transition-all text-lg shadow-md hover:-translate-y-0.5 text-center">
            Apply to Adopt {{ pet.name }}
          </button>
          <button class="w-full sm:w-auto bg-slate-100 text-slate-800 px-10 py-5 rounded-full font-bold hover:bg-slate-200 transition-all text-lg text-center">
            Sponsor Pet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiUrl } from '../config/api';
import { resolveMediaUrl } from '../utils/media';

const route = useRoute();
const pet = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch(apiUrl(`/api/pets/${route.params.id}`));
    if (res.ok) {
      pet.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch pet:', err);
  } finally {
    loading.value = false;
  }
});
</script>