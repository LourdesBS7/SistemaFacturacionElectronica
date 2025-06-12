// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('vendedor', 'jefeVentas', 'administrador'),
    allowNull: false,
    defaultValue: 'vendedor'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo'
  },
  sexo: {
    type: DataTypes.ENUM('masculino', 'femenino'),
    allowNull: true
  },
  foto: {
    type: DataTypes.STRING,  // Para guardar la ruta o URL de la foto
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;