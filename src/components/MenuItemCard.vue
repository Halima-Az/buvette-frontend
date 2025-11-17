<template>
  <div class="card">
    <div class="img-wrapper">
      <img :src="item.image" class="img" />

      <div class="rating">★ {{ item.rating }}</div>

      <button
        class="heart-btn"
        :class="{ active: isFav }"
        @click.stop="togglePreference"
      >
        ♥
      </button>
    </div>

    <p class="name">{{ item.name }}</p>

    <div class="row">
      <div class="price-info">
        <p class="price" v-if="count === 0">${{ item.price.toFixed(2) }}</p>
        <p class="total-price" v-else>
          ${{ (item.price * count).toFixed(2) }}
        </p>
      </div>

      <button v-if="count === 0" class="add-btn" @click.stop="increase">
        +
      </button>

      <div v-else class="counter">
        <button class="counter-btn" @click.stop="decrease">−</button>
        <span class="count">{{ count }}</span>
        <button class="counter-btn" @click.stop="increase">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Renamed 'add' emit to 'update-count' for clarity on quantity change
const emit = defineEmits(["update-count", "add-preference"]);

const props = defineProps({
  item: Object,
  favorite: Boolean
});

const isFav = ref(props.favorite);
const count = ref(0);

function togglePreference() {
  isFav.value = !isFav.value;
  emit("add-preference", props.item);
}

function increase() {
  count.value++;
  // Emit the updated count and item to the parent for grand total calculation
  emit("update-count", { item: props.item, count: count.value });
}

function decrease() {
  if (count.value > 0) {
    count.value--;
    // Emit the updated count and item to the parent for grand total calculation
    emit("update-count", { item: props.item, count: count.value });
  }
}
</script>

---

<style scoped>
/* Color Palette Reference: Golden Brown (Primary: #c08b3e, Darker Gold: #cc9333, Background/Accent: #fcf4e8) */

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: 0.25s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.14);
}

.img-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.img {
  width: 100%;
  height: 130px;
  border-radius: 14px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .img {
  transform: scale(1.05);
}

/* Rating badge */
.rating {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #cc9333; /* Darker Gold */
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

/* Heart */
.heart-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(4px);
  color: #e04e4e;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.heart-btn.active {
  background: #ffe0e0;
  box-shadow: 0 0 8px rgba(255,0,0,0.25);
  transform: scale(1.12);
}

/* Name */
.name {
  margin: 10px 0 6px;
  font-weight: 600;
  font-size: 15px;
  text-align: left;
}

/* Price + buttons row */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.price-info {
  /* This container helps align the price text consistently */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.price {
  font-weight: bold;
  font-size: 15px;
  color: #333;
  margin: 0; /* Important: reset margin */
}

/* Total Price - Updated to be the primary price element when counting */
.total-price {
    font-size: 15px;
    font-weight: bold;
    color: #cc9333; /* Use golden color for total */
    margin: 0;
}


/* Rectangular “+” button (first add) */
.add-btn {
  margin-left: 30px;
  width: 100px; /* Wider rectangular look */
  height: 34px;
  border-radius: 10px;
  border: none;
  background: #c08b3e; /* Golden Brown */
  color: white;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.add-btn:active {
  transform: scale(0.95);
}

/* Counter container */
.counter {
  margin-left: 30px;
  width: 100px; /* Set a consistent width to fill the space where .add-btn was */
  height: 34px; /* Match the height of .add-btn */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Spread elements */
  background: #fcf4e8;
  border-radius: 10px; /* Match the border-radius of .add-btn */
  padding: 0 4px; /* Reduced padding */
}

/* Round counter + and - */
.counter-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #c08b3e;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.counter-btn:active {
  transform: scale(0.85);
}

/* Number */
.count {
  font-size: 15px;
  font-weight: bold;
  /* Reduced width as space is handled by justify-content */
  width: auto;
  text-align: center;
  color: #333; /* Default text color */
}
</style>
