const FacturaService = require('../services/FacturaService');

const FacturaController = {
  async crear(req, res) {
    try {
      const factura = await FacturaService.crearFactura(req.body);
      res.status(201).json(factura);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async obtenerTodas(req, res) {
    try {
      const facturas = await FacturaService.obtenerTodas();
      res.json(facturas);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const factura = await FacturaService.obtenerFacturaPorId(req.params.id);
      res.json(factura);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const factura = await FacturaService.actualizarFactura(req.params.id, req.body);
      res.json(factura);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  },
  async eliminar(req, res) {
    try {
      await FacturaService.eliminarFactura(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }
};

module.exports = FacturaController;
