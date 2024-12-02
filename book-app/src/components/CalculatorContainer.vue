<script setup>
import {ref} from 'vue';
import Calculator from './Calculator.vue';
import EventCalculator from './EventCalculator.vue';

const eventResult=ref("No result yet");
const bindingCalculation=ref("No calculation yet");

function eventCalculatorResultChanged(newResult){
    eventResult.value=newResult;
}

</script>
<template>
    <Calculator :fig1="2" :fig2="4" @calculation-changed="c => bindingCalculation=c"/>
    <p>Binding calculator: {{ bindingCalculation }}</p>
    <EventCalculator @result-changed="eventCalculatorResultChanged" />
    <p>Event calculator: {{ eventResult }}</p>
</template>