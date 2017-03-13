import Hapi from 'hapi';

const port = process.env.PORT || 3000;

// Cria o server
const server = new Hapi.Server();
server.connection({ port });

// Adiciona routes
server.route(require('./routes/carts'));

// Inicia o server
server.start(() => {
  console.log(`Running at ${server.info.uri}`);
  console.log('');
});

module.exports = server;
