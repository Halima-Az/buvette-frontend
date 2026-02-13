<template>
  <div class="register-form-container">
    <!-- Header -->
    <div class="form-header">
      <div class="logo-wrapper">
        <img src="/images/sanckuplogo.png" alt="Snack Up" class="logo" />
      </div>
      <h1 class="form-title">Create Account</h1>
      <p class="form-subtitle">Join SnackUp community today</p>
    </div>

    <!-- Role Switcher -->
    <div class="role-switcher-container">
      <div class="role-switcher">
        <input type="radio" id="roleClient" value="ROLE_CLIENT" v-model="user.role" hidden>
        <label for="roleClient" :class="{ active: user.role === 'ROLE_CLIENT' }" class="role-option">
          <i class="fas fa-user role-icon"></i>
          <span class="role-text">Client</span>
        </label>

        <input type="radio" id="roleWorker" value="ROLE_WORKER" v-model="user.role" hidden>
        <label for="roleWorker" :class="{ active: user.role === 'ROLE_WORKER' }" class="role-option">
          <i class="fas fa-user-tie role-icon"></i>
          <span class="role-text">Worker</span>
        </label>

        <div class="slider" :class="user.role === 'ROLE_WORKER' ? 'right' : 'left'"></div>
      </div>
      <p class="role-hint">
        <i class="fas fa-info-circle"></i>
        Register as {{ user.role === 'ROLE_WORKER' ? 'service provider' : 'student' }}
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="AddUser" class="register-form">
      <!-- Code Massar (Client only) -->
      <div v-if="user.role === 'ROLE_CLIENT'" class="form-group full-width">
        <label for="codeMassar">
          Code Massar
          <span class="required">*</span>
        </label>
        <div class="input-wrapper">
          <i class="fas fa-id-card"></i>
          <input id="codeMassar" type="text" class="form-input" v-model="user.codeMassar"
            placeholder="Enter your Code Massar" />
        </div>
        <div v-if="errors.codeMassar || localError.codeMassar" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errors.codeMassar || localError.codeMassar }}
        </div>
      </div>

      <!-- First Name & Last Name -->
      <div class="form-row">
        <div class="form-group">
          <label for="fname">
            First Name
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input id="fname" type="text" class="form-input" v-model="user.fname" placeholder="John" required />
          </div>
          <div v-if="errors.fname" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.fname }}
          </div>
        </div>

        <div class="form-group">
          <label for="lname">
            Last Name
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input id="lname" type="text" class="form-input" v-model="user.lname" placeholder="Doe" required />
          </div>
          <div v-if="errors.lname" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.lname }}
          </div>
        </div>
      </div>

      <!-- Username & Phone -->
      <div class="form-row">
        <div class="form-group">
          <label for="username">
            Username
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <i class="fas fa-at"></i>
            <input id="username" type="text" class="form-input" v-model="user.username" placeholder="johndoe"
              required />
          </div>
          <div v-if="errors.username" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.username }}
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <div class="input-wrapper">
            <i class="fas fa-phone"></i>
            <input id="phone" type="tel" class="form-input" v-model="user.phone" placeholder="+212 6XX XXX XXX" />
          </div>
        </div>
      </div>

      <!-- Email & Date of Birth -->
      <div class="form-row">
        <div class="form-group">
          <label for="email">
            Email Address
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input id="email" type="email" class="form-input" v-model="user.email" placeholder="john@example.com"
              required />
          </div>
          <div v-if="errors.email" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.email }}
          </div>
        </div>

        <div class="form-group">
          <label for="dob">Date of Birth</label>
          <div class="input-wrapper">
            <i class="fas fa-calendar-alt"></i>
            <input id="dob" type="date" class="form-input" v-model="user.dob" />
          </div>
        </div>
      </div>

      <!-- Password -->
      <div class="form-group full-width">
        <label for="password">
          Password
          <span class="required">*</span>
        </label>
        <div class="input-wrapper">
          <i class="fas fa-lock"></i>
          <input id="password" type="password" class="form-input" v-model="user.password" placeholder="••••••••"
            required minlength="6" />
        </div>
        <div v-if="errors.password" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errors.password }}
        </div>
        <span class="helper-text">Minimum 6 characters</span>
      </div>

      <!-- Terms & Conditions -->
      <div class="form-group full-width">
        <div class="checkbox-wrapper">
          <input type="checkbox" id="termsCheck" v-model="user.agreeTerms" class="custom-checkbox">
          <label for="termsCheck" class="checkbox-label">
            I agree to the <a href="#" class="terms-link">Terms & Conditions</a>
          </label>
        </div>
        <div v-if="localError.agreeTerms" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ localError.agreeTerms }}
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn">
        <i class="fas fa-user-plus"></i>
        Create Account as {{ user.role === 'ROLE_WORKER' ? 'Worker' : 'Client' }}
      </button>
    </form>
    <transition name="fade">
      <div v-if="sendSuccess" class="alert alert-success my-2">
        <i class="fas fa-check-circle"></i>
        <span>{{ sendSuccess }}</span>
      </div>
    </transition>

    <!-- Sign In Link -->
    <div class="form-footer">
      <p>Already have an account? <router-link to="/login" class="signin-link">Sign in</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue'

const emit = defineEmits(['submit'])

const user = ref({
  codeMassar: '',
  fname: '',
  lname: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  dob: '',
  agreeTerms: false,
  role: 'ROLE_CLIENT' // Default role
})

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({})
  },
  sendSuccess:String
})

const { errors } = toRefs(props)
const localError = ref({})

const AddUser = () => {
  localError.value = {}

  if (!user.value.agreeTerms) {
    localError.value.agreeTerms = "You must accept the terms & conditions."
    return
  }

  if (
    user.value.role === 'ROLE_CLIENT' &&
    !user.value.codeMassar
  ) {
    localError.value.codeMassar = "Code Massar is required for clients."
    return
  }

  emit('submit', user.value)
}

watch(
  () => user.value.role,
  (newRole) => {
    if (newRole === 'ROLE_WORKER') {
      user.value.codeMassar = ''
    }
  }
)

</script>
<style scoped>
.register-form-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* Header */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  margin-bottom: 1rem;
}

.logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: #aa7a11 3px solid;
  object-fit: contain;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 0.975rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Role Switcher */
.role-switcher-container {
  margin-bottom: 2rem;
}

.role-switcher {
  display: flex;
  position: relative;
  background: #fdfaf2;
  border-radius: 14px;
  padding: 5px;
  border: 2px solid rgba(170, 122, 17, 0.15);
  margin-bottom: 0.75rem;
}

.role-option {
  flex: 1;
  text-align: center;
  padding: 0.875rem;
  border-radius: 10px;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.role-option:hover {
  color: #aa7a11;
}

.role-option.active {
  color: #1f2937;
  font-weight: 700;
}

.role-icon {
  font-size: 1.25rem;
}

.role-text {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider {
  position: absolute;
  top: 5px;
  left: 5px;
  width: calc(50% - 10px);
  height: calc(100% - 10px);
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.2);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  z-index: 1;
  border: 2px solid rgba(170, 122, 17, 0.1);
}

.slider.left {
  transform: translateX(0);
}

.slider.right {
  transform: translateX(100%);
}

.role-hint {
  text-align: center;
  color: #aa7a11;
  font-size: 0.85rem;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.role-hint i {
  font-size: 0.875rem;
}

/* Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  margin-left: 0.25rem;
}

.required {
  color: #ef4444;
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
  font-size: 0.975rem;
  pointer-events: none;
  z-index: 1;
  transition: all 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 3rem;
  border: 2px solid rgba(170, 122, 17, 0.15);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #1f2937;
  background: #fdfaf2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  font-weight: 500;
}

.form-input::placeholder {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 400;
}

.form-input:focus {
  border-color: #aa7a11;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(170, 122, 17, 0.08);
  transform: translateY(-1px);
}

.form-input:focus~i,
.input-wrapper:focus-within i {
  color: #d4a517;
  transform: scale(1.05);
}

.helper-text {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
  font-weight: 500;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-size: 0.825rem;
  font-weight: 600;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
}

.error-message i {
  font-size: 0.875rem;
}

/* Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(170, 122, 17, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background: #fdfaf2;
  position: relative;
}

.custom-checkbox:checked {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  border-color: #aa7a11;
}

.custom-checkbox:checked::after {
  content: '\f00c';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  margin: 0;
}

.terms-link {
  color: #aa7a11;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
}

.terms-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.terms-link:hover {
  color: #d4a517;
}

.terms-link:hover::after {
  transform: scaleX(1);
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
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.3);
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(170, 122, 17, 0.4);
  background: linear-gradient(135deg, #8f6610 0%, #b8910f 100%);
}

.submit-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.35);
}

.submit-btn i {
  font-size: 1.1rem;
}

/* Form Footer */
.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f3f4f6;
}

.form-footer p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

.signin-link {
  color: #aa7a11;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
}

.signin-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.signin-link:hover {
  color: #d4a517;
}

.signin-link:hover::after {
  transform: scaleX(1);
}

/* Responsive */
@media (max-width: 768px) {
  .form-title {
    font-size: 1.65rem;
  }

  .form-subtitle {
    font-size: 0.9rem;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .form-input {
    padding: 0.8rem 0.8rem 0.8rem 2.75rem;
  }

  .role-option {
    padding: 0.75rem;
  }

  .role-icon {
    font-size: 1.1rem;
  }

  .role-text {
    font-size: 0.8rem;
  }
}

/* Animations */
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

.register-form-container {
  animation: fadeIn 0.4s ease;
}
</style>