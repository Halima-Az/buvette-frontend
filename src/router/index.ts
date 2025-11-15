import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Hello from '@/views/hello.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'Landing',
      component: Landing,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    { path: '/register', name: 'register', component: Register },
    { path: '/hello', name: 'hello', component: Hello },
  ],
})

export default router
