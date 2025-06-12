const CategoriaRepository = require('../repositories/CategoriaRepository');

const CategoriaService = {
  async crearCategoria(data) {
    return await CategoriaRepository.crear(data);
  },

  async obtenerCategorias() {
    return await CategoriaRepository.obtenerTodos();
  },

  async obtenerCategoriaPorId(id) {
    const categoria = await CategoriaRepository.obtenerPorId(id);
    if (!categoria) throw new Error('Categoría no encontrada');
    return categoria;
  },

  async actualizarCategoria(id, data) {
    const categoria = await CategoriaRepository.obtenerPorId(id);
    if (!categoria) throw new Error('Categoría no encontrada');

    return await CategoriaRepository.actualizar(id, data);
  },

  async eliminarCategoria(id) {
    const categoria = await CategoriaRepository.obtenerPorId(id);
    if (!categoria) throw new Error('Categoría no encontrada');

    return await CategoriaRepository.eliminar(id);
  }
};

module.exports = CategoriaService;
