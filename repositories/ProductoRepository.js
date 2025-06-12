const Producto = require('../models/Producto');
const { Op } = require('sequelize');  // Agrega esta línea aquí
const Categoria = require('../models/Categoria');

const ProductoRepository = {
  async crear(data) {
    return await Producto.create(data);
  },

  async obtenerTodos() {
    return await Producto.findAll({
      attributes: { exclude: ['imagen'] }, // Excluimos la imagen por defecto
      include: [
        {
          model: Categoria,
          as: 'categoria'
        }
      ]
    });
  },

  async obtenerPorId(id) {
    return await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoria'
        }
      ]
    });
  },

  //IMPLEMENTANDO CON IMAGEN......
  async obtenerTodosConImagen() {
    return await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria'
        }
      ]
    });
  },

  async actualizar(id, data) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return await producto.update(data);
  },

  async eliminar(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return await producto.destroy();
  },

  async buscarPorNombre(nombre) {
    return await Producto.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${nombre}%`
        }
      },
      include: [
        {
          model: Categoria,
          as: 'categoria'
        }
      ]
    });
  },

  async obtenerPorCategoria(idCategoria) {
    return await Producto.findAll({
      where: {
        idCategoria
      },
      include: [
        {
          model: Categoria,
          as: 'categoria'
        }
      ]
    });
  }
};

module.exports = ProductoRepository;