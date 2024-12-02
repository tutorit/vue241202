<script setup>
import {ref,onMounted,onUpdated,defineEmits} from 'vue';

const emit=defineEmits(["resultChanged"]);
const fig1=ref(4);
const fig2=ref(5);
const result=ref(fig1.value+fig2.value);

function calculate(){
    result.value=fig1.value+fig2.value; 
    emit("resultChanged",result.value);   
}

onMounted(() => console.log("Event calculator mounted",fig1.value,fig1.value))
onUpdated(() => console.log("Event calculator updated",fig1.value,fig2.value))


</script>
<template>
    <div @keyup.tab="calculate">
        <h2>Event calculator</h2>
        <input type="number" v-model="fig1" />
        +
        <input type="number" v-model="fig2" />
        <input type="button" @click="calculate" value="=" />
        {{ result }}
    </div>
</template>