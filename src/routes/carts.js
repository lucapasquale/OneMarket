var joi = require('joi');
var models = require('../models');


// METHODS
module.exports = [

// GET - Retorna todos os produtos
  {
    method: 'GET',
    path: '/products',
    handler: function(request, reply) {

		console.log("Buscando todos os produtos");
		models.Product.findAll().then(function (project){
			var result = {products: []};

			// Para cada instancia da resposta, adicionar o valor atual dos dados
			project.forEach(function (instance){
				result.products.push(instance.dataValues);
			});
			return reply(result);
		});
	}
  },

// GET - Dado um userId, encontrar todos os produtos no cart deste usuário
  {
    method: 'GET',
    path: '/orders/{userId}',
    handler: function(request, reply) {
    	const _userId = request.params.userId;

		console.log(`Buscando carrinho com id: ${_userId}`);
		models.Order.findAll({where: {userId: _userId}}).then(function (project){
			const result = { userId: _userId, orders: []};

			// Para cada instancia da resposta, adicionar o valor atual dos dados
			project.forEach(function (instance){
				result.orders.push(instance.dataValues);
			});
			return reply(result);
		});
	}
  },

// POST - Insere o carrinho no DB
  {
    method: 'POST',
    path: '/orders',
    config: {
    	handler: function(request, reply) {
	    	var _receivedCart = {
	    		userId: request.payload.userId,
	    		orders: request.payload.orders
	    	};

	    	console.log(`Inserindo carrinho: ${JSON.stringify(_receivedCart)}`);

		// Para cada item do carrinho atual, inserir na tabela
		for(i = 0; i < _receivedCart.orders.length; i++){
			// Obtem o pedido do array
			var order = {
				userId: _receivedCart.userId,
				productId: _receivedCart.orders[i].productId,
				quantity: _receivedCart.orders[i].quantity
			};

			// Insere o pedido no DB na table orders
			models.Order.create(order);
		}

			// Retorna com o valor do userId
	    	return reply({userId: _receivedCart.userId});
		},

	// Validação do payload
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

// Atualiza o carrinho que já está no DB
  {
    method: 'PUT',
    path: '/orders',
    config:{
    	handler: function(request, reply) {

    		console.log(`Atualizando carrinho: ${_receivedCart}`);

	    	var _receivedCart = {
	    		userId: request.payload.userId,
	    		orders: request.payload.orders
	    	};

			// Deleta carrinho antigo do orders
			models.Order.destroy({where: {userId: _receivedCart.userId}}).then(function (project) {

				// Para cada item do carrinho atual, inserir na tabela
				for(i = 0; i < _receivedCart.orders.length; i++){
					// Obtem o pedido do array
					var order = {
						userId: _receivedCart.userId,
						productId: _receivedCart.orders[i].productId,
						quantity: _receivedCart.orders[i].quantity
					};

					// Insere o pedido no DB na table orders
					models.Order.create(order);
				}
			});

			// Retorna com o valor do cartId
	    	return reply({userId: _receivedCart.userId});
		}, 

	// Validação do payload
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