import joi from 'joi';
import models from '../models/models';

// METHODS
module.exports = [

	// GET - Hello World
	{
		method: 'GET',
		path: '/test',
		handler: function(request, reply) {

			return reply('Hello World!');
		}
	},

	// GET - Obtem todos os produtos listados
	{
		method: 'GET',
		path: '/products',
		handler: async function(request, reply) {

			console.log('\n# Buscando todos os produtos');

			let products = await models.product.findAll();
			if (products) return reply(products);
			
			// Caso não encontre nenhum produto
			else return reply('Erro ao buscar os produtos!');
		}
	},

	// GET - Dado um username, encontrar todos os produtos no cart deste usuário
	{
		method: 'GET',
		path: '/cart/{userId}',
		handler: async function(request, reply) {
			const _userId = request.params.userId;

			console.log(`\n# Buscando carrinho para o userId: ${_userId}`);

			// Busca o cart no DB pela userId, e inclui os produtos associados a ele
			let cart = await models.cart.findById(_userId, {include: [models.product]});
			if (cart) return reply(cart.dataValues);

			// Caso não encontre o cart para o userId
			else return reply('Não foi encontrado cart para ' + _userId);
		}
	},

	// POST - Insere o carrinho no DB
	{
	method: 'POST',
	path: '/cart',
	config: {
		handler: async function(request, reply) {
			const _userId = request.payload.id;
			const _products = request.payload.products;

			console.log(`\n# Inserindo carrinho com userId: ${_userId}`);

			// Se já existe o cart para o usuário, sair
			let cart = await models.cart.findById(_userId);
			if (cart) return reply('Cart para o usuário ' + _userId + ' já existe!');

			else {
				// Adiciona o cartId para cada produto
		    	_products.forEach(function (product) {
		    		product.cartId = _userId;
		    	});

		    	// Cria o cart e salva no DB
		    	await models.cart.create({
		    		id: _userId,
		    		products: _products
		    	},{
		    		include: [models.product]
		    	});

				// Retorna o valor do userId
			 	return reply({id: _userId});
			}
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
		handler: async function(request, reply) {
	    	const _userId = request.payload.id;
			const _products = request.payload.products;

	    	console.log(`\n# Atualizando carrinho com userId: ${_userId}`);

			// Deleta os produtos com cartId = userId
			await models.product.destroy({where: {cartId: _userId}});

			// Deleta cart antigo
			await models.cart.destroy({where: {id: _userId}});
			

			// Adiciona o cartId para cada produto
	    	_products.forEach(function (product) {
	    		product.cartId = _userId;
	    	});

	    	// Cria o cart e salva no DB
	    	await models.cart.create({
	    		id: _userId,
	    		products: _products
	    	},{
	    		include: [models.product]
	    	});

			// Retorna o valor do userId
		 	return reply({id: _userId});
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