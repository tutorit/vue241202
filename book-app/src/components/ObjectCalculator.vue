<script setup>
import {defineProps} from 'vue';
defineProps(["modelValue"]);

</script>
<template>
    <h2>Object calculator</h2>
    <input type="number" v-model="modelValue.fig1" />
    +
    <input type="number" v-model="modelValue.fig2" />
    =
    {{ modelValue.fig1+modelValue.fig2 }}
</template>