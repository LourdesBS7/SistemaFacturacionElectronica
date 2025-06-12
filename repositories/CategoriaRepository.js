const Categoria = require('../models/Categoria');

const CategoriaRepository = {
  async crear(data) {
    return await Categoria.create(data);
  },

  async obtenerTodos() {
    return await Categoria.findAll();
  },

  async obtenerPorId(id) {
    return await Categoria.findByPk(id);
  },

  async actualizar(id, data) {
    return await Categoria.update(data, { where: { idCategoria: id } });
  },

  async eliminar(id) {
    return await Categoria.destroy({ where: { idCategoria: id } });
  }
};

module.exports = CategoriaRepository;
