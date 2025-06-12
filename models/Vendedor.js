const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vendedor = sequelize.define('Vendedor', {
  idVendedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  direccion: DataTypes.STRING,
  telefono: DataTypes.STRING,
  email: DataTypes.STRING,
  codVendedor: DataTypes.INTEGER
}, {
  tableName: 'vendedores',
  timestamps: false
});

module.exports = Vendedor;
