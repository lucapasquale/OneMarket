var pg = require('pg');
const dbLoc = "postgres://postgres:2805@localhost:5432/carts";

/*Instanteia o client do DB*/
var db = new pg.Client(dbLoc);
db.connect(function (err){
	if (err) throw err;
});

/*METHODS*/
module.exports = [

	//Retorna todos os carts
  {
    method: 'GET',
    path: '/carts',
    handler: function(request, reply) {
		console.log("Buscando todos os produtos");

		db.query(`SELECT * FROM products`, function(err, result){
			if (err) throw err;

			//Se não encontrou resultado retornar com erro
			if (!result.rows[0])
				return reply({	errorMessage: 'Não foram encontrados produtos' });

			//Retorna lista de itens
			return reply(result.rows);
		});
	}
  },

	//Dado um cartId, encontrar todos os produtos neste cart
  {
    method: 'GET',
    path: '/carts/{cartId}',
    handler: function(request, reply) {
    	const cartId = request.params.cartId;
    	var resposta = { cartId : cartId, itens: [] };

		console.log(`Buscando carrinho com id: ${cartId}`);
    	db.query(`SELECT quantity,productId FROM cartItems WHERE cartId = ${cartId}`, function(err, result){
    		if (err) throw err;

    		//Se não encontrou resultado retornar com erro
			if (!result.rows[0]){
				console.log('cartId ' + cartId + ' não existe. Retornando carrinho vazio');
				return reply(resposta);
			}

			resposta.itens = result.rows;
			return reply(resposta);
    	});
	}
  },

/*POST CART*/
  {
    method: 'POST',
    path: '/carts',
    handler: function(request, reply) {
    	console.log(request.payload);
    	const cart = request.payload;

    	console.log("Posted cart " + cart.id);
    	values.push(cart);

 		return reply('OK');
	}
  }
];