const {model,daoFactory}=require('./model');
const session=require('express-session');
const error = (err) => ({message:err});

module.exports=function(app){

    app.use(session({
        secret:'Anything you want',
        resave:false,
        saveUninitialized:false
    }))

    const dao=daoFactory(model['person']);

    app.get('/open/login',function(req,resp){
        let ret=req.session.user || {id:0,role:'none'};
        resp.json(ret);
    })

    app.put('/open/login',async function(req,resp){
        let {username,password}=req.body;
        if (!username || !password) resp.status(401).json(error("Invalid credentials"));
        else {
            try{
                let rows=await dao.getAll('username',username);
                if (!rows.length) resp.status(401).json(error("Username not found"));
                else {
                    let user=rows[0];
                    if (user.password!=password) resp.status(401).json(error("Invalid credentials"));
                    else {
                        req.session.user=user;
                        delete user.password;
                        resp.json(user);
                    }
                }
            }
            catch(x){
                console.log("ERROR",x);
                resp.status(401).json(error("Internal server error"))
            }
        }
    })

    app.delete('/open/login',function(req,resp){
        req.session.user=null;
        resp.json({id:0,role:'none'});              
    })
}

