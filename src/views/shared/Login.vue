<template>
    <div class="container my-5">
        <div class="row align-items-center">
             <!-- Formulaire -->
            <div class="col-md-6">
                <Login  :changePasswordError="changePasswordError"
                         @forgot-password="handleForgotPassword"/>
            </div>
            <!-- Logo -->
            <div class="col-md-6">
                <illustration-panel subtitle="Welcome back! Order your favorite snacks and drinks in seconds and skip the queue on campus" />
            </div>
           
        </div>
    </div>
</template>

<script setup>

import IllustrationPanel from '@/components/client/IllustrationPanel.vue';
import Login from '@/components/shared/Login.vue';
import axios from "axios"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const changePasswordError = ref("")
const handleForgotPassword = async (email) => {
    try {
        const res = await axios.post('http://localhost:8088/auth/forgot-password', {
            identifier: email
        })

        // Redirection seulement si la requête est OK
        router.push({
            name: 'resetPassword',
            query: { token: res.data.resetToken }
        })

    } catch (err) {
        // Vérifier si le backend a renvoyé un message d'erreur
        if (err.response && err.response.status === 400 && err.response.data?.message) {
            changePasswordError.value = err.response.data.message
        } else {
            // Autre erreur inconnue
            changePasswordError.value = "Something went wrong. Try again."
        }
    }
}

</script>
