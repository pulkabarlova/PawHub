<template>
  <article
    :class="cardClass"
    @click="router.push(`/pet/${pet._id}`)"
  >
    <div :class="mediaClass">
      <img
        v-if="pet.pictures && pet.pictures.length"
        :src="resolveMediaUrl(pet.pictures[0])"
        :alt="pet.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      >
      <div
        v-else
        :class="fallbackClass"
      >
        {{ pet.name.charAt(0) }}
      </div>

      <div
        v-if="showStatus"
        class="absolute top-4 right-4 bg-white text-slate-900 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm"
      >
        {{ pet.status }}
      </div>
    </div>

    <div :class="bodyClass">
      <template v-if="variant === 'featured'">
        <h3 class="text-2xl font-bold text-slate-900 mb-2">{{ pet.name }}</h3>
        <p class="text-slate-500 font-medium mb-5 flex items-center gap-2">
          <PawPrintIcon class="w-4 h-4 text-slate-400" /> {{ pet.species }} &bull; {{ pet.breed || 'Mixed' }}
        </p>
        <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span class="text-sky-600 font-bold group-hover:text-orange-500 transition-colors text-lg">Meet {{ pet.name }} &rarr;</span>
        </div>
      </template>

      <template v-else>
        <h3 class="text-2xl font-bold text-slate-900 mb-1">{{ pet.name }}</h3>
        <p class="text-slate-500 font-medium mb-5">{{ pet.species }} &bull; {{ pet.breed || 'Mixed' }} &bull; {{ pet.age || '?' }} yrs</p>
        <button class="w-full bg-sky-50 text-sky-600 font-bold py-3 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors text-lg">
          Meet {{ pet.name }}
        </button>
      </template>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { PawPrintIcon } from 'lucide-vue-next';
import { resolveMediaUrl } from '../utils/media';

const props = defineProps({
  pet: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'default',
  },
});

const router = useRouter();

const isFeatured = computed(() => props.variant === 'featured');
const showStatus = computed(() => isFeatured.value);

const cardClass = computed(() =>
  isFeatured.value
    ? 'bg-white shadow-sm border border-slate-100 hover:shadow-xl rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer'
    : 'bg-white shadow-sm border border-slate-100 hover:shadow-xl rounded-[2.5rem] p-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer'
);

const mediaClass = computed(() =>
  isFeatured.value
    ? 'relative overflow-hidden rounded-2xl h-64 mb-5 bg-slate-50'
    : 'relative overflow-hidden rounded-[2rem] h-64 mb-5 bg-slate-50'
);

const fallbackClass = computed(() =>
  isFeatured.value
    ? 'w-full h-full flex items-center justify-center text-5xl text-slate-300 font-bold'
    : 'w-full h-full flex items-center justify-center text-5xl text-slate-300 font-bold uppercase'
);

const bodyClass = computed(() =>
  isFeatured.value ? 'px-2' : 'px-3 pb-2 text-center'
);
</script>
