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
		path: '/cart/{userId}',
		handler: function(request, reply) {
			const _userId = request.params.userId;

			console.log(`\n# Buscando carrinho para o userId: ${_userId}`);

			models.cart.findById(_userId, {include: [models.product]} ).then(function (cart){
				if (!cart){
					console.log('Não foi encontrado cart para ' + _userId);
					return reply('Não foi encontrado cart para ' + _userId);
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
	path: '/cart',
	config: {
		handler: function(request, reply) {
			const _userId = request.payload.id;
			const _products = request.payload.products;

			console.log(`\n# Inserindo carrinho com userId: ${_userId}`);

			// Se já existe o cart para o usuário, sair
			models.cart.findById(_userId).then(function (cart) {
				if(cart){
					console.log('Cart for userId: ' + _userId + ' already exists!');
					return reply('Cart for userId: ' + _userId + ' already exists!');
				}

				// Adiciona o cartId para cada produto
		    	_products.forEach(function (product) {
		    		product.cartId = _userId;
		    	});

		    	// Cria o cart e salva no DB
		    	models.cart.create({
		    		id: _userId,
		    		products: _products
		    	},{
		    		include: [models.product]
		    	});

				// Retorna o valor do userId
			 	return reply({id: _userId});
			});
		},

		// Validação do payload
		validate: {
			payload: {
				id: joi.number().required(),

				products: joi.array().items(
					joi.object().keys({
						id: joi.number(),
						name: joi.string().required(),
						description: joi.string().required(),
						price: joi.number().required(),
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