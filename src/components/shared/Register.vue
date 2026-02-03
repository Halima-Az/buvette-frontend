<template>
  <div class="formContent">
    <!-- Header avec logo et titre -->
    <div class="header text-center">
      <img class="logo" src="/images/sanckuplogo.png" alt="Snack Up">
      <p class="signup">Sign up</p>
      
      <!-- Role Switcher -->
      <div class="role-switcher-container">
        <div class="role-switcher">
          <input 
            type="radio" 
            id="roleClient" 
            value="ROLE_CLIENT" 
            v-model="user.role" 
            hidden
          >
          <label 
            for="roleClient" 
            :class="{ active: user.role === 'ROLE_CLIENT' }"
            class="role-option"
          >
            <span class="role-icon">👤</span>
            <span class="role-text">Client</span>
          </label>
          
          <input 
            type="radio" 
            id="roleWorker" 
            value="ROLE_WORKER" 
            v-model="user.role" 
            hidden
          >
          <label 
            for="roleWorker" 
            :class="{ active: user.role === 'ROLE_WORKER' }"
            class="role-option"
          >
            <span class="role-icon">👷</span>
            <span class="role-text">Worker</span>
          </label>
          
          <div class="slider" :class="user.role === 'ROLE_WORKER' ? 'right' : 'left'"></div>
        </div>
        <div class="role-hint">
          <small>Register as a {{ user.role === 'ROLE_WORKER' ? 'Service provider' : 'Client' }}</small>
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="AddUser">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">First Name</label>
          <input type="text" class="form-control" v-model="user.fname">
          <div v-if="errors.fname" class="text-danger">{{ errors.fname }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Last Name</label>
          <input type="text" class="form-control" v-model="user.lname">
          <div v-if="errors.lname" class="text-danger">{{ errors.lname }}</div>
        </div>

        <div class="col-md-4">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model="user.username">
          <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
        </div>

        <div class="col-md-4">
          <label class="form-label">Phone</label>
          <input type="text" class="form-control" v-model="user.phone">
        </div>

        <div class="col-md-3">
          <label class="form-label">Date of Birth</label>
          <input type="date" class="form-control" v-model="user.dob">
        </div>

        <div class="col-6">
          <label class="form-label">Email address</label>
          <input type="email" class="form-control" v-model="user.email">
          <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
        </div>

        <div class="col-6">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" v-model="user.password">
          <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
        </div>  
      </div>

      <div class="my-3 form-check">
        <input type="checkbox" class="form-check-input" id="termsCheck" v-model="user.agreeTerms">
        <label class="form-check-label" for="termsCheck">I agree to terms & conditions</label>
        <div v-if="localError.agreeTerms" class="text-danger">{{ localError.agreeTerms }}</div>
      </div>

      <button type="submit" class="btn w-100">Sign up as {{ user.role === 'ROLE_WORKER' ? 'Worker' : 'Client' }}</button>

      <p class="text-center mt-3">
        Already have an account? <a href="/login" class="link">Sign in</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'

const emit = defineEmits(['submit'])

const user = ref({
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
  }
})

const { errors } = toRefs(props)
const localError = ref({})

const AddUser = () => {
 
  
  if (!user.value.agreeTerms) {
    localError.value.agreeTerms = "You must accept the terms & conditions."
    return
  }
  
  emit('submit', user.value)
}
</script>

<style>
/* Form container */
.formContent {
  max-width: 500px;
  background: #fff;
  border-radius: 20px;
  border: 2px solid #ce971f; /* couleur SnackUp */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* Header */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header .logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ce971f;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  object-fit: cover;
}

.header .signup {
  color: #ce971f;
  font-weight: 700;
  font-size: 20px;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Role Switcher Styles */
.role-switcher-container {
  margin: 15px 0 5px;
  width: 90%;
}

.role-switcher {
  display: flex;
  position: relative;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid #e0e0e0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 5px;
}

.role-option {
  flex: 1;
  text-align: center;
  padding: 10px 5px;
  border-radius: 10px;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.role-option:hover {
  color: #ce971f;
}

.role-option.active {
  color: #333;
  font-weight: 700;
}

.role-icon {
  font-size: 18px;
  margin-bottom: 3px;
}

.role-text {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 8px);
  height: calc(100% - 8px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(206, 151, 31, 0.3);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  z-index: 1;
}

.slider.left {
  transform: translateX(0);
  border: 1px solid rgba(206, 151, 31, 0.2);
}

.slider.right {
  transform: translateX(100%);
  border: 1px solid rgba(206, 151, 31, 0.2);
}

.role-hint {
  text-align: center;
  color: #ce971f;
  font-size: 12px;
  margin-top: 5px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Worker Section Styles */
.worker-section-divider {
  position: relative;
  text-align: center;
  margin: 20px 0 15px;
}

.worker-section-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #ce971f, transparent);
}

.divider-text {
  background: white;
  padding: 0 15px;
  color: #ce971f;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}

/* Form labels and inputs */
.form-control {
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #ce971f;
  box-shadow: 0 0 8px rgba(206, 151, 31, 0.3);
  outline: none;
}

/* Submit button */
.btn {
  background: linear-gradient(135deg, #ce971f, #e6b450);
  color: #fff;
  font-weight: 700;
  padding: 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(206, 151, 31, 0.3);
}

.btn:hover {
  background: linear-gradient(135deg, #b87e12, #ce971f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(206, 151, 31, 0.4);
}

.btn:active {
  transform: translateY(0);
}

/* Link styles */
.link {
  display: inline-flex;
  color: #333;
  font-weight: 650;
  text-decoration: none;
  transition: color 0.3s, transform 0.3s;
  border-bottom: #ce971f solid 2px;
  padding-bottom: 1px;
}

.link:hover {
  color: #ce971f;
  border-bottom-color: transparent;
  transform: scale(1.08);
}

/* Checkbox */
.form-check-input {
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 18px;
  height: 18px;
}

.form-check-input:checked {
  background-color: #ce971f;
  border-color: #ce971f;
}

.form-check-label {
  margin-left: 8px;
  color: #555;
}

/* Error messages */
.text-danger {
  font-size: 0.875rem;
  margin-top: 3px;
  color: #e74c3c;
}

/* Responsive tweaks */
@media (max-width: 576px) {
  .formContent {
    padding: 20px 15px;
    margin: 20px;
  }

  .header .signup {
    font-size: 22px;
  }

  .role-option {
    padding: 8px 3px;
    min-height: 45px;
  }

  .role-icon {
    font-size: 16px;
  }

  .role-text {
    font-size: 13px;
  }

  .btn {
    padding: 10px;
  }
}

/* Animation for role switch */
.role-option {
  transition: color 0.3s ease;
}
</style>