const sequelize = require('../config/database');

// Importar modelos con nombres de archivo capitalizados
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const Cliente = require('./Cliente');
const Vendedor = require('./Vendedor');
const Factura = require('./Factura');
const ItemFactura = require('./ItemFactura');
const Usuario = require('./Usuario'); //implementado despues de crear el modelo
// Definir relaciones entre modelos

// Producto pertenece a una categoría
Producto.belongsTo(Categoria, { foreignKey: 'idCategoria' });
Categoria.hasMany(Producto, { foreignKey: 'idCategoria' });

// Factura pertenece a un cliente y un vendedor
Factura.belongsTo(Cliente, { foreignKey: 'idCliente' });
Cliente.hasMany(Factura, { foreignKey: 'idCliente' });

Factura.belongsTo(Vendedor, { foreignKey: 'idVendedor' });
Vendedor.hasMany(Factura, { foreignKey: 'idVendedor' });

// ItemFactura pertenece a una factura y un producto
ItemFactura.belongsTo(Factura, { foreignKey: 'idFactura' });
Factura.hasMany(ItemFactura, { foreignKey: 'idFactura' });

ItemFactura.belongsTo(Producto, { foreignKey: 'idProducto' });
Producto.hasMany(ItemFactura, { foreignKey: 'idProducto' });

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: false }) // Puedes usar { force: true } solo en desarrollo
  .then(() => {
    console.log('✅ Modelos sincronizados correctamente');
  })
  .catch((err) => {
    console.error('❌ Error al sincronizar modelos:', err);
  });

module.exports = {
  sequelize,
  Categoria,
  Producto,
  Cliente,
  Vendedor,
  Factura,
  ItemFactura,
  Usuario  // Agregar Usuario
};
