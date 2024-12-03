import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import App from './App.vue'
import BookList from './components/BookList.vue';
import CalculatorContainer from './components/CalculatorContainer.vue';
import BookDetail from './components/BookDetail.vue';
import BookDetailContainer from './components/BookDetailContainer.vue';
import BookPrintable from './components/BookPrintable.vue';

const router=createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/',component:BookList},
        {path:'/calc',component:CalculatorContainer},
        {path:'/book',component:BookDetailContainer,children:[
            {path:':id',name:'editable',component:BookDetail},
            {path:':id/printable',name:'printable',component:BookPrintable}
        ]}
    ]
})

let app=createApp(App);
app.use(router);
app.mount('#app')
