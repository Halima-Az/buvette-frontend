<template>
  <HeaderPage />

  <div class="cart-page">
    <h1>Your Cart</h1>
    <!-- Cart content will go here -->
  </div>

  <FooterPage />
</template>

<script setup >
import HeaderPage from '@/components/HeaderPageMenu.vue';
import FooterPage from '@/components/FooterPageMenu.vue';
</script>

<style scoped>
.cart-page {
  padding: 16px;
}
</style>
