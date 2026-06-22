<template>
  <footer class="bg-white border-t border-slate-200 text-slate-500 py-12 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <PawPrintIcon class="w-5 h-5 text-sky-500" />
        <p class="text-sm font-bold text-slate-800">&copy; 2026 PawHub.</p>
      </div>
      <div class="flex space-x-6 text-sm font-bold">
        <RouterLink to="/adopt" class="hover:text-sky-500 transition-colors">Adopt</RouterLink>
        <RouterLink to="/community" class="hover:text-sky-500 transition-colors">Community</RouterLink>
        <a href="mailto:hello@pawhub.example" class="hover:text-sky-500 transition-colors">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { PawPrintIcon } from 'lucide-vue-next';
</script>
