<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <!-- Profile Header -->
    <header
      v-if="user"
      class="bg-white shadow-sm rounded-[3rem] p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100"
    >
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm bg-slate-100 shrink-0">
          <img
            v-if="user.profilePicture"
            :src="user.profilePicture"
            alt="Profile Avatar"
            class="h-full w-full object-cover"
          />
        </div>
        <div class="text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{{ user.name }}</h1>
          <p class="text-slate-500 font-medium mt-2 text-lg">{{ user.email }}</p>
          <span
            class="inline-block mt-4 px-5 py-2 bg-sky-100 text-sky-800 rounded-full text-xs font-bold uppercase tracking-widest"
            >{{ user.role }}</span
          >
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Pet List -->
      <section class="lg:col-span-2">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-extrabold text-slate-900">My Pets</h2>
        </div>

        <div v-if="loading" class="text-slate-500 animate-pulse">Loading your pets...</div>
        <div
          v-else-if="userPets.length === 0"
          class="bg-white p-16 text-center rounded-[3rem] border border-slate-100 shadow-sm text-slate-500"
        >
          <p class="text-2xl font-bold text-slate-700">You haven't added any pets yet.</p>
          <p class="text-slate-500 mt-2 text-lg">Add your companion using the form to let the community know!</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <article
            v-for="pet in userPets"
            :key="pet._id"
            class="bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 rounded-3xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden cursor-pointer group"
            @click="$router.push(`/pet/${pet._id}`)"
          >
            <!-- Status badge -->
            <span
              v-if="pet.status === 'adoptable'"
              class="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-6 py-2 rounded-bl-3xl uppercase tracking-wider shadow-sm z-10"
            >
              Adoptable
            </span>

            <div class="w-full h-56 bg-slate-50 relative overflow-hidden rounded-t-3xl">
              <img
                v-if="pet.pictures && pet.pictures.length"
                :src="resolveMediaUrl(pet.pictures[0])"
                alt="Pet image"
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                v-else
                class="h-full w-full flex items-center justify-center text-4xl text-slate-300 font-bold uppercase"
              >
                {{ pet.name.charAt(0) }}
              </div>
            </div>

            <div class="p-8 w-full relative">
              <h3 class="text-3xl font-bold text-slate-900 mt-2">{{ pet.name }}</h3>
              <p class="text-slate-500 font-medium mt-3 text-lg">
                {{ pet.breed || 'Mixed' }} &bull; {{ pet.age || '?' }} yrs
              </p>
            </div>
          </article>
        </div>

        <!-- My Adoption Applications -->
        <div class="mt-12">
          <h2 class="text-3xl font-extrabold text-slate-900 mb-6">My Adoption Applications</h2>
          <p v-if="appError" class="text-red-600 font-medium text-sm mb-4">{{ appError }}</p>
          <div v-if="loadingApps" class="text-slate-500 animate-pulse">Loading applications...</div>
          <div
            v-else-if="applications.length === 0"
            class="bg-white p-10 text-center rounded-3xl border border-slate-100 shadow-sm text-slate-500"
          >
            You haven't applied to adopt any pets yet.
          </div>
          <ul v-else class="space-y-4">
            <li
              v-for="app in applications"
              :key="app._id"
              class="bg-white border border-slate-100 shadow-sm rounded-3xl p-5 flex items-center gap-4"
            >
              <div class="h-16 w-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                <img
                  v-if="app.petId && app.petId.pictures && app.petId.pictures.length"
                  :src="resolveMediaUrl(app.petId.pictures[0])"
                  alt="Pet"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <router-link
                  :to="`/pet/${app.petId && app.petId._id}`"
                  class="text-lg font-bold text-slate-900 hover:text-sky-600"
                >
                  {{ (app.petId && app.petId.name) || 'Pet' }}
                </router-link>
                <p class="text-slate-500 font-medium text-sm">
                  {{ app.petId && app.petId.species }} • applied
                  {{ new Date(app.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <button
                @click="withdraw(app)"
                :disabled="app._busy"
                class="bg-white border-2 border-red-100 text-red-600 px-5 py-2.5 rounded-full font-bold hover:bg-red-50 transition-all disabled:opacity-50 shrink-0"
              >
                {{ app._busy ? '…' : 'Cancel' }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Log Out Section at bottom of main content -->
        <div class="mt-16 pt-8 border-t border-slate-200">
          <button
            @click="logout"
            class="bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 font-bold px-8 py-4 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 w-full md:w-auto"
          >
            Log Out of PawHub
          </button>
        </div>
      </section>

      <!-- Add Pet Form Sidebar -->
      <aside>
        <div class="bg-white shadow-sm rounded-[3rem] p-10 border border-slate-100 sticky top-28">
          <div class="flex items-center gap-3 mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Add Pet</h2>
          </div>
          <form @submit.prevent="addPet" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Name</label>
              <input
                v-model="newPet.name"
                required
                type="text"
                class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-slate-50"
                placeholder="Fido"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Species</label>
              <select
                v-model="newPet.species"
                required
                class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-slate-50"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Breed</label>
              <input
                v-model="newPet.breed"
                type="text"
                class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-slate-50"
                placeholder="e.g. Golden Retriever"
              />
            </div>
            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Age</label>
                <input
                  v-model.number="newPet.age"
                  type="number"
                  min="0"
                  class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-slate-50"
                  placeholder="2"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select
                  v-model="newPet.status"
                  required
                  class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-slate-50"
                >
                  <option value="owned">Owned</option>
                  <option value="adoptable">For Adoption</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              class="w-full bg-sky-500 text-white px-5 py-5 rounded-full font-bold hover:bg-sky-600 transition-all mt-8 shadow-lg hover:-translate-y-1 text-lg"
              :disabled="submitting"
            >
              {{ submitting ? 'Adding Pet...' : 'Add Pet to Profile' }}
            </button>
            <p v-if="addPetError" class="text-red-600 font-medium text-sm">{{ addPetError }}</p>
          </form>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { petsService } from '../services/pets.service';
import { applicationsService } from '../services/applications.service';
import { resolveMediaUrl } from '../utils/media';

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const userPets = ref([]);
const loading = ref(true);
const submitting = ref(false);
const applications = ref([]);
const loadingApps = ref(true);
const addPetError = ref('');
const appError = ref('');

const newPet = ref({
  name: '',
  species: 'Dog',
  breed: '',
  status: 'owned',
  age: null,
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const fetchUserPets = async () => {
  if (!user.value) return;
  loading.value = true;
  try {
    const allPets = await petsService.list();
    // Keep only the pets owned by the current user.
    userPets.value = allPets.filter((p) => p.ownerId === user.value._id);
  } catch (err) {
    console.error('Failed to fetch user pets:', err);
  } finally {
    loading.value = false;
  }
};

const addPet = async () => {
  submitting.value = true;
  addPetError.value = '';
  try {
    // Inject a realistic image based on species/breed via loremflickr.
    const species = newPet.value.species.toLowerCase();
    const breed = newPet.value.breed ? ',' + newPet.value.breed.toLowerCase().replace(' ', '-') : '';
    const pictureUrl = `https://loremflickr.com/400/300/${species}${breed}/all`;

    const payload = {
      ...newPet.value,
      age: Number(newPet.value.age) || 0,
      pictures: [pictureUrl],
    };

    const addedPet = await petsService.create(payload);
    userPets.value.push(addedPet);
    newPet.value = { name: '', species: 'Dog', breed: '', status: 'owned', age: null };
  } catch (err) {
    addPetError.value = err.message || 'Failed to add pet. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const fetchApplications = async () => {
  if (!user.value) return;
  loadingApps.value = true;
  try {
    applications.value = await applicationsService.listMine();
  } catch (err) {
    console.error('Failed to load applications:', err);
  } finally {
    loadingApps.value = false;
  }
};

const withdraw = async (app) => {
  app._busy = true;
  appError.value = '';
  try {
    await applicationsService.cancel(app._id);
    applications.value = applications.value.filter((a) => a._id !== app._id);
  } catch (err) {
    appError.value = err.message || 'Could not cancel the application. Please try again.';
    app._busy = false;
  }
};

onMounted(() => {
  fetchUserPets();
  fetchApplications();
});
</script>
