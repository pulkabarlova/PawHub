<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <header class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Upcoming Events</h1>
      <p class="mt-4 text-xl text-slate-500 font-medium max-w-2xl mx-auto">Meetups, adoption drives, training workshops, and more.</p>
    </header>

    <main>
      <div v-if="loading" class="text-center py-16 text-slate-500 animate-pulse text-lg font-medium">
        Loading schedule...
      </div>
      <div v-else-if="events.length === 0" class="text-center py-20 bg-white rounded-[3rem] border border-slate-100 text-slate-500 shadow-sm">
        <p class="text-2xl font-bold text-slate-700">No upcoming events right now.</p>
        <p class="text-lg mt-2 font-medium">Subscribe to our newsletter to stay updated!</p>
      </div>
      <div v-else class="space-y-8">
        <article v-for="event in events" :key="event._id" class="flex flex-col md:flex-row bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-[2.5rem] overflow-hidden border border-slate-100 group">
          
          <!-- Event Image if available -->
          <div v-if="event.imageUrl" class="w-full md:w-1/3 bg-slate-100 relative h-48 md:h-auto overflow-hidden">
            <img :src="event.imageUrl" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          </div>

          <!-- Calendar Date Block -->
          <div class="bg-sky-500 text-white p-8 md:w-48 flex flex-row md:flex-col justify-center items-center text-center gap-3 md:gap-1 shrink-0">
            <span class="text-sm md:text-base uppercase tracking-widest font-black opacity-90">{{ getMonth(event.date) }}</span>
            <span class="text-4xl md:text-6xl font-extrabold">{{ getDay(event.date) }}</span>
          </div>
          
          <!-- Event Info -->
          <div class="p-8 md:p-10 flex-1 flex flex-col justify-center">
            <h3 class="text-3xl font-bold text-slate-900 mb-3">{{ event.title }}</h3>
            
            <div class="text-slate-500 mb-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-base font-bold">
              <span class="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                📍 {{ event.location || 'Location TBA' }}
              </span>
              <span class="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100" v-if="event.date">
                🕒 {{ getTime(event.date) }}
              </span>
            </div>
            
            <p class="text-slate-600 text-lg leading-relaxed">{{ event.description }}</p>
            
            <div class="mt-8 flex justify-end">
              <button class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-sm hover:shadow hover:-translate-y-0.5 text-lg">
                RSVP Now
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const events = ref([]);
const loading = ref(true);

const getMonth = (dateStr) => {
  if (!dateStr) return 'TBA';
  return new Date(dateStr).toLocaleString('default', { month: 'short' });
};

const getDay = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).getDate();
};

const getTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/events');
    if (res.ok) {
      events.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch events:', err);
  } finally {
    loading.value = false;
  }
});
</script>