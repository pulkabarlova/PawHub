<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-900">
    
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <RouterLink to="/" class="flex items-center gap-3 group">
              <div class="bg-sky-500 text-white p-2 rounded-xl group-hover:bg-sky-600 transition-colors shadow-sm">
                 <PawPrintIcon class="w-6 h-6" />
              </div>
              <span class="text-2xl font-extrabold tracking-tight text-slate-900">Paw<span class="text-sky-500">Hub</span></span>
            </RouterLink>
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex space-x-2 items-center">
            <RouterLink to="/" class="px-4 py-2 rounded-full text-slate-600 font-bold hover:text-sky-600 hover:bg-slate-50 transition-all">Home</RouterLink>
            <RouterLink to="/adopt" class="px-4 py-2 rounded-full text-slate-600 font-bold hover:text-sky-600 hover:bg-slate-50 transition-all">Adopt</RouterLink>
            <RouterLink to="/community" class="px-4 py-2 rounded-full text-slate-600 font-bold hover:text-sky-600 hover:bg-slate-50 transition-all">Community</RouterLink>
            <RouterLink to="/events" class="px-4 py-2 rounded-full text-slate-600 font-bold hover:text-sky-600 hover:bg-slate-50 transition-all">Events</RouterLink>
            
            <div class="w-px h-6 bg-slate-200 mx-2"></div>

            <template v-if="isAuthenticated">
              <RouterLink to="/profile" class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-all">
                <div class="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs overflow-hidden">
                  <img v-if="user?.profilePicture" :src="user.profilePicture" class="w-full h-full object-cover">
                  <span v-else>U</span>
                </div>
                My Profile
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink to="/login" class="ml-2 bg-sky-500 text-white hover:bg-sky-600 px-6 py-2.5 rounded-full font-bold transition-all">Log In / Sign Up</RouterLink>
            </template>
          </nav>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-600 hover:text-sky-600 focus:outline-none p-2 bg-slate-100 rounded-xl">
              <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
              <XIcon v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Nav -->
      <nav v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-xl absolute w-full left-0">
        <RouterLink @click="isMobileMenuOpen = false" to="/" class="block px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:text-sky-600">Home</RouterLink>
        <RouterLink @click="isMobileMenuOpen = false" to="/adopt" class="block px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:text-sky-600">Adopt</RouterLink>
        <RouterLink @click="isMobileMenuOpen = false" to="/community" class="block px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:text-sky-600">Community</RouterLink>
        <RouterLink @click="isMobileMenuOpen = false" to="/events" class="block px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:text-sky-600">Events</RouterLink>
        
        <div class="border-t border-slate-100 my-2 pt-2"></div>

        <template v-if="isAuthenticated">
          <RouterLink @click="isMobileMenuOpen = false" to="/profile" class="block px-4 py-3 rounded-xl text-sky-700 font-bold bg-sky-50">My Profile</RouterLink>
        </template>
        <template v-else>
          <RouterLink @click="isMobileMenuOpen = false" to="/login" class="block px-4 py-3 rounded-xl bg-sky-500 text-white font-bold text-center mt-4">Log In / Register</RouterLink>
        </template>
      </nav>
    </header>

    <!-- Global Notifications -->
    <div v-if="notification" class="fixed top-24 right-4 md:right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl z-50 animate-bounce font-bold flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-green-400"></div>
      {{ notification }}
    </div>

    <!-- Main Content Area -->
    <main class="flex-grow w-full relative z-10">
      <RouterView />
    </main>

    <footer class="bg-white border-t border-slate-200 text-slate-500 py-12 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
           <PawPrintIcon class="w-5 h-5 text-sky-500" />
           <p class="text-sm font-bold text-slate-800">&copy; 2026 PawHub.</p>
        </div>
        <div class="flex space-x-6 text-sm font-bold">
          <a href="#" class="hover:text-sky-500 transition-colors">Terms</a>
          <a href="#" class="hover:text-sky-500 transition-colors">Privacy</a>
          <a href="#" class="hover:text-sky-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { useAuth } from './composables/useAuth'
import { PawPrintIcon, MenuIcon, XIcon } from 'lucide-vue-next'

const { isAuthenticated, user } = useAuth()
const isMobileMenuOpen = ref(false)
const notification = ref(null)

onMounted(() => {
  // Connect to backend WebSocket
  const socket = io('http://localhost:5000')

  socket.on('new_adoption_alert', (pet) => {
    notification.value = `New pet up for adoption: ${pet.name} the ${pet.species}!`
    setTimeout(() => {
      notification.value = null
    }, 5000)
  })
})
</script>