<template>
    <HeaderPageMenu title ="Profile"/>
    <Profile />
    <FooterPageMenu/>

</template>
<script setup>
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue';
import FooterPageMenu from '@/components/client/FooterPageMenu.vue';
import Profile from '@/components/shared/Profile.vue';
</script>