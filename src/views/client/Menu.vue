<template>
  <div class="page">
    <!-- TOP BAR -->
    <HeaderPage />

    <!-- SEARCH BAR -->
    <SearchBar v-model="search" placeholder="search food..." />

    <!-- GRID -->
    <div class="grid">
      <MenuItemCard v-for="item in filteredItems" :key="item.id" :item="item" :favorite="preferences.has(item.id)"
        @update-count="updateCart" @add-preference="togglePreference" />
    </div>
    <FooterPageMenu />
  </div>


</template>

<script setup>
import axios from "axios"
import { ref, computed, onMounted } from "vue";
import MenuItemCard from "@/components/client/MenuItemCard.vue";
import HeaderPage from "@/components/client/HeaderPageMenu.vue";
import SearchBar from "@/components/client/SearchBar.vue";
import FooterPageMenu from "@/components/client/FooterPageMenu.vue";
import { setCartCountFromCart } from "@/store/cartStore";
import { useFavorites } from "@/composables/client/useFavorites";

// Favorite / preference tracking
const { preferences, loadFavorites, togglePreference } = useFavorites();
// Search input
const search = ref("");

// Items fetched from backend
const items = ref([]);

// Fetch items on component mount
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8088/api/menu");
    items.value = res.data; // Axios stocke les données dans .data


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
// Increase count of item in order
function increaseCount(item) {
  order.value[item.id] = (order.value[item.id] || 0) + 1;
}

// Charger au montage
onMounted(() => {
  loadFavorites();

});



async function updateCart({ item, count }) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 1️⃣ Load existing cart from backend
    const cartRes = await axios.get("http://localhost:8088/client/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cart = cartRes.data;

    // 2️⃣ Check if item already exists
    const existing = cart.find(c => c.itemId === item.id);

    // 3️⃣ Use the count emitted from the card (fix + / -)
    const finalQty = count;

    // 4️⃣ Push the updated quantity
    const updateRes = await axios.post(
      "http://localhost:8088/client/cart/update",
      { itemId: item.id, quantity: finalQty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 5️⃣ Update badge
    setCartCountFromCart(updateRes.data);

  } catch (err) {
    console.error("Error updating cart:", err);
  }
}


</script>

<style scoped>
/* PAGE BASE */
.page {
  background: #f5f8f3;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  animation: fadeIn 0.5s ease;
  padding-bottom: 100px;
}




/* AUTO-FIT GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin: 0 10px;

}


/* ANIMATION */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
