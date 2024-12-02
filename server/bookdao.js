const books=[
	{id:1,title:"Odysseia",author:"Homeros",description:"Long way back",price:12.30,published:new Date(22,2,4)},
	{id:2,title:"Hobbit",author:"Tolkien",description:"There and back",price:11.20,published:new Date(37,1,3)},
	{id:3,title:"Two towers",author:"Tolkien",description:"Some balls?",price:13.40,published:new Date(54,9,6)},
	{id:4,title:"Player piano",author:"Vonnegut",description:"Engineers for-ever",price:14.90,published:new Date(52,8,1)},
];

const okPromise=data => new Promise(resolve => setTimeout(resolve(data),100));
const failPromise=message => new Promise((x,reject) => setTimeout(reject({message},100))); 

module.exports={

	getAll(){
		return okPromise(books);
	},
	get(id){
		let book=books.find(b => b.id==id);
		if (!book) return failPromise("Not found");
		return okPromise(book);
	},
	create(book){
		if (!book.title) return failPromise("Must set title");
		if (!book.author) return failPromise("Must set author");
		let maxId=books.reduce((a,b) => a.id>b.id ? a : b, {id:0}).id;
		book.id=maxId+1;
		books.push(book);
		return okPromise(book);
	},
	update(book){
		if (!book.title) return failPromise("Must set title");
		if (!book.author) return failPromise("Must set author");
		let b=books.find(b => b.id==book.id);
		if (!b) return failPromise("Not found");
		Object.assign(b,book);
		return okPromise(b);
	},
	delete(id){
		let index=books.findIndex(b => b.id==id);
		if (index<0) return failPromise("Not found")
		books.splice(index,1);
		return okPromise({message:"Deleted"});
	}
	
	
}