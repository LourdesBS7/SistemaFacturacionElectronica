const Factura = require('../models/Factura');
const Cliente = require('../models/Cliente');
const Vendedor = require('../models/Vendedor');
const ItemFactura = require('../models/ItemFactura');

const FacturaRepository = {
  async crear(data) {
    console.log('Datos de la factura a crear:', data); // Debugging line to check data
    return await Factura.create(data);
  },

  async obtenerTodos() {
    return await Factura.findAll({ include: [Cliente, Vendedor, ItemFactura] });
  },

  async obtenerPorId(id) {
    return await Factura.findByPk(id, { include: [Cliente, Vendedor, ItemFactura] });
  },

  async actualizar(id, data) {
    return await Factura.update(data, { where: { idFactura: id } });
  },

  async eliminar(id) {
    return await Factura.destroy({ where: { idFactura: id } });
  }
};

module.exports = FacturaRepository;
