// frontend/public/js/app.js
import { showToast } from './utils.js';
import { createVehicleCard } from './components.js';

// ✅ URL CORRECTA: apunta a la raíz de la API de vehículos
const API_BASE = 'https://auto-marketplace-f5vb.onrender.com/api/vehicles';

let allVehicles = [];
let filteredVehicles = [];

async function loadAllVehicles() {
  try {
    const [ventaRes, subastaRes] = await Promise.all([
      fetch(`${API_BASE}/type/venta`),
      fetch(`${API_BASE}/type/subasta`)
    ]);

    if (!ventaRes.ok || !subastaRes.ok) {
      throw new Error('Error al cargar los datos del servidor');
    }

    const venta = await ventaRes.json();
    const subasta = await subastaRes.json();

    allVehicles = [...venta, ...subasta];
    filteredVehicles = [...allVehicles];

    renderVehicles(filteredVehicles);
    updateResultsCount();
  } catch (error) {
    console.error('Error al cargar vehículos:', error);
    document.getElementById('vehicles-grid').innerHTML = 
      '<p class="error">❌ No se pudieron cargar los equipos. Verifica que el backend esté corriendo.</p>';
    showToast('Error al conectar con el servidor.', 'error');
  }
}

function renderVehicles(vehicles) {
  const grid = document.getElementById('vehicles-grid');
  
  if (vehicles.length === 0) {
    grid.innerHTML = '<p class="no-results">No se encontraron equipos con los filtros aplicados.</p>';
    return;
  }

  const vehiclesHtml = vehicles.map(vehicle => {
    const card = createVehicleCard(vehicle);
    return card.outerHTML;
  }).join('');

  grid.innerHTML = vehiclesHtml;

  // Añadir eventos a los botones
  grid.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      window.location.href = `vehicle-detail.html?id=${id}`;
    });
  });
}

function updateResultsCount() {
  const countEl = document.getElementById('results-count');
  if (countEl) {
    countEl.textContent = `${filteredVehicles.length} equipos disponibles`;
  }
}

function applyFilters() {
  const typeFilter = document.getElementById('filter-type')?.value || '';
  const brandFilter = document.getElementById('filter-brand')?.value || '';
  const yearFilter = document.getElementById('filter-year')?.value || '';
  const locationFilter = document.getElementById('filter-location')?.value || '';

  filteredVehicles = allVehicles.filter(vehicle => {
    let typeMatch = true;
    if (typeFilter) {
      if (typeFilter === 'car') {
        typeMatch = vehicle.type === 'venta';
      } else {
        typeMatch = vehicle.type === 'subasta';
      }
    }

    const brandMatch = !brandFilter || 
      (vehicle.brand && vehicle.brand.toLowerCase().includes(brandFilter.toLowerCase()));
    const yearMatch = !yearFilter || 
      (vehicle.year && vehicle.year.toString() === yearFilter);
    const locationMatch = !locationFilter || 
      (vehicle.location && vehicle.location.toLowerCase().includes(locationFilter.toLowerCase()));

    return typeMatch && brandMatch && yearMatch && locationMatch;
  });

  const sortBy = document.getElementById('sort-by')?.value || 'newest';
  sortVehicles(sortBy);

  renderVehicles(filteredVehicles);
  updateResultsCount();
}

function sortVehicles(sortBy) {
  filteredVehicles.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id;
      case 'price-asc':
        const priceA = a.type === 'subasta' ? a.currentBid : a.price;
        const priceB = b.type === 'subasta' ? b.currentBid : b.price;
        return (priceA || 0) - (priceB || 0);
      case 'price-desc':
        const priceA2 = a.type === 'subasta' ? a.currentBid : a.price;
        const priceB2 = b.type === 'subasta' ? b.currentBid : b.price;
        return (priceB2 || 0) - (priceA2 || 0);
      case 'ending-soon':
        if (a.type !== 'subasta' && b.type !== 'subasta') return 0;
        if (a.type !== 'subasta') return 1;
        if (b.type !== 'subasta') return -1;
        const endTimeA = a.endTime ? new Date(a.endTime) : new Date(9999, 0, 1);
        const endTimeB = b.endTime ? new Date(b.endTime) : new Date(9999, 0, 1);
        return endTimeA - endTimeB;
      default:
        return 0;
    }
  });
}

function resetFilters() {
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-brand').value = '';
  document.getElementById('filter-year').value = '';
  document.getElementById('filter-location').value = '';
  applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
  const applyBtn = document.getElementById('apply-filters');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }

  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }

  const sortSelect = document.getElementById('sort-by');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortVehicles(e.target.value);
      renderVehicles(filteredVehicles);
    });
  }

  loadAllVehicles();
});