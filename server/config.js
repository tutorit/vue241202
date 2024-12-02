
const wwwroot='../wwwroot';
const serverPort=9000;
const dbType="memory";  // memory, mysql, psql or sqls 

const connectionOptions={
    user : "librarian",
    password : "test123",
    database : 'library',
    host:'localhost',
    port:3306    
};

if (dbType=='psql') connectionOptions.port=5432;
if (dbType=='sqls') {
    delete connectionOptions.host;
    connectionOptions.port=1433;
    connectionOptions.server='localhost';
    connectionOptions.options={
        trustServerCertificate:true
    }
}
module.exports={wwwroot,serverPort,connectionOptions,dbType};