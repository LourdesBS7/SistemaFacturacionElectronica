const VendedorService = require('../services/VendedorService');

const VendedorController = {
  async crear(req, res) {
    try {
      const vendedor = await VendedorService.crearVendedor(req.body);
      res.status(201).json(vendedor);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const vendedores = await VendedorService.obtenerVendedores();
      res.json(vendedores);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const vendedor = await VendedorService.obtenerVendedorPorId(req.params.id);
      res.json(vendedor);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const vendedor = await VendedorService.actualizarVendedor(req.params.id, req.body);
      res.json(vendedor);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await VendedorService.eliminarVendedor(req.params.id);
      res.json({ mensaje: 'Vendedor eliminado correctamente' });
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }
};

module.exports = VendedorController;
