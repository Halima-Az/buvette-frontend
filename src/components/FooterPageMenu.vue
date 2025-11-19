<template>
  <nav class="bottom-nav">
    <router-link to="/home" class="nav-item" :class="{ active: active === 'home' }" @click="setActive('home')">
      <i class="icon">🏡</i>
    </router-link>

    <router-link to="/search" class="nav-item" :class="{ active: active === 'search' }" @click="setActive('search')">
      <i class="icon">🔍</i>
    </router-link>

    <router-link to="/cart" class="nav-item" :class="{ active: active === 'cart' }" @click="setActive('cart')">
      <i class="icon">🛒</i>
    </router-link>

    <router-link to="/favorites" class="nav-item" :class="{ active: active === 'favorites' }" @click="setActive('favorites')">
      <i class="icon">🤍</i>
    </router-link>

    <router-link to="/profile" class="nav-item profile" :class="{ active: active === 'profile' }" @click="setActive('profile')">
      <i class="icon">👤</i>
      <span class="dot"></span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const active = ref('home'); // default active item

function setActive(name) {
  active.value = name;
}
</script>

<style scoped>.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 52px;

  display: flex;
  justify-content: space-around;
  align-items: center;

  background: #FFF8EC; /* warm cream */
  box-shadow: 0 -4px 20px rgba(138, 86, 35, 0.10); /* soft caramel shadow */

  border-radius: 18px 18px 0 0;
  z-index: 999;
}

.nav-item {
  text-decoration: none;
  opacity: 0.45;
  position: relative;
  color: #A9682A; /* caramel brown */
  transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
}

.nav-item.active {
  opacity: 1;
  color: #E7A73C; /* golden highlight */
}

.icon {
  font-size: 20px;
}

/* red notification dot */
.dot {
  width: 9px;
  height: 9px;
  background: #ff4d4f;
  border-radius: 50%;
  position: absolute;
  top: -3px;
  right: -3px;
}

/* hover + tap interactions */
.nav-item:hover {
  transform: translateY(-3px);
  opacity: 1;
}

.nav-item:active {
  transform: scale(0.85);
}

</style>
