<template>
  <HeaderPageMenu title="CartPage" />

  <div class="cart-page">
    <h2 class="title">Your Cart</h2>

    <!-- EMPTY CART -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <i class="fa-solid fa-cart-shopping"></i>
      <p class="empty-title">Your cart is empty</p>
      <p class="empty-text">
        You haven’t added any items to your cart yet.
      </p>
    </div>

    <!-- CART ITEMS -->
    <div v-else class="cart-list">
      <!-- Select All -->
      <div class="select-all">
        <input type="checkbox" v-model="allSelected" /> Select All
      </div>

      <div v-for="item in cartItems" :key="item.itemId" class="cart-item">
        <input type="checkbox" v-model="item.selected" />
        <img :src="`http://localhost:8088/${item.image}`" class="item-image" />

        <div class="details">
          <p class="name">{{ item.name }}</p>
          <p class="price">${{ item.price.toFixed(2) }}</p>

          <!-- QUANTITY CONTROL -->
          <div class="counter">
            <button @click="updateQuantity(item, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item, item.quantity + 1)">+</button>
          </div>
        </div>

        <div class="total">
          ${{ (item.price * item.quantity).toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- FOOTER TOTAL -->
    <div v-if="cartItems.length > 0" class="summary">
      <p>Total: <strong>${{ totalPrice.toFixed(2) }}</strong></p>
      <button class="checkout-btn" @click="checkout">Checkout</button>
      <button class="clear-cart-btn" @click="showBoxConfirm = true">Clear Cart</button>
    </div>
  </div>
  <!-- LOGOUT CONFIRMATION -->
    <div v-if="showBoxConfirm" class="confirmation-overlay">
      <div class="confirmation-box">
        <p>Are you sure you want to Clear the cart?</p>

        <div class="actions">
          <button class="cancel" @click="showBoxConfirm = false">
            Cancel
          </button>
          <button class="confirm" @click="clearCart">
            Clear
          </button>
        </div>
      </div>
    </div>

  <FooterPageMenu />
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import router from "@/router";
import HeaderPageMenu from "@/components/client/HeaderPageMenu.vue";
import FooterPageMenu from "@/components/client/FooterPageMenu.vue";
import { setCartCountFromCart } from "@/store/cartStore";

const cartItems = ref([]);
const allSelected = ref(true);
const showBoxConfirm = ref(false);

// Watch allSelected to toggle individual item selection
watch(allSelected, val => {
  cartItems.value.forEach(item => item.selected = val);
});

// Update allSelected if individual items change
watch(
  () => cartItems.value.map(i => i.selected),
  (arr) => {
    allSelected.value = arr.every(Boolean);
  },
  { deep: true }
);

// Load cart on mount
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 1️⃣ Get saved cart (itemId + quantity)
    const cartRes = await axios.get("http://localhost:8088/client/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rawCart = cartRes.data; // [{itemId, quantity}]
    setCartCountFromCart(rawCart);

    // 2️⃣ Get menu items
    const menuRes = await axios.get("http://localhost:8088/api/menu");
    const menuItems = menuRes.data;

    // 3️⃣ Merge and add selected
    cartItems.value = rawCart.map(c => {
      const item = menuItems.find(m => m.id === c.itemId);
      return {
        itemId: c.itemId,
        quantity: c.quantity,
        name: item.name,
        price: item.price,
        image: item.image,
        selected: true
      };
    });
  } catch (err) {
    console.error("Failed to load cart:", err);
  }
});

// Update quantity (+ or -)
async function updateQuantity(item, newQty) {
  const token = localStorage.getItem("token");
  if (!token) return;

  if (newQty <= 0) {
    cartItems.value = cartItems.value.filter(i => i.itemId !== item.itemId);
  } else {
    item.quantity = newQty;
  }

  try {
    const res = await axios.post(
      "http://localhost:8088/client/cart/update",
      { itemId: item.itemId, quantity: newQty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCartCountFromCart(res.data);
    localStorage.setItem("cart", JSON.stringify(res.data));
  } catch (err) {
    console.error("Error updating cart:", err);
  }
}

// Total only for selected items
const totalPrice = computed(() =>
  cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Checkout selected items
async function checkout() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const selectedItems = cartItems.value
    .filter(item => item.selected)
    .map(item => ({ itemId: item.itemId, quantity: item.quantity }));

  if (selectedItems.length === 0) {
    alert("Please select at least one item to checkout.");
    return;
  }

  try {
    await axios.post(
      "http://localhost:8088/client/orders",
      { items: selectedItems },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Remove checked-out items from cart
    cartItems.value = cartItems.value.filter(item => !item.selected);
    setCartCountFromCart(cartItems.value.map(i => ({ itemId: i.itemId, quantity: i.quantity })));

    router.push("/home");
  } catch (err) {
    console.error("Checkout failed:", err);
    
  }
}

async function clearCart() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.post(
      "http://localhost:8088/client/cart/clear",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    cartItems.value = [];
    setCartCountFromCart([]);
    localStorage.removeItem("cart");
    showBoxConfirm.value = false


    console.log("Cart cleared successfully!");
  } catch (err) {
    console.error("Failed to clear cart:", err);
  }
}

</script>

<style scoped>
/* Keep your existing styles; add this for the Select All */
.select-all {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
}

.cart-page {
  padding: 10px 30px 180px;
  background: #f8f9fa;
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, sans-serif;
  color: #333;
  position: relative;
}

.cart-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(192, 139, 62, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #6e6565b9 0%, #9b8e8e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  animation: fadeInDown 0.6s ease;
  position: relative;
  z-index: 1;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  padding: 80px 20px;
  margin: 40px auto;

  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);

  max-width: 420px;
}

.empty-cart i {
  font-size: 48px;
  color: #9ca3af; /* gray */
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

.empty-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 20px;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: slideIn 0.5s ease backwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.cart-item:nth-child(1) {
  animation-delay: 0.1s;
}

.cart-item:nth-child(2) {
  animation-delay: 0.2s;
}

.cart-item:nth-child(3) {
  animation-delay: 0.3s;
}

.cart-item:nth-child(4) {
  animation-delay: 0.4s;
}

.cart-item:nth-child(5) {
  animation-delay: 0.5s;
}

.cart-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 1);
}

.item-image {
  width: 110px;
  height: 110px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
}

.cart-item:hover .item-image {
  transform: scale(1.05) rotate(-2deg);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
}

.details {
  flex: 1;
  padding-left: 0;
}

.name {
  font-weight: 700;
  margin: 0 0 8px 0;
  font-size: 19px;
  color: #1a1a2e;
  letter-spacing: -0.3px;
}

.price {
  font-size: 15px;
  color: #666;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.counter {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 10px;
}

.counter button {
  width: 36px;
  height: 36px;
  background: #ce971f;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 12px #ce971f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter button:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  background: #ce971f;
}

.counter button:active {
  transform: scale(1.05);
}

.counter span {
  font-weight: 800;
  font-size: 18px;
  color: #1a1a2e;
  min-width: 30px;
  text-align: center;
}

.total {
  font-weight: 800;
  font-size: 24px;
  background: #ce971f;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ✅ SUMMARY FIXÉ EN BAS */
.summary {
  position: fixed;
  bottom: 50px;
  right: 0;
  margin: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 25px 30px;
  border-radius: 10px;
  border-top: 2px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  z-index: 1000;
  animation: slideUp 0.6s ease 0.5s backwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.summary p {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
}

.summary strong {
  font-size: 28px;
  font-weight: 800;
  background: #ce971f;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.checkout-btn {
  flex-shrink: 0;
  min-width: 180px;
  padding: 16px 32px;
  background: #ce971f;
  border: none;
  color: white;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 25px #ce971f;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.checkout-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.checkout-btn:hover::before {
  width: 300px;
  height: 300px;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px #ce971f;
}

.checkout-btn:active {
  transform: translateY(0);
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .cart-page {
    padding: 30px 15px 160px;
  }

  .title {
    font-size: 32px;
    margin-bottom: 30px;
  }

  .cart-item {
    grid-template-columns: auto 1fr;
    gap: 15px;
    padding: 15px;
  }

  .item-image {
    width: 90px;
    height: 90px;
  }

  .name {
    font-size: 16px;
  }

  .price {
    font-size: 14px;
  }

  .counter button {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .counter span {
    font-size: 16px;
  }

  .total {
    grid-column: 2;
    text-align: right;
    font-size: 20px;
  }

  .summary {
    flex-direction: column;
    gap: 15px;
    padding: 10px 15px;
    align-items: stretch;
  }

  .summary p {
    font-size: 18px;
    text-align: center;
  }

  .summary strong {
    font-size: 18px;
  }

  .checkout-btn {
    width: 100%;
    min-width: unset;
    padding: 12px;
    font-size: 12px;
  }
}

/* ✅ Pour les très petits écrans */
@media (max-width: 480px) {
  .cart-page {
    padding: 20px 10px 160px;
  }

  .title {
    font-size: 28px;
  }

  .cart-item {
    padding: 12px;
  }

  .item-image {
    width: 70px;
    height: 70px;
  }
}
/* ✅ Smooth selection feedback */
.cart-item {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-color 0.25s ease,
    opacity 0.25s ease;
}

.cart-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #ce971f;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.15s ease;
}

.cart-item input[type="checkbox"]:hover {
  transform: scale(1.15);
}

/* Selected item highlight */
.cart-item:has(input[type="checkbox"]:checked) {
  background: rgba(255, 248, 230, 0.95);
  box-shadow: 0 12px 35px rgba(206, 151, 31, 0.25);
  border-color: rgba(206, 151, 31, 0.4);
}

/* Unselected items feel lighter */
.cart-item:has(input[type="checkbox"]:not(:checked)) {
  opacity: 0.75;
}

.cart-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.clear-cart-btn {
  background: #f87171; /* red */
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 25px #f87171;
  transition: all 0.3s ease;
}

.clear-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px #f87171;
}

.confirmation-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirmation-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 260px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.confirmation-box p {
  margin-bottom: 16px;
  font-weight: 500;
}

.confirmation-box .actions {
  display: flex;
  gap: 10px;
}

.confirmation-box button {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.confirmation-box .cancel {
  background: #eee;
}

.confirmation-box .confirm {
  background: #e74c3c;
  color: white;
}
</style>