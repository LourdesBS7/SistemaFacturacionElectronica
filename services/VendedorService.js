const VendedorRepository = require('../repositories/VendedorRepository');

const VendedorService = {
  async crearVendedor(data) {
    return await VendedorRepository.crear(data);
  },

  async obtenerVendedores() {
    return await VendedorRepository.obtenerTodos();
  },

  async obtenerVendedorPorId(id) {
    const vendedor = await VendedorRepository.obtenerPorId(id);
    if (!vendedor) {
      throw new Error('Vendedor no encontrado');
    }
    return vendedor;
  },

  async actualizarVendedor(id, data) {
    const vendedor = await VendedorRepository.obtenerPorId(id);
    if (!vendedor) {
      throw new Error('Vendedor no encontrado');
    }
    await VendedorRepository.actualizar(id, data);
    return await VendedorRepository.obtenerPorId(id);
  },

  async eliminarVendedor(id) {
    const vendedor = await VendedorRepository.obtenerPorId(id);
    if (!vendedor) {
      throw new Error('Vendedor no encontrado');
    }
    return await VendedorRepository.eliminar(id);
  }
};

module.exports = VendedorService;
