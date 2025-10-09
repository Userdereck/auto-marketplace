// backend/src/controllers/vehicles.controller.js
const Vehicle = require('../models/Vehicle');

/**
 * Obtiene todos los vehículos (venta + subasta)
 */
const getAllVehicles = (req, res) => {
  try {
    const vehicles = Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    console.error('Error en getAllVehicles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene vehículos por tipo: 'venta' o 'subasta'
 */
const getVehiclesByType = (req, res) => {
  try {
    const { type } = req.params;
    if (type !== 'venta' && type !== 'subasta') {
      return res.status(400).json({ error: 'Tipo inválido. Usa "venta" o "subasta".' });
    }
    const vehicles = Vehicle.findByType(type);
    res.json(vehicles);
  } catch (error) {
    console.error('Error en getVehiclesByType:', error);
    res.status(500).json({ error: 'Error al cargar los vehículos' });
  }
};

/**
 * Obtiene un vehículo por ID
 */
const getVehicleById = (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado', id });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error en getVehicleById:', error);
    res.status(500).json({ error: 'Error al cargar el vehículo' });
  }
};

/**
 * Registra una puja para un vehículo en subasta
 */
const placeBid = (req, res) => {
  try {
    const { id } = req.params;
    const { bidAmount } = req.body;

    if (!bidAmount || bidAmount <= 0) {
      return res.status(400).json({ error: 'Monto de puja inválido.' });
    }

    const updatedVehicle = Vehicle.placeBid(id, bidAmount);
    if (updatedVehicle) {
      res.json({ success: true, vehicle: updatedVehicle });
    } else {
      res.status(400).json({ error: 'No se pudo realizar la puja. Verifica que el vehículo esté en subasta.' });
    }
  } catch (error) {
    console.error('Error en placeBid:', error);
    res.status(500).json({ error: 'Error al procesar la puja' });
  }
};

module.exports = {
  getAllVehicles,
  getVehiclesByType,
  getVehicleById,
  placeBid
};