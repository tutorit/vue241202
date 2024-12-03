<script setup>
import HelloWorld from './components/HelloWorld.vue'
//import TheWelcome from './components/TheWelcome.vue'
//import Calculator from './components/Calculator.vue'
import CalculatorContainer from './components/CalculatorContainer.vue';
import BookList from './components/BookList.vue'
import logo from './assets/books.gif'
import { HTTP } from './utils/http';
import { provide, ref } from 'vue';

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
        <a @click="() => loadTranslations('en')" class="trans">EN</a>
        <a @click="() => loadTranslations('fi')" class="trans">FI</a>
      </nav>
      <main>
        <RouterView />
      </main>
      <footer>
        Copyright Acme Ltd
      </footer>
    </div>
</template>

<style scoped>
.trans{
  cursor:pointer;
  float:right;
}
</style>
