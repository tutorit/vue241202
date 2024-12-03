<script setup>
import HelloWorld from './components/HelloWorld.vue'
//import TheWelcome from './components/TheWelcome.vue'
//import Calculator from './components/Calculator.vue'
import CalculatorContainer from './components/CalculatorContainer.vue';
import BookList from './components/BookList.vue'
import logo from './assets/books.gif'
</script>

<template>
    <div class="container">
      <header>
        <img :src="logo" />
        <h1>Kirjasovellus</h1>
      </header>
      <nav>
        <RouterLink to="/">Books</RouterLink>
        <RouterLink to="/calc">Calculators</RouterLink>
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

</style>
