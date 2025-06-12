const Cliente = require('../models/Cliente');

const ClienteRepository = {
  async crear(data) {
    return await Cliente.create(data);
  },

  async obtenerTodos() {
    return await Cliente.findAll();
  },

  async obtenerPorId(id) {
    return await Cliente.findByPk(id);
  },

  async actualizar(id, data) {
    return await Cliente.update(data, { where: { idCliente: id } });
  },

  async eliminar(id) {
    return await Cliente.destroy({ where: { idCliente: id } });
  }
};

module.exports = ClienteRepository;
