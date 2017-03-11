# OneMarket
Cart API with Hapi.js and PostgreSQL on ElasticBeanstalk

## Links:

GET - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/products

GET - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/cart/5

POST - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/cart

PUT - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/cart


## Example Body:

{
	"userId":"5",
	"orders":
	[
		{
			"quantity":2,
			"productId":3
		},
		{
			"quantity":4,
			"productId":1
		},
		{
			"quantity":1,
			"productId":2
		}
	]
}
