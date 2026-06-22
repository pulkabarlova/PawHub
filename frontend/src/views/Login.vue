<template>
  <div
    class="max-w-md mx-4 sm:mx-auto bg-white border border-slate-100 shadow-sm p-10 rounded-[3rem] mt-12 relative overflow-hidden"
  >
    <h2 class="text-3xl font-extrabold text-center mb-8 text-slate-900 relative z-10">Welcome Back</h2>
    <form @submit.prevent="handleLogin" class="relative z-10">
      <div class="mb-5">
        <label class="block text-slate-700 text-sm font-bold mb-2" for="email">Email Address</label>
        <input
          v-model="email"
          type="email"
          id="email"
          required
          class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-3 border bg-slate-50 transition-all"
          placeholder="you@example.com"
        />
      </div>
      <div class="mb-8">
        <label class="block text-slate-700 text-sm font-bold mb-2" for="password">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-3 border bg-slate-50 transition-all mb-2"
          placeholder="••••••••"
        />
        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>
      </div>
      <div>
        <button
          class="w-full bg-sky-500 border border-sky-400 text-white font-bold py-4 px-6 rounded-2xl hover:bg-sky-600 transition-all shadow-md hover:-translate-y-0.5"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
      </div>
      <div class="text-center mt-6 pt-6 border-t border-slate-100">
        <p class="text-sm text-slate-600 font-medium">
          Don't have an account?
          <router-link to="/register" class="text-sky-600 hover:text-sky-800 font-bold ml-1 transition-colors"
            >Register here</router-link
          >
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    // Return to the page the guard bounced us from, if any.
    router.push(route.query.redirect || '/');
  } catch (err) {
    error.value = err.message || 'Failed to login';
  } finally {
    loading.value = false;
  }
};
</script>
