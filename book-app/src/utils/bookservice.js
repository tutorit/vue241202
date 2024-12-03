import { reactive, ref } from "vue";

export const bookService=reactive({
    books:[
        {id:1,title:"Odysseia",author:"Homeros",description:"Long way back",price:12.30,published:new Date(22,2,4)},
        {id:2,title:"Hobbit",author:"Tolkien",description:"There and back",price:11.20,published:new Date(37,1,3)},
        {id:3,title:"Two towers",author:"Tolkien",description:"Some balls?",price:13.40,published:new Date(54,9,6)},
        {id:4,title:"Player piano",author:"Vonnegut",description:"Engineers for-ever",price:14.90,published:new Date(52,8,1)},
    ],

    get(id){
        let book=this.books.find(b => b.id==id) ;
        if (book) return book;
        return {title:"",author:""};
    },

    save(book){},
    create(book){
        book.price=13.13;
        book.published=new Date();
        book.id=this.books.reduce((a,b) => a.id>b.id?a:b).id+1;
        console.log("Create",book)
        this.books.push(book);
    },
    deleteBook(book){}
    
})