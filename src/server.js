import Hapi from 'hapi';
import models from './models';

// Cria o server
var server = new Hapi.Server();
server.connection({ host: 'localhost', port : 3000 });

// Adiciona routes
server.route(require('./routes/carts'));

// Inicia o server
server.start(function() {
	console.log('Running at ' + server.info.uri);
	console.log('');
});