const {connectionOptions,dbType}=require('./config');
const {withCamelCaseProperties,withSnakeCaseProperties, snakeToCamelCase}=require('./utils');
const mysql=require("mysql2");
const psql=require('pg');

async function getConnection(user=null,password=null,db=null){
    let options={...connectionOptions};
    if (user) options.user=user;
    if (password) options.password=password;
    if (db) options.database=db;
    if (dbType=="mysql"){
        const con=mysql.createConnection(options);
        con.connect();
        return con;
    }
    if (dbType=='psql'){
        const client = new psql.Client(options);
        client.connect();
        return client;
    }
    return null;
}

function executeSql(sql,user=null,password=null,db=null){
    return new Promise(async (resolve,reject) => {
        const con=await getConnection(user,password,db,false);
        con.query(sql,function(err,rows){
            con.end();
            if (err) reject({sql});
            else {
                if (dbType=='psql') rows=rows.rows;
                resolve(rows);
            }
        });
    });
}

function executeSqlWithParams(sql,params,returnRaw=false){
    return new Promise(async (resolve,reject) => {
        const con=await getConnection();
        if (dbType=='sqls'){
            let request=con.request();
            if (params) params.forEach(param => {
                request.input(param.field,param.value);
            });
            request.query(sql,function(err,rows){
                con.close();
                if (err) reject({sql,params});
                else {
                    let ret=[];
                    if (rows.recordset.forEach) rows.recordset.forEach(row => ret.push(withCamelCaseProperties(row)));
                    resolve(ret);
                }
            });
        }
        else{
            con.query(sql,params,function(err,rows){
                con.end();
                if (err) console.log("Error",err);
                if (err) reject({sql,params});
                else{
                    if (dbType=='psql' && !returnRaw) rows=rows.rows;
                    let ret=[];
                    if (rows.forEach) rows.forEach(row => ret.push(withCamelCaseProperties(row)));
                    resolve(ret);
                }
            });
        }
    });
}


function convertParamObject(types,obj){
    let fields=Object.keys(withSnakeCaseProperties(types));
    obj=withSnakeCaseProperties(obj);
    for(let key in obj){
        if (!fields.includes(key)){
            delete obj[key];
            continue;
        }
        if (key.endsWith("_date") && obj[key]) obj[key]=new Date(obj[key]);
    }
    return obj;
}

function insert(table,object,types){
    let objToInsert=convertParamObject(types,object);
    delete objToInsert.id;
    let columns=[];
    let values=[];
    let params=[];
    let counter=1;
    for (let field in objToInsert){
        columns.push(field);
        if (dbType=='psql') values.push('$'+counter++);
        else if (dbType=='sqls') values.push('@'+field);
        else values.push('?');
        if (dbType=='sqls') params.push({field,value:objToInsert[field]});
        else params.push(objToInsert[field]);
    }
    let sql=`insert into ${table}(${columns.join(',')}) values(${values.join(',')})`;
    if (dbType=="psql") sql+=" returning id";
    if (dbType=='sqls') sql+=" SELECT SCOPE_IDENTITY() as id";

    return new Promise(function(resolve,reject){
        executeSqlWithParams(sql,params).then(resp => {
            let id=resp.insertId;
            if (dbType!='mysql') id=resp[0].id;
            resolve(id);
        })
        .catch(x => {
            reject(x);
        })
    });
}

function getById(table,id){
    let queryString='SELECT * FROM '+table+' WHERE id=?';
    if (dbType=='psql') queryString="SELECT * FROM "+table+" WHERE id=$1";
    if (dbType=='sqls') queryString="SELECT * FROM "+table+" WHERE id=@id";
    let params=[id];
    if (dbType=='sqls') params=[{field:'id',value:id}];
    return new Promise(async function(resolve,reject){
        let rows=await executeSqlWithParams(queryString,params);
        if (rows.length!=1) resolve(null);
        else resolve(rows[0]);
    });
}


function update(table,object,types){
    let objToUpdate=convertParamObject(types,object);
    let id=object.id;
    let columns=[];
    let params=[];
    let counter=1;
    for (let field in objToUpdate){
        let col=field+"=?"
        if (dbType=='psql') col=field+'=$'+counter++;
        if (dbType=='sqls') col=field+'=@'+field;
        columns.push(col);
        if (dbType=='sqls') params.push({field,value:objToUpdate[field]});
        else params.push(objToUpdate[field]);
    }
    let sql=`UPDATE ${table} SET ${columns.join(',')} WHERE id=${id}`;

    return executeSqlWithParams(sql,params);
}


module.exports={executeSql,executeSqlWithParams,insert,update, getById};