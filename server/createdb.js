const {connectionOptions,dbType}=require('./config');
const { executeSql, insert} = require('./dbhelper');
const {model}=require("./model");
const {camelToSnakeCase, withSnakeCaseProperties}=require("./utils");

const [,,user,password,drop=""]=process.argv;
if (!user || !password){
    console.log("This script creates a database as described in config.js")
    console.log("Usage: node createdb.js user pw [drop]");
    console.log("user is the username of user with privilege to create a database");
    console.log("pw is the password for that user");
    console.log("If third parameter is 'drop', the database and user are dropped not created")
    return;
}

if (drop!='drop'){
    console.log("This script will create and populate",connectionOptions.database,"database");
    console.log(connectionOptions.user,"user will also be created as owner of the database");
    console.log("The password for "+connectionOptions.user+" will be",connectionOptions.password);
}
else{
    console.log("This script will drop database ",connectionOptions.database,"database");
    console.log(connectionOptions.user,"user will also be dropped");
}

async function createDatabase(user,password){
    let queries=[
        `CREATE USER '${connectionOptions.user}'@'localhost' IDENTIFIED BY '${connectionOptions.password}'`,    
        "CREATE DATABASE "+connectionOptions.database,
        `GRANT ALL PRIVILEGES ON ${connectionOptions.database}.* TO ${connectionOptions.user}@localhost`,
    ];
    let database='mysql';
    if (dbType=='psql'){
        queries=[
            `CREATE USER ${connectionOptions.user} WITH ENCRYPTED PASSWORD '${connectionOptions.password}'`,
            `CREATE DATABASE ${connectionOptions.database} WITH OWNER=${connectionOptions.user}`,
        ];
        database="postgres";
    }
    if (dbType=='sqls'){
        queries=[
            `CREATE LOGIN [${connectionOptions.user}] WITH PASSWORD='${connectionOptions.password}'`,    
            "CREATE DATABASE "+connectionOptions.database,
            "USE "+connectionOptions.database+`
                create user [${connectionOptions.user}] for login [${connectionOptions.user}]
                EXEC sp_addrolemember 'db_owner','${connectionOptions.user}'
            `,
        
        ];
        database="master";
    }
    for(let index in queries){
        let sql=queries[index];
        try{
            let result=await executeSql(sql,user,password,database);
            console.log("Success",sql);
        }
        catch(x){
            console.log('FAILED: ',sql,x);
        }
    }
}

function queryForEntity(entity){
    const mysqlId="id int primary key not null auto_increment";
    const psqlId="id serial primary key";
    const sqlsId="id int identity(1,1) primary key not null";
    const fields=[];
    if (dbType=="psql") fields.push(psqlId);
    else if (dbType=='sqls') fields.push(sqlsId);
    else fields.push(mysqlId);
    let types=withSnakeCaseProperties(entity.types);
    for(let fieldName in types){
        let tp=types[fieldName];
        if (dbType=='psql' && tp=='double') tp+=" precision";
        if (dbType=='sqls' && tp=='double') tp="float";
        fields.push(fieldName+" "+tp);
    }
    if (entity.foreignKeys){
        entity.foreignKeys.forEach(fk => {
            let f=camelToSnakeCase(fk.field);
            let t=fk.references;
            let t1=fk.references;
            if (dbType=='sqls') t1='['+t+']';
            fields.push("constraint fk_"+entity.table+"_"+t+" foreign key("+f+") references "+t1+"(id)")
        })
    }
    let beg="CREATE TABLE "+entity.table+"(";
    if (dbType=='sqls') beg="CREATE TABLE ["+entity.table+"] (";
    let end=")";
    let sql=beg+fields.join(",")+end;
    //if (entity.foreignKeys) console.log(sql);
    return sql;
}

async function createTables(){
    const queries=[];
    model.order.forEach(entity => {
        queries.push(queryForEntity(model[entity]));
    });
    for(let index in queries){
        let sql=queries[index];
        try{
            let result=await executeSql(sql);
            console.log("Success",sql);
        }
        catch(x){
            console.log("FAILED",sql);
        }
    }
}

function updateForeignKeys(table,originalId,finalId){
    for(let entity in model){
        if (model[entity].table==table) continue;
        if (!model[entity].foreignKeys) continue;
        model[entity].foreignKeys.forEach(fk => {
            if (fk.references==table){
                model[entity].data.forEach(item => {
                    if (item[fk.field]==originalId) item[fk.field]=finalId;
                })
            }
        })
    }
}

async function populateTable(entity){
    for(let index in entity.data){
        let obj=entity.data[index];
        let id=await insert(entity.table,obj,entity.types);
        if (!id) console.log("Failed to insert",entity.table,obj);
        else updateForeignKeys(entity.table,obj.id,id);
    }
}

async function populate(){
    for(let index in model.order){
        let entity=model.order[index];
        await populateTable(model[entity]);
        console.log(entity,"populated");
    }
}

async function dropDatabase(user,password){
    const queries=[
        "DROP DATABASE "+connectionOptions.database,
        `DROP USER ${connectionOptions.user}`,
    ];
    let database='mysql';
    if (dbType=='psql') database='postgres';
    else if (dbType=='sqls'){
        database='master';
        queries[1]=`DROP LOGIN ${connectionOptions.user}`;
    } 
    else queries[1]+="@localhost";
    for(let index in queries){
        let sql=queries[index];
        try{
            let result=await executeSql(sql,user,password,database);
            console.log("SUCCESS",sql);
        }
        catch(x){
            console.log('FAILED: ',sql);
        }
    }
}


(async function(){
    if (drop!="drop") {
        await createDatabase(user,password);
        await createTables();
        await populate();
    }
    else await dropDatabase(user,password);
    console.log("All done")
})()
