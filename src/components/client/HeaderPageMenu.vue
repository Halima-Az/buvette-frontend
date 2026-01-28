<template>
  <header class="header-page">
    <!-- LOGO -->
    <img
      :src="`http://localhost:8088/img/sanckuplogo.png`"
      alt="logo"
      class="logo"
      @click="$router.push('/home')"
    />

    <!-- TITLE -->
    <h1 class="page-title">{{ title }}</h1>

    <!-- NOTIFICATIONS -->
    <NotificationBell v-if="isClient" />

    <!-- CART -->
    <div
      class="cart-wrapper"
      v-if="isClient"
      @click="$router.push('/cart')"
    >
      <button class="card-btn">🛒</button>
      <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
    </div>

    <!-- LOGOUT -->
    <button class="card-btn" @click="showLogoutConfirm = true">
      <i class="fa-solid fa-arrow-right-from-bracket"></i>
    </button>

    <!-- LOGOUT CONFIRMATION -->
    <div v-if="showLogoutConfirm" class="logout-overlay">
      <div class="logout-box">
        <p>Are you sure you want to logout?</p>

        <div class="actions">
          <button class="cancel" @click="showLogoutConfirm = false">
            Cancel
          </button>
          <button class="confirm" @click="confirmLogout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { cartCount } from "@/store/cartStore"
import { logout } from "@/stores/auth"
import NotificationBell from "@/components/client/NotificationBell.vue"

defineProps({
  title: { type: String, default: "Home Page" }
})

const router = useRouter()
const showLogoutConfirm = ref(false)

// ⚠️ Still not reactive by design — acceptable for now
const role = localStorage.getItem("role")
const isClient = computed(() => role === "ROLE_CLIENT")

function confirmLogout() {
  logout() // must remove token + role
  showLogoutConfirm.value = false
  router.push("/login")
}
</script>

<style scoped>
.header-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #fff8ec;
  box-shadow: 0 2px 6px rgba(138, 86, 35, 0.1);
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: #ce971f 2px solid;
  cursor: pointer;
}

.page-title {
  flex-grow: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #a9682a;
}

.cart-wrapper {
  position: relative;
}

.card-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #ffe6c2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: #a9682a;
  margin: 0 5px;
  transition: background 0.2s, transform 0.2s;
}

.card-btn:hover {
  background: #e7a73c;
  color: white;
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4d4f;
  color: white;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* LOGOUT CONFIRM */
.logout-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.logout-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 260px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.logout-box p {
  margin-bottom: 16px;
  font-weight: 500;
}

.logout-box .actions {
  display: flex;
  gap: 10px;
}

.logout-box button {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.logout-box .cancel {
  background: #eee;
}

.logout-box .confirm {
  background: #e74c3c;
  color: white;
}
</style>
