<template>
    <div class="container my-5">
        <div class="row align-items-center">
             <!-- Formulaire -->
            <div class="col-md-6">
                <Login />
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

</script>
