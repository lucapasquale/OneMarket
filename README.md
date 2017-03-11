# OneMarket
Cart API with Hapi.js and PostgreSQL on ElasticBeanstalk

## Links:

GET - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/products

GET - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/cart/5

POST - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/cart

PUT - http://default-environment.ypmxh7rj5r.us-east-1.elasticbeanstalk.com/cart


## Example Body:

{
  "id": 5,
  "products": [
    {
      "name": "D",
      "description": "dddd",
      "price": 1.1,
      "quantity": 1
    },
    {
      "name": "C",
      "description": "ccc",
      "price": 3.0,
      "quantity": 2
    },
    {
      "name": "E",
      "description": "eeeee",
      "price": 0.5,
      "quantity": 4
    }
  ]
}