var Sequelize = require('sequelize');
// import Sequelize from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:2805@localhost:5432/carts');
// const sequelize = new Sequelize('postgres://lucapasquale:luca1234@cartsapi.c5v1qh5ovkon.us-east-1.rds.amazonaws.com:5432/carts');
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


// Model do Product
const Product = sequelize.define('product', {
	name: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	},
	price: {
		type: Sequelize.FLOAT
	},
	quantity: {
		type: Sequelize.INTEGER
	}
});

// Model do Cart
const Cart = sequelize.define('cart', {

});

// Relations
Cart.hasMany(Product);
Product.belongsTo(Cart);

// Sincroniza DB e cria arquivos base
sequelize.sync({force: true}).then(function () {
	Cart.create({
		products: [{
			name: 'A',
			description: 'aa',
			price: 1.5,
			quantity: 2
		},
		{
			name: 'B',
			description: 'bbb',
			price: 3.5,
			quantity: 4
		}]
	}, {
		include: [ Product ]
	});
});

module.exports = {
	product: Product,
	cart: Cart
};