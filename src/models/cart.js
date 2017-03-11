var Sequelize = require('sequelize');

// import Sequelize from 'sequelize';

module.exports = function(sequelize, DataTypes) {
	// Model do Cart
	const Cart = sequelize.define('cart', {
		name: {
			type: Sequelize.STRING
		}
	});

	// Cart.belongsTo(user);
	// Cart.hasMany(product);

	Cart.sync({ force: true });

  return Cart;
};