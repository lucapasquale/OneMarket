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
	path: '/cart',
	config:{
		handler: function(request, reply) {
	    	const _userId = request.payload.id;
			const _products = request.payload.products;

	    	console.log(`\n# Atualizando carrinho com userId: ${_userId}`);

			// Deleta os produtos com cartId = userId
			models.product.destroy({
				where: {
					cartId: _userId
				}
			})
			// Deleta carrinho antigo do orders
			.then(function () {
				models.cart.destroy({
					where: {
						id: _userId,
					}
				});
			})
			// Cria o novo cart e salva no DB
			.then(function () {
				// Adiciona o cartId para cada produto
		    	_products.forEach(function (product) {
		    		product.cartId = _userId;
		    	});

		    	// Cria o cart
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
	}
];