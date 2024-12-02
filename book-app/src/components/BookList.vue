<script setup>
const books=[
	{id:1,title:"Odysseia",author:"Homeros",description:"Long way back",price:12.30,published:new Date(22,2,4)},
	{id:2,title:"Hobbit",author:"Tolkien",description:"There and back",price:11.20,published:new Date(37,1,3)},
	{id:3,title:"Two towers",author:"Tolkien",description:"Some balls?",price:13.40,published:new Date(54,9,6)},
	{id:4,title:"Player piano",author:"Vonnegut",description:"Engineers for-ever",price:14.90,published:new Date(52,8,1)},
];

</script>
<template>
    <h2>Books</h2>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Published</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="book in books" :key="book.id">
                <td>{{ book.id }}</td>
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.price }}</td>
                <td>{{ book.published }}</td>
            </tr>
        </tbody>
    </table>
</template>