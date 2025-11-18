<template>
    <div class="container my-5">
        <div class="row align-items-center">
            <!-- Logo -->
            <div class="col-md-6 text-center mb-4 mb-md-0">
                <Logo />
            </div>
            <!-- Formulaire -->
            <div class="col-md-6">
                <Register />
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from '@/components/Logo.vue'
import Register from '@/components/Register.vue';

</script>
