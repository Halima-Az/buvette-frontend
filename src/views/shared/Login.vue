<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <!-- Left Side - Form -->
        <div class="login-form-section">
          <Login 
            :changePasswordError="changePasswordError"
            :changePassworSucces="changePassworSucces"
            @forgot-password="handleForgotPassword"
          />
        </div>

        <!-- Right Side - Illustration -->
        <div class="login-illustration-section">
          <IllustrationPanel 
            subtitle="Welcome back! Order your favorite snacks and drinks in seconds and skip the queue on campus" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import IllustrationPanel from '@/components/client/IllustrationPanel.vue';
import Login from '@/components/shared/Login.vue';
import axios from "axios"
import { ref } from "vue"

const changePasswordError = ref("")
const changePassworSucces=ref("")
const handleForgotPassword = async (email) => {
    try {
        const res = await axios.post('http://localhost:8088/auth/forgot-password', {
            identifier: email
        })
        changePassworSucces.value= res.data?.success || "Reset password email sent successfully."
        changePasswordError.value="";
        

    } catch (err) {
        // Vérifier si le backend a renvoyé un message d'erreur
        if (err.response && err.response.status === 400 && err.response.data?.message) {
            changePasswordError.value = err.response.data.message
        } else {
            // Autre erreur inconnue
            changePasswordError.value = "Something went wrong. Try again."
        }
    }
}

</script>

<style scoped>

.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f6f1 0%, #fdfaf2 100%);
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden !important;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23aa7a11' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.login-container {
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
}

.login-content {
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

.login-form-section {
  padding: 3rem;
}

.login-illustration-section {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  position: relative;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 991px) {
  .login-content {
    grid-template-columns: 1fr;
  }

  .login-illustration-section {
    display: none;
  }

  .login-form-section {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }

  .login-form-section {
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

.login-content {
  animation: fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
