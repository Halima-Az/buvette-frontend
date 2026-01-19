<template>
  <HeaderPageMenu title="" />
  <div class="categories-page">

    <!-- CATEGORY STRIP -->
    <div :class="['category-strip', { collapsed: selectedCategory }]">
      <div
        v-for="c in categories"
        :key="c.key"
        class="category-card"
        :class="{ active: selectedCategory === c.key }"
        @click="selectCategory(c.key)"
      >
        <div class="img-wrapper">
          <img
            :src="c.image"
            class="img"
            @error="e => e.target.src = '/categories/default.png'"
          />
        </div>
        <div class="info">
          <h2 class="name">{{ c.label }}</h2>
          <span class="arrow" v-if="!selectedCategory">→</span>
        </div>
      </div>
    </div>

    <!-- BACK BUTTON WHEN CATEGORY SELECTED -->
    <div v-if="selectedCategory" class="back-section">
      <button class="back-btn" @click="goBack">
        ← Back to Categories
      </button>
      <h1 class="selected-title">{{ selectedCategoryLabel }} Menu</h1>
    </div>

    <!-- PRODUCTS GRID -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="selectedCategory" class="grid-wrapper" key="products">
        <div class="grid-header">
          <p class="product-count">{{ categoryProducts.length }} items available</p>
        </div>
        <div class="grid">
          <MenuItemCard
            v-for="p in categoryProducts"
            :key="p.id"
            :item="p"
            :favorite="isFavorite(p.id)"
            @update-count="updateCart"
            @add-preference="toggleFavorite"
          />
        </div>
      </div>
    </transition>

    <!-- EMPTY STATE -->
    <div v-if="selectedCategory && categoryProducts.length === 0" class="empty-state">
      <div class="empty-icon">🍽️</div>
      <h3>No items available</h3>
      <p>We're currently updating this menu</p>
      <button class="cta-btn" @click="goBack">Browse other categories</button>
    </div>

  </div>
  <FooterPageMenu />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import HeaderPageMenu from "@/components/client/HeaderPageMenu.vue";
import FooterPageMenu from "@/components/client/FooterPageMenu.vue";
import MenuItemCard from "@/components/client/MenuItemCard.vue";
import { setCartCountFromCart } from "@/store/cartStore";

import axios from "axios";

const categories = ref([]);
const selectedCategory = ref(null);
const categoryProducts = ref([]);
const favorites = ref(new Set());

// Computed property for selected category label
const selectedCategoryLabel = computed(() => {
  if (!selectedCategory.value) return '';
  const category = categories.value.find(c => c.key === selectedCategory.value);
  return category ? category.label : '';
});

// Load categories on mount
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8088/api/categories");

    categories.value = res.data.map(c => ({
      key: c,
      label: c.charAt(0) + c.slice(1).toLowerCase(),
      image: `/categories/${c}.png`
    }));

  } catch (err) {
    console.error("Failed to load categories:", err);
  }
});

// Check if item is favorite
function isFavorite(itemId) {
  return favorites.value.has(itemId);
}

// Toggle favorite status
function toggleFavorite(item) {
  if (favorites.value.has(item.id)) {
    favorites.value.delete(item.id);
  } else {
    favorites.value.add(item.id);
  }
  // In a real app, you would save to backend here
  console.log('Favorite toggled for item:', item.id);
}

// Handle count updates from MenuItemCard
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

    // 3️⃣ Use the count emitted from the card (fix + / -)
    const finalQty = count;

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

// Select category and load products
async function selectCategory(key) {
  selectedCategory.value = key;
  try {
    const res = await axios.get("http://localhost:8088/api/menu-items", {
      params: { category: key }
    });
    categoryProducts.value = res.data.map(item => ({
      ...item,
      rating: item.rating || 4.5 // Default rating if not provided
    }));
  } catch (err) {
    console.error("Failed to load products:", err);
    categoryProducts.value = [];
  }
}

// Reset category selection
function goBack() {
  selectedCategory.value = null;
  categoryProducts.value = [];
}
</script>

<style scoped>
.categories-page {
  padding: 20px 16px 80px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2c3e50;
}

/* ---------- CATEGORY STRIP ---------- */
.category-strip {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-strip.collapsed {
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 12px;
  padding: 8px 0 16px;
  margin: -8px 0 16px;
  scrollbar-width: none;
}

.category-strip.collapsed::-webkit-scrollbar {
  display: none;
}

.category-strip.collapsed .category-card {
  flex: 0 0 auto;
  width: 140px;
  padding: 12px;
  min-height: auto;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 120px;
}

.category-card.active {
  background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
  border-color: #ffd699;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 8px 30px rgba(192, 139, 62, 0.2),
    0 3px 10px rgba(192, 139, 62, 0.1);

  width: 170px;
}

.category-card:hover:not(.active) {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.img-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-strip.collapsed .img-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 16px;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card:hover .img {
  transform: scale(1.08);
}

.info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  font-weight: 700;
  font-size: 22px;
  margin: 0;
  color: #1a1a2e;
  background: linear-gradient(135deg, #2c3e50 0%, #4a6572 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.category-strip.collapsed .name {
  font-size: 16px;
  font-weight: 600;
}

.arrow {
  font-size: 28px;
  color: #c08b3e;
  font-weight: 300;
  transition: transform 0.3s ease;
}

.category-card:hover .arrow {
  transform: translateX(4px);
}

/* ---------- BACK BUTTON SECTION ---------- */
.back-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.back-btn {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-btn:hover {
  background: #f8f9fa;
  border-color: #c08b3e;
  color: #c08b3e;
  transform: translateX(-2px);
}

.selected-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  flex: 1;
}

/* ---------- GRID LAYOUT ---------- */
.grid-wrapper {
  animation: fadeInUp 0.4s ease;
}

.grid-header {
  margin-bottom: 20px;
  padding: 0 4px;
}

.product-count {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

/* ---------- EMPTY STATE ---------- */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.6s ease;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 24px;
  font-size: 16px;
}

.cta-btn {
  background: linear-gradient(135deg, #c08b3e 0%, #d4a346 100%);
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(192, 139, 62, 0.2);
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(192, 139, 62, 0.3);
}

/* ---------- TRANSITIONS ---------- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ---------- ANIMATIONS ---------- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 768px) {
  .categories-page {
    padding: 16px 12px 80px;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .selected-title {
    font-size: 24px;
  }
  
  .category-card {
    padding: 16px;
    gap: 16px;
  }
  
  .img-wrapper {
    width: 80px;
    height: 80px;
  }
  
  .name {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .back-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .back-btn {
    align-self: flex-start;
  }
}

/* ==============================
   COLLAPSED CATEGORY — POLISHED
============================== */

.category-strip.collapsed {
  padding: 6px 0 14px;
}

/* Card base */
.category-strip.collapsed .category-card,
.category-strip.collapsed .category-card.active {
  width: auto;
  height: 72px;
  padding: 10px 14px;
  min-height: unset;

  flex-direction: row;
  align-items: center;
  gap: 12px;

  border-radius: 18px;
  transform: none;
}

/* Normal state */
.category-strip.collapsed .category-card {
  background: white;
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* Active state — unmistakable */
.category-strip.collapsed .category-card.active {
  background: linear-gradient(135deg, #fff6ea, #ffecd1);
  border: 1px solid #f2c98b;
  box-shadow:
    0 6px 20px rgba(192, 139, 62, 0.35);
}

/* Image becomes icon */
.category-strip.collapsed .img-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  box-shadow: none;
}

/* Text takes the lead */
.category-strip.collapsed .info {
  flex: 1;
  justify-content: center;
}

.category-strip.collapsed .name {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.1;
  text-align: left;
  white-space: nowrap;
}

/* No hover nonsense */
.category-strip.collapsed .category-card:hover,
.category-strip.collapsed .category-card:hover .img {
  transform: none;
}

/* Arrow is meaningless here */
.category-strip.collapsed .arrow {
  display: none;
}

</style>