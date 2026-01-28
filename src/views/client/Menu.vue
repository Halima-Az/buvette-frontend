<template>
  <div class="page">
    <!-- TOP BAR -->
    <HeaderPage />

    <!-- SEARCH BAR -->
    <div class="row ">
      <div class="col-md-9">
        <SearchBar v-model="search" placeholder="search food..." />
      </div>

      <!-- GRID -->
      <div class="col-md-3">
        <div class="divaddCar">
          <button class="addCar" v-if="isWorker" @click="toggleForm">
            <i class="fas fa-plus"></i>
            {{ showForm ? 'Annuler' : 'Add Item' }}
          </button>
        </div>
      </div>
    </div>

    
    <transition name="slide-fade">
      <div v-if="showForm && isWorker" class="form-overlay" @click.self="closeForm">
        <div class="form-container">
          <div class="form-header">
            <h2>
              <i class="fas fa-utensils"></i>
              Add new Item
            </h2>
            <button @click="closeForm" class="close-form-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="form-content">
            <AddItem 
              v-model:name="name" 
              v-model:price="price" 
              v-model:rating="rating" 
              v-model:category="category"
              v-model:available="available"
              :preview="preview" 
              @file-change="handleImage" 
              @submit="additem" 
            />
          </div>
        </div>
      </div>
    </transition>

    <div class="grid">
      <MenuItemCard v-for="item in filteredItems" :key="item.id" :item="item" :favorite="preferences.has(item.id)"
        @update-count="updateCart" 
        @add-preference="togglePreference" 
        @invalidate-item="setAvailableFalse"
        @validate-item="setAvailableTrue"
      />
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
import { useMenuAvailability } from "@/composables/worker/useMenuAvailability";
import { useRouter } from "vue-router";
import AddItem from "@/components/worker/AddItem.vue";

const router = useRouter()
const showForm = ref(false)

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm()
  }
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

const name = ref('')
const price = ref('')
const rating = ref('')
const category = ref('')
const imageFile = ref(null)
const preview = ref(null)

const resetForm = () => {
  name.value = ''
  price.value = ''
  rating.value = ''
  category.value = ''
  imageFile.value = null
  preview.value = null
}

const role = localStorage.getItem("role")
const isWorker = computed(() => role == "ROLE_WORKER")

// Favorite / preference tracking
const { preferences, loadFavorites, togglePreference } = useFavorites();

// Search input
const search = ref("");

// Items fetched from backend
const items = ref([]);

//items state
const { invalidate, validate } = useMenuAvailability();

// Fetch items on component mount
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8088/api/menu");
    items.value = res.data;
  } catch (err) {
    console.error("Failed to fetch menu items:", err);
  }
});

// Filter items based on search input
const filteredItems = computed(() =>
  items.value.filter(i =>
    i.name.toLowerCase().includes(search.value.toLowerCase() && i.available)
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
    const cartRes = await axios.get("http://localhost:8088/client/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cart = cartRes.data;
    const existing = cart.find(c => c.itemId === item.id);
    const finalQty = existing ? existing.quantity + count : count;

    const updateRes = await axios.post(
      "http://localhost:8088/client/cart/update",
      { itemId: item.id, quantity: finalQty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCartCountFromCart(updateRes.data);
  } catch (err) {
    console.error("Error updating cart:", err);
  }
}

const handleImage = (file) => {
  imageFile.value = file
  preview.value = URL.createObjectURL(file)
}

const additem = async () => {
  if (!imageFile.value) {
    alert('Veuillez sélectionner une image')
    return
  }

  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('price', price.value)
  formData.append('rating', rating.value)
  formData.append('itemCategory', category.value)
  formData.append('available', available.value)
  formData.append('image', imageFile.value)

  try {
    const token = localStorage.getItem('token')
    await axios.post('http://localhost:8088/worker/addItem', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
    
    // Refresh items list
    const res = await axios.get("http://localhost:8088/api/menu");
    items.value = res.data;
    
    // Close form and reset
    showForm.value = false
    resetForm()
    
    // Success notification (optional)
    alert('Article ajouté avec succès!')
  } catch (err) {
    console.error(err)
  }
}

async function setAvailableFalse(item) {
  invalidate(item);
}

async function setAvailableTrue(item) {
  validate(item);
}

</script>

<style scoped>
/* BOUTON ADD */
.addCar {
  padding: 12px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d6a050 0%, #c08b3e 100%);
  color: white;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(214, 160, 80, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.addCar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(214, 160, 80, 0.4);
  background: linear-gradient(135deg, #c08b3e 0%, #d6a050 100%);
}

.addCar:active {
  transform: translateY(0);
}

.addCar i {
  font-size: 14px;
}

.divaddCar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
}

/* OVERLAY FORMULAIRE */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

/* CONTAINER FORMULAIRE */
.form-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* HEADER FORMULAIRE */
.form-header {
  background: linear-gradient(135deg, #d6a050 0%, #c08b3e 100%);
  color: white;
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(214, 160, 80, 0.2);
}

.form-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-header i {
  font-size: 24px;
}

.close-form-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 18px;
}

.close-form-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* CONTENU FORMULAIRE */
.form-content {
  padding: 30px;
  max-height: calc(90vh - 92px);
  overflow-y: auto;
}

/* Custom Scrollbar */
.form-content::-webkit-scrollbar {
  width: 8px;
}

.form-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.form-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d6a050 0%, #c08b3e 100%);
  border-radius: 4px;
}

.form-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #c08b3e 0%, #d6a050 100%);
}

/* TRANSITIONS */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
}

.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-from .form-container {
  transform: translateY(50px) scale(0.95);
}

.slide-fade-leave-to .form-container {
  transform: translateY(30px) scale(0.98);
}

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

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-container {
    max-width: 95%;
    margin: 10px;
  }

  .form-header {
    padding: 20px;
  }

  .form-header h2 {
    font-size: 18px;
  }

  .form-content {
    padding: 20px;
  }

  .addCar {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>