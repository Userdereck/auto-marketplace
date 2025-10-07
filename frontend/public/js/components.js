// frontend/public/js/components.js
import { formatCurrency } from './utils.js';

export function createVehicleCard(vehicle) {
  // Determinar si es subasta o venta
  const isAuction = vehicle.type === 'subasta';
  const priceDisplay = isAuction 
    ? `${formatCurrency(vehicle.currentBid)} <small>(puja actual)</small>`
    : `${formatCurrency(vehicle.price)} <small>(compra directa)</small>`;

  // Calcular tiempo restante
  let timeLeft = '';
  if (isAuction && vehicle.endTime) {
    const endTime = new Date(vehicle.endTime);
    const now = new Date();
    const diffMs = endTime - now;
    if (diffMs > 0) {
      const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      timeLeft = `<div class="auction-timer">⏳ Termina en: ${d}d ${h}h</div>`;
    } else {
      timeLeft = `<div class="auction-timer ended">Subasta finalizada</div>`;
    }
  }

  const card = document.createElement('div');
  card.className = 'vehicle-card';
  card.innerHTML = `
    <div class="vehicle-image-container">
      <img src="${vehicle.image}" alt="${vehicle.name}" class="vehicle-img">
      <span class="vehicle-type-badge">${isAuction ? 'SUBASTA' : 'VENTA'}</span>
    </div>
    <div class="vehicle-content">
      <h3 class="vehicle-title">${vehicle.name}</h3>
      <div class="vehicle-specs">
        <span>📍 ${vehicle.location || 'No especificada'}</span>
        <span>📅 ${vehicle.year || 'N/A'}</span>
        <span>⚙️ ${vehicle.brand || 'N/A'}</span>
      </div>
      <p class="vehicle-desc">${vehicle.description}</p>
      <div class="vehicle-price" style="margin: 0.8rem 0;">${priceDisplay}</div>
      ${timeLeft}
      <button class="action-btn ${isAuction ? 'bid-btn' : 'buy-btn'}" 
              data-id="${vehicle.id}" 
              data-type="${vehicle.type}">
        ${isAuction ? 'Pujar ahora' : 'Ver detalles'}
      </button>
    </div>
  `;
  return card;
}