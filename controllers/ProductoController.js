const ProductoService = require('../services/ProductoService');

const ProductoController = {
  async crear(req, res) {
    try {
      const producto = await ProductoService.crearProducto(req.body);
      res.status(201).json(producto);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const productos = await ProductoService.obtenerProductos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  //IMPLEMETANDO CON IMAGEN
  async obtenerTodosConImagen(req, res) {
    try {
      const productos = await ProductoService.obtenerProductosConImagen();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const producto = await ProductoService.obtenerProductoPorId(req.params.id);
      res.json(producto);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const producto = await ProductoService.actualizarProducto(req.params.id, req.body);
      res.json(producto);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await ProductoService.eliminarProducto(req.params.id);
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }
};

module.exports = ProductoController;
