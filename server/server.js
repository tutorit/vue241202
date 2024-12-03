const {serverPort=9000, wwwroot="../wwwroot"}=require('./config.js');

const express = require('express');
let app = express();

app.use(express.static('../book-app/dist'));
app.use(express.static(wwwroot));

require('./bookapi')(app);
require('./standardapi')(app);
require('./apiextensions')(app);
require('./login')(app);
require('./websocket')(serverPort+1);


// Needed for browserRouter, change the path to point to your index.html

const path = require('path')
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '../book-app/dist', 'index.html'))
})




app.listen(serverPort);
console.log('Server listening on http://localhost:'+serverPort);
console.log('Distributing site from: '+wwwroot);