<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-content">
        <!-- Left Side - Illustration -->
        <div class="register-illustration-section">
          <IllustrationPanel
            subtitle="Join SnackUp today and enjoy fast ordering, favorites and exclusive campus deals" />
        </div>

        <!-- Right Side - Form -->
        <div class="register-form-section">
          <Register :errors="errors" @submit="handleRegister" :sendSuccess="sendSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Register from '@/components/shared/Register.vue';
import IllustrationPanel from '@/components/client/IllustrationPanel.vue';
import axios from 'axios';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const errors = ref({})
const sendSuccess = ref('')
const handleRegister = async (data) => {
  errors.value = {}
  sendSuccess.value = ""

  try {
    let url = ""

    if (data.role === "ROLE_CLIENT") {
      url = "http://localhost:8088/auth/registerAsClient"
    } else if (data.role === "ROLE_WORKER") {
      url = "http://localhost:8088/auth/registerAsWorker"
    } else {
      throw new Error("Invalid role selected")
    }

    await axios.post(url, data)

    sendSuccess.value =
      data.role === "ROLE_CLIENT"
        ? "Account created successfully. Please check your email to verify your account."
        : "Request created successfully. Please check your email. You will receive a response soon."

  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 409) {
      errors.value = err.response.data
    } else {
      errors.value = {
        general: "Something went wrong. Please try again later."
      }
    }
  }
}
</script>
<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f6f1 0%, #fdfaf2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23aa7a11' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.register-container {
  width: 100%;
  max-width: 1300px;
  position: relative;
  z-index: 1;
}

.register-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(170, 122, 17, 0.06);
  border: 1px solid rgba(170, 122, 17, 0.08);
}

.register-illustration-section {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  position: relative;
  overflow: hidden;
}

.register-form-section {
  padding: 3rem;
  max-height: 160vh;
  overflow-y: auto;
}

/* Custom Scrollbar */
.register-form-section::-webkit-scrollbar {
  width: 8px;
}

.register-form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.register-form-section::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  border-radius: 10px;
}

.register-form-section::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #8f6610 0%, #b8910f 100%);
}

/* Responsive */
@media (max-width: 991px) {
  .register-content {
    grid-template-columns: 1fr;
  }

  .register-illustration-section {
    display: none;
  }

  .register-form-section {
    padding: 2.5rem 2rem;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .register-page {
    padding: 1rem;
  }

  .register-form-section {
    padding: 2rem 1.5rem;
  }
}

/* Animation */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.register-content {
  animation: fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
