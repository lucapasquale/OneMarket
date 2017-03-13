import joi from 'joi';
import models from '../models/models';

// METHODS
module.exports = [

  // GET - Hello World
  {
    method: 'GET',
    path: '/test',
    handler(request, reply) {
      return reply('Hello World!');
    },
  },

  // GET - Obtem todos os produtos listados
  {
    method: 'GET',
    path: '/products',
    async handler(request, reply) {
      console.log('\n# Buscando todos os produtos');

      const products = await models.product.findAll({ attributes: ['name', 'description', 'price', 'quantity'] });
      if (products) return reply({ products });

      // Caso não encontre nenhum produto
      return reply('Erro ao buscar os produtos!');
    },
  },

  // GET - Dado um username, encontrar todos os produtos no cart deste usuário
  {
    method: 'GET',
    path: '/cart/{userId}',
    async handler(request, reply) {
      const userId = request.params.userId;

      console.log(`\n# Buscando carrinho para o userId: ${userId}`);

      // Configura a query para incluir os produtos e somente alguns atributos
      const query = {
        where: { id: userId },
        include: { model: models.product, attributes: ['name', 'description', 'price', 'quantity'] },
        attributes: ['id'],
      };

      // Busca o cart no DB pela userId, e inclui os produtos associados a ele
      const cart = await models.cart.findOne(query);
      if (cart) return reply(cart.dataValues);

      // Caso não encontre o cart para o userId
      return reply(`Não foi encontrado cart para ${userId}`);
    },
  },

  // POST - Insere o carrinho no DB
  {
    method: 'POST',
    path: '/cart',
    config: {
      async handler(request, reply) {
        const userId = request.payload.id;
        const products = request.payload.products;

        console.log(`\n# Inserindo carrinho com userId: ${userId}`);

        // Se já existe o cart para o usuário, sair
        const cart = await models.cart.findById(userId);
        if (cart) return reply(`Cart ${userId} já existe!`);

        // Adiciona o cartId para cada produto
        products.forEach((item) => {
          const product = item;
          product.cartId = userId;
        });

        // Cria o cart e salva no DB
        await models.cart.create({
          id: userId,
          products,
        }, {
          include: [models.product],
        });

        // Retorna o valor do userId
        return reply({ id: userId });
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
              quantity: joi.number().required(),
            }),
          ),
        },
      },
    },
  },

  // Atualiza o carrinho que já está no DB
  {
    method: 'PUT',
    path: '/cart',
    config: {
      async handler(request, reply) {
        const userId = request.payload.id;
        const products = request.payload.products;

        console.log(`\n# Atualizando carrinho com userId: ${userId}`);

        // Deleta os produtos com cartId = userId
        await models.product.destroy({ where: { cartId: userId } });

        // Deleta cart antigo
        await models.cart.destroy({ where: { id: userId } });

        // Adiciona o cartId para cada produto
        products.forEach((item) => {
          const product = item;
          product.cartId = userId;
        });

        // Cria o cart e salva no DB
        await models.cart.create({
          id: userId,
          products,
        }, {
          include: [models.product],
        });

        // Retorna o valor do userId
        return reply({ id: userId });
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
              quantity: joi.number().required(),
            }),
          ),
        },
      },
    },
  },
];
