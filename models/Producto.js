const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./Categoria'); // Asegúrate de que la ruta sea correcta

const Producto = sequelize.define('Producto', {
  idProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.STRING,
  precioUnitario: DataTypes.DOUBLE,
  marca: DataTypes.STRING,
  tallaPrenda: DataTypes.STRING,
  genero: DataTypes.STRING,
  stock: DataTypes.INTEGER,
  imagen: {
    type: DataTypes.STRING,
    allowNull: true // Esto permite que la imagen sea opcional
  }
}, {
  tableName: 'productos',
  timestamps: false
});

// Relación con Categoría
Producto.belongsTo(Categoria, {
  foreignKey: 'idCategoria',
  as: 'categoria'
});

module.exports = Producto;
