import Home from '../views/Home.vue';

/**
 * Application route table. Home is eagerly imported (the landing page); every
 * other view is lazy-loaded for a smaller initial bundle.
 * @type {import('vue-router').RouteRecordRaw[]}
 */
export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
  { path: '/adopt', name: 'adopt', component: () => import('../views/Adoption.vue') },
  { path: '/events', name: 'events', component: () => import('../views/Events.vue') },
  { path: '/shop', name: 'shop', component: () => import('../views/Shop.vue') },
  { path: '/cart', name: 'cart', component: () => import('../views/Cart.vue') },
  { path: '/community', name: 'community', component: () => import('../views/Community.vue') },
  { path: '/post/:id', name: 'post', component: () => import('../views/PostDetail.vue') },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/UserProfile.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/pet/:id', name: 'pet-profile', component: () => import('../views/PetProfile.vue') },
];
