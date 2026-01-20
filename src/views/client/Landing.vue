<template>
  <div class="d-flex flex-column min-vh-100">
    <HeaderPage />
    <main class="flex-grow-1 text-center py-5 bg-light">
        <h1>Bienvenue à La Buvette</h1>
        <p>Un lieu convivial pour savourer des boissons fraîches et des snacks gourmands.</p>
        <button class="btn btn-primary">Voir le menu</button>
     
    </main>
    <FooterPage />
  </div>
</template>

<script setup>

import HeaderPage from '@/components/client/HeaderPage.vue'
import FooterPage from '@/components/client/FooterPage.vue'
</script>
<style scoped>
button {
    padding: 0.5rem 1rem;
    background-color: #ff6f61;
    color: white;
    border: none;
    border-radius: 5px;
}
button:hover{
  background-color: #c05146;  
}
</style>
