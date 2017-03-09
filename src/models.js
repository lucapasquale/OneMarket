var Sequelize = require('sequelize');

/*Inicia o client do DB*/
var sequelize = new Sequelize("postgres://postgres:2805@localhost:5432/carts");
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


var Product = sequelize.define('product', {
	name: {
		type: Sequelize.STRING
	}
});

var Order = sequelize.define('order', {
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


//Sincroniza o DB, e force = true faz com que a tabela reinicie quando criado
Product.sync({force: true}).then(function (){

	Product.bulkCreate([
		{
			name: "A"
		},
		{
			name: "B"
		},
		{
			name: "C"
		},
		{
			name: "D"
		}
	]);

	return Product;
});

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

	return Order;
});

module.exports = {
	Product: Product,
	Order: Order
}