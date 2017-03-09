var Hapi = require('hapi');
var pg = require('pg');
const dbLoc = "postgres://postgres:2805@localhost:5432/carts";

/*Cria o server*/
var server = new Hapi.Server();
server.connection({ host: 'localhost', port : 3000 });

/*Adiciona routes*/
server.route(require('./routes/carts'));

/*Instanteia o client do DB*/
server.db = new pg.Client(dbLoc);
server.db.connect(function (err){
	if (err) throw err;
});

//Inicia o server
server.start(function() {
	console.log('Running at ' + server.info.uri);
	console.log('');
});

