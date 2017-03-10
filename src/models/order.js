var Sequelize = require('sequelize');
// import Sequelize from 'sequelize';

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

  return Order;
};