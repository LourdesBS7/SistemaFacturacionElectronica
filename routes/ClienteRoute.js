const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.post('/', ClienteController.crear);
router.get('/', ClienteController.obtenerTodos);
router.get('/:id', ClienteController.obtenerPorId);
router.put('/:id', ClienteController.actualizar);
router.delete('/:id', ClienteController.eliminar);

module.exports = router;
