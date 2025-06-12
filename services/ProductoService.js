const ProductoRepository = require('../repositories/ProductoRepository');
const CategoriaRepository = require('../repositories/CategoriaRepository');

const ProductoService = {
  async crearProducto(data) {
    const categoria = await CategoriaRepository.obtenerPorId(data.idCategoria);
    if (!categoria) throw new Error('Categoría no encontrada');

    return await ProductoRepository.crear(data);
  },

  async obtenerProductos() {
    return await ProductoRepository.obtenerTodos();
  },

  //IMPLEMETANDO CON IMAGEN
  async obtenerProductosConImagen() {
    return await ProductoRepository.obtenerTodosConImagen();
  },

  async obtenerProductoPorId(id) {
    const producto = await ProductoRepository.obtenerPorId(id);
    if (!producto) throw new Error('Producto no encontrado');
    return producto;
  },

  async actualizarProducto(id, data) {
    const producto = await ProductoRepository.obtenerPorId(id);
    if (!producto) throw new Error('Producto no encontrado');

    return await ProductoRepository.actualizar(id, data);
  },

  async eliminarProducto(id) {
    const producto = await ProductoRepository.obtenerPorId(id);
    if (!producto) throw new Error('Producto no encontrado');

    return await ProductoRepository.eliminar(id);
  }
};

module.exports = ProductoService;
