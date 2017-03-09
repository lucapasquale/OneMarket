var pg = require('pg');
var joi = require('joi');
const dbLoc = "postgres://postgres:2805@localhost:5432/carts";

/*Instanteia o client do DB*/
var db = new pg.Client(dbLoc);
db.connect(function (err){
	if (err) throw err;
});

/*METHODS*/
module.exports = [

	//Retorna todos os produtos
  {
    method: 'GET',
    path: '/products',
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

	//Dado um userId, encontrar todos os produtos no cart deste usuário
  {
    method: 'GET',
    path: '/orders/{userId}',
    handler: function(request, reply) {
    	const userId = request.params.userId;

		console.log(`Buscando carrinho com id: ${userId}`);
    	db.query(`SELECT productId,quantity FROM orders WHERE userId = ${userId}`, function(err, result){
    		if (err) throw err;

    		//Se não encontrou resultado retornar com erro
			if (!result.rows[0]){
				console.log('userId: ' + userId + ' não existe. Retornando carrinho vazio');
				return reply({ userId : userId, products: [] });
			}

			return reply({ userId : userId, products: result.rows });
    	});
	}
  },

/*Insere o carrinho*/
  {
    method: 'POST',
    path: '/orders',
    config: {
    	handler: function(request, reply) {
    	var receivedCart = {
    		userId: request.payload.userId,
    		orders: request.payload.orders
    	};

		console.log(`Inserindo carrinho: ${JSON.stringify(receivedCart)}`);

		//Para cada item do carrinho atual, inserir na tabela
		for(i = 0; i < receivedCart.orders.length; i++){
			//Obtem o pedido do array
			var order = {productId: receivedCart.orders[i].productId, quantity: receivedCart.orders[i].quantity}

			//Insere o pedido no DB na table orders
			db.query(`INSERT INTO orders (userId, productId, quantity) 
				VALUES (${receivedCart.userId}, ${order.productId}, ${order.quantity})`, function(err, result){
					if (err) throw err;
			});
		};

		//Retorna com o valor do userId
    	return reply({userId: receivedCart.userId});
		},

		//Validação do payload
		validate: {
			payload: {
				userId: joi.required(),

				orders: joi.array().items(
					joi.object().keys({
						productId: joi.number().required(),
						quantity: joi.number().required()
					})
				)
			}
		}
    }
    
  },

  {
    method: 'PUT',
    path: '/carts',
    handler: function(request, reply) {
    	const cartId = request.params.cartId;
    	var cart = request.payload;

    	//Checa se existe o payload e se existem a propriedades necessárias
    	if(!cart || !cart.cartId || !cart.products){
    		console.log("Erro no payload: " + cart);
    		return reply({ errorMessage: "Erro no payload: " + cart });
    	};

		console.log(`Atualizando carrinho com id: ${cartId}`);

		//Deleta carrinho antigo do cartId
		db.query(`DELETE FROM cartItems 
			WHERE cartId = ${cartId}`, function(err, result){
			if (err) throw err;
		});

		//Para cada item do carrinho atual, inserir na tabela
		console.log("Products: " + cart.products);
		console.log("Products 0 : " + cart.products[0].keys);
		for(p = 0; p < cart.products; p++){
			var prod = cart.products[i];
			console.log(i + ": " + prod);

			db.query(`INSERT INTO cartItems (cartId, productId, quantity) 
				VALUES (${cartId}, ${prod.productId}, ${prod.quantity})`, function(err, result){
					if (err) throw err;
			});
		};

		//Retorna com o valor do cartId
    	return reply(cartId);
	}
  }
];