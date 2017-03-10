var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
// import fs from 'fs';
// import path from 'path';
// import Sequelize from 'sequelize';

const sequelize = new Sequelize('postgres://lucapasquale:luca1234@cartsapi.c5v1qh5ovkon.us-east-1.rds.amazonaws.com:5432/carts');
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;