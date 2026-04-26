import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
    { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
    { path: '/adopt', name: 'adopt', component: () => import('../views/Adoption.vue') },
    { path: '/community', name: 'community', component: () => import('../views/Community.vue') },
    { 
      path: '/profile', 
      name: 'profile', 
      component: () => import('../views/UserProfile.vue'),
      meta: { requiresAuth: true }
    },
    { path: '/pet/:id', name: 'pet-profile', component: () => import('../views/PetProfile.vue') }
  ]
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login');
  } else {
    next();
  }
});

export default router
