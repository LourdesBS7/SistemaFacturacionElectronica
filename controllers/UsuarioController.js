// controllers/UsuarioController.js
const UsuarioService = require('../services/UsuarioService');

const UsuarioController = {
  async registrar(req, res) {
    try {
      const usuario = await UsuarioService.registrarUsuario(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const usuario = await UsuarioService.obtenerUsuarioPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Usuario no encontrado' });
      }

      const passwordValido = await UsuarioService.verificarPassword(usuario, password);
      if (!passwordValido) {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }

      res.json({
        id: usuario.idUsuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
        sexo: usuario.sexo,
        foto: usuario.foto
      });
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  async actualizarUsuario(req, res) {
    try {
      const usuario = await UsuarioService.actualizarUsuario(req.params.id, req.body);
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  }
};

module.exports = UsuarioController;