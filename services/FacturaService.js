const FacturaRepository = require('../repositories/FacturaRepository');
const ItemFacturaRepository = require('../repositories/ItemFacturaRepository');
const ClienteRepository = require('../repositories/ClienteRepository');
const VendedorRepository = require('../repositories/VendedorRepository');
const ProductoRepository = require('../repositories/ProductoRepository');

const FacturaService = {
  async crearFactura(data) {
    const {
      idCliente,
      idVendedor,
      nitEmisor,
      codigoPV,
      items, // array: [{ idProducto, cantidad }]
      total,
      totalImpuestos
    } = data;

    // Validaciones básicas
    const cliente = await ClienteRepository.obtenerPorId(idCliente);
    if (!cliente) throw new Error('Cliente no encontrado');

    const vendedor = await VendedorRepository.obtenerPorId(idVendedor);
    if (!vendedor) throw new Error('Vendedor no encontrado');

    // if (!items || items.length === 0) {
    //   throw new Error('La factura debe tener al menos un producto');
    // }

    // // Cálculos
    // let total = 0;
    // let totalImpuestos = 0;
    // const tasaIVA = 0.13;

    // const itemDetalles = [];

    // for (const item of items) {
    //   const producto = await ProductoRepository.obtenerPorId(item.idProducto);
    //   if (!producto) throw new Error(`Producto con ID ${item.idProducto} no encontrado`);

    //   const precioUnitario = producto.precioUnitario;
    //   const subtotal = precioUnitario * item.cantidad;
    //   const impuesto = subtotal * tasaIVA;

    //   total += subtotal;
    //   totalImpuestos += impuesto;

    //   itemDetalles.push({
    //     idProducto: item.idProducto,
    //     cantidad: item.cantidad,
    //     precioUnitario
    //   });
    // }

    // Crear factura
    const factura = await FacturaRepository.crear({
      idCliente,
      idVendedor,
      nitcliente: cliente.NIT,
      titularCliente: cliente.nombre,
      fechaEmision: new Date(),
      nitEmisor,
      codigoPV,
      total,
      totalImpuestos,
      estado: 'emitida'
    });

    // Crear items de factura
    // for (const item of itemDetalles) {
    //   await ItemFacturaRepository.crear({
    //     idFactura: factura.idFactura,
    //     ...item
    //   });
    // }

    return factura;
  },

  async obtenerFacturaPorId(id) {
    const factura = await FacturaRepository.obtenerPorId(id);
    if (!factura) throw new Error('Factura no encontrada');
    return factura;
  },

  async obtenerTodas() {
    return await FacturaRepository.obtenerTodos();
  },

  async anularFactura(id) {
    const factura = await FacturaRepository.obtenerPorId(id);
    if (!factura) throw new Error('Factura no encontrada');

    return await FacturaRepository.actualizar(id, { estado: 'anulada' });
  },

  async actualizarFactura(id, data) {
    const factura = await FacturaRepository.obtenerPorId(id);
    if (!factura) throw new Error('Factura no encontrada');

    // Validaciones y actualizaciones
    const updatedFactura = await FacturaRepository.actualizar(id, data);
    return updatedFactura;
  },

  async eliminarFactura(id) {
    const factura = await FacturaRepository.obtenerPorId(id);
    if (!factura) throw new Error('Factura no encontrada');

    return await FacturaRepository.eliminar(id);
  }
};

module.exports = FacturaService;
