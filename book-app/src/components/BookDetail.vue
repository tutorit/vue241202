<script setup>
import { bookService } from '@/utils/bookservice';
import { bookServiceHttp } from '@/utils/bookservicehttp';
import { useRoute, useRouter } from 'vue-router';


const route=useRoute();
const id=route.params.id;
const book=bookServiceHttp.get(id);
console.log("Book",book)

const router=useRouter();

function create(){
    bookServiceHttp.create(book)
    router.back();
}

function save(){
    bookServiceHttp.save(book);
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