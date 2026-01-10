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
        <p class="total-price" v-else>${{ (item.price * count).toFixed(2) }}</p>
      </div>

      <button v-if="count === 0" class="add-btn" @click.stop="increase">+</button>

      <div v-else class="counter">
        <button class="counter-btn" @click.stop="decrease">−</button>
        <span class="count">{{ count }}</span>
        <button class="counter-btn" @click.stop="increase">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  item: Object,
  favorite: Boolean
});
const count = ref(0);
const isFav = ref(props.favorite);
const emit = defineEmits(["update-count", "add-preference"]);
watch(() => props.favorite, (newVal) => {
  isFav.value = newVal;
});

function togglePreference() {
  isFav.value = !isFav.value;
  emit("add-preference", props.item);
}




function increase() {
  count.value++;
   emit("update-count", { item: props.item, count: count.value });
}

function decrease() {
   if (count.value > 0) {
    count.value--;
   emit("update-count", { item: props.item, count: count.value });}
}
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: 0.25s ease;
  display: flex;
  flex-direction: column;

}
.card:hover { transform: translateY(-3px); box-shadow: 0 4px 14px rgba(0,0,0,0.14); }

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.14);
}

.img-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  height: 130px;
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

.rating {
  position: absolute; top: 10px; left: 10px; background: #cc9333;
  padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; color: white;
}

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
  height: 40px;       /* consistent name block */
  overflow: hidden;
}
.heart-btn.active { background: #ffe0e0; box-shadow: 0 0 8px rgba(255,0,0,0.25); transform: scale(1.12); }

/* Price + buttons row */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.row { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }

.price-info { display: flex; flex-direction: column; justify-content: center; }
.price, .total-price { font-weight: bold; font-size: 15px; margin: 0; }
.total-price { color: #cc9333; }

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
.add-btn:active { transform: scale(0.95); }

.counter {
  margin-left: 30px; width: 100px; height: 34px; display: flex; align-items: center;
  justify-content: space-between; background: #fcf4e8; border-radius: 10px; padding: 0 4px;
}
.counter-btn { width: 26px; height: 26px; border-radius: 50%; border: none;
  background: #c08b3e; color: white; font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: transform 0.15s;
}
.counter-btn:active { transform: scale(0.85); }

.count { font-size: 15px; font-weight: bold; width: auto; text-align: center; color: #333; }
</style>
