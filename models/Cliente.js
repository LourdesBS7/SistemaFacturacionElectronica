const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  NIT: DataTypes.INTEGER,
  direccion: DataTypes.STRING,
  telefono: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  tableName: 'clientes',
  timestamps: false
});

module.exports = Cliente;
