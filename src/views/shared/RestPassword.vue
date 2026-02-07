<template>
  <div class="reset-page">
    <div class="reset-container">
      <!-- Logo -->
      <div class="logo-section">
        <img src="/images/sanckuplogoRmbg.png" alt="Logo" class="logo" />
        <h1 class="title">Reset Password</h1>
        <p class="subtitle">Enter your new password to secure your account</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="resetPassword" class="reset-form">
        <div class="form-group">
          <label for="new-password">New Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input
              id="new-password"
              type="password"
              v-model="password"
              placeholder="Enter your new password"
              required
              minlength="6"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <div class="input-wrapper">
            <i class="fas fa-check-circle"></i>
            <input
              id="confirm-password"
              type="password"
              v-model="confirm"
              placeholder="Confirm your new password"
              required
              minlength="6"
            />
          </div>
        </div>

        <!-- Messages -->
        <transition name="fade">
          <div v-if="error" class="message error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>
        </transition>

        <transition name="fade">
          <div v-if="success" class="message success-message">
            <i class="fas fa-check-circle"></i>
            {{ success }}
          </div>
        </transition>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">
            <i class="fas fa-key"></i>
            Reset Password
          </span>
          <span v-else>
            <i class="fas fa-spinner fa-spin"></i>
            Processing...
          </span>
        </button>

        <!-- Back to Login -->
        <router-link to="/login" class="back-link">
          <i class="fas fa-arrow-left"></i>
          Back to Login
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const token = route.query.token

const password = ref('')
const confirm = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const resetPassword = async () => {
  error.value = ''
  success.value = ''

  if (!password.value || !confirm.value) {
    error.value = 'All fields are required.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long.'
    return
  }

  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    const res = await axios.post('http://localhost:8088/auth/reset-password', {
      token: token,
      password: password.value
    })
    
    success.value = 'Password reset successfully!'
    error.value = ''
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Unable to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f6f1 0%, #fdfaf2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.reset-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23aa7a11' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.reset-container {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(170, 122, 17, 0.1);
  position: relative;
  z-index: 1;
}

/* Logo Section */
.logo-section {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  padding: 1rem 1rem 1.5rem;
  text-align: center;
  position: relative;
}

.logo-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 1.25rem;
  filter: brightness(0) invert(1);
  position: relative;
  z-index: 1;
  border: #f8f6f1 solid 2px;
  border-radius: 50%;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  position: relative;
  z-index: 1;
}

/* Form */
.reset-form {
  padding: 2.5rem 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  color: #aa7a11;
  font-size: 1rem;
  pointer-events: none;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid rgba(170, 122, 17, 0.15);
  border-radius: 12px;
  font-size: 0.95rem;
  color: #1f2937;
  background: #fdfaf2;
  transition: all 0.3s ease;
  outline: none;
}

.input-wrapper input::placeholder {
  color: #9ca3af;
  font-size: 0.9rem;
}

.input-wrapper input:focus {
  border-color: #aa7a11;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(170, 122, 17, 0.1);
}

.input-wrapper input:focus ~ i,
.input-wrapper:focus-within i {
  color: #d4a517;
}

/* Messages */
.message {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.error-message i {
  font-size: 1.1rem;
}

.success-message {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.success-message i {
  font-size: 1.1rem;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
  margin-bottom: 1.25rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(170, 122, 17, 0.35);
  background: linear-gradient(135deg, #8f6610 0%, #b8910f 100%);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(170, 122, 17, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn i {
  font-size: 1.1rem;
}

/* Back Link */
.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #aa7a11;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: rgba(170, 122, 17, 0.08);
  color: #d4a517;
}

.back-link i {
  font-size: 0.85rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .reset-page {
    padding: 1rem;
  }

  .logo-section {
    padding: 2.5rem 1.5rem 2rem;
  }

  .logo {
    width: 70px;
    height: 70px;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .reset-form {
    padding: 2rem 1.5rem;
  }

  .input-wrapper input {
    padding: 0.875rem 1rem 0.875rem 2.75rem;
  }

  .submit-btn {
    padding: 0.875rem 1.5rem;
  }
}

/* Animation d'apparition de la page */
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

.reset-container {
  animation: fadeInScale 0.4s ease;
}
</style>