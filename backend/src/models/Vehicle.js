// backend/src/models/Vehicle.js

// Datos simulados en memoria (reemplazable por MongoDB más adelante)
let vehicles = [
  // === VEHÍCULOS EN VENTA (tipo: 'venta') ===
  {
    id: 1,
    type: 'venta',
    name: "Toyota Corolla Hybrid 2023",
    brand: "Toyota",
    year: 2023,
    location: "California, USA",
    price: 24500,
    currentBid: null,
    endTime: null,
    image: "https://placehold.co/600x400/1e3c72/white?text=Toyota+Corolla+2023",
    description: "Híbrido, 12,000 km, impecable, garantía vigente, certificado de bajo consumo."
  },
  {
    id: 2,
    type: 'venta',
    name: "Ford F-150 XLT 2022",
    brand: "Ford",
    year: 2022,
    location: "Texas, USA",
    price: 32900,
    currentBid: null,
    endTime: null,
    image: "https://placehold.co/600x400/2a5298/white?text=Ford+F150+2022",
    description: "Pickup 4x4, motor V6, 25,000 km, caja automática, accesorios incluidos."
  },
  {
    id: 3,
    type: 'venta',
    name: "Honda CR-V EX-L 2021",
    brand: "Honda",
    year: 2021,
    location: "Florida, USA",
    price: 28900,
    currentBid: null,
    endTime: null,
    image: "https://placehold.co/600x400/3498db/white?text=Honda+CRV+2021",
    description: "SUV familiar, cuero, techo solar, solo 18,500 km, impecable estado."
  },

  // === MAQUINARIA EN SUBASTA (tipo: 'subasta') ===
  {
    id: 101,
    type: 'subasta',
    name: "Excavadora Caterpillar 320 GC",
    brand: "Caterpillar",
    year: 2021,
    location: "Texas, USA",
    price: null,
    currentBid: 89500,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // +2 días
    image: "https://placehold.co/600x400/e74c3c/white?text=Caterpillar+320",
    description: "20,000 horas de operación, mantenimiento al día, lista para trabajo pesado."
  },
  {
    id: 102,
    type: 'subasta',
    name: "Tractor John Deere 6150R",
    brand: "John Deere",
    year: 2020,
    location: "Iowa, USA",
    price: null,
    currentBid: 125000,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(), // +1d 12h
    image: "https://placehold.co/600x400/27ae60/white?text=John+Deere+6150R",
    description: "Tractor agrícola de alta potencia, 1,200 horas, sistema GPS integrado."
  },
  {
    id: 103,
    type: 'subasta',
    name: "Cargador Frontal Komatsu WA470",
    brand: "Komatsu",
    year: 2019,
    location: "Arizona, USA",
    price: null,
    currentBid: 142000,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 días
    image: "https://placehold.co/600x400/8e44ad/white?text=Komatsu+WA470",
    description: "Máquina robusta para minería y construcción, 8,500 horas, certificado de inspección incluido."
  },
  {
    id: 104,
    type: 'subasta',
    name: "Camión Volvo VNL 760",
    brand: "Volvo",
    year: 2022,
    location: "Georgia, USA",
    price: null,
    currentBid: 98000,
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // +18 horas
    image: "https://placehold.co/600x400/16a085/white?text=Volvo+VNL+760",
    description: "Camión de carga larga distancia, motor D13, 150,000 millas, cabina dormitorio."
  }
];

// Métodos del "modelo" (simulando una capa de acceso a datos)
const Vehicle = {
  findAll() {
    return vehicles;
  },

  findByType(type) {
    return vehicles.filter(v => v.type === type);
  },

  findById(id) {
    return vehicles.find(v => v.id == id);
  },

  placeBid(id, bidAmount) {
    const vehicle = vehicles.find(v => v.id == id);
    if (vehicle && vehicle.type === 'subasta') {
      // Solo permitir pujas mayores a la actual
      if (bidAmount > (vehicle.currentBid || 0)) {
        vehicle.currentBid = bidAmount;
        return { ...vehicle }; // Devolver copia actualizada
      }
    }
    return null;
  },

  // Método para obtener todas las marcas únicas (útil para filtros)
  getBrands() {
    return [...new Set(vehicles.map(v => v.brand))];
  },

  // Método para obtener todos los tipos de equipo
  getEquipmentTypes() {
    return [
      { value: 'venta', label: 'Automóviles' },
      { value: 'subasta', label: 'Maquinaria Industrial' }
    ];
  }
};

module.exports = Vehicle;