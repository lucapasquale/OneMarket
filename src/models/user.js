var Sequelize = require('sequelize');
var models = require('../models');
// import Sequelize from 'sequelize';

module.exports = function(sequelize, DataTypes) {
	// Model do User
	const User = sequelize.define('user', {
		name: {
			type: Sequelize.STRING
		},
		lastName: {
			type: Sequelize.STRING
		},
		username: {
			type: Sequelize.STRING
		}
	});

	// console.log('user');
	// console.log(models);

	// User.hasOne(models.cart);
	User.sync({ force: true }).then(function (){
		return User.create({
			name: 'Luca',
			lastName: 'Pasquale',
			username: 'lucapasquale'
		});
	});

  return User;
};