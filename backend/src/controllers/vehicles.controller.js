// backend/src/controllers/vehicles.controller.js
const Vehicle = require('../models/Vehicle');

const getVehiclesByType = (req, res) => {
  const { type } = req.params; // 'venta' o 'subasta'
  if (type !== 'venta' && type !== 'subasta') {
    return res.status(400).json({ error: 'Tipo inválido. Usa "venta" o "subasta".' });
  }
  const vehicles = Vehicle.findByType(type);
  res.json(vehicles);
};

const placeBid = (req, res) => {
  const { id } = req.params;
  const { bidAmount } = req.body;

  if (!bidAmount || bidAmount <= 0) {
    return res.status(400).json({ error: 'Monto de puja inválido.' });
  }

  const updatedVehicle = Vehicle.placeBid(id, bidAmount);
  if (updatedVehicle) {
    res.json({ success: true, vehicle: updatedVehicle });
  } else {
    res.status(400).json({ error: 'No se pudo realizar la puja.' });
  }
};

module.exports = {
  getVehiclesByType,
  placeBid
};