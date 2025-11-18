import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Menu from '@/views/Menu.vue'
import CartPage from '@/views/CardPage.vue'
import Hello from '@/views/hello.vue'
import { isAuthenticated } from "@/stores/auth";
import Favorites from '@/views/Favorites.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // Public pages
    {
      path: '/',
      name: 'login',
      component: Login, // ✅ first page is login
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
       meta:{ requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'avorites',
      component: Favorites,
       meta:{ requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    { path: '/register', name: 'register', component: Register },
    { path: '/hello', name: 'hello', component: Hello },
    
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
    },
  ],
})

// Guard : vérifie l'authentification avant d'entrer dans une route
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login"); // redirige vers login si non connecté
  } else {
    next(); // autorise la navigation
  }
});


export default router
