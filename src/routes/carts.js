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
				return reply({ userId : userId, orders: [] });
			}

			return reply({ userId : userId, orders: result.rows });
    	});
	}
  },

//Insere o carrinho no DB
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
				userId: joi.number().required(),

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

//Atualiza o carrinho que já está no DB
  {
    method: 'PUT',
    path: '/orders',
    config:{
    	handler: function(request, reply) {
	    	var receivedCart = {
	    		userId: request.payload.userId,
	    		orders: request.payload.orders
	    	};

			console.log(`Atualizando carrinho com id: ${receivedCart.userId}`);

			//Deleta carrinho antigo do orders
			db.query(`DELETE FROM orders WHERE userId = ${receivedCart.userId}`, function(err, result){
				if (err) throw err;
			});

			console.log(`Novo carrinho: ${JSON.stringify(receivedCart.orders)}`);

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

			//Retorna com o valor do cartId
	    	return reply({userId: receivedCart.userId});
		}, 

		/*Validação do payload*/
		validate: {
			payload: {
				userId: joi.number().required(),

				orders: joi.array().items(
					joi.object().keys({
						productId: joi.number().required(),
						quantity: joi.number().required()
					})
				)
			}
		}
    }
  }
];