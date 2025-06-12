const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Factura = require('./Factura');
const Producto = require('./Producto');

const ItemFactura = sequelize.define('ItemFactura', {
  idItem: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: DataTypes.INTEGER,
  precioUnitario: DataTypes.DOUBLE
}, {
  tableName: 'items_factura',
  timestamps: false
});

// Relaciones
ItemFactura.belongsTo(Factura, {
  foreignKey: 'idFactura'
});
ItemFactura.belongsTo(Producto, {
  foreignKey: 'idProducto'
});

module.exports = ItemFactura;
