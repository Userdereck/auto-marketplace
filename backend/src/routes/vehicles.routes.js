// backend/src/routes/vehicles.routes.js
const express = require('express');
const router = express.Router();
const { getVehiclesByType, getVehicleById, getAllVehicles, placeBid } = require('../controllers/vehicles.controller');

// Nueva ruta: obtener todos los vehículos
router.get('/', getAllVehicles);

// Rutas existentes
router.get('/:type', getVehiclesByType);
router.get('/:id', getVehicleById);
router.post('/:id/bid', placeBid);

module.exports = router;