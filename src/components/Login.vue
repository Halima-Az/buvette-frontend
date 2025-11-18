<template>
    <div class="formContent">
        <p class="text-center signup">Sign In</p>
        <form @submit.prevent="login">

            <div class="mb-3">
                <label class="form-label">Email address</label>
                <input type="email" class="form-control" v-model="email">

            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password">

            </div>
            <div class="mb-3">
                <p v-if="error" class="text-danger">{{ error }}</p>

            </div>
            <button type="submit" class="btn">Submit</button>
            <p class="text-center mt-3">
                You don't have account yet? <a href="/register" class="link">Sign up</a>
            </p>
        </form>
    </div>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref(null);

const login = async () => {
    if (!email.value || !password.value) {
        error.value = "Tous les champs sont obligatoires !";
        return;
    }

    try {
        const res = await axios.post("http://localhost:8088/auth/login", {
            email: email.value,
            password: password.value,
        });

        // maintenant res est défini, tu peux l'utiliser
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.token;
        
        router.push('/home');

    } catch (err) {
        if (err.response && err.response.status === 401) {
            error.value = "Email ou mot de passe incorrect.";
        } else {
            error.value = "Erreur de connexion au backend.";
            console.error(err);
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
