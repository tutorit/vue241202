<script setup>
import { bookService } from '@/utils/bookservice';
import { bookServiceHttp } from '@/utils/bookservicehttp';
import { useRoute } from 'vue-router';

const route=useRoute();
const book=bookServiceHttp.get(route.params.id)
</script>
<template>
    <div>
        <h2>Printable</h2>
        <div>{{ JSON.stringify(book) }}</div>
    </div>
</template>