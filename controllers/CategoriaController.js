const CategoriaService = require('../services/CategoriaService');

const CategoriaController = {
  async crear(req, res) {
    try {
      const categoria = await CategoriaService.crearCategoria(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async obtenerTodas(req, res) {
    try {
      const categorias = await CategoriaService.obtenerCategorias();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const categoria = await CategoriaService.obtenerCategoriaPorId(req.params.id);
      res.json(categoria);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const categoria = await CategoriaService.actualizarCategoria(req.params.id, req.body);
      res.json(categoria);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await CategoriaService.eliminarCategoria(req.params.id);
      res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }
};

module.exports = CategoriaController;
