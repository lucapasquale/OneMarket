import Sequelize from 'sequelize';

const uri = process.env.AWS || 'postgres://postgres:2805@localhost:5432/carts';

const sequelize = new Sequelize(uri, {
  logging: !process.env.TEST_ENVIROMENT,
});

sequelize
  .authenticate()
  .then(() => (
    console.log('Connection has been established successfully.')
  ))
  .catch(err => (
    console.log('Unable to connect to the database:', err)
  ));


// Model do Product
const Product = sequelize.define('product', {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.FLOAT,
  },
  quantity: {
    type: Sequelize.INTEGER,
  },
});

// Model do Cart
const Cart = sequelize.define('cart', {

});

// Relations
Cart.hasMany(Product);
Product.belongsTo(Cart);

// Sincroniza DB e cria arquivos base
sequelize.sync({ force: true }).then(() => {
  Cart.create({
    products: [{
      name: 'A',
      description: 'aa',
      price: 1.5,
      quantity: 2,
    },
    {
      name: 'B',
      description: 'bbb',
      price: 3.5,
      quantity: 4,
    }],
  }, {
    include: [Product],
  });
});

module.exports = {
  product: Product,
  cart: Cart,
};
