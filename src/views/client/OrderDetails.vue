<template>
  <HeaderPageMenu title="My Orders" />

  <div class="content">
    <div class="orders-page">
      <!-- Filters bar -->
      <div class="filters-bar">
        <div class="search-input">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="🔍 Search by order code or item..."
          />
        </div>
        <select v-model="statusFilter">
          <option value="">All statuses</option>
          <option value="PENDING">⏳ En attente</option>
          <option value="CONFIRMED">✅ Confirmée</option>
          <option value="READY">🍽 READY</option>
          <option value="DELIVERED">🚚 Livrée</option>
          <option value="CANCELED">❌ Annulée</option>
        </select>
        <select v-model="sortOrder">
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      <div class="main-layout">
        <!-- Orders List -->
        <aside class="orders-list">
          <h3>My Orders ({{ orders.length }})</h3>
          <div
            v-for="o in filteredOrders"
            :key="o.id"
            class="order-card"
            :class="{ active: selectedOrder?.id === o.id }"
            @click="selectOrder(o.id)"
          >
            <div class="order-card-header">
              <div class="order-code">#{{ o.orderCode }}</div>
              <div class="order-status" :class="o.status.toLowerCase()">
                <i v-if="o.status==='PENDING'" class="far fa-hourglass"></i>
                <i v-else-if="o.status==='CONFIRMED'" class="fas fa-check-circle"></i>
                <i v-else-if="o.status==='READY'" class="fas fa-utensils"></i>
                <i v-else-if="o.status==='DELIVERED'" class="fas fa-truck"></i>
                <i v-else class="fas fa-times-circle"></i>
                {{ getStatusLabel(o.status) }}
              </div>
            </div>
            <div class="order-card-body">
              <div class="order-date"><i class="far fa-calendar-alt"></i> {{ formatDate(o.createdAt) }}</div>
              <div class="order-total"><i class="fas fa-money-bill-wave"></i> {{ o.total }} DH</div>
            </div>
          </div>
          <p v-if="filteredOrders.length === 0" class="no-orders">
            No orders found.
          </p>
        </aside>

        <!-- Order Details -->
        <section class="order-details" v-if="selectedOrder">
          <div class="order-header">
            <h2>Order #{{ selectedOrder.orderCode }}</h2>
            <span class="status-badge" :class="selectedOrder.status.toLowerCase()">
              {{ getStatusLabel(selectedOrder.status) }}
            </span>
          </div>

          <div class="order-meta">
            <p><strong>Date:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
            <p><strong>Total:</strong> {{ calculateOrderTotal(selectedOrder).toFixed(2) }} DH</p>
          </div>

          <div class="actions" v-if="selectedOrder.status === 'PENDING'">
            <button class="btn-cancel" @click="showorderremoveconfirmaton=true">
              <i class="fas fa-times-circle"></i> Cancel Order
            </button>
            <button class="btn-save" @click="showordermodifyconfirmaton = true" :disabled="!hasChanges">
              <i class="fas fa-save"></i> Save Changes
            </button>
            <!-- removeorderconfirmation-->
            <div v-if="showorderremoveconfirmaton" class="confirm-overlay">
              <div class="confirm-box">
                <p>Are you sure you want to Cancel the order ?</p>
                <div class="actions">
                  <button class="cancel" @click="showorderremoveconfirmaton = false">Cancel</button>
                  <button class="confirm" @click="cancelOrder">Confirm</button>
                </div>
              </div>
            </div>
            <!-- changeorderconfirmation-->
            <div v-if="showordermodifyconfirmaton" class="confirm-overlay">
              <div class="confirm-box">
                <p>Are you sure you want to Modify the order ?</p>
                <div class="actions">
                  <button class="cancel" @click="showordermodifyconfirmaton = false">Cancel</button>
                  <button class="confirm" @click="updateOrder">Confirm</button>
                </div>
              </div>
            </div>
          </div>

          <h3>Items</h3>
          <div class="items-list">
            <div
              class="item editable"
              v-for="item in selectedOrder.items"
              :key="item.itemId"
            >
              <div class="item-info">
                <span class="item-name"><i class="fas fa-hamburger"></i> {{ item.itemName }}</span>

                <div class="quantity-controls" v-if="selectedOrder.status === 'PENDING'">
                  <button @click="decrementQuantity(item)" :disabled="item.quantity <= 1">−</button>
                  <input type="number" v-model.number="item.quantity" min="1" />
                  <button @click="incrementQuantity(item)">+</button>
                </div>

                <span v-else class="quantity">x {{ item.quantity }}</span>
              </div>

              <span class="item-total"><i class="fas fa-money-bill-wave"></i> {{ (item.quantity * item.itemPrice).toFixed(2) }} DH</span>

              <button
                class="btn-delete"
                v-if="selectedOrder.status === 'PENDING'"
                @click="showitemremoveconfirmaton = true"
                title="Remove item"
              >
                <i class="fas fa-trash"></i>
              </button>

            </div>
            <!-- removeitemconfirmation-->
              <div v-if="showitemremoveconfirmaton" class="confirm-overlay">
                <div class="confirm-box">
                  <p>Are you sure you want to remove the item ?</p>
                  <div class="actions">
                    <button class="cancel" @click="showitemremoveconfirmaton = false">Cancel</button>
                    <button class="confirm" @click="removeItem(item)">Confirm</button>
                  </div>
                </div>
              </div>

            <p v-if="selectedOrder.items.length === 0" class="no-items">
              No items left in this order.
            </p>
          </div>
        </section>

        <section class="order-details empty" v-else>
          <i class="fas fa-dolly"></i>  
          <p>Select an order to view details</p>
        </section>
      </div>
    </div>
  </div>

  <FooterPageMenu />
</template>



<script setup>
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue'
import FooterPageMenu from '@/components/client/FooterPageMenu.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

// --- Reactive state ---
const orders = ref([])
const selectedOrder = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const sortOrder = ref('desc') // desc = newest first
const hasChanges = ref(false)
const route=useRoute()

const showitemremoveconfirmaton = ref(false)
const showorderremoveconfirmaton = ref(false)
const showordermodifyconfirmaton = ref(false)
// --- Helper to get token ---
const getToken = () => localStorage.getItem('token')

// --- Fetch all orders ---
const fetchOrders = async () => {
  try {
    const res = await axios.get('http://localhost:8088/client/orders', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    orders.value = res.data

  } catch (err) {
    console.error('Error fetching orders:', err)
  }
}

// --- Fetch details of a single order ---
const selectOrder = async (orderId) => {
  try {
    const res = await axios.get(`http://localhost:8088/client/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    selectedOrder.value = res.data
    hasChanges.value = false
  } catch (err) {
    console.error('Error fetching order details:', err)
    selectedOrder.value = null
  }
}

// --- Format date ---
const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')

// --- Status labels ---
const getStatusLabel = (status) => ({
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
}[status] || status)

// --- Filter & sort orders ---
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Search by order code or item name
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderCode.toLowerCase().includes(q) ||
      order.items.some(item => item.itemName.toLowerCase().includes(q))
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Sort by creation date
  filtered = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })

  return filtered
})

// --- Editable item functions ---
const incrementQuantity = (item) => {
  item.quantity++
  hasChanges.value = true
}

const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    hasChanges.value = true
  }
}

const removeItem = (itemToRemove) => {
    selectedOrder.value.items = selectedOrder.value.items.filter(
      i => i.itemId !== itemToRemove.itemId
    )
    
    if (selectedOrder.value.items.length === 0) {
      // Automatically cancel the order if no items left
      cancelOrder()
    } else {
      hasChanges.value = true
    }
  
}


// --- Cancel entire order ---
const cancelOrder = async () => {
    try {
      await axios.patch(
        `http://localhost:8088/client/orders/${selectedOrder.value.id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      )
      selectedOrder.value.status = 'cancelled'

      // Update order list
      const index = orders.value.findIndex(o => o.id === selectedOrder.value.id)
      if (index !== -1) orders.value[index].status = 'cancelled'

      hasChanges.value = false
    } catch (err) {
      alert('Error cancelling order')
      console.error(err)
    }
}

// --- Update order after editing ---
const updateOrder = async () => {
  try {
    await axios.put(
      `http://localhost:8088/client/orders/${selectedOrder.value.id}`,
      selectedOrder.value,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    )
    // Update the order list
    const index = orders.value.findIndex(o => o.id === selectedOrder.value.id)
    if (index !== -1) {
      orders.value[index] = { ...selectedOrder.value }
    }

    hasChanges.value = false
    showordermodifyconfirmaton.value=false
  } catch (err) {
    alert('Error updating order')
    console.error(err)
  }
}

// --- Calculate total of order dynamically ---
const calculateOrderTotal = (order) => {
  return order.items.reduce((sum, i) => sum + i.quantity * i.itemPrice, 0)
}

// --- Lifecycle hook ---
onMounted(fetchOrders)
watch(
  () => route.params.orderId,
  async (newId) => {
    if (newId) {
        await selectOrder(newId)}
    else{
      selectOrder.value=null
    }    
      
    },
  { immediate: true }
)
</script>


<style scoped>
/* ==================== BASE CONTENT ==================== */


.content {
  background: linear-gradient(135deg, #fdfaf2 0%, #f8f3e9 50%, #f2ead9 100%);
  min-height: 100vh;
  padding: 40px 24px;
  position: relative;
}

.content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500px;
  background: radial-gradient(ellipse at top, rgba(170, 122, 17, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.orders-page {
  max-width: 1320px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 1;
}

/* ==================== FILTERS BAR ==================== */
.filters-bar {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  background: #ffffff;
  padding: 24px 28px;
  border-radius: 24px;
  box-shadow: 
    0 10px 40px rgba(170, 122, 17, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(170, 122, 17, 0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.filters-bar:hover {
  box-shadow: 
    0 16px 48px rgba(170, 122, 17, 0.18),
    0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Search Input */
.search-input {
  flex: 1;
  min-width: 320px;
  position: relative;
}

.search-input input {
  width: 100%;
  padding: 16px 24px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  background: #fafbfc;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-input input:focus {
  outline: none;
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 6px rgba(170, 122, 17, 0.1);
  transform: translateY(-2px);
}

.search-input input::placeholder {
  color: #9ca3af;
  font-weight: 500;
}

/* Select Dropdowns */
.filters-bar select {
  padding: 16px 48px 16px 22px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  background: #fafbfc;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 180px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23aa7a11' stroke-width='3'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.filters-bar select:hover {
  border-color: var(--primary);
  background-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.15);
}

.filters-bar select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 6px rgba(170, 122, 17, 0.1);
}

/* ==================== MAIN LAYOUT ==================== */
.main-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 32px;
}

/* ==================== ORDERS LIST ==================== */
.orders-list {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 
    0 10px 40px rgba(170, 122, 17, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(170, 122, 17, 0.1);
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  position: sticky;
  top: 32px;
}

.orders-list h3 {
  font-size: 24px;
  font-weight: 900;
  color: #1f2937;
  margin-bottom: 24px;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 3px solid rgba(170, 122, 17, 0.1);
}

.orders-list h3::before {
  content: '📋';
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(170, 122, 17, 0.3));
}

/* ==================== ORDER CARD ==================== */
.order-card {
  padding: 20px 24px;
  border-radius: 18px;
  cursor: pointer;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f6f7 100%);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-left: 5px solid transparent;
  border: 1px solid #f0f1f3;
  border-left-width: 5px;
  position: relative;
  overflow: hidden;
}

.order-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(170, 122, 17, 0.06) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.order-card:hover::before {
  opacity: 1;
}

.order-card:hover {
  background: linear-gradient(135deg, #fffcf5 0%, #fef9e7 100%);
  transform: translateX(8px) translateY(-4px);
  box-shadow: 0 12px 32px rgba(170, 122, 17, 0.2);
  border-left-color: var(--primary);
}

.order-card.active {
  background: linear-gradient(135deg, #fef9e7 0%, #fcefc7 100%);
  border-left-color: var(--primary);
  box-shadow: 0 12px 32px rgba(170, 122, 17, 0.25);
  transform: translateX(8px);
}

.order-card.active::before {
  opacity: 0;
}

/* Card Header */
.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.order-code {
  font-weight: 900;
  font-size: 18px;
  color: var(--primary);
  letter-spacing: -0.02em;
}

/* Card Body */
.order-card-body {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

.order-card-body i {
  margin-right: 6px;
  color: var(--primary);
}

.order-date {
  display: flex;
  align-items: center;
}

.order-total {
  font-weight: 800;
  color: #1f2937;
  display: flex;
  align-items: center;
}

/* ==================== STATUS BADGES ==================== */
.order-status,
.status-badge {
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.order-status:hover,
.status-badge:hover {
  transform: scale(1.05);
}

.order-status i,
.status-badge i {
  font-size: 13px;
}

.order-status.pending,
.status-badge.pending { 
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
}

.order-status.confirmed,
.status-badge.confirmed { 
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
}

.order-status.preparing,
.status-badge.preparing {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #000000;
}

.order-status.ready,
.status-badge.ready {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
}

.order-status.delivered,
.status-badge.delivered { 
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
}

.order-status.cancelled,
.status-badge.cancelled { 
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
}

/* ==================== ORDER DETAILS ==================== */
.order-details {
  background: #ffffff;
  border-radius: 24px;
  padding: 36px 40px;
  box-shadow: 
    0 10px 40px rgba(170, 122, 17, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(170, 122, 17, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 3px solid rgba(170, 122, 17, 0.1);
}

.order-header h2 {
  font-size: 32px;
  font-weight: 900;
  color: #1f2937;
  letter-spacing: -0.03em;
}

/* ==================== ORDER META ==================== */
.order-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 36px;
}

.order-meta p {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f6f7 100%);
  border-radius: 16px;
  border: 1px solid #f0f1f3;
  margin: 0;
  transition: all 0.3s ease;
}

.order-meta p:hover {
  background: linear-gradient(135deg, #fef9e7 0%, #fcefc7 100%);
  border-color: rgba(170, 122, 17, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(170, 122, 17, 0.12);
}

.order-meta strong {
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.order-meta p {
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
}

/* ==================== ACTIONS ==================== */
.actions {
  display: flex;
  gap: 16px;
  margin-bottom: 36px;
}

.btn-cancel,
.btn-save {
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-size: 13px;
}

.btn-cancel {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
}

.btn-cancel:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(239, 68, 68, 0.45);
}

.btn-save {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(16, 185, 129, 0.45);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel i,
.btn-save i {
  font-size: 16px;
}

/* ==================== ITEMS SECTION ==================== */
.order-details h3 {
  font-size: 22px;
  font-weight: 900;
  color: #1f2937;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(170, 122, 17, 0.1);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.items-list .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f6f7 100%);
  border-radius: 18px;
  padding: 22px 26px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid #f0f1f3;
  position: relative;
  overflow: hidden;
}

.items-list .item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--primary)1 0%, var(--secondary) 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.items-list .item:hover::before {
  transform: scaleY(1);
}

.items-list .item:hover {
  background: linear-gradient(135deg, #fef9e7 0%, #fcefc7 100%);
  transform: translateX(8px);
  box-shadow: 0 10px 28px rgba(170, 122, 17, 0.15);
  border-color: rgba(170, 122, 17, 0.25);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.item-name {
  font-weight: 800;
  font-size: 17px;
  color: #1f2937;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-name i {
  color: var(--primary);
  font-size: 18px;
}

.quantity {
  font-size: 15px;
  font-weight: 700;
  color: #6b7280;
}

/* ==================== QUANTITY CONTROLS ==================== */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 900;
  color: var(--primary);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #000000;
  border-color: var(--primary);
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(170, 122, 17, 0.3);
}

.quantity-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 80px;
  text-align: center;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 800;
  color: #1f2937;
  transition: all 0.3s ease;
  background: #ffffff;
}

.quantity-controls input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 6px rgba(170, 122, 17, 0.1);
}

/* ==================== ITEM TOTAL & DELETE ==================== */
.item-total {
  font-size: 20px;
  font-weight: 900;
  color: var(--primary);
  margin-right: 16px;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-total i {
  font-size: 18px;
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 10px 24px rgba(239, 68, 68, 0.45);
}

.btn-delete i {
  font-size: 14px;
}

/* ==================== EMPTY STATES ==================== */
.order-details.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  color: #9ca3af;
  font-size: 20px;
  font-weight: 700;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px ;
}

.order-details.empty .fa-dolly {
  font-size: 80px;
  opacity: 0.5;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.no-orders {
  text-align: center;
  color: #9ca3af;
  padding: 80px 20px;
  font-size: 18px;
  font-weight: 700;
}

.no-orders::before {
  content: '🔍';
  display: block;
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-items {
  text-align: center;
  color: #9ca3af;
  padding: 60px 20px;
  font-size: 17px;
  font-weight: 700;
}

/* ==================== SCROLLBAR ==================== */
.orders-list::-webkit-scrollbar {
  width: 10px;
}

.orders-list::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 10px;
  margin: 8px 0;
}

.orders-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 10px;
  border: 2px solid #f9fafb;
}

.orders-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--secondary) 0%,var(--primary) 100%);
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 380px 1fr;
  }
}

@media (max-width: 868px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  
  .orders-list {
    max-height: none;
    position: static;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-bar select {
    width: 100%;
  }
  
  .order-meta {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 24px 16px;
  }
  
  .orders-page {
    gap: 24px;
  }
  
  .filters-bar {
    padding: 20px;
  }
  
  .orders-list,
  .order-details {
    padding: 24px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .items-list .item {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .item-info {
    width: 100%;
  }
  
  .item-total {
    margin-right: 0;
  }
}

/* ==================== ANIMATIONS ==================== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.order-card,
.items-list .item {
  animation: fadeIn 0.5s ease-out backwards;
}

.order-card:nth-child(1) { animation-delay: 0.05s; }
.order-card:nth-child(2) { animation-delay: 0.1s; }
.order-card:nth-child(3) { animation-delay: 0.15s; }
.order-card:nth-child(4) { animation-delay: 0.2s; }
.order-card:nth-child(5) { animation-delay: 0.25s; }
.order-card:nth-child(6) { animation-delay: 0.3s; }

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-box {
  background: white;
  padding: 24px 26px;
  border-radius: 16px;
  width: 280px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  transform: translateY(-40px); /* 🔑 visual centering */
}


.confirm-box p {
  margin-bottom: 16px;
  font-weight: 500;
}

.confirm-box .actions {
  display: flex;
  gap: 10px;
}

.confirm-box button {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.confirm-box .cancel {
  background: #eee;
}

.confirm-box .confirm {
  background: #e74c3c;
  color: white;
}
</style>