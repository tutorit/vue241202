
module.exports=function(port){
	let ws = require("nodejs-websocket")

	let connections=[];
	let nextFigure=100;
	
	function sendNewFigure(){
		nextFigure=Math.round(nextFigure+Math.random()*20-10);
		if (nextFigure>180) nextFigure=180;
		if (nextFigure<20) nextFigure=20;
		connections.forEach(c => c.sendText(nextFigure.toString())); 
		setTimeout(sendNewFigure,1000);
	}
	
	setTimeout(sendNewFigure,1000);
	
	ws.createServer(function(conn) {
		connections.push(conn);
		console.log("New websocket connection");
		conn.on("text", function (str) {
			console.log("Received "+str)
		});
		conn.on("close", function (code, reason) {
			console.log("Closing websocket");
			let ind=connections.indexOf(conn);
			if (ind>=0) connections.splice(ind,1);
		})
		conn.on("error",function(err){
			console.log("Websocket error");
		});
	}).listen(port);
	console.log("WebSocket server listening port "+port);
}