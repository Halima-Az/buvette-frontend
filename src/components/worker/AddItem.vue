<template>
  <div class="add-item-form">
    <h2>Add New Item</h2>

    <form @submit.prevent="emit('submit')">
      <div class="form-group">
        <label>Item Name</label>
        <input v-model="nameModel" type="text" required />
      </div>

      <div class="form-group">
        <label>Price (DH)</label>
        <input v-model="priceModel" type="number" step="0.01" required />
      </div>

      <div class="form-group">
        <label>Rating</label>
        <input v-model="ratingModel" type="number" min="0" max="5" step="0.1" />
      </div>

      <div class="form-group">
        <label>Category</label>
        <select v-model="categoryModel" required>
          <option disabled value="">Select category</option>
          <option value="SNACK">Snacks</option>
          <option value="DRINK">Drinks</option>
          <option value="SANDWICH">Sandwiches</option>
          <option value="PIZZA">Pizza</option>
        </select>
      </div>

      <div class="form-group">
        <label>Available</label>
        <div class="toggle-wrapper">
          <input type="checkbox" id="available" v-model="availableModel" />
          <label for="available" class="toggle-slider"></label>
        </div>
      </div>


      <div class="form-group">
        <label>Image</label>
        <input type="file" accept="image/*" @change="onFileChange" />
      </div>

      <div v-if="preview" class="image-preview">
        <img :src="preview" />
      </div>

      <button type="submit">Add Item</button>
    </form>
  </div>
</template>


<script setup>
import { computed } from "vue"

const props = defineProps({
  name: String,
  price: Number,
  rating: Number,
  category: String,
  preview: String,
  available: Boolean
})

const emit = defineEmits([
  "update:name",
  "update:price",
  "update:rating",
  "update:category",
  "file-change",
  "update:available",
  "submit"
])

const nameModel = computed({
  get: () => props.name,
  set: v => emit("update:name", v)
})

const priceModel = computed({
  get: () => props.price,
  set: v => emit("update:price", Number(v))
})

const ratingModel = computed({
  get: () => props.rating,
  set: v => emit("update:rating", Number(v))
})

const categoryModel = computed({
  get: () => props.category,
  set: v => emit("update:category", v)
})

const onFileChange = (e) => {
  emit("file-change", e.target.files[0])
}

const availableModel = computed({
  get: () => props.available,
  set: v => emit("update:available", v)
})

</script>


<style scoped>
.add-item-form {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 6px;
    font-weight: 600;
}

.form-group input,
.form-group select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
}

button {
    padding: 10px 16px;
    background: linear-gradient(180deg, #c08b3e 0%, #d6a050 100%);;
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    background: linear-gradient(180deg, #af803a 0%, #be8e46 100%);;
}

.image-preview img {
    max-width: 100%;
    margin-top: 10px;
    border-radius: 8px;
}

.toggle-wrapper {
  position: relative;
  width: 60px;
  height: 30px;
}

.toggle-wrapper input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: 0.3s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.toggle-slider::before {
  content: "";
  position: absolute;
  height: 22px;
  width: 22px;
  left: 6px;
  top:1px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(180deg, #c08b3e 0%, #d6a050 100%);
}

input:checked + .toggle-slider::before {
  transform: translateX(32px);
}
</style>