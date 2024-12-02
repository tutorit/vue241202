const sqls=require('mssql');


// Use sql server configuration manager to enable tcp/ip + restart sql server
// Use sql server management studio so that 'sa'-login uses sql server authentication or create a new login "root" using sql server authentication and sysadmin-role
const sqlConfig = {
    user:'sa',
    password:'test123',
    database: 'master',
    port:1433,
    server: 'localhost',
    options:{
        trustServerCertificate:true
    }
}



sqls.connect(sqlConfig).then(con =>{
    console.log("jep",sqls.NVarChar.name);
})