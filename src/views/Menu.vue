<template>
  <div class="page">
    <!-- TOP BAR -->
    <HeaderPage />

    <!-- SEARCH BAR -->
    <div class="search-bar">
      <i class="icon">🔍</i>
      <input type="text" placeholder="Search food..." v-model="search" />
    </div>

    <!-- GRID -->
    <div class="grid">
      <MenuItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @add="increaseCount"
        @add-preference="togglePreference"
      />
    </div>
  </div>

  <FooterPage />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MenuItemCard from "../components/MenuItemCard.vue";
import HeaderPage from "@/components/HeaderPageMenu.vue";
import FooterPage from "@/components/FooterPageMenu.vue";

// Search input
const search = ref("");

// Items fetched from backend
const items = ref([]);

// Fetch items on component mount
onMounted(async () => {
  try {
    const res = await fetch("http://localhost:8080/api/menu"); // adjust your endpoint
    items.value = await res.json();
  } catch (err) {
    console.error("Failed to fetch menu items:", err);
  }
});

// Filter items based on search input
const filteredItems = computed(() =>
  items.value.filter(i =>
    i.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

// Order counts
const order = ref({});

// Favorite / preference tracking
const preferences = ref(new Set());

// Increase count of item in order
function increaseCount(item) {
  order.value[item.id] = (order.value[item.id] || 0) + 1;
}

// Toggle favorite / preference
function togglePreference(item) {
  preferences.value.has(item.id)
    ? preferences.value.delete(item.id)
    : preferences.value.add(item.id);
}
</script>

<style scoped>
/* PAGE BASE */
.page {
  background: #f5f8f3;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  animation: fadeIn 0.5s ease;
}

/* SEARCH BAR */
.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 14px;
  padding: 10px 14px;
  margin-bottom: 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.25s ease;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding-left: 6px;
  font-size: 15px;
}

.search-bar:focus-within {
  box-shadow: 0 0 0 3px rgba(56, 181, 111, 0.25),
              0 3px 12px rgba(0, 0, 0, 0.08);
}

.icon {
  font-size: 18px;
  opacity: 0.6;
}

/* AUTO-FIT GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

/* ANIMATION */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
