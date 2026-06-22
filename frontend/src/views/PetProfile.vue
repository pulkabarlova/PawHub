<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <div v-if="loading" class="text-center py-20 text-slate-500 animate-pulse font-medium text-lg">
      Loading pet profile...
    </div>
    <div
      v-else-if="!pet"
      class="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-slate-500"
    >
      <p class="text-3xl font-extrabold text-slate-900 mb-4">Pet not found</p>
      <p class="text-lg">This pet may have been removed or already adopted.</p>
      <router-link to="/adopt" class="inline-block mt-8 text-sky-600 font-bold hover:underline">
        &larr; Back to adoption
      </router-link>
    </div>
    <div
      v-else
      class="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row"
    >
      <!-- Pet Image Sidebar -->
      <div class="w-full lg:w-2/5 bg-slate-50 relative min-h-[400px]">
        <img
          v-if="pet.pictures && pet.pictures.length"
          :src="resolveMediaUrl(pet.pictures[0])"
          :alt="pet.name"
          class="w-full h-full object-cover absolute inset-0"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-7xl text-slate-300 font-bold absolute inset-0 uppercase"
        >
          {{ pet.name.charAt(0) }}
        </div>

        <div class="absolute top-6 left-6">
          <router-link
            to="/adopt"
            class="bg-white/90 backdrop-blur-md text-slate-800 p-3 rounded-full shadow-sm hover:shadow hover:-translate-y-0.5 transition-all inline-flex items-center justify-center font-bold text-sm"
          >
            &larr; Back
          </router-link>
        </div>
      </div>

      <!-- Pet Info Content -->
      <div class="w-full lg:w-3/5 p-10 lg:p-16 flex flex-col">
        <div class="mb-4">
          <span
            v-if="pet.status === 'adoptable'"
            class="bg-orange-100 text-orange-800 text-sm font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4 inline-block"
          >
            Looking for a home
          </span>
          <span
            v-else
            class="bg-slate-100 text-slate-600 text-sm font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-4 inline-block"
          >
            Already Adopted
          </span>
        </div>

        <h1 class="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-2">{{ pet.name }}</h1>
        <p class="text-2xl text-slate-500 font-medium mb-8">
          {{ pet.species }} &bull; {{ pet.breed || 'Mixed' }} &bull; {{ pet.age || '?' }} years old
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Health Notes</h3>
            <p class="text-lg text-slate-900 font-medium">
              {{ pet.healthNotes || 'No specific health notes provided.' }}
            </p>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Location</h3>
            <p class="text-lg text-slate-900 font-medium">PawHub Central Shelter</p>
          </div>
        </div>

        <div class="mt-auto pt-8 border-t border-slate-100">
          <!-- Adoption: only while the pet is actually adoptable -->
          <div v-if="pet.status === 'adoptable'" class="mb-4">
            <!-- Already applied -> show status + cancel -->
            <div v-if="myApplication" class="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div
                class="w-full sm:flex-1 text-sky-800 font-bold bg-sky-50 border border-sky-100 px-6 py-4 rounded-2xl"
              >
                ✓ You've applied to adopt {{ pet.name }}. The shelter will be in touch.
              </div>
              <button
                @click="cancelAdoption"
                :disabled="working"
                class="w-full sm:w-auto bg-white border-2 border-red-100 text-red-600 px-8 py-4 rounded-full font-bold hover:bg-red-50 transition-all disabled:opacity-50 shrink-0"
              >
                {{ working ? 'Cancelling…' : 'Cancel application' }}
              </button>
            </div>
            <!-- Not applied yet -> apply -->
            <button
              v-else
              @click="requestAdoption"
              :disabled="working"
              class="w-full sm:w-auto bg-orange-500 text-white px-10 py-5 rounded-full font-bold hover:bg-orange-600 transition-all text-lg shadow-md hover:-translate-y-0.5 text-center disabled:opacity-50"
            >
              {{ working ? 'Submitting…' : `Apply to Adopt ${pet.name}` }}
            </button>
          </div>

          <button
            @click="sponsorPet"
            class="w-full sm:w-auto bg-slate-100 text-slate-800 px-10 py-5 rounded-full font-bold hover:bg-slate-200 transition-all text-lg text-center"
          >
            Sponsor Pet
          </button>

          <p v-if="errorMsg" class="mt-6 text-red-700 font-bold bg-red-50 border border-red-100 px-6 py-4 rounded-2xl">
            {{ errorMsg }}
          </p>
          <p
            v-if="sponsorMessage"
            class="mt-6 text-sky-800 font-bold bg-sky-50 border border-sky-100 px-6 py-4 rounded-2xl"
          >
            {{ sponsorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { petsService } from '../services/pets.service';
import { applicationsService } from '../services/applications.service';
import { resolveMediaUrl } from '../utils/media';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const pet = ref(null);
const loading = ref(true);
const myApplication = ref(null);
const working = ref(false);
const errorMsg = ref('');
const sponsorMessage = ref('');

// Find whether the logged-in user has already applied for this pet.
const loadMyApplication = async () => {
  if (!authStore.isAuthenticated) return;
  try {
    const apps = await applicationsService.listMine();
    myApplication.value = apps.find((a) => (a.petId?._id || a.petId) === route.params.id) || null;
  } catch (err) {
    console.error('Failed to load applications:', err);
  }
};

const requestAdoption = async () => {
  errorMsg.value = '';
  // Must be logged in to apply — send to login and come back here.
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  working.value = true;
  try {
    myApplication.value = await applicationsService.apply(pet.value._id);
  } catch (err) {
    errorMsg.value = err.message || 'Could not submit your application.';
  } finally {
    working.value = false;
  }
};

const cancelAdoption = async () => {
  errorMsg.value = '';
  working.value = true;
  try {
    await applicationsService.cancel(myApplication.value._id);
    myApplication.value = null;
  } catch (err) {
    errorMsg.value = err.message || 'Could not cancel your application.';
  } finally {
    working.value = false;
  }
};

const sponsorPet = () => {
  // Real action: open the user's email client addressed to the shelter.
  const subject = encodeURIComponent(`Sponsoring ${pet.value.name}`);
  const body = encodeURIComponent(
    `Hi PawHub team,\n\nI'd like to sponsor ${pet.value.name} (${pet.value.species}). Please let me know how I can help cover their food and vet care.\n\nThank you!`
  );
  window.location.href = `mailto:hello@pawhub.example?subject=${subject}&body=${body}`;
  sponsorMessage.value = `Opening your email app to sponsor ${pet.value.name}…`;
};

onMounted(async () => {
  try {
    pet.value = await petsService.get(route.params.id);
    await loadMyApplication();
  } catch (err) {
    console.error('Failed to fetch pet:', err);
  } finally {
    loading.value = false;
  }
});
</script>
