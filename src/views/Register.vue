<template>
    <div class="body">
        <div class="container my-5 ">
            <div class="row">
                <!-- Logo -->
                <div class="col-md-3 text-center mb-4 mb-md-0">

                </div>
                <!-- Formulaire -->
                <div class="col-md-9">
                    <Register />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Register from '@/components/Register.vue';

</script>
<style>
.body {
    margin: 0;
    height: 100vh;
    background: linear-gradient(to right, #f5d67a 60%, #ffffff 50%);
}
</style>
