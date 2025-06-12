const ClienteRepository = require('../repositories/ClienteRepository');

const ClienteService = {
  async crearCliente(data) {
    // Puedes agregar validaciones aquí si lo deseas
    return await ClienteRepository.crear(data);
  },

  async obtenerClientes() {
    return await ClienteRepository.obtenerTodos();
  },

  async obtenerPorId(id) {
    const cliente = await ClienteRepository.obtenerPorId(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  },

  async actualizarCliente(id, data) {
    const cliente = await ClienteRepository.obtenerPorId(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    await ClienteRepository.actualizar(id, data);
    return await ClienteRepository.obtenerPorId(id); // retornar el actualizado
  },

  async eliminarCliente(id) {
    const cliente = await ClienteRepository.obtenerPorId(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return await ClienteRepository.eliminar(id);
  }
};

module.exports = ClienteService;
