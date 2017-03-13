// Marca o enviroment como TEST_ENVIROMENT
process.env.TEST_ENVIROMENT = true;

require('babel-polyfill');
const test = require('tape');
const server = require('../server.js');

// Testa conexão com a API
test('Basic HTTP Test - GET /test', (t) => {
  const options = {
    method: 'GET',
    url: '/test',
  };

  server.inject(options, (response) => {
    t.equal(response.statusCode, 200, 'Status Code = 200');
    t.equal(response.result, 'Hello World!', 'Result = \'Hello World!\'');
    server.stop(t.end);
  });
});

// // Testa se consegue pegar os produtos base criado com o DB
// test('Test get all products - GET /products', (t) => {
//   const options = {
//     method: 'GET',
//     url: '/products',
//   };
//
//   // Configura reposta esperada
//   const products = {
//     products: [{
//       name: 'A',
//       description: 'aa',
//       price: 1.5,
//       quantity: 2,
//     }, {
//       name: 'B',
//       description: 'bbb',
//       price: 3.5,
//       quantity: 4,
//     }],
//   };
//
//   server.inject(options, (response) => {
//     t.equal(response.statusCode, 200, 'Status Code = 200');
//     t.equal(response.result, products, 'Base products created');
//     server.stop(t.end);
//   });
// });
//
// // Testa se consegue pegar o carrinho base criado com o DB
// test('Test get cart - GET /cart/{userId}', (t) => {
//   const options = {
//     method: 'GET',
//     url: '/products/1',
//   };
//
//   // Configura reposta esperada
//   const cart = {
//     id: 1,
//     products: [{
//       name: 'A',
//       description: 'aa',
//       price: 1.5,
//       quantity: 2,
//     }, {
//       name: 'B',
//       description: 'bbb',
//       price: 3.5,
//       quantity: 4,
//     }],
//   };
//
//   server.inject(options, (response) => {
//     t.equal(response.statusCode, 200, 'Status Code = 200');
//     t.equal(response.result, cart, 'Base cart created');
//     server.stop(t.end);
//   });
// });
