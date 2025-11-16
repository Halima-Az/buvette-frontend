<template>
    <div class="formContent">
        <p class="text-center signup">Sign up</p>
        <form @submit.prevent="AddUser">
            <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" v-model="user.username">
                <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Email address</label>
                <input type="email" class="form-control" v-model="user.email">
                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="user.password">
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="my-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">I agree to terms & conditions</label>
            </div>
            <button type="submit" class="btn">Submit</button>
            <p class="text-center mt-3">
                Have you already an account? <a href="/login" class="link">Sign in</a>
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
    username: '',
    email: '',
    password: ''
})
const errors = ref({})
const success = ref(false)

const AddUser = async () => {
    errors.value = {};
    success.value = false;
    
    
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
    border: 2px rgb(206, 151, 32) solid;
    border-radius: 20px;
    padding: 20px;
}

.signup {
    color: rgb(206, 151, 32);
    font-weight: bold;
    font-size: 20px;
}

.btn {
    width: 100%;
    background-color: rgb(206, 151, 32);
    font-weight: bold;
    color: white;
}

.btn:hover {
    background-color: rgb(170, 122, 17);
    color: white;
}

.link {
    color: black;
    text-decoration: none;
    font-weight: bold;
    border-bottom: 2px solid rgb(68, 138, 243);
}
</style>
