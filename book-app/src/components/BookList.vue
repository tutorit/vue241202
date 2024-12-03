<script setup>
import {ref,computed, inject} from 'vue';
import { formatCurrency,formatDate,vFocus } from '../utils/formatters';
import { useRouter } from 'vue-router';
import { bookService } from '../utils/bookservice';
import { bookServiceHttp } from '@/utils/bookservicehttp';

const titleFilter=ref("");
const authorFilter=ref("");
const sortOrder=ref("title");

const tx=inject("tx");

const filteredBooks=computed(() => {
    let filtered=bookServiceHttp.books.filter(b => b.title.toLowerCase().includes(titleFilter.value.toLowerCase()) &&  
                                b.author.toLowerCase().includes(authorFilter.value.toLowerCase()));
    filtered.sort((a,b) => a[sortOrder.value].localeCompare(b[sortOrder.value]));
    return filtered;
});

function priceStyle(price){
    if (price>14) return {color:"green"};
    if (price<12) return {color:"red"}
    return {}
}

const router=useRouter();

function goto(book){
    router.push("/book/"+book.id)
}

function deleteBook(book){
    bookServiceHttp.deleteBook(book);
}

</script>
<template>
    <h2>Books</h2>
    <table class="table table-striped">
        <thead>
            <tr>
                <th><select v-model="sortOrder">
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </select></th>
                <th><input :placeholder="tx.book.title" v-model="titleFilter" /></th>
                <th><input v-focus :placeholder="tx.book.author" v-model="authorFilter" /></th>
                <th>Price</th>
                <th>Published</th>
                <th><RouterLink to="/book/create">Create</RouterLink></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="book in filteredBooks" :key="book.id">
                <td><RouterLink :to="`/book/${book.id}`">{{ book.id }}</RouterLink></td>
                <td @click="() => goto(book)" class="clickable">{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td :class="{tooSmall:book.price<12,ratherBig:book.price>14}" 
                    :style="priceStyle(book.price)">{{ formatCurrency(book.price) }}</td>
                <td>{{ formatDate(book.published) }}</td>
                <td @click="() => deleteBook(book)" class="clickable">Del</td>
            </tr>
        </tbody>
    </table>
</template>
<style>
.tooSmall{
    font-weight: bold;
}
.ratherBig{
    font-style:italic;
}

.clickable{
    cursor:pointer;
}
</style>