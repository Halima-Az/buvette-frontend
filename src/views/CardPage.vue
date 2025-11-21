<template>
  <HeaderPageMenu/>
  <div class="cart-page">
    <h2 class="title">Your Cart</h2>

    <!-- EMPTY CART -->
    <div v-if="cartItems.length === 0" class="empty">
      <p>Your cart is empty 😢</p>
    </div>

    <!-- CART ITEMS -->
    <div class="cart-list">
      <div v-for="item in cartItems" :key="item.itemId" class="cart-item">
        <img :src="item.image" class="item-image" />

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
      <button class="checkout-btn">Checkout</button>
    </div>
  </div>
  <FooterPageMenu/>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import HeaderPageMenu from "@/components/HeaderPageMenu.vue";
import FooterPageMenu from "@/components/FooterPageMenu.vue";
import { setCartCountFromCart } from "@/store/cartStore";


const cartItems = ref([]);


// Load cart on mount
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 1️⃣ Get saved cart (itemId + quantity)
    const cartRes = await axios.get("http://localhost:8088/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawCart = cartRes.data;   // [{itemId, quantity}]

    setCartCountFromCart(rawCart);

    // 2️⃣ Get menu items to match names, images, price
    const menuRes = await axios.get("http://localhost:8088/api/menu");
    const menuItems = menuRes.data;

    // 3️⃣ Merge
    cartItems.value = rawCart.map(c => {
      const item = menuItems.find(m => m.id === c.itemId);
      return {
        itemId: c.itemId,
        quantity: c.quantity,
        name: item.name,
        price: item.price,
        image: item.image
      };
    });
  } catch (err) {
    console.error("Failed to load cart:", err);
  }
});

// Update item quantity (+ or -)
async function updateQuantity(item, newQty) {
  const token = localStorage.getItem("token");
  if (!token) return;

  if (newQty <= 0) {
    // Remove item locally
    cartItems.value = cartItems.value.filter(i => i.itemId !== item.itemId);
  } else {
    item.quantity = newQty;
  }

  try {
    const res = await axios.post(
      "http://localhost:8088/cart/update",
      { itemId: item.itemId, quantity: newQty },
      { headers: { Authorization: `Bearer ${token}` } }
    );


    // update badge count using backend updated cart
    setCartCountFromCart(res.data);

    localStorage.setItem("cart", JSON.stringify(res.data));
  } catch (err) {
    console.error("Error updating cart:", err);
  }
}

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
</script>

<style scoped>
.cart-page {
  padding: 20px;
  background: #f5f8f3;
  min-height: 100vh;
}

.title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  opacity: 0.7;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-item {
  display: flex;
  background: white;
  padding: 12px;
  border-radius: 14px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.item-image {
  width: 75px;
  height: 75px;
  border-radius: 10px;
  object-fit: cover;
}

.details {
  flex: 1;
  padding-left: 12px;
}

.name {
  font-weight: 600;
  margin: 0;
}

.price {
  font-size: 14px;
  color: #777;
  margin: 4px 0;
}

.counter {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 5px;
}

.counter button {
  width: 28px;
  height: 28px;
  background: #c08b3e;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.counter span {
  font-weight: bold;
}

.total {
  font-weight: bold;
  font-size: 16px;
  color: #cc9333;
}

.summary {
  margin-top: 20px;
  background: white;
  padding: 16px;
  border-radius: 14px;
  text-align: center;
  font-size: 18px;
}

.checkout-btn {
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  background: #c08b3e;
  border: none;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
