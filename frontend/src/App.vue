<template>
  <div
    class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-900"
  >
    <AppHeader />

    <ToastNotification />

    <main class="flex-grow w-full relative z-10">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import ToastNotification from './components/ui/ToastNotification.vue';
import { useSocket } from './composables/useSocket';

// Open the WebSocket connection and route adoption alerts into the toast.
useSocket();
</script>
