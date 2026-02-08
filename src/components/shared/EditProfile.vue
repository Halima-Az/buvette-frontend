<template>
  <form @submit.prevent="submit" class="profile-form">

        <!-- Close button -->
    <button
        type="button"
        class="close-btn"
        @click="close"
        aria-label="Close"
    >
        ×
    </button>


    <div class="form-group">
      <label for="email">UserName :</label>
      <div class="input-wrapper">
        <i class="fas fa-envelope"></i>
        <input
          type="text"
          id="username"
          v-model="localUser.username"
          placeholder="Enter your new username"
          required
        />
      </div>
    </div>

    <div class="form-group">
      <label for="dob">Date of Birth</label>
      <div class="input-wrapper">
        <i class="fas fa-calendar-alt"></i>
        <input
          type="date"
          id="dob"
          v-model="localUser.dob"
        />
      </div>
    </div>

    <button type="submit" class="submit-btn">
      <i class="fas fa-check-circle"></i>
      Update Profile
    </button>

  </form>
</template>


<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

// define emits
const emit = defineEmits(['save', 'cancel'])

const localUser = ref({ ...props.user })

watch(() => props.user, (u) => {
  localUser.value = { ...u }
})

const submit = () => {
  emit('save', {
    username: localUser.value.username,
    dob: localUser.value.dob
  })
}

// optional: local function to close
const close = () => emit('cancel')
</script>


<style scoped>
.profile-form {
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
  .profile-form {
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

.profile-form {
  animation: fadeIn 0.4s ease;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;

  width: 36px;
  height: 36px;
  border-radius: 50%;

  border: none;
  background: rgba(170, 122, 17, 0.1);
  color: #aa7a11;

  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.25s ease;
}

.close-btn:hover {
  background: rgba(170, 122, 17, 0.2);
  color: #8f6610;
  transform: rotate(90deg);
}

.close-btn:active {
  transform: scale(0.95) rotate(90deg);
}

</style>
