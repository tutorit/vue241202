import { defineStore } from "pinia";
import { ref } from "vue";

export const useSocketStore=defineStore('socket',() => {
    const data=ref([100]);
    const latest=ref(100);

    function add(n){
        latest.value=n;
        data.value.push(n);
        if (data.value.length>20) data.value.splice(0,1);
    }

    return {data,latest,add}
});

/*
// to App.vue
const socketStore=useSocketStore();

let socket=null;
onMounted(() => {
    console.log("Mount")
    socket=new WebSocket("ws://localhost:9001");
    socket.onmessage=function(ev){
      socketStore.add(Number(ev.data));
    }
})

onBeforeUnmount(() => {
    console.log("Unmoint")
    socket.close();
})


*/