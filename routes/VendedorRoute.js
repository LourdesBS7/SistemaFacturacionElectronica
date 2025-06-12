const express = require('express');
const router = express.Router();
const VendedorController = require('../controllers/VendedorController');

router.post('/', VendedorController.crear);
router.get('/', VendedorController.obtenerTodos);
router.get('/:id', VendedorController.obtenerPorId);
router.put('/:id', VendedorController.actualizar);
router.delete('/:id', VendedorController.eliminar);

module.exports = router;
