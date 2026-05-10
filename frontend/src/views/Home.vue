<template>
  <div class="font-sans bg-slate-50">
    <!-- Clean B2C Hero Section -->
    <header class="bg-white border-b border-slate-100 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 lg:pt-32 lg:pb-32">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div class="w-full lg:w-1/2 text-center lg:text-left relative z-10">
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
              Find your <br class="hidden lg:block"/> new <span class="text-sky-500">best friend.</span>
            </h1>
            <p class="text-xl md:text-2xl text-slate-600 mb-6 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              PawHub helps you discover adoptable pets, connect with other pet lovers, and manage your own profile in one place.
            </p>
            <p class="text-base md:text-lg text-slate-500 mb-12 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Sign in to post in the community, then browse and filter pets to find your best match faster.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <router-link to="/adopt" class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center">
                Browse Pets
              </router-link>
              
              <router-link v-if="!isAuthenticated" to="/register" class="bg-white border-2 border-slate-200 text-slate-800 hover:border-slate-300 font-bold px-10 py-4 rounded-full transition-all text-lg shadow-sm hover:shadow text-center">
                Join the Community
              </router-link>
              <router-link v-else to="/community" class="bg-white border-2 border-slate-200 text-slate-800 hover:border-slate-300 font-bold px-10 py-4 rounded-full transition-all text-lg shadow-sm hover:shadow text-center">
                Go to Forums
              </router-link>
            </div>
          </div>
          
          <div class="w-full lg:w-1/2 relative flex justify-center lg:justify-end mt-12 lg:mt-0">
             <!-- Subtle decorative shape -->
            <div class="absolute inset-0 bg-sky-100 rounded-full w-[100%] h-[100%] lg:w-[120%] lg:h-[120%] lg:-translate-x-10 translate-y-10 lg:translate-x-10 lg:-translate-y-10 z-0"></div>
            
            <!-- Authentic snapshot style image (messy dog at home) -->
            <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80" alt="Happy dog looking at camera" class="rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-xl object-cover h-[400px] sm:h-[450px] lg:h-[600px] ring-4 ring-white">
          </div>
        </div>
      </div>
    </header>

    <main class="pb-24">
      <!-- Featured Pets Section -->
      <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="mb-12 flex flex-col md:flex-row items-baseline justify-between">
          <div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Looking for a home</h2>
            <p class="text-slate-500 mt-3 text-lg font-medium">These beautiful companions are waiting for you.</p>
          </div>
          <router-link to="/adopt" class="text-sky-600 font-bold hover:text-sky-700 hover:underline mt-4 md:mt-0 flex items-center gap-1">
            View all adoptable pets <ArrowRightIcon class="w-5 h-5" />
          </router-link>
        </header>

        <div v-if="loadingPets" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           <div v-for="i in 4" :key="i" class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 animate-pulse">
             <div class="bg-slate-100 h-64 rounded-2xl mb-5"></div>
             <div class="h-6 bg-slate-100 w-1/2 rounded mb-3"></div>
             <div class="h-4 bg-slate-100 w-1/3 rounded"></div>
           </div>
        </div>
        <div v-else-if="featuredPets.length === 0" class="text-slate-500 bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
          <p class="text-xl font-bold">No featured pets at the moment. Check back soon!</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <PetCard v-for="pet in featuredPets" :key="pet._id" :pet="pet" variant="featured" />
        </div>
      </section>

      <!-- Latest Posts Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div class="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-sm border border-slate-100">
          <header class="mb-12 text-center">
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">From the Community</h2>
            <p class="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto">Read the latest tips, stories, and discussions from our members.</p>
          </header>

          <div v-if="loadingPosts" class="text-center text-slate-500 animate-pulse py-12">Loading posts...</div>
          <div v-else-if="latestPosts.length === 0" class="text-slate-500 bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
            No recent posts. Be the first to start a discussion!
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article v-for="post in latestPosts" :key="post._id" class="bg-slate-50 border border-slate-100 shadow-sm rounded-3xl p-8 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col relative overflow-hidden" @click="$router.push('/community')">
              
              <!-- Subtle background image for visual flair if present -->
              <div v-if="post.imageUrl" class="absolute top-0 right-0 w-full h-32 opacity-20 group-hover:opacity-40 transition-opacity duration-500 overflow-hidden pointer-events-none rounded-t-3xl mask-image-b">
                 <img :src="resolveMediaUrl(post.imageUrl)" class="w-full h-full object-cover">
              </div>

              <div class="relative z-10 flex-1">
                <MessageCircleIcon class="w-10 h-10 text-orange-500 mb-6" />
                <h3 class="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors leading-tight">{{ post.title }}</h3>
                <p class="text-slate-600 line-clamp-3 mb-8">{{ post.content }}</p>
              </div>
              <div class="mt-auto pt-5 border-t border-slate-200 text-sm font-bold text-sky-600 uppercase tracking-wide relative z-10">
                Read discussion &rarr;
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArrowRightIcon, MessageCircleIcon } from 'lucide-vue-next';
import PetCard from '../components/PetCard.vue';
import { useAuth } from '../composables/useAuth';
import { apiUrl } from '../config/api';
import { resolveMediaUrl } from '../utils/media';

const { isAuthenticated } = useAuth();
const featuredPets = ref([]);
const latestPosts = ref([]);
const loadingPets = ref(true);
const loadingPosts = ref(true);

onMounted(async () => {
  try {
    const petRes = await fetch(apiUrl('/api/pets'));
    if (petRes.ok) {
      const data = await petRes.json();
      // Show only adoptable pets on the home page for impact
      featuredPets.value = data.filter(p => p.status === 'adoptable').slice(0, 4);
    }
  } catch (err) {
    console.error('Failed to fetch featured pets:', err);
  } finally {
    loadingPets.value = false;
  }

  try {
    const postRes = await fetch(apiUrl('/api/posts'));
    if (postRes.ok) {
      const data = await postRes.json();
      // Reverse to get newest first, then slice
      latestPosts.value = data.reverse().slice(0, 3); 
    }
  } catch (err) {
    console.error('Failed to fetch latest posts:', err);
  } finally {
    loadingPosts.value = false;
  }
});
</script>
