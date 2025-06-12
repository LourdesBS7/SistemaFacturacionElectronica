const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');

router.post('/', ProductoController.crear);
router.get('/', ProductoController.obtenerTodos);
router.get('/con-imagen', ProductoController.obtenerTodosConImagen); // Nueva ruta para productos con imagen
router.get('/:id', ProductoController.obtenerPorId);
router.put('/:id', ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);

module.exports = router;
