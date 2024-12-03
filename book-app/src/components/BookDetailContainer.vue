<script setup>
import { useRoute } from 'vue-router';

const route=useRoute();
const id=route.params.id;
console.log("Route",route)
</script>
<template>
    <h2>Detail container</h2>
    <nav>
        <RouterLink :to="{name:'editable',params:{id}}">Editable</RouterLink>
        <RouterLink :to="{name:'printable',params:{id}}">Printable</RouterLink>
    </nav>
    <RouterView />
</template>