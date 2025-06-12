const ItemFactura = require('../models/ItemFactura');
const Producto = require('../models/Producto');

const ItemFacturaRepository = {
  async crear(data) {
    console.log('Datos del item factura a crear:', data); // Debugging line to check data
    return await ItemFactura.create(data);
  },

  async obtenerTodos() {
    return await ItemFactura.findAll({ include: Producto });
  },

  async obtenerPorId(id) {
    return await ItemFactura.findByPk(id, { include: Producto });
  },

  async actualizar(id, data) {
    console.log(`Actualizando item factura con ID: ${id}`, data);
    return await ItemFactura.update(data, { where: { idItem: id } });
  },

  async eliminar(id) {
    return await ItemFactura.destroy({ where: { idItem: id } });
  }
};

module.exports = ItemFacturaRepository;
