var values = ["a", "b", "c", "d"];

module.exports = [
/*GET ALL CARTS*/
  {
    method: 'GET',
    path: '/carts',
    handler: function(request, reply) {
    	console.log("Get carts");
 		return reply('carts success');
	}
  },

/*GET CART BY ID*/
  {
    method: 'GET',
    path: '/carts/{id}',
    handler: function(request, reply) {
    	const id = request.params.id;

    	console.log("Get cart " + id);
    	var result = values[id] ? values[id] : "NOT FOUND";

 		return reply(result);
	}
  },

/*POST CART*/
  {
    method: 'POST',
    path: '/carts',
    handler: function(request, reply) {
    	console.log(request.payload);
    	const cart = request.payload;

    	console.log("Posted cart " + cart.id);
    	values.push(cart);

 		return reply('OK');
	}
  }
];