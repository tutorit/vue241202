<script setup>
import {ref,computed} from 'vue';
const books=[
	{id:1,title:"Odysseia",author:"Homeros",description:"Long way back",price:12.30,published:new Date(22,2,4)},
	{id:2,title:"Hobbit",author:"Tolkien",description:"There and back",price:11.20,published:new Date(37,1,3)},
	{id:3,title:"Two towers",author:"Tolkien",description:"Some balls?",price:13.40,published:new Date(54,9,6)},
	{id:4,title:"Player piano",author:"Vonnegut",description:"Engineers for-ever",price:14.90,published:new Date(52,8,1)},
];

function formatCurrency(value){
    const fiCurrency=new Intl.NumberFormat("fi-FI", {style: "currency", currency: "EUR" });
    return fiCurrency.format(value);
}

function formatDate(dt){
    return dt.toLocaleDateString();
}

const titleFilter=ref("");
const authorFilter=ref("");
const sortOrder=ref("title");
const filteredBooks=computed(() => {
    let filtered=books.filter(b => b.title.toLowerCase().includes(titleFilter.value.toLowerCase()) &&  
                                b.author.toLowerCase().includes(authorFilter.value.toLowerCase()));
    filtered.sort((a,b) => a[sortOrder.value].localeCompare(b[sortOrder.value]));
    return filtered;
});


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
                <th><input placeholder="Title" v-model="titleFilter" /></th>
                <th><input placeholder="Author" v-model="authorFilter" /></th>
                <th>Price</th>
                <th>Published</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="book in filteredBooks" :key="book.id">
                <td>{{ book.id }}</td>
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ formatCurrency(book.price) }}</td>
                <td>{{ formatDate(book.published) }}</td>
            </tr>
        </tbody>
    </table>
</template>