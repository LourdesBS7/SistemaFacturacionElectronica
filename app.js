const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000', // Permite CORS desde el mismo puerto
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend'))); // Servir archivos estáticos

// Rutas
app.use('/api/categorias', require('./routes/CategoriaRoute'));
app.use('/api/clientes', require('./routes/ClienteRoute'));
app.use('/api/productos', require('./routes/ProductoRoute'));
app.use('/api/vendedores', require('./routes/VendedorRoute'));
app.use('/api/facturas', require('./routes/FacturaRoute'));
app.use('/api/items', require('./routes/ItemFacturaRoute'));
app.use('/api/usuarios', require('./routes/UsuarioRoute')); //--------

// Rutas para archivos específicos
app.get('/', (req, res) => {
    // Redirigir a login
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/principal', (req, res) => {
    // No necesitamos verificar sesión aquí, lo hacemos en el frontend
    res.sendFile(path.join(__dirname, 'frontend', 'principal.html'));
});

// Ruta de logout
app.get('/logout', (req, res) => {
    res.redirect('/login');
});

// Sincronización con la base de datos y arranque del servidor
db.sequelize.sync({ force: false }) // Cambia a true si quieres resetear DB cada vez
  .then(() => {
    console.log('Base de datos conectada y modelos sincronizados.');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al conectar con la base de datos:', error);
  });
