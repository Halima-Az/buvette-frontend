<template>
  <header class="header-page">
    <img src="/img/SnackUpLogo.png" alt="logo" class="logo" @click="$router.push('/home')" />

    <h1 class="page-title">{{ title }}</h1>
    <!-- 🔔 NOTIFICATION ICON -->
    <NotificationBell />
    
    <!-- CART BUTTON WITH BADGE -->
    <div class="cart-wrapper" @click="$router.push('/cart')">
      <button class="card-btn">
        🛒
      </button>

      <!-- BADGE -->
      <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
    </div>
    
    

    <button @click="logoutFct" class="card-btn">
      <i class="fa-solid fa-arrow-right-from-bracket"></i>  
    </button>
  </header>
</template>

<script setup>
import { cartCount } from "@/store/cartStore"
import { logout } from "@/stores/auth"
import { useRouter } from "vue-router"
import NotificationBell from "@/components/client/NotificationBell.vue"

const router = useRouter()

defineProps({
  title: { type: String, default: "Home Page" }
})

function logoutFct() {
  const confirmed = window.confirm("Are you sure you want to logout?")
  if (!confirmed) return
  logout()
  router.push("/login")
}
</script>


<style scoped>
.header-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #FFF8EC;
  /* warm cream */
  box-shadow: 0 2px 6px rgba(138, 86, 35, 0.10);
  margin: 0;
}

.logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 50%;
  border: #ce971f 2px solid;
}

.logo:hover {
  cursor: pointer;
}

.page-title {
  flex-grow: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #A9682A;
  margin: 0 12px;
}

/* Wrapper to position badge */
.cart-wrapper {
  position: relative;
}

.card-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #FFE6C2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  font-size: 20px;
  color: #A9682A;
  margin: 0 5px
}

.card-btn:hover {
  background: #E7A73C;
  color: white;
  transform: scale(1.05);
}

/* BADGE STYLE */
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4d4f;
  color: white;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
</style>
