// backend/src/routes/vehicles.routes.js
const express = require('express');
const router = express.Router();
const { getVehiclesByType, placeBid } = require('../controllers/vehicles.controller');

// GET /api/vehicles/:type → 'venta' o 'subasta'
router.get('/:type', getVehiclesByType);

// POST /api/vehicles/:id/bid
router.post('/:id/bid', placeBid);

module.exports = router;