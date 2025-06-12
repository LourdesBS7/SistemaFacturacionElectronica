const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente'); // Asegúrate de que la ruta sea correcta
const Vendedor = require('./Vendedor'); // Asegúrate de que la ruta sea correcta

const Factura = sequelize.define('Factura', {
  idFactura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nitcliente: DataTypes.INTEGER,
  titularCliente: DataTypes.STRING,
  fechaEmision: DataTypes.DATE,
  nitEmisor: DataTypes.STRING,
  codigoPV: DataTypes.STRING,
  total: DataTypes.DOUBLE,
  totalImpuestos: DataTypes.DOUBLE,
  estado: {
    type: DataTypes.ENUM('emitida', 'anulada', 'borrador'),
    defaultValue: 'borrador'
  }
}, {
  tableName: 'facturas',
  timestamps: false
});

// Relación con Cliente y Vendedor
Factura.belongsTo(Cliente, {
  foreignKey: 'idCliente'
});
Factura.belongsTo(Vendedor, {
  foreignKey: 'idVendedor'
});

module.exports = Factura;
