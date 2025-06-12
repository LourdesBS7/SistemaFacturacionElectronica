const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: false,  // Puedes activarlo poniendo true si quieres ver consultas SQL
});

module.exports = sequelize;
