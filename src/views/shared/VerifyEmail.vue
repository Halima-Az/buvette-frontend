<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

const message = ref('')
const error = ref('')
const loading = ref(true)

onMounted(async () => {
    const token = route.query.token

    if (!token) {
        error.value = "Invalid verification link."
        loading.value = false
        return
    }

    try {
        await axios.get(`http://localhost:8088/auth/verify?token=${token}`)
        message.value = "Your email has been verified successfully!"
    } catch {
        error.value = "Invalid or expired verification link."
    } finally {
        loading.value = false
    }
})
</script>

<template>
  <div class="verify-container">
    <div class="verify-card">

      <!-- Loader -->
      <div v-if="loading" class="loader"></div>

      <!-- Success -->
      <div v-if="message && !loading" class="success-section">
        <div class="icon success-icon">✔</div>
        <h2>Email Verified</h2>
        <p>{{ message }}</p>
        <button @click="router.push('/login')" class="btn-primary">
          Go to Login
        </button>
      </div>

      <!-- Error -->
      <div v-if="error && !loading" class="error-section">
        <div class="icon error-icon">✖</div>
        <h2>Verification Failed</h2>
        <p>{{ error }}</p>
        <button @click="router.push('/')" class="btn-secondary">
          Back to Home
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.verify-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #288ea7, #4fc3dc);
  padding: 20px;
}

.verify-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  animation: fadeIn 0.4s ease-in-out;
}

.icon {
  font-size: 50px;
  margin-bottom: 15px;
}

.success-icon {
  color: #2ecc71;
}

.error-icon {
  color: #e74c3c;
}

h2 {
  margin-bottom: 10px;
  font-weight: 600;
}

p {
  margin-bottom: 20px;
  color: #555;
}

.btn-primary {
  background-color: #288ea7;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-primary:hover {
  background-color: #1f6f85;
}

.btn-secondary {
  background-color: #ddd;
  color: #333;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-secondary:hover {
  background-color: #ccc;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #288ea7;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  margin: auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>