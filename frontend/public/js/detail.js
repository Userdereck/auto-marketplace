// frontend/public/js/detail.js
import { showToast } from './utils.js';

const API_BASE = 'http://localhost:5000/api/vehicles';

// Obtener ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('id');

if (!vehicleId) {
  document.getElementById('vehicle-detail').innerHTML = '<p class="error">ID de vehículo no especificado.</p>';
} else {
  loadVehicleDetail(vehicleId);
}

async function loadVehicleDetail(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error('Vehículo no encontrado');
    
    const vehicle = await response.json();
    renderVehicleDetail(vehicle);
    startAuctionTimer(vehicle);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('vehicle-detail').innerHTML = `
      <p class="error">❌ ${error.message || 'Error al cargar el vehículo.'}</p>
      <a href="index.html" class="btn-primary" style="display:inline-block;margin-top:1rem;">Volver al catálogo</a>
    `;
  }
}

function renderVehicleDetail(vehicle) {
  const isAuction = vehicle.type === 'subasta';
  const priceDisplay = isAuction 
    ? `${formatCurrency(vehicle.currentBid)} <small>(puja actual)</small>`
    : `${formatCurrency(vehicle.price)} <small>(precio fijo)</small>`;

  // Simular galería (en producción, tendrías múltiples imágenes)
  const thumbnails = [
    vehicle.image,
    vehicle.image.replace('600x400', '300x200'),
    vehicle.image.replace('600x400', '300x200&text=Vista+2'),
    vehicle.image.replace('600x400', '300x200&text=Vista+3')
  ];

  const thumbnailHtml = thumbnails.map((src, i) => 
    `<img src="${src}" class="thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">`
  ).join('');

  document.getElementById('vehicle-detail').innerHTML = `
    <div class="detail-images">
      <img src="${vehicle.image}" class="main-image" id="main-image">
      <div class="thumbnail-grid">
        ${thumbnailHtml}
      </div>
    </div>
    <div class="detail-info">
      <h2 class="vehicle-name">${vehicle.name}</h2>
      
      <div class="vehicle-meta">
        <div class="meta-item">
          <span class="meta-label">Marca</span>
          <span class="meta-value">${vehicle.brand}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Año</span>
          <span class="meta-value">${vehicle.year}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Ubicación</span>
          <span class="meta-value">${vehicle.location}</span>
        </div>
      </div>

      <div class="vehicle-price">${priceDisplay}</div>
      
      ${isAuction ? `<div class="auction-timer" id="auction-timer">⏳ Cargando tiempo...</div>` : ''}

      <p class="description">${vehicle.description}</p>

      <table class="specs-table">
        <tr><th>Tipo de equipo</th><td>${isAuction ? 'Maquinaria Industrial' : 'Vehículo Ligero'}</td></tr>
        <tr><th>Estado</th><td>${isAuction ? 'En subasta' : 'Disponible para compra'}</td></tr>
        ${isAuction ? `<tr><th>Puja mínima</th><td>${formatCurrency(vehicle.currentBid + 100)}</td></tr>` : ''}
      </table>

      <div class="location-map">
        🗺️ Mapa de ubicación: ${vehicle.location} (próximamente con Google Maps)
      </div>

      <div class="action-section">
        <h3>${isAuction ? 'Realiza tu puja' : 'Compra este equipo'}</h3>
        ${isAuction 
          ? `
            <form class="bid-form" id="bid-form">
              <input type="number" 
                     class="bid-input" 
                     id="bid-amount" 
                     min="${vehicle.currentBid + 100}" 
                     placeholder="Ingresa tu puja en USD" 
                     required>
              <button type="submit" class="action-btn bid-btn">Pujar ahora</button>
            </form>
          `
          : `<button class="action-btn buy-btn" id="buy-btn">Comprar ahora</button>`
        }
      </div>
    </div>
  `;

  // Eventos para thumbnails
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      document.getElementById('main-image').src = thumb.src;
    });
  });

  // Evento para compra
  if (!isAuction) {
    document.getElementById('buy-btn')?.addEventListener('click', () => {
      showToast(`Compra iniciada para ${vehicle.name}. Pronto implementaremos pagos.`, 'success');
    });
  }

  // Evento para puja
  if (isAuction) {
    document.getElementById('bid-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('bid-amount').value);
      if (isNaN(amount) || amount <= vehicle.currentBid) {
        showToast('La puja debe ser mayor que la actual.', 'error');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/${vehicle.id}/bid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bidAmount: amount })
        });
        const data = await res.json();
        
        if (res.ok) {
          showToast(`¡Puja de ${formatCurrency(amount)} registrada!`, 'success');
          // Recargar detalle para ver cambios
          loadVehicleDetail(vehicle.id);
        } else {
          showToast(data.error || 'Error al pujar.', 'error');
        }
      } catch {
        showToast('Error de conexión.', 'error');
      }
    });
  }
}

function startAuctionTimer(vehicle) {
  if (vehicle.type !== 'subasta' || !vehicle.endTime) return;

  const endTime = new Date(vehicle.endTime);
  const timerEl = document.getElementById('auction-timer');
  
  const updateTimer = () => {
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) {
      timerEl.textContent = '⏰ Subasta finalizada';
      timerEl.style.color = '#e74c3c';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    timerEl.innerHTML = `⏳ Termina en: <strong>${d}d ${h}h ${m}m</strong>`;
  };

  updateTimer();
  setInterval(updateTimer, 60000); // Actualizar cada minuto
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}