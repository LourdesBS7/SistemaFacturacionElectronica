// routes/UsuarioRoute.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Rutas públicas
router.post('/registrar', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// Rutas protegidas (requieren autenticación)
router.get('/', UsuarioController.obtenerUsuarios);
router.put('/:id', UsuarioController.actualizarUsuario);

module.exports = router;