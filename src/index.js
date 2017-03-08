var Hapi = require('hapi');

//Cria o server
var server = new Hapi.Server();
server.connection({ port : 3000 });

//Adiciona routes
server.route(require('./routes/carts'));

//Inicia o server
server.start(function() {
	console.log('Running at ' + server.info.uri);
});