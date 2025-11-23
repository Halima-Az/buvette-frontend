import { ref } from "vue";

export const cartCount = ref(0);

export function setCartCountFromCart(cart) {
  // cart is [{itemId, quantity}]
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.value = total;
}
