const {model,daoFactory}=require('./model');
const {camelToSnakeCase}=require('./utils');
const {dbType}=require("./config");
const error = (err) => ({message:err});

function createEntityApi(app,entity){
    //const entity=model[entityName];
    const dao=daoFactory(entity);
    const apiroot="/api/"+entity.url;
    console.log("Creating api for",entity.table,'at',apiroot);

	app.get(apiroot,async (req,res) => res.json(await dao.getAll()))


	app.get(apiroot+'/:id',async function(req, res) {
		let id = Number(req.params.id);
		dao.get(id)
			.then(data => res.json(data))
			.catch(err => res.status(err.status).json(err));
	});

	app.delete(apiroot+'/:id', async function(req, res) {
		let id = Number(req.params.id);
		try{
			let success=await dao.delete(id);
			res.json(success);
		}
		catch(err){
			res.status(err.status).json(err);
		}
	});

	app.put(apiroot+"/:id",function(req,res){
		let id=Number(req.params.id);
		let data=req.body;
		if (id!=data.id) res.status(400).json(error("ID mismatch"));
		else dao.update(data).then(d => res.json(d)).catch(err => res.status(err.status).json(err));
	});

	app.post(apiroot,async (req,res) => dao.create(req.body).then(book => res.json(book)).catch(err => res.status(err.status).json(err)));
    
    let fks=entity.foreignKeys;
    if (fks) fks.forEach(fk => {
		console.log("API FOR FOREIGN KEY",fk);
        const fdao=daoFactory(model[fk.references]);
        app.get(apiroot+"/:id/"+fk.references,async function(req,res){
            let id = Number(req.params.id);
			console.log("Getting",entity.table,id);
			let obj=await dao.get(id);
			let fid=obj[fk.field];
            fdao.get(fid)
                .then(data => res.json(data))
                .catch(err => res.status(err.status).json(err));
    
        });
        let path='/api/'+model[fk.references].url+"/:id/"+entity.url;
        app.get(path,async function(req,res){
            let id = Number(req.params.id);
            let f=fk.field;
            if (dbType!="memory") f=camelToSnakeCase(f);
            res.json(await dao.getAll(f,id));
        });
    });
    
}

module.exports=(app) => model.order.forEach(entity => createEntityApi(app,model[entity]));
