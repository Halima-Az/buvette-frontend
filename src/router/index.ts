import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/shared/Login.vue'
import Register from '@/views/shared/Register.vue'
import Menu from '@/views/client/Menu.vue'
import CardPage from '@/views/client/CardPage.vue'
import Hello from '@/views/shared/hello.vue'
import Favorites from '@/views/client/Favorites.vue'
import Profile from '@/views/shared/Profile.vue'
import Categorie from '@/views/client/Categories.vue'

import { isAuthenticated } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // Public pages
    {
      path: '/',
      name: 'landing page',
      component: Hello,
    },
    {
      path: '/login',
      name: 'login-page',
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
      name: 'home',
      component: Menu,
      meta: { requiresAuth: true }
    },
     {
      path: '/profile',
      name: 'profile',
      component: Profile,
       meta:{ requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: Favorites,
      meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CardPage,
      meta: { requiresAuth: true }
    },

    // Dev page
   
    {
      path: '/categories',
      name: 'categories',
      component: Categorie,
      meta: { requiresAuth: true }
    },
  ]
})

// 🔒 Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login");
  } else {
    next();
  }
});

export default router
