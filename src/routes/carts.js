var joi = require('joi');
var models = require('../models/models');
// import joi from 'joi';
// import models from '../models';

// METHODS
module.exports = [

// GET - Retorna todos os produtos
	{
		method: 'GET',
		path: '/test',
		handler: function(request, reply) {

			return reply('Hello World!');
		}
	},

	// GET - Dado um username, encontrar todos os produtos no cart deste usuário
	{
		method: 'GET',
		path: '/cart/{username}',
		handler: function(request, reply) {
			const _username = request.params.username;

			console.log(`Buscando carrinho para o user: ${_username}`);

			const query = {
				where: {
					username: _username
				},
				include: [models.product]
			};

			models.cart.findOne(query).then(function (cart){
				if (!cart){
					console.log('Não foi encontrado cart para ' + _username);
					return reply('Não foi encontrado cart para ' + _username);
				} else {
					return reply(cart.dataValues);
				}
			}, function(err){
				console.log(err);
			});
		}
	},

	// POST - Insere o carrinho no DB
	{
	method: 'POST',
	path: '/orders',
	config: {
		handler: function(request, reply) {
	    	const _receivedCart = {
	    		userId: request.payload.userId,
	    		orders: request.payload.orders
	    	};

	    	console.log(`Inserindo carrinho: ${JSON.stringify(_receivedCart)}`);

		// Para cada item do carrinho atual, inserir na tabela
		let i;
		for(i = 0; i < _receivedCart.orders.length; i++){
			// Obtem o pedido do array
			const order = {
				userId: _receivedCart.userId,
				productId: _receivedCart.orders[i].productId,
				quantity: _receivedCart.orders[i].quantity
			};

			// Insere o pedido no DB na table orders
			models.order.create(order);
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
	    	const _receivedCart = {
	    		userId: request.payload.userId,
	    		orders: request.payload.orders
	    	};

	    	console.log(`Atualizando carrinho: ${_receivedCart}`);

			// Deleta carrinho antigo do orders
			models.order.destroy({where: {userId: _receivedCart.userId}}).then(function (project) {

				// Para cada item do carrinho atual, inserir na tabela
				let i;
				for(i = 0; i < _receivedCart.orders.length; i++){
					// Obtem o pedido do array
					const order = {
						userId: _receivedCart.userId,
						productId: _receivedCart.orders[i].productId,
						quantity: _receivedCart.orders[i].quantity
					};

					// Insere o pedido no DB na table orders
					models.order.create(order);
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