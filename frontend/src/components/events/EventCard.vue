<template>
  <article
    class="bg-white shadow-sm border border-slate-100 hover:shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
  >
    <div class="relative h-48 bg-slate-50 overflow-hidden">
      <img
        v-if="event.imageUrl"
        :src="resolveMediaUrl(event.imageUrl)"
        :alt="event.title"
        class="w-full h-full object-cover"
      />
      <span
        class="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm"
        >{{ typeLabel }}</span
      >
    </div>
    <div class="p-8 flex flex-col flex-1">
      <p class="text-sky-600 font-bold text-sm mb-2">{{ formattedDate }}</p>
      <h3 class="text-2xl font-bold text-slate-900 mb-3">{{ event.title }}</h3>
      <p class="text-slate-600 mb-6 flex-1 line-clamp-3">{{ event.description }}</p>
      <div class="flex items-center gap-2 text-slate-500 font-medium pt-4 border-t border-slate-100">
        <MapPinIcon class="w-4 h-4 text-slate-400" /> {{ event.location || 'Location TBA' }}
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { MapPinIcon } from 'lucide-vue-next';
import { resolveMediaUrl } from '../../utils/media';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const TYPE_LABELS = {
  adoption_day: 'Adoption Day',
  vaccination_clinic: 'Vaccination Clinic',
  fundraiser: 'Fundraiser',
};

const typeLabel = computed(() => TYPE_LABELS[props.event.type] || 'Event');

const formattedDate = computed(() =>
  new Date(props.event.date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
);
</script>
