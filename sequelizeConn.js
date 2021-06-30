const { Sequelize } = require('sequelize');

module.exports = new Sequelize('test', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
});
