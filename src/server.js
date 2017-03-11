import Hapi from 'hapi';
import models from './models/models';

const port = process.env.PORT || 3000;

// Cria o server
var server = new Hapi.Server();
server.connection({ port });

// Adiciona routes
server.route(require('./routes/carts'));

// Inicia o server
server.start(function() {
	console.log('Running at ' + server.info.uri);
	console.log('');
});