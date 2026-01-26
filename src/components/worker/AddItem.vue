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
  preview: String
})

const emit = defineEmits([
  "update:name",
  "update:price",
  "update:rating",
  "update:category",
  "file-change",
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
</style>
