const express = require('express');
const router = express.Router();
const ItemFacturaController = require('../controllers/ItemFacturaController');

router.post('/', ItemFacturaController.crear);
router.get('/', ItemFacturaController.obtenerTodos);
router.get('/:id', ItemFacturaController.obtenerPorId);
router.put('/:id', ItemFacturaController.actualizar);
router.delete('/:id', ItemFacturaController.eliminar);

module.exports = router;
