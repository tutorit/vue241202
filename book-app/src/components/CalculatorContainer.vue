<script setup>
import {ref} from 'vue';
import Calculator from './Calculator.vue';
import EventCalculator from './EventCalculator.vue';
import ObjectCalculator from './ObjectCalculator.vue';

const eventResult=ref("No result yet");
const bindingCalculation=ref("No calculation yet");
const myCalc=ref({fig1:7,fig2:9});

function eventCalculatorResultChanged(newResult){
    eventResult.value=newResult;
}

</script>
<template>
    <Calculator :fig1="2" :fig2="4" @calculation-changed="c => bindingCalculation=c"/>
    <p>Binding calculator: {{ bindingCalculation }}</p>
    <EventCalculator @result-changed="eventCalculatorResultChanged" />
    <p>Event calculator: {{ eventResult }}</p>
    <ObjectCalculator v-model="myCalc" />
    <p>{{ myCalc.fig1 }}+{{ myCalc.fig2 }} = {{ myCalc.fig1+myCalc.fig2 }}</p>
</template>