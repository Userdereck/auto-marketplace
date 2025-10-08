// backend/src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.json({ message: '🚀 AutoBid Pro API - Funcionando correctamente' });
});

// Rutas de vehículos
const vehicleRoutes = require('./routes/vehicles.routes');
app.use('/api/vehicles', vehicleRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

const corsOptions = {
  origin: [
    'https://tu-sitio.netlify.app',        // ← Tu dominio de Netlify
    'http://localhost:3000',               // Para desarrollo local
    'https://auto-marketplace-f5vb.onrender.com' // Opcional, para pruebas
  ],
  credentials: true
};
app.use(cors(corsOptions));