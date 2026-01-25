// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, getRole } from "@/stores/auth";

import Login from "@/views/shared/Login.vue";
import Register from "@/views/shared/Register.vue";
import Hello from "@/views/shared/hello.vue";

import Menu from "@/views/client/Menu.vue";
import CardPage from "@/views/client/CardPage.vue";
import Favorites from "@/views/client/Favorites.vue";
import Profile from "@/views/shared/Profile.vue";
import Categorie from "@/views/client/Categories.vue";

import Dashboard from "@/views/worker/Dashboard.vue";
import OrderDetails from "@/views/client/OrderDetails.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public
    { path: "/", name: "landing", component: Hello },
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },

    // Client
    { path: "/home", name: "home", component: Menu, meta: { requiresAuth: true, role: "ROLE_CLIENT" } },
    { path: "/favorites", name: "favorites", component: Favorites, meta: { requiresAuth: true, role: "ROLE_CLIENT" } },
    { path: "/cart", name: "cart", component: CardPage, meta: { requiresAuth: true, role: "ROLE_CLIENT" } },
    { path: "/profile", name: "profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/categories", name: "categories", component: Categorie, meta: { requiresAuth: true } },
    {path:"/orders", name:"orderDetails",component:OrderDetails,meta: { requiresAuth: true, role: "ROLE_CLIENT"  }},

    // Worker
    { path: "/serveur/home", name: "serverHome", component: Dashboard, meta: { requiresAuth: true, role: "ROLE_WORKER" } },
  ],
});

// 🔒 Guard pour vérifier auth et rôle
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return next("/login");
  }

  if (to.meta.role) {
    const userRole = getRole();
    if (userRole !== to.meta.role) {
      // Redirection selon rôle
      if (userRole === "ROLE_CLIENT") return next("/home");
      if (userRole === "ROLE_WORKER") return next("/serveur/home");
      return next("/");
    }
  }

  next();
});

export default router;
