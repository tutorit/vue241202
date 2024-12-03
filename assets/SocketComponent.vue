<script setup>
import { watch } from 'vue';
import { useSocketStore } from '../utils/SocketStore';

const socketStore=useSocketStore();
const data=socketStore.data;

function draw(){
	let c=document.getElementById("canvas");
	let ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(10,10);
	ctx.lineTo(10,180);
	ctx.lineTo(190,180);
	ctx.stroke();
	for(let i=10;i<200;i+=20){
		ctx.font="8pt Arial";
		ctx.fillText(i-10,i,190);
	}
		ctx.clearRect(10,10,180,170);
		ctx.beginPath();
		ctx.moveTo(10,Number(data[0]));
		for(var i=1;i<data.length;i++){
			ctx.lineTo(10*i+10,Number(data[i]));
		}
		ctx.stroke();
}

watch(data,() => draw());

</script>
<template>
    <div>
        <canvas id="canvas" width="200" height="200" border="1px solid black"></canvas> 
    </div>
</template>