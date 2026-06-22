<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <header class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Upcoming Events</h1>
      <p class="mt-4 text-xl text-slate-500 font-medium max-w-2xl mx-auto">
        Adoption days, vaccination clinics, and fundraisers hosted by our shelters and vets.
      </p>
    </header>

    <section v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <SkeletonCard v-for="i in 6" :key="i" />
    </section>
    <section
      v-else-if="events.length === 0"
      class="bg-slate-50 p-16 text-center rounded-[3rem] border border-slate-100 text-slate-500"
    >
      <p class="text-2xl font-bold text-slate-700">No upcoming events.</p>
      <p class="text-lg mt-2 font-medium">Check back soon for adoption days and clinics!</p>
    </section>
    <section v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <EventCard v-for="event in events" :key="event._id" :event="event" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EventCard from '../components/events/EventCard.vue';
import SkeletonCard from '../components/ui/SkeletonCard.vue';
import { eventsService } from '../services/events.service';

const events = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const all = await eventsService.list();
    const now = new Date();
    // The page is titled "Upcoming Events" — only show events still ahead.
    events.value = all.filter((e) => new Date(e.date) >= now);
  } catch (err) {
    console.error('Failed to fetch events:', err);
  } finally {
    loading.value = false;
  }
});
</script>
