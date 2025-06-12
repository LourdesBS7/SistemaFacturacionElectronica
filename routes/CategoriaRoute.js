const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');

router.post('/', CategoriaController.crear);
router.get('/', CategoriaController.obtenerTodas);
router.get('/:id', CategoriaController.obtenerPorId);
router.put('/:id', CategoriaController.actualizar);
router.delete('/:id', CategoriaController.eliminar);

module.exports = router;
