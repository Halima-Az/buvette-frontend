import { createRouter, createWebHistory } from 'vue-router';

import Landing from '@/views/Landing.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

import Menu from '@/views/Menu.vue';
import CartPage from '@/views/CardPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // Public pages
    {
      path: '/',
      name: 'Landing',
      component: Landing,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },

    // Authenticated pages
    {
      path: '/home',
      name: 'menu',
      component: Menu,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
    },
  ],
});

export default router;
