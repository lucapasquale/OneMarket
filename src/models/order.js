import Sequelize from 'sequelize';

module.exports = function(sequelize, DataTypes) {
	// Model do Order
	const Order = sequelize.define('order', {
		userId: {
			type: Sequelize.INTEGER
		},
		productId: {
			type: Sequelize.INTEGER
		},
		quantity: {
			type: Sequelize.INTEGER
		}
	});

  	// Sincroniza com o DB, cria uma nova tabela e insere dados base
	Order.sync({force: true}).then(function (){
		Order.bulkCreate([
			{
				userId: 5,
				productId: 1,
				quantity: 2
			},
			{
				userId: 5,
				productId: 3,
				quantity: 1
			},
			{
				userId: 6,
				productId: 2,
				quantity: 1
			}
		]);
	});

  return Order;
};