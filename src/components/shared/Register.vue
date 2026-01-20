<template>
  <div class="formContent">
    <!-- Header avec logo et titre -->
    <div class="header text-center">
      <img class="logo" src="/images/sanckuplogo.png" alt="Snack Up">
      <p class="signup">Sign up</p>
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
        <input type="checkbox" class="form-check-input" id="termsCheck"  v-model="user.agreeTerms">
        <label class="form-check-label" for="termsCheck">I agree to terms & conditions</label>
          <div v-if="localError.agreeTerms" class="text-danger">{{ localError.agreeTerms }}</div>
      </div>

      <button type="submit" class="btn w-100">Sign up</button>

      <p class="text-center mt-3">
        Already have an account? <a href="/login" class="link">Sign in</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'

const emit=defineEmits(['submit'])

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
})

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({})
  }
})
const {errors}=toRefs(props)
const localError=ref({})
const AddUser =  () => {
    errors.value = {};
    
      if (!user.value.agreeTerms) {
        localError.value.agreeTerms = "You must accept the terms & conditions.";
        return; 
    }
   emit('submit',user.value)
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
  
  background-color: #ce971f;
  color: #fff;
  font-weight: 700;
  padding: 10px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #b87e12;
}

/* Link styles */
.link {
   display: inline-flex; 
  color: #333;
  font-weight: 650;
  text-decoration: none;
  transition: color 0.3s, transform 0.3s;
  border-bottom:#ce971f solid 2px
}

.link:hover {
  color: #ce971f;
  border:none;
  transform: scale(1.08);
}

/* Checkbox */
.form-check-input {
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 18px;
  height: 18px;
}

.form-check-label {
  margin-left: 8px;
  color: #555;
}

/* Error messages */
.text-danger {
  font-size: 0.875rem;
  margin-top: 3px;
  color: #e74c3c; /* rouge clair */
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

  .btn {
    padding: 10px;
  }
}

</style>
