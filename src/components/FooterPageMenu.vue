<template>
  <nav class="bottom-nav">

    <router-link
      to="/home"
      class="nav-item"
      :class="{ active: active === 'home' }"
      @click="setActive('home')"
    >
      <i class="icon">🏡</i>
    </router-link>

    <router-link
      to="/search"
      class="nav-item"
      :class="{ active: active === 'search' }"
      @click="setActive('search')"
    >
      <i class="icon">🔍</i>
    </router-link>

    <!-- CART ICON WITH BADGE -->
    <router-link
      to="/cart"
      class="nav-item"
      :class="{ active: active === 'cart' }"
      @click="setActive('cart')"
    >
      <i class="icon">🛒</i>

      <!-- Show badge only if cart has items -->
      <span v-if="cartCount > 0" class="badge">
        {{ cartCount }}
      </span>
    </router-link>

    <router-link
      to="/favorites"
      class="nav-item"
      :class="{ active: active === 'favorites' }"
      @click="setActive('favorites')"
    >
      <i class="icon">🤍</i>
    </router-link>

    <router-link
      to="/profile"
      class="nav-item profile"
      :class="{ active: active === 'profile' }"
      @click="setActive('profile')"
    >
      <i class="icon">👤</i>
    </router-link>

  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { cartCount } from "@/store/cartStore";   // ⬅️ Import your global cart count

const active = ref("home");

function setActive(name) {
  active.value = name;
}
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
  color: #E7A73C;
}

.icon {
  font-size: 20px;
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

.nav-item:hover {
  transform: translateY(-3px);
  opacity: 1;
}

.nav-item:active {
  transform: scale(0.85);
}
</style>
