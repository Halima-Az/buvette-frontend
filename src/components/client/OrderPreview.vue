<template>
    <div v-if="showOrderDetails" class="order-preview">

        <div class="preview-header">
          <h3>Aperçu de la commande</h3>
          <button @click="$emit('close')" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loadingOrder" class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des détails...</p>
        </div>

        <div v-else-if="!selectedOrder" class="error-state">
          <div class="error-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <h4>Commande introuvable</h4>
          <p>La commande demandée n'existe pas ou a été supprimée.</p>
        </div>

        <div v-else class="preview-content">
          <div class="order-header-preview">
            <div class="order-number">
              <span class="label">Commande</span>
              <span class="number">#{{ selectedOrder.orderCode}}</span>
            </div>
            <div :class="['status-pill', selectedOrder.status.toLowerCase()]">
              <span class="status-dot"></span>
              {{ selectedOrder.status }}
            </div>
          </div>
          
          <div class="order-meta">
            <div class="meta-item">
              <i class="fas fa-calendar-alt"></i>
              <div>
                <span class="meta-label">Date</span>
                <span class="meta-value">{{ formatDate(selectedOrder.createdAt) }}</span>
              </div>
            </div>
            <div class="meta-item">
              <i class="fas fa-wallet"></i>
              <div>
                <span class="meta-label">Total</span>
                <span class="meta-value highlight">{{ selectedOrder.total }} DH</span>
              </div>
            </div>
          </div>
          
          <div class="divider"></div>

          <!-- Items Section -->
          <div class="items-section">
            <div class="section-header">
              <h4>Articles</h4>
              <span class="items-count">{{ selectedOrder.items.length }} article(s)</span>
            </div>

            <div class="items-list">
              <div v-for="item in selectedOrder.items" :key="item.itemId" class="item-row">
                <div class="item-details">
                  <div class="item-icon">
                    <i class="fas fa-box"></i>
                  </div>
                  <div class="item-info">
                    <span class="item-name">{{ item.itemName }}</span>
                    <span class="item-quantity">Qté: {{ item.quantity }}</span>
                  </div>
                </div>
                <div class="item-price" v-if="item.price">
                  {{ (item.price * item.quantity).toFixed(2) }} DH
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
    loadingOrder: Boolean,
    showOrderDetails: Boolean,
    selectedOrder: Object,
})

defineEmits(['close'])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewFullOrder = (orderId) => {
  router.push(`/orders/${orderId}`)
}
</script>

<style scoped>
/* Order Preview Container */
.order-preview {
  position: fixed;
  right: 480px;
  top: 80px;
  width: 440px;
  max-height: calc(100vh - 120px);
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(170, 122, 17, 0.25),
              0 0 0 1px rgba(170, 122, 17, 0.1);
  overflow: hidden;
  z-index: 999;
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* Preview Header */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(170, 122, 17, 0.1);
}

.preview-header h3 {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  font-size: 14px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Loading State */
.loading-state {
  padding: 80px 20px;
  text-align: center;
  color: #9ca3af;
}

.spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  border: 4px solid #f3f4f6;
  border-top-color: #aa7a11;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 15px;
  font-weight: 500;
}

/* Error State */
.error-state {
  padding: 80px 30px;
  text-align: center;
}

.error-icon {
  font-size: 56px;
  color: #ef4444;
  margin-bottom: 20px;
  opacity: 0.9;
}

.error-state h4 {
  color: #1f2937;
  margin-bottom: 10px;
  font-size: 19px;
  font-weight: 700;
}

.error-state p {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

/* Preview Content */
.preview-content {
  max-height: calc(100vh - 192px);
  overflow-y: auto;
  padding: 24px;
}

/* Custom Scrollbar */
.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: #faf9f7;
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d4a517 0%, #aa7a11 100%);
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #aa7a11 0%, #8a6209 100%);
}

/* Order Header Preview */
.order-header-preview {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #faf5e6;
}

.order-number .label {
  display: block;
  font-size: 11px;
  color: #aa7a11;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.order-number .number {
  font-size: 26px;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: -0.03em;
}

/* Status Pill */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.status-pill.pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #fbbf24;
}

.status-pill.pending .status-dot {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

.status-pill.confirmed,
.status-pill.processing {
  background: linear-gradient(135deg, #fef7e6 0%, #fcefc7 100%);
  color: #aa7a11;
  border: 1px solid #d4a517;
}

.status-pill.confirmed .status-dot,
.status-pill.processing .status-dot {
  background: #aa7a11;
  box-shadow: 0 0 8px #aa7a11;
}

.status-pill.shipped {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4338ca;
  border: 1px solid #6366f1;
}

.status-pill.shipped .status-dot {
  background: #6366f1;
  box-shadow: 0 0 8px #6366f1;
}

.status-pill.delivered {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 1px solid #10b981;
}

.status-pill.delivered .status-dot {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.status-pill.cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid #ef4444;
}

.status-pill.cancelled .status-dot {
  background: #ef4444;
  box-shadow: 0 0 8px #ef4444;
}

/* Order Meta */
.order-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: linear-gradient(135deg, #fffcf5 0%, #fef9e7 100%);
  border-radius: 12px;
  border: 1px solid #fcefc7;
  transition: all 0.3s ease;
}

.meta-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(170, 122, 17, 0.12);
}

.meta-item i {
  font-size: 22px;
  color: #aa7a11;
  margin-top: 2px;
}

.meta-label {
  display: block;
  font-size: 11px;
  color: #aa7a11;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
}

.meta-value {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.meta-value.highlight {
  color: #aa7a11;
  font-size: 18px;
}

/* Divider */
.divider {
  height: 2px;
  background: linear-gradient(to right, transparent, #fcefc7, transparent);
  margin: 24px 0;
}

/* Items Section */
.items-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 17px;
  color: #1f2937;
  font-weight: 700;
}

.items-count {
  font-size: 12px;
  color: #aa7a11;
  background: linear-gradient(135deg, #fef9e7 0%, #fcefc7 100%);
  padding: 6px 12px;
  border-radius: 100px;
  border: 1px solid #fcefc7;
  font-weight: 700;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: #fdfbf7;
  border-radius: 12px;
  border: 1px solid #f5f0e6;
  transition: all 0.3s ease;
}

.item-row:hover {
  background: #fef9e7;
  border-color: #fcefc7;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.1);
}

.item-details {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.item-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 17px;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-name {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}

.item-quantity {
  font-size: 13px;
  color: #aa7a11;
  font-weight: 600;
}

.item-price {
  font-size: 16px;
  font-weight: 800;
  color: #aa7a11;
}

/* Preview Footer */
.preview-footer {
  padding-top: 20px;
  border-top: 2px solid #faf5e6;
}

.view-full-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(170, 122, 17, 0.3);
}

.view-full-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(170, 122, 17, 0.4);
  background: linear-gradient(135deg, #d4a517 0%, #aa7a11 100%);
}

.view-full-btn:active {
  transform: translateY(-1px);
}

.view-full-btn i {
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1400px) {
  .order-preview {
    right: 20px;
    width: 400px;
  }
}

@media (max-width: 768px) {
  .order-preview {
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
    top: 60px;
  }

  .order-meta {
    grid-template-columns: 1fr;
  }
  
  .order-header-preview {
    flex-direction: column;
    gap: 12px;
  }
  
  .status-pill {
    align-self: flex-start;
  }
}
</style>