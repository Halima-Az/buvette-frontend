<template>
  <header class="header-page">
    <img src="/img/SnackUpLogo.png" alt="logo" class="logo" @click="$router.push('/home')" />

    <h1 class="page-title">{{ title }}</h1>

    <!-- CART BUTTON WITH BADGE -->
    <div class="cart-wrapper" @click="$router.push('/cart')">
      <button class="card-btn">
        🛒
      </button>

      <!-- BADGE -->
      <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
    </div>

  </header>
</template>

<script setup>
import { cartCount } from "@/store/cartStore"; // <-- ADD THIS

defineProps({
  title: { type: String, default: "Home Page" }
});
</script>

<style scoped>
.header-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #FFF8EC; /* warm cream */
  box-shadow: 0 2px 6px rgba(138, 86, 35, 0.10);
  margin: 0;
}

.logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
.logo:hover{
  cursor: pointer;
}

.page-title {
  flex-grow: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #A9682A;
  margin: 0 12px;
}

/* Wrapper to position badge */
.cart-wrapper {
  position: relative;
}

.card-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #FFE6C2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  font-size: 20px;
  color: #A9682A;
}

.card-btn:hover {
  background: #E7A73C;
  color: white;
  transform: scale(1.05);
}

/* BADGE STYLE */
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4d4f;
  color: white;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
</style>
