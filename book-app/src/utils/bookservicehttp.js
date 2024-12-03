import { reactive } from "vue";
import { HTTP } from "./http";

export const bookServiceHttp=reactive({
    books:[],

    verify(book){
        book.published=new Date(book.published);
        let existing=this.books.find(b => b.id==book.id);
        if (existing) Object.assign(existing,book);
        else this.books.push(book);
    },

    getAll(){
        HTTP.get("/simple/books").then(books => {
            books.forEach(book => this.verify(book));
        })
    },

    get(id){
        let existing=this.books.find(b => b.id==id) || {title:"",author:""}
        if (id!="create") HTTP.get("/simple/books/"+id).then(book=>{
            this.verify(book);
        })
        return existing;
    },

    save(book){
        HTTP.put("/simple/books/"+book.id,book).then(book => {
            this.verify(book);
        })
    },

    create(book){
        book.price=13.13;
        book.published=new Date();
        HTTP.post("/simple/books",book).then(book => {
            this.verify(book)
        });
    },

    deleteBook(book){
        HTTP.delete("/simple/books/"+book.id).then(() =>{
            let index=this.books.findIndex(b => b.id==book.id);
            if (index>=0) this.books.splice(index,1);
        })
    }

})