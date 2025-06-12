// repositories/UsuarioRepository.js
const Usuario = require('../models/Usuario');

const UsuarioRepository = {
  async crear(data) {
    return await Usuario.create(data);
  },

  async obtenerPorEmail(email) {
    return await Usuario.findOne({ where: { email } });
  },

  async obtenerPorId(id) {
    return await Usuario.findByPk(id);
  },

  async obtenerTodos() {
    return await Usuario.findAll();
  },

  async actualizar(id, data) {
    return await Usuario.update(data, { where: { idUsuario: id } });
  },

  async eliminar(id) {
    return await Usuario.destroy({ where: { idUsuario: id } });
  }
};

module.exports = UsuarioRepository;