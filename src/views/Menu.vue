<template>
  <div class="page">
    <!-- TOP BAR -->
    <HeaderPage />

    <!-- SEARCH BAR -->
   <SearchBar v-model="search" placeholder="search food..."/>

    <!-- GRID -->
    <div class="grid">
      <MenuItemCard v-for="item in filteredItems" 
      :key="item.id" :item="item"
      :favorite="preferences.has(item.id)"
         @update-count="updateCart"
         @add-preference="togglePreference" />
    </div>
    <FooterPageMenu />
  </div>

  
</template>

<script setup>
import axios from "axios"
import { ref, computed, onMounted } from "vue";
import MenuItemCard from "../components/MenuItemCard.vue";
import HeaderPage from "@/components/HeaderPageMenu.vue";
import SearchBar from "@/components/SearchBar.vue";
import FooterPageMenu from "@/components/FooterPageMenu.vue";
import { setCartCountFromCart } from "@/store/cartStore";

// Favorite / preference tracking
const preferences = ref(new Set());
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
// Fonction pour charger l'état des favoris
async function loadFavorites() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.get("http://localhost:8088/favorites", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const favIds = res.data.map(f => f.id);
    console.log(favIds)
    preferences.value = new Set(favIds);
     console.log(preferences.value)
  } catch (err) {
    console.error("Erreur en récupérant les favoris:", err);
  }
}

// Charger au montage
onMounted(() => {
  loadFavorites();
  
});

// Toggle favorite / preference
async function togglePreference(item) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
     if (preferences.value.has(item.id)) {
      await axios.post(
        "http://localhost:8088/favorites/delete",
        { itemId: item.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      preferences.value.delete(item.id);

    } else {
      await axios.post(
        "http://localhost:8088/favorites/add",
        { itemId: item.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      preferences.value.add(item.id);

    }
  } catch (err) {
    console.error("Erreur toggle favorite:", err);
  }
}

async function updateCart({ item, count }) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 1️⃣ Load existing cart from backend
    const cartRes = await axios.get("http://localhost:8088/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cart = cartRes.data;

    // 2️⃣ Check if item already exists
    const existing = cart.find(c => c.itemId === item.id);

    // 3️⃣ Compute correct final quantity
    const finalQty = existing ? existing.quantity + count : count;

    // 4️⃣ Push the updated quantity
    const updateRes = await axios.post(
      "http://localhost:8088/cart/update",
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

