const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/FacturaController');

router.post('/', FacturaController.crear);
router.get('/', FacturaController.obtenerTodas);
router.get('/:id', FacturaController.obtenerPorId);
router.put('/:id', FacturaController.actualizar);
router.delete('/:id', FacturaController.eliminar);

module.exports = router;
