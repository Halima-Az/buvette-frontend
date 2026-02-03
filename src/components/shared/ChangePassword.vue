<template>
  <form @submit.prevent="submit" class="password-form">
    <div class="form-group">
      <label for="oldPassword">Current Password</label>
      <div class="input-wrapper">
        <i class="fas fa-lock"></i>
        <input 
          type="password" 
          id="oldPassword"
          v-model="oldPassword" 
          placeholder="Enter your current password" 
          required
        />
      </div>
    </div>

    <div class="form-group">
      <label for="newPassword">New Password</label>
      <div class="input-wrapper">
        <i class="fas fa-key"></i>
        <input 
          type="password" 
          id="newPassword"
          v-model="newPassword" 
          placeholder="Enter your new password" 
          required
        />
      </div>
    </div>

    <button type="submit" class="submit-btn">
      <i class="fas fa-check-circle"></i>
      Update Password
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
const emit= defineEmits(['changePass'])
const oldPassword=ref('')
const newPassword =ref('')
function submit(){
    emit('changePass',{
    oldPassword:oldPassword.value,
    newPassword:newPassword.value}

    )
}
</script>

<style scoped>
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(170, 122, 17, 0.12);
  border: 1px solid rgba(170, 122, 17, 0.08);
  max-width: 500px;
 


}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
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
  padding: 0.875rem 1rem 0.875rem 3rem;
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

.input-wrapper input:focus + i,
.input-wrapper:focus-within i {
  color: #d4a517;
}

.submit-btn {
  margin-top: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(170, 122, 17, 0.35);
  background: linear-gradient(135deg, #8f6610 0%, #b8910f 100%);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(170, 122, 17, 0.3);
}

.submit-btn i {
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .password-form {
    padding: 1.5rem;
  }

  .input-wrapper input {
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    font-size: 0.9rem;
  }

  .submit-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.password-form {
  animation: fadeIn 0.4s ease;
}
</style>