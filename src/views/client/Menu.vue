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

    <!-- Worker Add Item Form -->
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

    <!-- Menu Items -->
    <div class="grid">
      <MenuItemCard 
        v-for="item in filteredItems" 
        :key="item.id" 
        :item="item" 
        :favorite="preferences.has(item.id)"
        :count="cartMap[item.id] || 0"
        @update-count="updateCart" 
        @add-preference="togglePreference" 
        @invalidate-item="setAvailableFalse"
        @validate-item="setAvailableTrue"
      />
    </div>

    <!-- Quick Order Floating Bar -->
<div
  v-if="hasQuickItems"
  class="quick-order-bar"
>
  <div class="quick-order-info">
    <span class="icon">🛒</span>
    <span>
      {{ Object.keys(quickOrder).length }} item(s) selected
    </span>
  </div>

  <button
    class="quick-buy-btn"
    @click="quickCheckout"
  >
    Checkout
  </button>
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
import AddItem from "@/components/worker/AddItem.vue";

const showForm = ref(false)
const toggleForm = () => { showForm.value = !showForm.value; if(!showForm.value) resetForm(); }
const closeForm = () => { showForm.value = false; resetForm(); }

const name = ref('')
const price = ref('')
const rating = ref('')
const category = ref('')
const imageFile = ref(null)
const preview = ref(null)
const cartItems = ref([]) // raw backend cart items

const resetForm = () => {
  name.value = ''
  price.value = ''
  rating.value = ''
  category.value = ''
  imageFile.value = null
  preview.value = null
}

const role = localStorage.getItem("role")
const isWorker = computed(() => role === "ROLE_WORKER")

// Favorites
const { preferences, loadFavorites, togglePreference } = useFavorites();
const search = ref("")
const items = ref([])
const { invalidate, validate } = useMenuAvailability()

// Quick order object
const quickOrder = ref({})

const filteredItems = computed(() => 
  items.value.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()))
)

const hasQuickItems = computed(() => Object.keys(quickOrder.value).length > 0)

// Fetch items & favorites on mount
onMounted(async () => {
  loadFavorites()
  try {
    const res = await axios.get("http://localhost:8088/api/menu");
    items.value = res.data;

    // fetch cart from backend
    const token = localStorage.getItem("token")
    if (token) {
      const cartRes = await axios.get(
        "http://localhost:8088/client/cart",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      cartItems.value = cartRes.data
    }

  } catch(err) {
    console.error("Failed to fetch menu items:", err);
  }
})

// Update cart & quickOrder
async function updateCart({ item, count }) {
  const token = localStorage.getItem("token")
  if (!token) return

  // 1️⃣ Update local quickOrder (absolute quantity)
  if (count > 0) {
    quickOrder.value[item.id] = count
  } else {
    delete quickOrder.value[item.id]
  }

  try {
    // 2️⃣ Get current cart from backend
    const cartRes = await axios.get(
      "http://localhost:8088/client/cart",
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const cart = cartRes.data // [{ itemId, quantity }]

    // 3️⃣ Compute new quantity for this item
    const existing = cart.find(c => c.itemId === item.id)
    const finalQty = count // take the UI count as the final quantity

    // 4️⃣ Update backend cart
    const updateRes = await axios.post(
      "http://localhost:8088/client/cart/update",
      { itemId: item.id, quantity: finalQty },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // 5️⃣ Sync frontend cart count
    setCartCountFromCart(updateRes.data)
  } catch (err) {
    console.error("Error updating cart:", err)
  }
}


// Quick checkout
async function quickCheckout() {
  const token = localStorage.getItem("token")
  if (!token) return

  // 1️⃣ Prepare items selected for checkout (with quantity)
  const selectedItems = Object.entries(quickOrder.value)
    .map(([itemId, quantity]) => ({ itemId, quantity }))
    .filter(item => item.quantity > 0)

  if (selectedItems.length === 0) return

  try {
    // 2️⃣ Get current cart items from backend
    const cartRes = await axios.get(
      "http://localhost:8088/client/cart",
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const cartItems = cartRes.data // [{ itemId, quantity }]

    // 3️⃣ Compute final cart quantities
    const finalCart = cartItems.map(cartItem => {
      const selected = selectedItems.find(sel => sel.itemId === cartItem.itemId)

      if (!selected) return cartItem // not selected → keep as is

      // Subtract the ordered quantity
      const remainingQty = cartItem.quantity - selected.quantity
      return remainingQty > 0
        ? { itemId: cartItem.itemId, quantity: remainingQty }
        : null // fully ordered → remove from cart
    }).filter(Boolean)

    // 4️⃣ Place order
    await axios.post(
      "http://localhost:8088/client/orders",
      { items: selectedItems },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // 5️⃣ Restore remaining items in cart
    for (const item of finalCart) {
      await axios.post(
        "http://localhost:8088/client/cart/update",
        { itemId: item.itemId, quantity: item.quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    }

    // 6️⃣ Update frontend state
    setCartCountFromCart(finalCart)
    quickOrder.value = {}

    alert("Order placed successfully!")
  } catch (err) {
    console.error("Quick checkout failed:", err)
    alert("Failed to place order")
  }
}



// Handle image for worker form
const handleImage = file => { imageFile.value = file; preview.value = URL.createObjectURL(file) }

// Add new item (worker)
const additem = async () => {
  if(!imageFile.value) return alert("Veuillez sélectionner une image")

  const formData = new FormData()
  formData.append("name", name.value)
  formData.append("price", price.value)
  formData.append("rating", rating.value)
  formData.append("itemCategory", category.value)
  formData.append("availability", true)
  formData.append("image", imageFile.value)

  try {
    const token = localStorage.getItem("token")
    await axios.post("http://localhost:8088/worker/addItem", formData, {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
    })

    const res = await axios.get("http://localhost:8088/api/menu")
    items.value = res.data
    showForm.value = false
    resetForm()
    alert("Article ajouté avec succès!")
  } catch(err) {
    console.error(err)
  }
}

// Menu availability (worker)
async function setAvailableFalse(item) { invalidate(item) }
async function setAvailableTrue(item) { validate(item) }

const cartMap = computed(() => {
  const map = {}
  cartItems.value.forEach(c => map[c.itemId] = c.quantity)
  return map
})


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
/* QUICK ORDER BAR */
.quick-order-bar {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  z-index: 999;
  min-width: 260px;
  animation: slideUp 0.3s ease;
}

.quick-order-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}

.quick-order-info .icon {
  font-size: 20px;
}

/* CHECKOUT BUTTON */
.quick-buy-btn {
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.quick-buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(46, 204, 113, 0.35);
}

.quick-buy-btn:active {
  transform: translateY(0);
}

/* ANIMATION */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* MOBILE */
@media (max-width: 768px) {
  .quick-order-bar {
    bottom: 80px;
    width: calc(100% - 30px);
  }
}

</style>