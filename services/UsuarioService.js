// services/UsuarioService.js
const UsuarioRepository = require('../repositories/UsuarioRepository');
const bcrypt = require('bcrypt');

const UsuarioService = {
  async registrarUsuario(data) {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const usuario = await UsuarioRepository.crear({
      ...data,
      password: hashedPassword
    });

    return usuario;
  },



  async obtenerUsuarioPorEmail(email) {
    return await UsuarioRepository.obtenerPorEmail(email);
  },

  async actualizarUsuario(id, data) {
    // Si se actualiza la contraseña, encriptarla
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    return await UsuarioRepository.actualizar(id, data);
  },

  async verificarPassword(usuario, password) {
    return await bcrypt.compare(password, usuario.password);
  },

  async obtenerTodos() {
    return await UsuarioRepository.obtenerTodos();
  }

};

module.exports = UsuarioService;