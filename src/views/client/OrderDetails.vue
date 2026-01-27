<template>
  <HeaderPageMenu title="My Orders" />
  <div class="content">
    <div class="orders-page">
      <!-- Horizontal Search & Filters Bar -->
      <div class="filters-bar">
        <div class="search-input">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by order code or item name..."
          />
        </div>
        <select v-model="statusFilter">
          <option value="">All statuses</option>
          <option value="PENDING">En attente</option>
          <option value="CONFIRMED">Confirmée</option>
          <option value="READY">READY</option>
          <option value="DELIVERED">Livrée</option>
          <option value="CANCELED">Annulée</option>
        </select>
        <select v-model="sortOrder">
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      <div class="main-layout">
        <!-- Orders List (now card-style for modern look) -->
        <aside class="orders-list">
          <h3>My orders </h3>
          <div
            v-for="o in filteredOrders"
            :key="o.id"
            class="order-card"
            :class="{ active: selectedOrder?.id === o.id }"
            @click="selectOrder(o)"
          >
            <div class="order-card-header">
              <div class="order-code">#{{ o.orderCode }}</div>
              <div class="order-status" :class="o.status.toLowerCase()">
                {{ getStatusLabel(o.status) }}
              </div>
            </div>
            <div class="order-card-body">
              <div class="order-date">{{ formatDate(o.createdAt) }}</div>
              <div class="order-total">{{ o.total }} DH</div>
            </div>
          </div>
          <p v-if="filteredOrders.length === 0" class="no-orders">
            No orders found.
          </p>
        </aside>

        <!-- Order Details -->
        <section class="order-details" v-if="selectedOrder">
        <!-- Order Header -->
        <div class="order-header">
            <h2>Order #{{ selectedOrder.orderCode }}</h2>
            <span class="status-badge" :class="selectedOrder.status.toLowerCase()">
            {{ getStatusLabel(selectedOrder.status) }}
            </span>
        </div>

        <!-- Order Meta -->
        <div class="order-meta">
            <p><strong>Date:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
            <p><strong>Total:</strong> {{ calculateOrderTotal(selectedOrder).toFixed(2) }} DH</p>
        </div>

        <!-- Actions (Only if order is pending) -->
        <div class="actions" v-if="selectedOrder.status === 'PENDING'">
            <button class="btn-cancel" @click="cancelOrder">Cancel Order</button>
            <button class="btn-save" @click="updateOrder" :disabled="!hasChanges">
            Save Changes
            </button>
        </div>

        <h3>Items</h3>
        <div class="items-list">
            <div
            class="item editable"
            v-for="item in selectedOrder.items"
            :key="item.itemId"
            >
            <div class="item-info">
                <span class="item-name">{{ item.itemName }}</span>

                <!-- Quantity controls for pending orders -->
                <div class="quantity-controls" v-if="selectedOrder.status === 'PENDING'">
                <button @click="decrementQuantity(item)" :disabled="item.quantity <= 1">−</button>
                <input type="number" v-model.number="item.quantity" min="1" />
                <button @click="incrementQuantity(item)">+</button>
                </div>

                <!-- Display quantity only if not pending -->
                <span v-else class="quantity">x {{ item.quantity }}</span>
            </div>

            <!-- Item total -->
            <span class="item-total">{{ (item.quantity * item.itemPrice).toFixed(2) }} DH</span>

            <!-- Remove item button (only for pending orders) -->
            <button
                class="btn-delete"
                v-if="selectedOrder.status === 'PENDING'"
                @click="removeItem(item)"
                title="Remove item"
            >
                🗑
            </button>
            </div>

            <!-- Empty state if all items removed -->
            <p v-if="selectedOrder.items.length === 0" class="no-items">
            No items left in this order.
            </p>
        </div>
        </section>



        <!-- Empty State -->
        <section class="order-details empty" v-else>
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

// --- Reactive state ---
const orders = ref([])
const selectedOrder = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const sortOrder = ref('desc') // desc = newest first
const hasChanges = ref(false)

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
const selectOrder = async (order) => {
  try {
    const res = await axios.get(`http://localhost:8088/client/orders/${order.id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    selectedOrder.value = res.data
    hasChanges.value = false // reset changes when selecting
  } catch (err) {
    console.error('Error fetching order details:', err)
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
  if (confirm(`Remove "${itemToRemove.itemName}" from this order?`)) {
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
}


// --- Cancel entire order ---
const cancelOrder = async () => {
  if (confirm('Are you sure you want to cancel this order?')) {
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
}

// --- Update order after editing ---
const updateOrder = async () => {
  try {
    await axios.put(
      `http://localhost:8088/client/orders/${selectedOrder.value.id}`,
      selectedOrder.value,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    )
    alert('Order updated successfully!')

    // Update the order list
    const index = orders.value.findIndex(o => o.id === selectedOrder.value.id)
    if (index !== -1) {
      orders.value[index] = { ...selectedOrder.value }
    }

    hasChanges.value = false
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
</script>


<style scoped>
.content {
  background: #f8fafc;
  min-height: 100vh;
  padding: 24px 0;
}

.orders-page {
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Filters bar - horizontal at the top */
.filters-bar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  background: #ffffff;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-input input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 300px;
  max-width: 100%;
}

.filters-bar select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

/* Main layout */
.main-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
}

@media (max-width: 868px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .search-input input {
    width: 100%;
  }
}

/* Orders list - modern cards */
.orders-list {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  max-height: 80vh;
  overflow-y: auto;
}

.orders-list h3 {
  font-size: 20px;
  font-weight: 700;
  color: #37311f;
  margin-bottom: 16px;
}

.order-card {
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 12px;
  background: #f9fafb;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.order-card:hover {
  background: #fffbee;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.order-card.active {
  background: #fffbee;
  border-left-color: #dfb838;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-code {
  font-weight: 700;
  font-size: 16px;
  color: #ce9e37;
}

.order-card-body {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #4b5563;
}

/* Status badges (same colors as before) */
.order-status,
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.order-status.pending,
.status-badge.pending { background: #facc15; color: #78350f; }
.order-status.confirmed,
.status-badge.confirmed { background: #3b82f6; }
.order-status.delivered,
.status-badge.delivered { background: #10b981; }
.order-status.cancelled,
.status-badge.cancelled { background: #ef4444; }

/* Details section */
.order-details {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-header h2 {
  font-size: 24px;
  color: #1f2937;
}

.order-meta {
  display: flex;
  gap: 32px;
  margin-bottom: 28px;
  color: #374151;
  font-size: 15px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-cancel {
  background: #ef4444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-save {
  background: #10b981;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.items-list .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  margin-bottom: 12px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.quantity-controls input {
  width: 60px;
  text-align: center;
  padding: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.order-details.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #9ca3af;
  font-size: 18px;
}

.no-orders {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
}
.items-list .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.items-list .item:hover {
  background: #fffdee;
  transform: translateY(-2px);
}

.quantity-controls button {
  transition: background 0.2s;
}

.quantity-controls button:hover {
  background: #e5e7eb;
}

.btn-delete {
  transition: all 0.2s ease;
}
.btn-delete:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.order-status.preparing,
.status-badge.preparing {
  background: #f59e0b; /* amber */
  color: #78350f;
}

.order-status.ready,
.status-badge.ready {
  background: #8b5cf6; /* violet */
}


</style>