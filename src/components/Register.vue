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

        <div class="col-12">
          <label class="form-label">Email address</label>
          <input type="email" class="form-control" v-model="user.email">
          <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
        </div>

        <div class="col-12">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" v-model="user.password">
          <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
        </div>
        
      </div>

      <div class="my-3 form-check">
        <input type="checkbox" class="form-check-input" id="termsCheck"  v-model="user.agreeTerms">
        <label class="form-check-label" for="termsCheck">I agree to terms & conditions</label>
          <div v-if="errors.agreeTerms" class="text-danger">{{ errors.agreeTerms }}</div>
      </div>

      <button type="submit" class="btn w-100">Submit</button>

      <p class="text-center mt-3">
        Already have an account? <a href="/login" class="link">Sign in</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter();
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
const errors = ref({})
const success = ref(false)

const AddUser = async () => {
    errors.value = {};
    success.value = false;
    
      if (!user.value.agreeTerms) {
        errors.value.agreeTerms = "You must accept the terms & conditions.";
        return; // stoppe l'envoi si pas coché
    }
    try {
        await axios.post('http://localhost:8088/auth/register', user.value)
        success.value = true;
        
        setTimeout(() => {
            router.push('/login');
        }, 1000);
    } catch (err) {
        if (err.response && err.response.status === 400) {
            console.log(err.response)
            errors.value = err.response.data;
        }
    }
}
</script>

<style>
.formContent {
  border: 2px solid rgb(206, 151, 32);
  border-radius: 20px;
  padding: 30px;
  background: #fff;
  box-shadow: 0 6px 25px rgba(0,0,0,0.12);

  margin: auto;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgb(206, 151, 32);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.signup {
  color: rgb(206, 151, 32);
  font-weight: bold;
  font-size: 24px;
  margin-top: 10px;
}

.btn {
  width: 100%;
  background-color: rgb(206, 151, 32);
  font-weight: bold;
  color: white;
  padding: 10px;
  border-radius: 12px;
  transition: 0.3s ease;
}

.btn:hover {
  background-color: rgb(170, 122, 17);
}

.link {
  color: black;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 2px solid rgb(68, 138, 243);
}

.form-label {
  font-weight: 600;
}

.form-control {
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #bbb;
}

.form-control:focus {
  border-color: rgb(206, 151, 32);
  box-shadow: 0 0 8px rgba(206, 151, 32, 0.3);
  outline: none;
}
</style>
