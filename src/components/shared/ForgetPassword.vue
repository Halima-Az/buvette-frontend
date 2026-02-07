<template>
  <button @click="forgetPass" type="button" class="forgot-btn">
    <i class="fas fa-question-circle"></i>
    Forgot password?
  </button>

  <transition name="modal-fade">
    <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-lock-open"></i>
            Reset Password
          </h3>
          <button type="button" class="close-btn" @click="showModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="submitEmail" class="modal-form">
          <p class="modal-description">
            Enter your email address to reset your password.
          </p>
          
          <div class="form-group">
            <label for="reset-email">Email Address</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                id="reset-email"
                type="email"
                placeholder="your.email@example.com"
                v-model="selectedemail"
                required
              />
            </div>
            <p class="text-danger">{{ ChangePasswordError }}</p>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showModal = false">
              Cancel
            </button>
            <button type="submit" class="btn-confirm">
              <i class="fas fa-paper-plane"></i>
               Reset 
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const selectedemail = ref('')
const emit = defineEmits(['selectEmail'])

const forgetPass = () => {
  showModal.value = true
}

const submitEmail = () => {
  emit('selectEmail', selectedemail.value)

}
defineProps({
  ChangePasswordError:String
})
</script>

<style scoped>
/* Bouton Forgot Password */
.forgot-btn {
  background: transparent;
  border: none;
  color: #aa7a11;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.forgot-btn:hover {
  color: #d4a517;
  background: rgba(170, 122, 17, 0.08);
}

.forgot-btn i {
  font-size: 0.9rem;
}

/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

/* Modal Content */
.modal-content {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(170, 122, 17, 0.1);
}

/* Modal Header */
.modal-header {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  padding: 1.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  position: relative;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.modal-header h3 i {
  font-size: 1.5rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-btn i {
  font-size: 1.1rem;
}

/* Modal Form */
.modal-form {
  padding: 2rem;
}

.modal-description {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.75rem 0;
  text-align: center;
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
  border-radius: 10px;
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

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.btn-cancel {
  background: #ffffff;
  color: #1f2937;
  border: 2px solid rgba(170, 122, 17, 0.15);
}

.btn-cancel:hover {
  border-color: #aa7a11;
  color: #aa7a11;
  background: #fdfaf2;
  transform: translateY(-2px);
}

.btn-confirm {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(170, 122, 17, 0.35);
  background: linear-gradient(135deg, #8f6610 0%, #b8910f 100%);
}

.btn-confirm:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(170, 122, 17, 0.3);
}

.btn-confirm i {
  font-size: 1rem;
}

/* Transitions */
.modal-fade-enter-active {
  transition: all 0.3s ease;
}

.modal-fade-leave-active {
  transition: all 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content {
  transform: scale(0.9) translateY(-30px);
}

.modal-fade-leave-to .modal-content {
  transform: scale(0.95) translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
  }

  .modal-header {
    padding: 1.5rem 1.5rem;
  }

  .modal-header h3 {
    font-size: 1.15rem;
  }

  .modal-form {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}

/* Animation d'apparition */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  animation: slideIn 0.3s ease;
}
</style>