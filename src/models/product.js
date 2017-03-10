import Sequelize from 'sequelize';


module.exports = function(sequelize, DataTypes) {
	// Model do Product
  	const Product = sequelize.define('product', {
		name: {
			type: Sequelize.STRING
		}
	});

  	// Sincroniza com o DB, cria uma nova tabela e insere dados base
	Product.sync({force: true}).then(function (){
		Product.bulkCreate([
			{
				name: "q"
			},
			{
				name: "w"
			},
			{
				name: "e"
			},
			{
				name: "r"
			}
		]);
	});

  return Product;
};