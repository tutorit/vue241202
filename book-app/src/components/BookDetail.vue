<script setup>
import { bookService } from '@/utils/bookservice';
import { useRoute, useRouter } from 'vue-router';


const route=useRoute();
const id=route.params.id;
const book=bookService.get(id);


const router=useRouter();

function create(){
    bookService.create(book)
    router.back();
}

function save(){
    router.back();
}

</script>
<template>
    <div>
        <h2>Kirja {{ route.params.id }}</h2>

        <div>
            <label>Title</label>
            <input placeholder="Title" v-model="book.title" />
        </div>
        <div>
            <label>Author</label>
            <input placeholder="Author" v-model="book.author" />
        </div>
        <input v-if="id=='create'" type="button" value="Create" @click="create" />
        <input v-if="id!='create'" type="button" value="Save" @click="save" />
    </div>
</template>