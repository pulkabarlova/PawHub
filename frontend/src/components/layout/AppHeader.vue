<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <RouterLink to="/" class="flex items-center gap-3 group">
            <div class="bg-sky-500 text-white p-2 rounded-xl group-hover:bg-sky-600 transition-colors shadow-sm">
              <PawPrintIcon class="w-6 h-6" />
            </div>
            <span class="text-2xl font-extrabold tracking-tight text-slate-900"
              >Paw<span class="text-sky-500">Hub</span></span
            >
          </RouterLink>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex space-x-1 items-center">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2 rounded-full text-slate-600 font-bold hover:text-sky-600 hover:bg-slate-50 transition-all"
            >{{ link.label }}</RouterLink
          >

          <RouterLink
            to="/cart"
            class="relative px-3 py-2 rounded-full text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all"
            title="Cart"
          >
            <ShoppingCartIcon class="w-5 h-5" />
            <span
              v-if="cartCount"
              class="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
              >{{ cartCount }}</span
            >
          </RouterLink>

          <div class="w-px h-6 bg-slate-200 mx-2"></div>

          <template v-if="isAuthenticated">
            <RouterLink
              to="/profile"
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-all"
            >
              <div
                class="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs overflow-hidden"
              >
                <img v-if="user?.profilePicture" :src="user.profilePicture" class="w-full h-full object-cover" />
                <span v-else>U</span>
              </div>
              My Profile
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="ml-2 bg-sky-500 text-white hover:bg-sky-600 px-6 py-2.5 rounded-full font-bold transition-all"
              >Log In / Sign Up</RouterLink
            >
          </template>
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="text-slate-600 hover:text-sky-600 focus:outline-none p-2 bg-slate-100 rounded-xl"
          >
            <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <XIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Nav -->
    <nav
      v-if="isMobileMenuOpen"
      class="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-xl absolute w-full left-0"
    >
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        @click="isMobileMenuOpen = false"
        :to="link.to"
        class="block px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:text-sky-600"
        >{{ link.label }}</RouterLink
      >

      <RouterLink
        @click="isMobileMenuOpen = false"
        to="/cart"
        class="block px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:text-sky-600"
        >Cart<span v-if="cartCount" class="ml-1 text-orange-500">({{ cartCount }})</span></RouterLink
      >

      <div class="border-t border-slate-100 my-2 pt-2"></div>

      <template v-if="isAuthenticated">
        <RouterLink
          @click="isMobileMenuOpen = false"
          to="/profile"
          class="block px-4 py-3 rounded-xl text-sky-700 font-bold bg-sky-50"
          >My Profile</RouterLink
        >
      </template>
      <template v-else>
        <RouterLink
          @click="isMobileMenuOpen = false"
          to="/login"
          class="block px-4 py-3 rounded-xl bg-sky-500 text-white font-bold text-center mt-4"
          >Log In / Register</RouterLink
        >
      </template>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { PawPrintIcon, MenuIcon, XIcon, ShoppingCartIcon } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';

const { isAuthenticated, user } = storeToRefs(useAuthStore());
const { count: cartCount } = storeToRefs(useCartStore());
const isMobileMenuOpen = ref(false);

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/adopt', label: 'Adopt' },
  { to: '/events', label: 'Events' },
  { to: '/shop', label: 'Shop' },
  { to: '/community', label: 'Community' },
];
</script>
