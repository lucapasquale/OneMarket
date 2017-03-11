var Sequelize = require('sequelize');
// import Sequelize from 'sequelize';


module.exports = function(sequelize, DataTypes) {
	// Model do Product
  	const Product = sequelize.define('product', {
		name: {
			type: Sequelize.STRING
		},
		description: {
			type: Sequelize.STRING
		},
		category: {
			type: Sequelize.STRING
		}
	});

  	Product.sync({ force: true });
  	
  return Product;
};