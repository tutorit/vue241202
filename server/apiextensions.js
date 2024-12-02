const fs=require('fs');
const path = require('path');
const bodyParser = require('body-parser');

module.exports=function(app){

    app.use(bodyParser.raw({type: 'image/jpg', limit : '2mb'}));

    app.get("/api/books/:id/image",function(req,resp){
        let imgfile='book_'+req.params.id+".jpg";
        let fn=path.resolve(__dirname,'../assets/bookimages',imgfile);
        if (!fs.existsSync(fn)) fn=path.resolve(__dirname,'../assets/bookimages','book_default.jpg');
        resp.sendFile(fn);
    })


    app.post('/api/books/:id/image',function(req,resp){
        let image=req.body;
        let imgfile='book_'+req.params.id+".jpg";
        let fn=path.resolve(__dirname,'../assets/bookimages',imgfile);
        fs.writeFile(fn,image,function(err) {
            if (err) {
                console.log("Error",err);
                resp.status(400).json({error:'Failed to write '+fn});
            }
            else{
                resp.json({ok:'Written'});
            }
        })
    });
}