<template>
    <div class="dashboard">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="header-left">
                <div class="icon-badge">
                    <span>👨‍🍳</span>
                </div>
                <div>
                    <h1>Worker Dashboard</h1>
                    <p class="subtitle">Gérez vos commandes en temps réel</p>
                </div>
            </div>
            <div class="header-right">
                <div class="status-badge active">
                    <span class="status-dot"></span>
                    Taking Orders (8AM-6PM)
                </div>
                <div class="time-display">
                    <i class="icon icon-clock"></i>
                    {{ currentTime }}
                </div>
            </div>
        </div>

        <div class="dashboard-content">
            <!-- Order Queue -->
            <div class="main-section">
                <div class="section-card order-queue">
                    <div class="card-header">
                        <h2>
                            <span class="icon">📋</span>
                            Order Queue
                        </h2>
                        <div class="badge-counter">{{ pendingOrders.length }} pending</div>
                    </div>

                    <div class="order-tabs">
                        <button 
                            @click="activeTab = 'PENDING'" 
                            :class="['tab-btn', { active: activeTab === 'PENDING' }]"
                        >
                            Pending ({{ pendingOrders.length }})
                        </button>
                        <button 
                            @click="activeTab = 'PREPARING'" 
                            :class="['tab-btn', { active: activeTab === 'PREPARING' }]"
                        >
                            Preparing ({{ preparingOrders.length }})
                        </button>
                    </div>

                    <div class="orders-list">
                        <!-- PENDING ORDERS -->
                        <div v-if="activeTab === 'PENDING'">
                            <div v-for="(order, index) in pendingOrders" :key="order.id" class="order-card">
                                <div class="order-header">
                                    <div class="order-id">
                                        <p class="hash">
                                            <span>#{{ index + 1 }}</span> {{ order.username }}
                                        </p>
                                    </div>
                                    <div class="order-time">{{ formatTime(order.createdAt) }}</div>
                                </div>

                                <div class="order-items">
                                    <div v-for="item in order.items" :key="item.id" class="item-row">
                                        <span class="item-name">{{ item.itemName }}</span>
                                        <span class="item-quantity">×{{ item.quantity }}</span>
                                    </div>
                                </div>

                                <div class="order-footer">
                                    <div class="order-total">${{ order.total }}</div>
                                    <div class="order-actions">
                                        <button 
                                            class="btn-start" 
                                            @click="confirmOrder(order.id)"
                                        >
                                            <span class="action-icon">👨‍🍳</span>
                                            Start Preparing
                                        </button>
                                        <button 
                                            class="btn-cancel" 
                                            @click="cancelOrder(order.id)"
                                        >
                                            <span class="action-icon">✕</span>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- PREPARING ORDERS -->
                        <div v-if="activeTab === 'PREPARING'">
                            <div v-for="(order, index) in preparingOrders" :key="order.id" class="order-card">
                                <div class="order-header">
                                    <div class="order-id">
                                        <p class="hash">
                                            <span>#{{ index + 1 }}</span> {{ order.username }}
                                        </p>
                                    </div>
                                    <div class="order-time">
                                        Started: {{ formatTime(order.startedAt || order.updatedAt) }}
                                    </div>
                                </div>

                                <div class="order-items">
                                    <div v-for="item in order.items" :key="item.id" class="item-row">
                                        <span class="item-name">{{ item.itemName }}</span>
                                        <span class="item-quantity">×{{ item.quantity }}</span>
                                    </div>
                                </div>

                                <div class="order-footer">
                                    <div class="order-total">${{ order.total }}</div>
                                    <div class="order-actions">
                                        <button 
                                            class="btn-ready" 
                                            @click="markAsReady(order.id)"
                                        >
                                            <span class="action-icon">✓</span>
                                            Mark as Ready
                                        </button>
                                        <button 
                                            class="btn-cancel" 
                                            @click="cancelOrder(order.id)"
                                        >
                                            <span class="action-icon">✕</span>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="sidebar-section">
                <!-- Total Items Needed -->
                <div class="section-card items-needed">
                    <div class="card-header">
                        <h2>
                            <span class="icon">📦</span>
                            Total Items Needed
                        </h2>
                    </div>
                    <div class="items-list">
                        <div v-for="item in totalItemsNeeded" :key="item.name" class="item-needed">
                            <span class="item-name">{{ item.itemName }}</span>
                            <span class="item-count">{{ item.quantity }} requis</span>
                        </div>
                    </div>
                </div>

                <!-- Ready for Pickup -->
                <div class="section-card ready-pickup">
                    <div class="card-header">
                        <h2>
                            <span class="icon"><i class="icon icon-check"></i>
                            </span>
                            Ready for Pickup
                        </h2>
                        <div class="badge-counter">{{ readyOrders.length }} ready</div>
                    </div>
                    <div class="ready-list">
                        <div v-for="(order, index) in readyOrders" :key="order.id" class="ready-item">
                            <div class="ready-info">
                                <p class="ready-id">
                                    <span>#{{ index + 1 }}</span> {{ order.username }}
                                </p>
                                <div class="ready-time">Ready at {{ formatTime(order.readyTime || order.updatedAt) }}</div>
                            </div>
                            <button 
                                class="btn-delivered" 
                                @click="markAsDelivered(order.id)"
                            >
                                <span class="action-icon">✓</span>
                                Mark Delivered
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Recently Delivered -->
                <div class="section-card delivered-orders" v-if="deliveredOrders.length > 0">
                    <div class="card-header">
                        <h2>
                            <span class="icon">🚚</span>
                            Recently Delivered
                        </h2>
                        <div class="badge-counter">{{ deliveredOrders.length }} delivered</div>
                    </div>
                    <div class="delivered-list">
                        <div v-for="(order, index) in deliveredOrders.slice(0, 3)" :key="order.id" class="delivered-item">
                            <div class="delivered-info">
                                <p class="delivered-id">
                                    <span>#{{ index + 1 }}</span> {{ order.username }}
                                </p>
                                <div class="delivered-time">Delivered at {{ formatTime(order.deliveredAt || order.updatedAt) }}</div>
                            </div>
                            <div class="delivered-status">
                                <span class="status-badge delivered">✓ Delivered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const orders = ref([])
const activeTab = ref('PENDING')
const currentTime = ref(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
)

// Computed properties for filtered orders
const pendingOrders = computed(() => 
    orders.value.filter(o => o.status === "PENDING")
)

const preparingOrders = computed(() => 
    orders.value.filter(o => o.status === "PREPARING")
)

const readyOrders = computed(() => 
    orders.value.filter(o => o.status === "READY")
)

const deliveredOrders = computed(() => 
    orders.value.filter(o => o.status === "DELIVERED")
)

const totalItemsNeeded = computed(() => {
    const map = {}
    pendingOrders.value
        .flatMap(o => o.items)
        .forEach(item => {
            if (!map[item.itemName]) {
                map[item.itemName] = {
                    itemName: item.itemName,
                    quantity: 0
                }
            }
            map[item.itemName].quantity += item.quantity
        })
    return Object.values(map)
})

// Clock
onMounted(() => {
    setInterval(() => {
        currentTime.value = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }, 60000)
})

// Load orders
const loadOrders = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
        const res = await axios.get("http://localhost:8088/worker/orders", {
            headers: { Authorization: `Bearer ${token}` },
        })

        orders.value = res.data
        console.log("Loaded orders:", orders.value)

    } catch (err) {
        console.error("Erreur chargement commandes", err)
    }
}

onMounted(() => {
    loadOrders()
    // Poll for new orders every 10 seconds
    setInterval(loadOrders, 10000)
})

// Helper function to format time
const formatTime = (dateString) => {
    if (!dateString) return '--:--'
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Confirm order (Start Preparing)
const confirmOrder = async (orderId) => {
    const token = localStorage.getItem("token")
    
    try {
        await axios.put(
            `http://localhost:8088/worker/orders/${orderId}/status`,
            { 
                status: "PREPARING",
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // Update local order
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
            order.status = "PREPARING"
        }
        
    } catch (err) {
        console.error("Error starting order:", err)
        alert("Failed to start order preparation")
    }
}

// Mark as Ready
const markAsReady = async (orderId) => {
    const token = localStorage.getItem("token")
    
    try {
        await axios.put(
            `http://localhost:8088/worker/orders/${orderId}/status`,
            { 
                status: "READY",
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // Update local order
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
            order.status = "READY"
        }
        
    } catch (err) {
        console.error("Error marking order as ready:", err)
        alert("Failed to mark order as ready")
    }
}

// Mark as Delivered
const markAsDelivered = async (orderId) => {
    const token = localStorage.getItem("token")
    
    try {
        await axios.put(
            `http://localhost:8088/worker/orders/${orderId}/status`,
            { 
                status: "DELIVERED",
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // Update local order
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
            order.status = "DELIVERED"
        }
        
    } catch (err) {
        console.error("Error marking order as delivered:", err)
        alert("Failed to mark order as delivered")
    }
}

// Cancel order
const cancelOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?")
    if (!confirmed) return
    
    const token = localStorage.getItem("token")
    
    try {
        await axios.put(
            `http://localhost:8088/worker/orders/${orderId}/status`,
            { 
                status: "CANCELLED",
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // Update local order
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
            order.status = "CANCELLED"
        }
        
    } catch (err) {
        console.error("Error cancelling order:", err)
        alert("Failed to cancel order")
    }
}
</script>

<style scoped>
.dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #f3cc79 0%, #d69d21 100%);
    padding: 30px;
    font-family: 'Inter', -apple-system, sans-serif;
}

/* Header */
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 25px 30px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.icon-badge {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #eca50b 0%, #d69d21 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    box-shadow: 0 8px 20px rgba(214, 157, 33, 0.4);
}

.header-left h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: #1a1a2e;
}

.subtitle {
    margin: 4px 0 0 0;
    color: #666;
    font-size: 14px;
}

.header-right {
    display: flex;
    gap: 20px;
    align-items: center;
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid #22c55e;
    border-radius: 50px;
    font-weight: 600;
    color: #22c55e;
    font-size: 14px;
}

.status-badge.delivered {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    color: #3b82f6;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse 2s ease infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.time-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(214, 157, 33, 0.15);
    border-radius: 12px;
    font-weight: 600;
    color: #d69d21;
    font-size: 14px;
}

/* Content Layout */
.dashboard-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 25px;
}

.section-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    background: linear-gradient(135deg, rgba(214, 157, 33, 0.1) 0%, rgba(236, 165, 11, 0.1) 100%);
    border-bottom: 2px solid rgba(214, 157, 33, 0.2);
}

.card-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
    display: flex;
    align-items: center;
    gap: 10px;
}

.icon {
    font-size: 28px;
}

.icon-badge span {
    font-size: 35px;
}

.badge-counter {
    background: linear-gradient(135deg, #d69d21 0%, #eca50b 100%);
    color: white;
    padding: 6px 16px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 700;
}

/* Order Tabs */
.order-tabs {
    display: flex;
    padding: 0 25px;
    border-bottom: 2px solid rgba(214, 157, 33, 0.1);
    background: rgba(255, 255, 255, 0.9);
}

.tab-btn {
    padding: 12px 20px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.tab-btn.active {
    color: #d69d21;
    border-bottom-color: #d69d21;
    background: rgba(214, 157, 33, 0.05);
}

.tab-btn:hover:not(.active) {
    color: #d69d21;
    background: rgba(214, 157, 33, 0.05);
}

/* Orders List */
.orders-list {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: calc(100vh - 300px);
    overflow-y: auto;
}

.order-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.order-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(214, 157, 33, 0.2);
    border-color: #d69d21;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.order-id {
    font-size: 20px;
    font-weight: 800;
    color: #1a1a2e;
}

.hash {
    color: #d69d21;
}

.order-time {
    color: #666;
    font-size: 14px;
    font-weight: 500;
}

.order-items {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 15px;
}

.item-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.item-row:last-child {
    border-bottom: none;
}

.item-name {
    font-weight: 600;
    color: #374151;
}

.item-quantity {
    font-weight: 700;
    color: #d69d21;
    background: white;
    padding: 2px 10px;
    border-radius: 50px;
    font-size: 13px;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order-total {
    font-size: 24px;
    font-weight: 800;
    color: #22c55e;
}

.order-actions {
    display: flex;
    gap: 10px;
}

/* Button Styles */
.btn-start,
.btn-ready,
.btn-delivered,
.btn-cancel {
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-icon {
    font-size: 16px;
}

.btn-start {
    background: linear-gradient(135deg, #d69d21 0%, #eca50b 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(214, 157, 33, 0.3);
}

.btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(214, 157, 33, 0.5);
}

.btn-ready {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.btn-ready:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5);
}

.btn-delivered {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-delivered:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.btn-cancel {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.btn-cancel:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
}

/* Sidebar */
.sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.items-list,
.ready-list,
.delivered-list {
    padding: 15px 20px;
}

.item-needed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: linear-gradient(135deg, #faf9f8 0%, #efede9 100%);
    border-radius: 10px;
    margin-bottom: 10px;
    border-left: 4px solid #d69d21;
    transition: all 0.3s ease;
}

.item-needed:hover {
    transform: translateX(5px);
    background: linear-gradient(135deg, #efede9 0%, #e6e4de 100%);
}

.item-count {
    font-weight: 700;
    color: #d69d21;
    font-size: 14px;
}

.ready-item,
.delivered-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
}

.ready-item {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
    border: 2px solid rgba(34, 197, 94, 0.2);
}

.ready-item:hover {
    transform: translateX(5px);
    border-color: #22c55e;
}

.delivered-item {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
    border: 2px solid rgba(59, 130, 246, 0.2);
}

.delivered-item:hover {
    transform: translateX(5px);
    border-color: #3b82f6;
}

.ready-id,
.delivered-id {
    font-weight: 700;
    color: #1a1a2e;
    font-size: 16px;
}

.ready-time,
.delivered-time {
    color: #666;
    font-size: 13px;
    margin-top: 2px;
}

/* Responsive */
@media (max-width: 1200px) {
    .dashboard-content {
        grid-template-columns: 1fr;
    }

    .sidebar-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
    }
}

@media (max-width: 768px) {
    .dashboard {
        padding: 15px;
    }

    .dashboard-header {
        flex-direction: column;
        gap: 15px;
        padding: 20px;
    }

    .header-left,
    .header-right {
        width: 100%;
        justify-content: center;
    }

    .header-right {
        flex-direction: column;
    }

    .sidebar-section {
        grid-template-columns: 1fr;
    }

    .order-footer {
        flex-direction: column;
        gap: 15px;
    }

    .order-actions {
        width: 100%;
        flex-direction: column;
    }

    .btn-start,
    .btn-ready,
    .btn-delivered,
    .btn-cancel {
        width: 100%;
        justify-content: center;
    }
}

/* Scrollbar */
.orders-list::-webkit-scrollbar {
    width: 8px;
}

.orders-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.orders-list::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #d69d21 0%, #eca50b 100%);
    border-radius: 10px;
}

.orders-list::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #eca50b 0%, #d69d21 100%);
}

.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-size: 18px;
}

.icon-clock::before {
    content: "🕐";
    font-size: 20px;
}

.icon-check::before {
    content: "✓";
    font-size: 18px;
    font-weight: 700;
}
</style>