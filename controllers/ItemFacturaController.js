const ItemFacturaService = require('../services/ItemFacturaService');

const ItemFacturaController = {
  async crear(req, res) {
    try {
      const item = await ItemFacturaService.crearItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const items = await ItemFacturaService.obtenerItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const item = await ItemFacturaService.obtenerItemPorId(req.params.id);
      res.json(item);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const item = await ItemFacturaService.actualizarItem(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await ItemFacturaService.eliminarItem(req.params.id);
      res.json({ mensaje: 'Item de factura eliminado correctamente' });
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }
};

module.exports = ItemFacturaController;
