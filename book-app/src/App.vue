<script setup>
import HelloWorld from './components/HelloWorld.vue'
//import TheWelcome from './components/TheWelcome.vue'
//import Calculator from './components/Calculator.vue'
import CalculatorContainer from './components/CalculatorContainer.vue';
import BookList from './components/BookList.vue'
import logo from './assets/books.gif'
import { HTTP } from './utils/http';
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { bookServiceHttp } from './utils/bookservicehttp';
import { useSocketStore } from './utils/SocketStore';


bookServiceHttp.getAll();

const tx=ref({
  title:'Some App',
  buttons:{},
  book:{}
})

provide("tx",tx);

function loadTranslations(locale){
  HTTP.get("/translations/translations_"+locale+".json").then(trans => {
    console.log("Käännökset",trans);
    Object.assign(tx.value,trans)
  })
}

loadTranslations("en");


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


</script>

<template>
    <div class="container">
      <header>
        <img :src="logo" />
        <h1>{{tx.title}}</h1>
      </header>
      <nav>
        <RouterLink to="/">Books</RouterLink>
        <RouterLink to="/calc">Calculators</RouterLink>
        <RouterLink to="/ws">Socket</RouterLink>
        <a @click="() => loadTranslations('en')" class="trans">EN</a>
        <a @click="() => loadTranslations('fi')" class="trans">FI</a>
      </nav>
      <main>
        <RouterView />
      </main>
      <footer>
        Copyright Acme Ltd {{ socketStore.latest }}
      </footer>
    </div>
</template>

<style scoped>
.trans{
  cursor:pointer;
  float:right;
}
</style>
