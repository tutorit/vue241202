const error = (err) => ({message:err});

const apiroot="/simple/books";
const bookdao=require("./bookdao");
const bodyParser = require('body-parser');

// Demonstrates
// -"standard" RESTful interface
// -different ways to use Promise-object returned from bookdao
module.exports=function(app){
	app.use(bodyParser.json());	

	app.get(apiroot,async (req,res) => res.json(await bookdao.getAll()))


	app.get(apiroot+'/:id',async function(req, res) {
		let id = Number(req.params.id);
		bookdao.get(id)
			.then(book => res.json(book))
			.catch(err => res.status(404).json(err));
	});

	app.delete(apiroot+'/:id', async function(req, res) {
		let id = Number(req.params.id);
		try{
			let success=await bookdao.delete(id);
			res.json(success);
		}
		catch(err){
			res.status(404).json(err);
		}
	});

	app.put(apiroot+"/:id",function(req,res){
		let id=Number(req.params.id);
		let book=req.body;
		if (id!=book.id) res.status(400).json(error("ID mismatch"));
		else bookdao.update(book).then(b => res.json(b)).catch(e => res.status(400).json(e));
	});

	app.post(apiroot,async (req,res) => bookdao.create(req.body).then(book => res.json(book)).catch(err => res.status(400).json(err)));

}

		
