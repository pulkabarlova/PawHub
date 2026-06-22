<template>
  <div
    v-if="notifications.current"
    class="fixed top-24 right-4 md:right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl z-50 animate-bounce font-bold flex items-center gap-3"
  >
    <div class="w-2 h-2 rounded-full bg-green-400"></div>
    {{ notifications.current }}
  </div>
</template>

<script setup>
import { useNotificationsStore } from '../../stores/notifications';

const notifications = useNotificationsStore();
</script>
