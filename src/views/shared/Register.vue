<template>
    <div class="body">
        <div class="container">
            <div class="row ">
                <div class="col-md-6">
                    <illustration-panel subtitle="Join SnackUp today and enjoy fast ordering, favorites and exclusive campus deals"/>
                </div>
                <div class="col-md-6">
                    <Register :errors="errors" @submit="handleRegister" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import Register from '@/components/shared/Register.vue';
import IllustrationPanel from '@/components/client/IllustrationPanel.vue';
import axios from 'axios';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const errors = ref({})

const handleRegister = async (data) => {
    try {
        await axios.post('http://localhost:8088/auth/register', data)
        router.push('/login')
    } catch (err) {
        if (err.response?.status === 400) {
            errors.value = err.response.data
        }
    }
}
</script>
<style>
    body {
    background: linear-gradient(135deg, #d6a02b, #ce971f);
    background-attachment: fixed;
}

</style>
