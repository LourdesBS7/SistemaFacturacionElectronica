const Vendedor = require('../models/Vendedor');

const VendedorRepository = {
  async crear(data) {
    return await Vendedor.create(data);
  },

  async obtenerTodos() {
    return await Vendedor.findAll();
  },

  async obtenerPorId(id) {
    return await Vendedor.findByPk(id);
  },

  async actualizar(id, data) {
    return await Vendedor.update(data, { where: { idVendedor: id } });
  },

  async eliminar(id) {
    return await Vendedor.destroy({ where: { idVendedor: id } });
  }
};

module.exports = VendedorRepository;
