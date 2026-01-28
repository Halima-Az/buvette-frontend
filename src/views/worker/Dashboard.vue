<template>
<HeaderPageMenu title=""/>

<div class="dashboard">

    <!-- HEADER -->
    <div class="dashboard-header">
        <div class="header-left">
            <div class="icon-badge">
                <!-- Icon FontAwesome chef -->
                👨‍🍳
            </div>
            <div>
                <h1>Kitchen Screen</h1>
                <p class="subtitle">Live Orders Management</p>
            </div>
        </div>

        <div class="header-right">
            <div class="status-badge active">
                <span class="status-dot"></span>
                Service ON
            </div>
            <div class="time-display">
                <i class="far fa-clock"></i>
                {{ currentTime }}
            </div>
        </div>
    </div>

    <!-- CONTENT GRID -->
    <div class="dashboard-content">

        <!-- LEFT COLUMN -->
        <div class="main-section">

            <!-- ORDER QUEUE -->
            <div class="section-card order-queue">
                <div class="card-header">
                    <h2><i class="fas fa-clipboard-list"></i> Order Queue</h2>
                    <div class="badge-counter">{{ pendingOrders.length }}</div>
                </div>

                <div class="order-tabs">
                    <button
                        @click="activeTab = 'PENDING'"
                        :class="['tab-btn', { active: activeTab === 'PENDING' }]"
                    >
                        <i class="far fa-hourglass"></i> Pending
                    </button>
                    <button
                        @click="activeTab = 'PREPARING'"
                        :class="['tab-btn', { active: activeTab === 'PREPARING' }]"
                    >
                        <i class="fas fa-utensils"></i> Preparing
                    </button>
                </div>

                <div class="orders-list">
                    <div v-if="activeTab === 'PENDING'">
                        <div v-for="(order, index) in pendingOrders" :key="order.id" class="order-card">
                            <div class="order-header">
                                <div class="order-id">
                                    #{{ index + 1 }} – {{ order.orderCode }}
                                </div>
                                <div class="order-time"><i class="far fa-clock"></i> {{ formatTime(order.createdAt) }}</div>
                            </div>

                            <div class="order-items">
                                <div v-for="item in order.items" :key="item.id" class="item-row">
                                    <span class="item-name"><i class="fas fa-hamburger"></i> {{ item.itemName }}</span>
                                    <span class="item-quantity">×{{ item.quantity }}</span>
                                </div>
                            </div>

                            <div class="order-footer">
                                <div class="order-total"><i class="fas fa-dollar-sign"></i> {{ order.total }}</div>
                                <div class="order-actions">
                                    <button class="btn-start" @click="confirmOrder(order.id)">
                                        <i class="fas fa-utensils"></i> Start
                                    </button>
                                    <button class="btn-cancel" @click="showCancelConfirmation(order.id)">
                                        <i class="fas fa-times"></i> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeTab === 'PREPARING'">
                        <div v-for="(order, index) in preparingOrders" :key="order.id" class="order-card">
                            <div class="order-header">
                                <div class="order-id">
                                    #{{ index + 1 }} – {{ order.username }}
                                </div>
                                <div class="order-time"><i class="far fa-clock"></i> Started {{ formatTime(order.updatedAt) }}</div>
                            </div>

                            <div class="order-items">
                                <div v-for="item in order.items" :key="item.id" class="item-row">
                                    <span class="item-name"><i class="fas fa-hamburger"></i> {{ item.itemName }}</span>
                                    <span class="item-quantity">×{{ item.quantity }}</span>
                                </div>
                            </div>

                            <div class="order-footer">
                                <div class="order-total"><i class="fas fa-dollar-sign"></i> {{ order.total }}</div>
                                <div class="order-actions">
                                    <button class="btn-ready" @click="markAsReady(order.id)">
                                        <i class="fas fa-check-circle"></i> Ready
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TOTAL ITEMS NEEDED -->
            <div class="section-card items-needed my-4">
                <div class="card-header">
                    <h2><i class="fas fa-boxes"></i> Total Items Needed</h2>
                </div>

                <div class="items-list">
                    <div v-for="item in totalItemsNeeded" :key="item.name" class="item-needed">
                        <span class="item-name"><i class="fas fa-hamburger"></i> {{ item.itemName }}</span>
                        <span class="item-count"><i class="fas fa-sort-numeric-up"></i> {{ item.quantity }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="sidebar-section">

            <!-- READY FOR PICKUP -->
            <div class="section-card ready-pickup">
                <div class="card-header">
                    <h2><i class="fas fa-check-circle"></i> Ready for Pickup</h2>
                    <div class="badge-counter">{{ readyOrders.length }}</div>
                </div>

                <div class="ready-list">
                    <div v-for="(order, index) in readyOrders" :key="order.id" class="ready-item">
                        <div>
                            <p class="ready-id"><i class="fas fa-user"></i> #{{ index + 1 }} – {{ order.orderCode }} For {{ order.username }}</p>
                            <div class="ready-time"><i class="far fa-clock"></i> {{ formatTime(order.readyTime) }}</div>
                        </div>
                        <button class="btn-delivered" @click="markAsDelivered(order.id)">
                            <i class="fas fa-truck"></i> Deliver
                        </button>
                    </div>
                </div>
            </div>

            <!-- RECENTLY DELIVERED -->
            <div class="section-card delivered-orders">
                <div class="card-header">
                    <h2><i class="fas fa-box-open"></i> Recently Delivered</h2>
                </div>

                <div class="delivered-list">
                    <div v-for="(order, index) in deliveredOrders.slice(0,3)" :key="order.id" class="delivered-item">
                        <div>
                            <p class="delivered-id"><i class="fas fa-user"></i> #{{ index + 1 }} – {{ order.orderCode }}</p>
                            <div class="delivered-time"><i class="far fa-clock"></i> {{ formatTime(order.deliveredAt) }}</div>
                        </div>
                        <span class="status-badge delivered"><i class="fas fa-check"></i></span>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- CANCELLATION CONFIRMATION OVERLAY (MOVED OUTSIDE THE LOOP) -->
    <div v-if="showCancelConfirm" class="confirm-overlay">
        <div class="confirm-box">
            <p>Are you sure you want to cancel order #{{ orderToCancel?.id || '' }} for {{ orderToCancel?.username || '' }}?</p>
            <div class="actions">
                <button class="cancel" @click="hideCancelConfirmation">
                    No
                </button>
                <button class="confirm" @click="cancelOrder">
                    Yes
                </button>
            </div>
        </div>
    </div>
</div>

<FooterPageMenu/>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue'
import FooterPageMenu from '@/components/client/FooterPageMenu.vue'

const orders = ref([])
const activeTab = ref('PENDING')
const currentTime = ref(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
)
//for notifications
const PENDING_STORAGE_KEY = 'knownPendingOrderIds'

const knownPendingOrderIds = ref(
  new Set(JSON.parse(localStorage.getItem(PENDING_STORAGE_KEY) || '[]'))
)

const showCancelConfirm = ref(false)
const orderToCancel = ref(null)

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

    const incomingOrders = res.data

    // Only pending orders
    const incomingPending = incomingOrders.filter(o => o.status === "PENDING")

    // Detect NEW pending orders
    const newPending = incomingPending.filter(
      o => !knownPendingOrderIds.value.has(o.id)
    )

    // 🔊 play sound ONLY if not first load
    const hasStoredPending = knownPendingOrderIds.value.size > 0

    if (newPending.length > 0 && hasStoredPending) {
      playPendingOrderSound()
    }

    // Update known pending IDs
    incomingPending.forEach(o => knownPendingOrderIds.value.add(o.id))

    // Persist
    localStorage.setItem(
      PENDING_STORAGE_KEY,
      JSON.stringify([...knownPendingOrderIds.value])
    )

    orders.value = incomingOrders
  } catch (err) {
    console.error("Erreur chargement commandes", err)
  }
}
//websocke

/*
let socket;


onMounted(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socket = new WebSocket(`ws://localhost:8088/orders/ws?token=${token}`);

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        const order = JSON.parse(event.data);
        console.log("New order received:", order);

        // Push to orders
        orders.value.unshift(order);

        // Handle pending order notification
        if (order.status === "PENDING") {
            if (!knownPendingOrderIds.value.has(order.id)) {
                playPendingOrderSound();
                knownPendingOrderIds.value.add(order.id);
                localStorage.setItem(
                    PENDING_STORAGE_KEY,
                    JSON.stringify([...knownPendingOrderIds.value])
                );
            }
        }
    };

    socket.onclose = () => console.log("WebSocket disconnected");
});*/


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

// Show cancellation confirmation
const showCancelConfirmation = (orderId) => {
    orderToCancel.value = orders.value.find(o => o.id === orderId)
    showCancelConfirm.value = true
}

// Hide cancellation confirmation
const hideCancelConfirmation = () => {
    showCancelConfirm.value = false
    orderToCancel.value = null
}

// Cancel order
const cancelOrder = async () => {
    if (!orderToCancel.value) return
    
    const token = localStorage.getItem("token")
    
    try {
        await axios.put(
            `http://localhost:8088/worker/orders/${orderToCancel.value.id}/status`,
            { 
                status: "CANCELLED",
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        // Update local order
        const order = orders.value.find(o => o.id === orderToCancel.value.id)
        if (order) {
            order.status = "CANCELLED"
        }
        
        hideCancelConfirmation()
        
    } catch (err) {
        console.error("Error cancelling order:", err)
        alert("Failed to cancel order")
        hideCancelConfirmation()
    }
}

const playPendingOrderSound = () => {
  const audio = new Audio('/sounds/notificationWorker.mp3')
  audio.play().catch(() => {})
}

</script>


<style scoped>
/* ==================== BASE DASHBOARD ==================== */
.dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #fdfaf2 0%, #f5ede0 50%, #efe5d6 100%);
    padding: 32px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    position: relative;
}

.dashboard::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: radial-gradient(ellipse at top, rgba(170, 122, 17, 0.08) 0%, transparent 70%);
    pointer-events: none;
}

/* ==================== HEADER ==================== */
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 28px 36px;
    background: #ffffff;
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 
        0 8px 32px rgba(170, 122, 17, 0.12),
        0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(170, 122, 17, 0.1);
    position: relative;
    z-index: 10;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.icon-badge {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    box-shadow: 
        0 12px 32px rgba(170, 122, 17, 0.35),
        0 4px 12px rgba(170, 122, 17, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
}

.icon-badge::after {
    content: '';
    position: absolute;
    inset: -4px;
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.2) 0%, rgba(212, 165, 23, 0.1) 100%);
    border-radius: 22px;
    z-index: -1;
}

.icon-badge:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
        0 16px 40px rgba(170, 122, 17, 0.4),
        0 8px 16px rgba(170, 122, 17, 0.25);
}

.header-left h1 {
    margin: 0 0 6px 0;
    font-size: 32px;
    font-weight: 900;
    color: #1f2937;
    letter-spacing: -0.03em;
    line-height: 1.2;
}

.subtitle {
    margin: 0;
    color: #6b7280;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
}

.header-right {
    display: flex;
    gap: 16px;
    align-items: center;
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border: 2px solid #10b981;
    border-radius: 100px;
    font-weight: 700;
    color: #065f46;
    font-size: 14px;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
    transition: all 0.3s ease;
}

.status-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.status-badge.delivered {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-color: #3b82f6;
    color: #1e40af;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.status-dot {
    width: 10px;
    height: 10px;
    background: #10b981;
    border-radius: 50%;
    animation: statusPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
}

@keyframes statusPulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.6;
        transform: scale(0.9);
    }
}

.time-display {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #fef9e7 0%, #fcefc7 100%);
    border-radius: 100px;
    font-weight: 700;
    color: #aa7a11;
    font-size: 14px;
    border: 2px solid rgba(170, 122, 17, 0.2);
    box-shadow: 0 4px 16px rgba(170, 122, 17, 0.12);
    transition: all 0.3s ease;
}

.time-display:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(170, 122, 17, 0.18);
}

/* ==================== CONTENT LAYOUT ==================== */
.dashboard-content {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 32px;
}

/* ==================== SECTION CARDS ==================== */
.section-card {
    background: #ffffff;
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 
        0 8px 32px rgba(170, 122, 17, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(170, 122, 17, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
}

.section-card:hover {
    box-shadow: 
        0 12px 40px rgba(170, 122, 17, 0.15),
        0 4px 12px rgba(0, 0, 0, 0.06);
}

/* ==================== CARD HEADER ==================== */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 32px;
    background: linear-gradient(135deg, #fef9e7 0%, #fcefc7 100%);
    border-bottom: 2px solid rgba(170, 122, 17, 0.15);
    position: relative;
}

.card-header::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, #aa7a11 0%, transparent 100%);
}

.card-header h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 14px;
    letter-spacing: -0.02em;
}

.icon {
    font-size: 28px;
    filter: drop-shadow(0 2px 4px rgba(170, 122, 17, 0.2));
}

.icon-badge span {
    font-size: 36px;
}

.badge-counter {
    background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
    color: white;
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 16px rgba(170, 122, 17, 0.3);
    text-transform: uppercase;
}

/* ==================== ORDER TABS ==================== */
.order-tabs {
    display: flex;
    padding: 0 32px;
    background: #ffffff;
    border-bottom: 2px solid #f3f4f6;
    gap: 4px;
}

.tab-btn {
    padding: 18px 28px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    font-weight: 700;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-size: 15px;
    letter-spacing: -0.01em;
    position: relative;
}

.tab-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(170, 122, 17, 0.05) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.tab-btn:hover:not(.active)::before {
    opacity: 1;
}

.tab-btn.active {
    color: #aa7a11;
    border-bottom-color: #aa7a11;
    background: linear-gradient(180deg, rgba(170, 122, 17, 0.08) 0%, transparent 100%);
}

.tab-btn:hover:not(.active) {
    color: #aa7a11;
}

/* ==================== ORDERS LIST ==================== */
.orders-list {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: calc(100vh - 220px);
    overflow-y: auto;
}

/* ==================== ORDER CARDS ==================== */
.order-card {
    background: #ffffff;
    border: 2px solid #e5e7eb;
    border-radius: 20px;
    padding: 28px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
}

.order-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(180deg, #aa7a11 0%, #d4a517 100%);
    transform: scaleY(0);
    transition: transform 0.3s ease;
    transform-origin: top;
}

.order-card:hover::before {
    transform: scaleY(1);
}

.order-card:hover {
    transform: translateY(-6px);
    box-shadow: 
        0 20px 48px rgba(170, 122, 17, 0.18),
        0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #aa7a11;
}

/* ==================== ORDER HEADER ==================== */
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f9fafb;
}

.order-id {
    flex: 1;
}

.hash {
    font-size: 22px;
    font-weight: 800;
    color: #1f2937;
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.02em;
}

.hash span {
    color: #aa7a11;
    font-size: 20px;
}

.order-time {
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 14px;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 100px;
    border: 1px solid #e5e7eb;
}

/* ==================== ORDER ITEMS ==================== */
.order-items {
    background: linear-gradient(135deg, #fafbfc 0%, #f5f6f7 100%);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #f0f1f3;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
}

.item-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.item-row:hover {
    padding-left: 8px;
}

.item-name {
    font-weight: 700;
    color: #374151;
    font-size: 15px;
    letter-spacing: -0.01em;
}

.item-quantity {
    font-weight: 800;
    color: #aa7a11;
    background: white;
    padding: 4px 14px;
    border-radius: 100px;
    font-size: 13px;
    border: 2px solid rgba(170, 122, 17, 0.2);
    box-shadow: 0 2px 8px rgba(170, 122, 17, 0.12);
}

/* ==================== ORDER FOOTER ==================== */
.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.order-total {
    font-size: 28px;
    font-weight: 900;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
}

.order-actions {
    display: flex;
    gap: 12px;
    flex: 1;
    justify-content: flex-end;
}

/* ==================== BUTTONS ==================== */
.btn-start,
.btn-ready,
.btn-delivered,
.btn-cancel {
    border: none;
    padding: 14px 24px;
    border-radius: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    letter-spacing: 0.2px;
    position: relative;
    overflow: hidden;
}

.btn-start,
.btn-ready,
.btn-delivered,
.btn-cancel {
    box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.12),
        0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-start::before,
.btn-ready::before,
.btn-delivered::before,
.btn-cancel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.btn-start:hover::before,
.btn-ready:hover::before,
.btn-delivered:hover::before,
.btn-cancel:hover::before {
    opacity: 1;
}

.action-icon {
    font-size: 18px;
}

.btn-start {
    background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
    color: white;
}

.btn-start:hover {
    transform: translateY(-3px);
    box-shadow: 
        0 12px 32px rgba(170, 122, 17, 0.4),
        0 4px 16px rgba(170, 122, 17, 0.3);
}

.btn-ready {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.btn-ready:hover {
    transform: translateY(-3px);
    box-shadow: 
        0 12px 32px rgba(16, 185, 129, 0.4),
        0 4px 16px rgba(16, 185, 129, 0.3);
}

.btn-delivered {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
}

.btn-delivered:hover {
    transform: translateY(-3px);
    box-shadow: 
        0 12px 32px rgba(59, 130, 246, 0.4),
        0 4px 16px rgba(59, 130, 246, 0.3);
}

.btn-cancel {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    padding: 14px 20px;
}

.btn-cancel:hover {
    transform: translateY(-3px);
    box-shadow: 
        0 12px 32px rgba(239, 68, 68, 0.4),
        0 4px 16px rgba(239, 68, 68, 0.3);
}

.btn-start:active,
.btn-ready:active,
.btn-delivered:active,
.btn-cancel:active {
    transform: translateY(-1px);
}

/* ==================== SIDEBAR ==================== */
.sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.items-list,
.ready-list,
.delivered-list {
    padding: 20px 24px;
    max-height: 400px;
    overflow-y: auto;
}

.item-needed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    background: linear-gradient(135deg, #fdfbf7 0%, #f8f6f1 100%);
    border-radius: 14px;
    margin-bottom: 12px;
    border-left: 4px solid #aa7a11;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid #f5f0e6;
    border-left-width: 4px;
}

.item-needed:hover {
    transform: translateX(8px);
    background: linear-gradient(135deg, #fef9e7 0%, #fcefc7 100%);
    box-shadow: 0 8px 24px rgba(170, 122, 17, 0.12);
}

.item-name {
    font-weight: 700;
    color: #1f2937;
    font-size: 15px;
}

.item-count {
    font-weight: 800;
    color: #aa7a11;
    font-size: 14px;
    padding: 4px 12px;
    background: white;
    border-radius: 100px;
    border: 2px solid rgba(170, 122, 17, 0.2);
}

/* ==================== READY & DELIVERED ITEMS ==================== */
.ready-item,
.delivered-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px;
    border-radius: 14px;
    margin-bottom: 14px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ready-item {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%);
    border: 2px solid rgba(16, 185, 129, 0.2);
}

.ready-item:hover {
    transform: translateX(8px);
    border-color: #10b981;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
}

.delivered-item {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%);
    border: 2px solid rgba(59, 130, 246, 0.2);
}

.delivered-item:hover {
    transform: translateX(8px);
    border-color: #3b82f6;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

.ready-id,
.delivered-id {
    font-weight: 800;
    color: #1f2937;
    font-size: 16px;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
}

.ready-time,
.delivered-time {
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
    margin: 0;
}

/* ==================== SCROLLBAR ==================== */
.orders-list::-webkit-scrollbar,
.items-list::-webkit-scrollbar,
.ready-list::-webkit-scrollbar,
.delivered-list::-webkit-scrollbar {
    width: 8px;
}

.orders-list::-webkit-scrollbar-track,
.items-list::-webkit-scrollbar-track,
.ready-list::-webkit-scrollbar-track,
.delivered-list::-webkit-scrollbar-track {
    background: #f9fafb;
    border-radius: 10px;
    margin: 8px 0;
}

.orders-list::-webkit-scrollbar-thumb,
.items-list::-webkit-scrollbar-thumb,
.ready-list::-webkit-scrollbar-thumb,
.delivered-list::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #aa7a11 0%, #d4a517 100%);
    border-radius: 10px;
    border: 2px solid #f9fafb;
}

.orders-list::-webkit-scrollbar-thumb:hover,
.items-list::-webkit-scrollbar-thumb:hover,
.ready-list::-webkit-scrollbar-thumb:hover,
.delivered-list::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #d4a517 0%, #aa7a11 100%);
}

/* ==================== ICONS ==================== */
.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-size: 24px;
}

.icon-clock::before {
    content: "🕐";
    font-size: 22px;
}

.icon-check::before {
    content: "✓";
    font-size: 20px;
    font-weight: 800;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1200px) {
    .dashboard-content {
        grid-template-columns: 1fr;
    }

    .sidebar-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
    }
}

@media (max-width: 768px) {
    .dashboard {
        padding: 20px;
    }

    .dashboard-header {
        flex-direction: column;
        gap: 20px;
        padding: 24px;
    }

    .header-left,
    .header-right {
        width: 100%;
    }

    .header-left {
        text-align: center;
        flex-direction: column;
    }

    .header-right {
        flex-direction: column;
        gap: 12px;
    }

    .status-badge,
    .time-display {
        width: 100%;
        justify-content: center;
    }

    .sidebar-section {
        grid-template-columns: 1fr;
    }

    .order-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }

    .order-actions {
        flex-direction: column;
        width: 100%;
    }

    .btn-start,
    .btn-ready,
    .btn-delivered,
    .btn-cancel {
        width: 100%;
        justify-content: center;
    }

    .order-total {
        text-align: center;
    }
}

@media (max-width: 480px) {
    .dashboard {
        padding: 16px;
    }

    .dashboard-header {
        padding: 20px;
    }

    .header-left h1 {
        font-size: 24px;
    }

    .icon-badge {
        width: 60px;
        height: 60px;
        font-size: 30px;
    }

    .card-header {
        padding: 20px 24px;
    }

    .orders-list {
        padding: 16px;
    }

    .order-card {
        padding: 20px;
    }
}
.fa-hamburger{
    color:#aa7a11
}
/* ==================== ANIMATIONS ==================== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.order-card {
    animation: fadeIn 0.4s ease-out;
}

/* LOGOUT CONFIRM */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 260px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
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

/* All your existing CSS remains the same, but add these styles for the confirmation overlay */

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.confirm-box {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-out;
}

.confirm-box p {
  margin-bottom: 24px;
  font-weight: 600;
  color: #1f2937;
  font-size: 18px;
  line-height: 1.5;
}

.confirm-box .actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.confirm-box button {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.3s ease;
  max-width: 150px;
}

.confirm-box .cancel {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.confirm-box .cancel:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.confirm-box .confirm {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.confirm-box .confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
}

</style>