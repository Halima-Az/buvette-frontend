<template>
    <div class="container py-4 w-50 ">
        <form @submit.prevent="addUser">
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Username</label>
                <input type="text" class="form-control" v-model="user.username">
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" v-model="user.email"
                id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" v-model="user.password"
                 id="exampleInputPassword1">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
const user=ref({
    username:'',
    email:'',
    password:''
})

const addUser = async()=>{
    try{
        const response= await axios.post("http://localhost:8088/auth/register",user.value)
        alert("inscription réussite")
    }
    catch (error){
         alert("something wrong !")
         console.log(error)
    }
}
</script>