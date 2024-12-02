<script setup>
import {ref,computed,defineProps,watch,defineEmits} from 'vue';
const emit=defineEmits(["calculation-changed"])
const props = defineProps(["fig1","fig2"])
const fig1=ref(props.fig1);
const fig2=ref(props.fig2);
const result=computed(() => fig1.value+fig2.value);
watch(result,(nv,ov) => emit("calculationChanged",`${fig1.value} + ${fig2.value} = ${nv}`))
</script>
<template>
    <div>
        <h2>Calculator</h2>
        <input type="number" v-model="fig1" />
        +
        <input type="number" v-model="fig2" />
        =
        {{ result  }}
    </div>
</template>