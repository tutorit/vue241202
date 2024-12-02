const { dbType } = require('./config');
const db=require('./dbhelper');

const ok=(message) => ({message,status:200});
const error=(message,extra) => ({message,extra,status:400});

function getAll(table,field,value){
    if (!field){
        let q=`SELECT * FROM ${table}`;
        return db.executeSqlWithParams(q);
    }
    else{
        let params=[value];
        let q=`SELECT * FROM ${table} WHERE ${field}=?`;
        if (dbType=='psql') q=`SELECT * FROM ${table} WHERE ${field}=$1`;
        if (dbType=='sqls'){
            q=`SELECT * FROM ${table} WHERE ${field}=@${field}`;
            params=[{field,value}];
        }
        return db.executeSqlWithParams(q,params);
    }
}

function get(table,id){
    return db.getById(table,id);
}

function create(table,item,types){
    return new Promise(async (resolve,reject)=>{
        try{
            let id=await db.insert(table,item,types);
            let bk=await db.getById(table,id);
            resolve(bk);
        }
        catch(x){
            reject(error("Error creating",x))
        }
    });
}

async function update(table,item,types){
    return new Promise(async (resolve,reject)=> {
        await db.update(table,item,types);
        try{
            let bk=await db.getById(table,item.id);
            resolve(bk);
        }
        catch(x){
            reject(error("Error updating",x));
        }
    })
}

function deleteRow(table,id){
    return new Promise(async (resolve,reject) => {
        try{
            let params=[id];
            let q=`DELETE FROM ${table} WHERE id=?`;
            if (dbType=='psql') q=`DELETE FROM ${table} WHERE id=$1`;
            if (dbType=='sqls'){
                q='DELETE FROM ${table} WHERE id=@id';
                params=[{field:'id',value:id}];
            }
            let result=await db.executeSqlWithParams(q,[id],true);
            let rc=dbType=='psql' ? result.rowCount : result.affectedRows;
            resolve(ok("Deleted "+rc+" rows"));
        }
        catch(x){
            reject(error("Failed",x))
        }
    })
}

module.exports=function(entity){
    const table=entity.table;
    console.log("Database dao for ",table)
    return{
        getAll:(field,value)=>getAll(table,field,value),
        get:id => get(table,id),
        create: obj => create(table,obj,entity.types),
        update: obj => update(table,obj,entity.types),
        delete: id => deleteRow(table,id)}
}