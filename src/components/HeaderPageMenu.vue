<template>
  <header class="header-page">
    <img src="/img/SnackUpLogo.png" alt="logo" class="logo" />
    <h1 class="page-title">{{ title }}</h1>
    <button class="card-btn">
      🛒
    </button>

  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Home Page" }
});
</script>

<style scoped>.header-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #FFF8EC; /* warm cream */
  box-shadow: 0 2px 6px rgba(138, 86, 35, 0.10); /* soft caramel shadow */
  margin: 0;
}

.logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.page-title {
  flex-grow: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #A9682A; /* caramel brown */
  margin: 0 12px;
}

.card-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #FFE6C2; /* biscuit gold */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  font-size: 20px;
  color: #A9682A; /* icon color */
}

.card-btn:hover {
  background: #E7A73C; /* primary gold */
  color: white;
  transform: scale(1.05);
}

</style>
