<template>
  <nav class="bottom-nav">
    <router-link
      to="/home"
      class="nav-item"
      :class="{ active: active === 'home' }"
      @click="setActive('home')"
    >
      <i class="fa-solid fa-house icon"></i>
    </router-link>

    <router-link
      to="/search"
      class="nav-item"
       :class="{ active: active === 'search' }"
      @click="setActive('search')"
    >
      <i class="fa-solid fa-magnifying-glass icon"></i>
    </router-link>

    <router-link
      to="/cart"
      class="nav-item"
       :class="{ active: active === 'cart' }"
      @click="setActive('cart')"
    >
      <i class="fa-solid fa-cart-shopping icon"></i>
    </router-link>

    <router-link
      to="/favorites"
      class="nav-item"
      :class="{ active: active === 'favorites' }"
      @click="setActive('favorites')"
    >
      <i class="fa-solid fa-heart icon"></i>
      <span v-if="favIds.length > 0" class="dot1"></span>
    </router-link>

    <router-link
      to="/profile"
      class="nav-item profile"
       :class="{ active: active === 'profile' }"
      @click="setActive('profile')"
    >
      <i class="fa-solid fa-user icon"></i>
      <span class="dot"></span>
    </router-link>

  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import {ref,onMounted} from "vue";
import axios from "axios";
const route = useRoute();
  import { ref } from 'vue';
import { cartCount } from "@/store/cartStore";   // ⬅️ Import your global cart count

const active = ref("home");

// Vérifie si la route actuelle correspond à l'onglet
function isActive(path) {
  return route.path === path;
}
const favIds=ref([])
async function loadFavorites() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.get("http://localhost:8088/favorites", {
      headers: { Authorization: `Bearer ${token}` }
    });

    favIds.value = res.data.map(f => f.id);
  } catch (err) {
    console.error("Erreur en récupérant les favoris:", err);
  }
}

onMounted(()=>loadFavorites())


</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  background: #FFF8EC;
  box-shadow: 0 -4px 20px rgba(138, 86, 35, 0.10);

  border-radius: 18px 18px 0 0;
  z-index: 999;
}

.nav-item {
  text-decoration: none;
  opacity: 0.45;
  position: relative;
  color: #A9682A;
  transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
}

.nav-item.active {
  opacity: 1;
  color: #c08b3e; /* golden color */
}

.icon {
  font-size: 22px;
}

/* BADGE STYLE */
.badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background: #ff4d4f;
  color: white;
  font-size: 10px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot1 {
  width: 9px;
  height: 9px;
  background: #ff4d4f;
  border-radius: 50%;
  position: absolute;
  top: -2px;
  right: -1px;
}
.nav-item:hover {
  transform: translateY(-3px);
  opacity: 1;
}

.nav-item:active {
  transform: scale(0.85);
}
</style>
