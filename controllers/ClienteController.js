const ClienteService = require('../services/ClienteService');

const ClienteController = {
  async crear(req, res) {
    try {
      const cliente = await ClienteService.crearCliente(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const clientes = await ClienteService.obtenerClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const cliente = await ClienteService.obtenerPorId(req.params.id);
      res.json(cliente);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const cliente = await ClienteService.actualizarCliente(req.params.id, req.body);
      res.json(cliente);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await ClienteService.eliminarCliente(req.params.id);
      res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }
};

module.exports = ClienteController;
