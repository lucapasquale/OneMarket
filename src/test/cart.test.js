require('babel-polyfill');
const test = require('tape');
const server = require('../server.js');

// Marca o enviroment como TEST_ENVIROMENT
process.env.TEST_ENVIROMENT = true;

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

test('Test get all products - GET /products', (t) => {
  const options = {
    method: 'GET',
    url: '/products',
  };

  server.inject(options, (response) => {
    t.equal(response.statusCode, 200, 'Status Code = 200');
    server.stop(t.end);
  });
});
