// backend/src/routes/vehicles.routes.js
const express = require('express');
const router = express.Router();
const { getVehiclesByType, getVehicleById, getAllVehicles, placeBid } = require('../controllers/vehicles.controller');

// Ruta raíz
router.get('/', getAllVehicles);

// Listar por tipo → /type/venta
router.get('/type/:type', getVehiclesByType);

// Obtener por ID → /123
router.get('/:id', getVehicleById);

// Pujar
router.post('/:id/bid', placeBid);

module.exports = router;