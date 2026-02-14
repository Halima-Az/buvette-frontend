<template>
    <HeaderPageMenu title="" />

    <div class="dashboard admin-dashboard">
        <div class="dashboard-header admin-header">
            <div class="header-left">
                <div class="icon-badge admin-icon">
                    <div class="icon-inner">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div class="icon-glow"></div>
                </div>
                <div>
                    <h1>Worker Requests</h1>
                    <p class="subtitle">Review and manage worker account requests</p>
                </div>
            </div>

            <div class="header-right">
                <div class="request-stats">
                    <div class="stat-item pending">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-value">{{ pendingRequests.length }}</span>
                            <span class="stat-label">Pending Review</span>
                        </div>
                        <div class="stat-decoration"></div>
                    </div>
                    <div class="stat-item approved">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-value">{{ approvedCount }}</span>
                            <span class="stat-label">Approved Today</span>
                        </div>
                        <div class="stat-decoration"></div>
                    </div>
                </div>
                <div class="time-display">
                    <div class="time-icon">
                        <i class="far fa-clock"></i>
                    </div>
                    <span>{{ currentTime }}</span>
                </div>
            </div>
        </div>

        <!-- WORKER REQUESTS -->
        <div class="section-card worker-requests">
            <div class="card-header admin-card-header">
                <div class="header-content">
                    <h2>
                        <span class="header-icon">
                            <i class="fas fa-user-clock"></i>
                        </span>
                        Worker Account Requests
                    </h2>
                    <p class="header-subtitle">{{ filteredRequests.length }} request(s) found</p>
                </div>
                <div class="request-filters">
                    <select v-model="statusFilter" class="filter-select">
                        <option value="ALL">All Requests</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div class="requests-list">
                <div v-for="request in filteredRequests" :key="request.id" class="request-item"
                    :data-status="request.status.toLowerCase()">
                    <div class="request-header">
                        <div class="request-user">
                            <div class="user-avatar-wrapper">
                                <div class="user-avatar">
                                    {{ request.firstName.charAt(0).toUpperCase() }}
                                </div>
                                <div class="avatar-ring"></div>
                            </div>
                            <div class="user-details">
                                <p class="request-name">{{ request.firstName }} {{ request.lastName }}</p>
                                <p class="request-email">
                                    <i class="far fa-envelope"></i>
                                    {{ request.email }}
                                </p>
                                <div class="request-meta">
                                    <span class="meta-badge">
                                        <i class="far fa-calendar"></i>
                                        {{ formatDate(request.createdAt) }}
                                    </span>
                                    <span class="meta-badge">
                                        <i class="far fa-clock"></i>
                                        {{ formatTime(request.createdAt) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="request-status-wrapper">
                            <div class="request-status" :class="request.status.toLowerCase()">
                                <span class="status-dot"></span>
                                <i :class="getStatusIcon(request.status)"></i>
                                <span>{{ request.status }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="request.status === 'PENDING'" class="request-details">
                        <div class="request-notes">
                            <div class="notes-header">
                                <i class="fas fa-sticky-note"></i>
                                <h4>Application Notes</h4>
                            </div>
                            <div class="notes-content">
                                <p>{{ request.notes || 'No additional notes provided.' }}</p>
                            </div>
                        </div>
                        <div class="request-actions">
                            <button class="btn-action btn-approve" @click="approveWorkerRequest(request.id)">
                                <span class="btn-icon">
                                    <i class="fas fa-check"></i>
                                </span>
                                <span class="btn-text">Approve Request</span>
                                <span class="btn-glow"></span>
                            </button>
                            <button class="btn-action btn-reject" @click="rejectWorkerRequest(request.id)">
                                <span class="btn-icon">
                                    <i class="fas fa-times"></i>
                                </span>
                                <span class="btn-text">Reject</span>
                            </button>
                            <button class="btn-action btn-view" @click="viewApplication(request.id)">
                                <span class="btn-icon">
                                    <i class="fas fa-eye"></i>
                                </span>
                                <span class="btn-text">Details</span>
                            </button>
                        </div>
                    </div>

                    <div v-else class="request-history">
                        <div class="history-info">
                            <div class="history-badge">
                                <i class="fas fa-user-shield"></i>
                                <span>Processed by <strong>{{ request.processedBy || 'System' }}</strong></span>
                            </div>
                            <div class="history-badge">
                                <i class="far fa-calendar-check"></i>
                                <span>{{ formatDate(request.processedAt) }}</span>
                            </div>
                        </div>
                        <div class="history-actions">
                            <button class="btn-action btn-view" @click="viewApplication(request.id)">
                                <span class="btn-icon">
                                    <i class="fas fa-eye"></i>
                                </span>
                                <span class="btn-text">View Details</span>
                            </button>
                            <button v-if="request.status === 'REJECTED'" class="btn-action btn-reconsider"
                                @click="reconsiderRequest(request.id)">
                                <span class="btn-icon">
                                    <i class="fas fa-redo"></i>
                                </span>
                                <span class="btn-text">Reconsider</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="filteredRequests.length === 0" class="empty-state">
                    <div class="empty-illustration">
                        <div class="empty-icon">
                            <i class="fas fa-inbox"></i>
                        </div>
                        <div class="empty-circles">
                            <span class="circle circle-1"></span>
                            <span class="circle circle-2"></span>
                            <span class="circle circle-3"></span>
                        </div>
                    </div>
                    <h3>No worker requests found</h3>
                    <p>All requests have been processed or no requests match your filter.</p>
                </div>
            </div>
        </div>
         <userDetails :showUserDetailsModal="showUserDetailsModal" 
                     :selectedUser="user"
                     @closeUserDetails="closeUserDetails"/>

        <!-- APPROVED WORKERS -->
        <div class="section-card approved-workers">
            <div class="card-header admin-card-header">
                <div class="header-content">
                    <h2>
                        <span class="header-icon success">
                            <i class="fas fa-user-check"></i>
                        </span>
                        Recently Approved Workers
                    </h2>
                    <p class="header-subtitle">Top performing team members</p>
                </div>
                <router-link to="/admin/allWorkers" class="btn-view-all">
                    <span>View All Workers</span>
                    <i class="fas fa-arrow-right"></i>
                </router-link>
            </div>

            <div class="workers-grid">
                <div v-for="worker in recentApprovedWorkers" :key="worker.id" class="worker-card">
                    <div class="worker-header">
                        <div class="worker-avatar-wrapper">
                            <div class="worker-avatar">
                                {{ worker.firstName.charAt(0).toUpperCase() }}
                            </div>
                            <div class="avatar-status"></div>
                        </div>
                        <div class="worker-info">
                            <h4>{{ worker.firstName }}</h4>
                            <p class="worker-email">
                                <i class="far fa-envelope"></i>
                                {{ worker.email }}
                            </p>
                        </div>
                    </div>
                    <div class="worker-stats">
                        <div class="stat-box">
                            <i class="fas fa-shopping-bag"></i>
                            <div>
                                <span class="stat-number">{{ totalOrders }}</span>
                                <span class="stat-text">Orders</span>
                            </div>
                        </div>
                        <div class="stat-box">
                            <i class="fas fa-star"></i>
                            <div>
                                <span class="stat-number">{{ delevredOrders }}</span>
                                <span class="stat-text">Delevred</span>
                            </div>
                        </div>
                    </div>
                    <div class="worker-status">
                        <span class="status-indicator"></span>
                        <span>Active Now</span>
                    </div>
                </div>
            </div>
        </div>
       
        
    </div>

    <AdminFooter />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue'
import AdminFooter from '@/components/admin/adminFooter.vue'
import userDetails from '@/components/admin/userDetails.vue'
import axios from 'axios'

// Data
const currentTime = ref('')
const statusFilter = ref('ALL')

// Worker Requests Data
const workerRequests = ref([])
const recentApprovedWorkers = ref([])
const totalOrders = ref(null)
const delevredOrders = ref(null)
const user =ref(null)
const showUserDetailsModal=ref(false)

onMounted(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await axios.get("http://localhost:8088/admin/requests", {
        headers: { Authorization: `Bearer ${token}` },
    });
    workerRequests.value = res.data.sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt))
    recentApprovedWorkers.value = res.data.filter(worker => worker.status === "APPROVED")
                                           .sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt))
                                           .slice(0,3)
    const resOrder = await axios.get("http://localhost:8088/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
    });
    totalOrders.value = resOrder.data.length
    delevredOrders.value = resOrder.data.filter(order => order.status === "DELIVERED").length

})


// Computed
const pendingRequests = computed(() =>
    workerRequests.value.filter(r => r.status === 'PENDING')
)

const approvedCount = computed(() =>
    workerRequests.value.filter(r => r.status === 'APPROVED').length
)

const filteredRequests = computed(() => {
    if (statusFilter.value === 'ALL') {
        return workerRequests.value
    }
    return workerRequests.value.filter(r => r.status === statusFilter.value)
})

// Methods
const formatTime = (dateString) => {
    if (!dateString) return '--:--'
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (dateString) => {
    if (!dateString) return '--/--/----'
    const date = new Date(dateString)
    return date.toLocaleDateString()
}

const getStatusIcon = (status) => {
    switch (status) {
        case 'PENDING': return 'fas fa-clock'
        case 'APPROVED': return 'fas fa-check-circle'
        case 'REJECTED': return 'fas fa-times-circle'
        default: return 'fas fa-question-circle'
    }
}

const approveWorkerRequest = async (requestId) => {

    try {
        const token = localStorage.getItem("token")
        await axios.post(`http://localhost:8088/admin/worker-requests/${requestId}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const request = workerRequests.value.find(r => r.id === requestId)
        if (request) {
            request.status = 'APPROVED'
            request.processedAt = new Date().toISOString()
            request.processedBy = 'You'
        }

    } catch (err) {
        console.error("Error approving request:", err)
        alert("Failed to approve worker request")
    }
}

const rejectWorkerRequest = async (requestId) => {
    if (!confirm("Reject this worker request?")) return

    try {
        const token = localStorage.getItem("token")
        await axios.post(`http://localhost:8088/admin/worker-requests/${requestId}/reject`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const request = workerRequests.value.find(r => r.id === requestId)
        if (request) {
            request.status = 'REJECTED'
            request.processedAt = new Date().toISOString()
            request.processedBy = 'You'
        }
    } catch (err) {
        console.error("Error rejecting request:", err)
        alert("Failed to reject worker request")
    }
}

const viewApplication = async (requestId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res= await axios.get(`http://localhost:8088/admin/${requestId}/user-details`,{
         headers: { Authorization: `Bearer ${token}` },
    })

    showUserDetailsModal.value=true
    user.value=res.data;


}
const closeUserDetails=()=>{
      showUserDetailsModal.value=false
    
}
const reconsiderRequest = (requestId) => {
    if (!confirm("Move this request back to pending?")) return

    const request = workerRequests.value.find(r => r.id === requestId)
    if (request) {
        request.status = 'PENDING'
        request.processedBy = null
        request.processedAt = null
    }
}

// Update time
onMounted(() => {
    updateTime()
    const timer = setInterval(updateTime, 60000)
    onUnmounted(() => clearInterval(timer))
})

const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<style scoped>
/* =========================
   CSS VARIABLES
========================= */

:root {
    --primary: #aa7a11;
    --secondary: #d4a517;
    --bg-main: #fdfaf2;
    --bg-card: #ffffff;
    --text-main: #1f2937;
    --text-muted: #6b7280;
    --success: #10b981;
    --warning: #fbbf24;
    --danger: #ef4444;
    --info: #7c3aed;
}

/* =========================
   LAYOUT & BASE
========================= */

.admin-dashboard {
    background: var(--bg-main);
    padding: 48px;
    min-height: 100vh;
    position: relative;
}

.admin-dashboard::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(circle at 20% 30%, rgba(170, 122, 17, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(212, 165, 23, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
}

.admin-dashboard>* {
    position: relative;
    z-index: 1;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    animation: slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

/* =========================
   ANIMATED ICON BADGE
========================= */

.admin-icon {
    position: relative;
    width: 72px;
    height: 72px;
}

.icon-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 22px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    box-shadow:
        0 10px 30px rgba(170, 122, 17, 0.3),
        inset 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 2;
    animation: float 4s ease-in-out infinite;
}

.icon-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 22px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    filter: blur(20px);
    opacity: 0.5;
    animation: pulse 3s ease-in-out infinite;
    z-index: 1;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-8px) rotate(2deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.4;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.05);
    }
}

.admin-header h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
}

.subtitle {
    font-size: 15px;
    color: var(--text-muted);
    margin-top: 6px;
    font-weight: 500;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

/* =========================
   STATS CARDS - ADVANCED
========================= */

.request-stats {
    display: flex;
    gap: 16px;
}

.stat-item {
    position: relative;
    background: var(--bg-card);
    padding: 20px 24px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 180px;
    box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
}

.stat-decoration {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    opacity: 0.05;
    transition: all 0.4s ease;
}

.stat-item.pending .stat-decoration {
    background: var(--warning);
}

.stat-item.approved .stat-decoration {
    background: var(--success);
}

.stat-item:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.stat-item:hover .stat-decoration {
    opacity: 0.1;
    transform: scale(1.5);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    position: relative;
    z-index: 1;
}

.stat-item.pending .stat-icon {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05));
    color: var(--warning);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
}

.stat-item.approved .stat-icon {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
    color: var(--success);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.stat-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.stat-value {
    font-size: 28px;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1;
    letter-spacing: -1px;
}

.stat-label {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* =========================
   TIME DISPLAY
========================= */

.time-display {
    background: var(--bg-card);
    padding: 14px 20px;
    border-radius: 14px;
    font-weight: 700;
    color: var(--text-main);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    gap: 10px;
    border: 2px solid rgba(170, 122, 17, 0.1);
}

.time-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.15), rgba(212, 165, 23, 0.05));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
}

/* =========================
   CARDS - GLASS MORPHISM
========================= */

.section-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(170, 122, 17, 0.1);
    border-radius: 28px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
    margin-bottom: 28px;
    animation: fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation-fill-mode: both;
}

.worker-requests {
    animation-delay: 0.1s;
}

.approved-workers {
    animation-delay: 0.2s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.admin-card-header {
    padding: 28px 32px;
    border-bottom: 2px solid rgba(170, 122, 17, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, rgba(253, 250, 242, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
}

.header-content h2 {
    margin: 0 0 6px 0;
    font-size: 20px;
    font-weight: 800;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 12px;
    letter-spacing: -0.3px;
}

.header-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(170, 122, 17, 0.3);
}

.header-icon.success {
    background: linear-gradient(135deg, var(--success), #059669);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.header-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0;
    font-weight: 500;
}

/* =========================
   FILTER SELECT
========================= */

.filter-select {
    padding: 12px 42px 12px 18px;
    border-radius: 14px;
    border: 2px solid rgba(170, 122, 17, 0.15);
    font-size: 14px;
    font-weight: 600;
    background: var(--bg-card);
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath fill='%23aa7a11' d='M7 10L2 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-select:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(170, 122, 17, 0.15);
}

.filter-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(170, 122, 17, 0.1);
}

/* =========================
   REQUESTS LIST
========================= */

.requests-list {
    padding: 32px;
}

.request-item {
    position: relative;
    background: var(--bg-card);
    border: 2px solid rgba(170, 122, 17, 0.08);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 24px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
}

.request-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(180deg, var(--primary), var(--secondary));
    opacity: 0;
    transition: opacity 0.3s ease;
}

.request-item[data-status="pending"]::before {
    background: linear-gradient(180deg, var(--warning), #f59e0b);
}

.request-item[data-status="approved"]::before {
    background: linear-gradient(180deg, var(--success), #059669);
}

.request-item[data-status="rejected"]::before {
    background: linear-gradient(180deg, var(--danger), #dc2626);
}

.request-item::after {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: radial-gradient(circle, rgba(170, 122, 17, 0.03) 0%, transparent 70%);
    transition: all 0.6s ease;
    pointer-events: none;
}

.request-item:hover {
    border-color: var(--primary);
    box-shadow:
        0 16px 48px rgba(170, 122, 17, 0.12),
        0 0 0 1px rgba(170, 122, 17, 0.05);
    transform: translateY(-4px);
}

.request-item:hover::before {
    opacity: 1;
}

.request-item:hover::after {
    top: 0;
    left: 0;
}

/* =========================
   REQUEST HEADER
========================= */

.request-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
}

.request-user {
    display: flex;
    align-items: center;
    gap: 20px;
}

.user-avatar-wrapper {
    position: relative;
}

.user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 8px 24px rgba(170, 122, 17, 0.3);
    position: relative;
    z-index: 2;
}

.avatar-ring {
    position: absolute;
    top: -4px;
    left: -4px;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: 20px;
    border: 3px solid rgba(170, 122, 17, 0.2);
    animation: ringPulse 3s ease-in-out infinite;
}

@keyframes ringPulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.5;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

.user-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.request-name {
    font-weight: 800;
    color: var(--text-main);
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.3px;
}

.request-email {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.request-email i {
    color: var(--primary);
    opacity: 0.7;
}

.request-meta {
    display: flex;
    gap: 12px;
    margin-top: 4px;
}

.meta-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
    background: rgba(170, 122, 17, 0.06);
    padding: 6px 12px;
    border-radius: 10px;
    font-weight: 600;
    border: 1px solid rgba(170, 122, 17, 0.1);
}

.meta-badge i {
    color: var(--primary);
    font-size: 11px;
}

/* =========================
   STATUS BADGES - PREMIUM
========================= */

.request-status-wrapper {
    position: relative;
}

.request-status {
    padding: 10px 20px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    position: relative;
    overflow: hidden;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.2);
    }
}

.request-status.pending {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05));
    color: var(--warning);
    border: 2px solid rgba(251, 191, 36, 0.3);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
}

.request-status.pending .status-dot {
    background: var(--warning);
}

.request-status.approved {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
    color: var(--success);
    border: 2px solid rgba(16, 185, 129, 0.3);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.request-status.approved .status-dot {
    background: var(--success);
}

.request-status.rejected {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
    color: var(--danger);
    border: 2px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.request-status.rejected .status-dot {
    background: var(--danger);
}

/* =========================
   REQUEST DETAILS
========================= */

.request-details,
.request-history {
    border-top: 2px solid rgba(170, 122, 17, 0.08);
    padding-top: 28px;
    margin-top: 4px;
}

.request-notes {
    margin-bottom: 24px;
}

.notes-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
}

.notes-header i {
    color: var(--primary);
    font-size: 16px;
}

.notes-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
    color: var(--text-main);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.notes-content {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.04) 0%, rgba(212, 165, 23, 0.02) 100%);
    border-left: 4px solid var(--primary);
    border-radius: 12px;
    padding: 18px 20px;
}

.notes-content p {
    margin: 0;
    color: var(--text-main);
    font-size: 15px;
    line-height: 1.7;
    font-weight: 500;
}

/* =========================
   ACTION BUTTONS - PREMIUM
========================= */

.request-actions,
.history-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn-action {
    position: relative;
    padding: 14px 28px;
    border: none;
    border-radius: 14px;
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    overflow: hidden;
}

.btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

.btn-approve {
    background: linear-gradient(135deg, var(--success), #059669);
    color: white;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

.btn-approve:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
}

.btn-approve:hover .btn-glow {
    left: 100%;
}

.btn-approve:active {
    transform: translateY(-2px) scale(1.01);
}

.btn-reject {
    background: var(--bg-card);
    color: var(--danger);
    border: 2px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
}

.btn-reject:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
    border-color: var(--danger);
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.25);
}

.btn-view {
    background: var(--bg-card);
    color: var(--primary);
    border: 2px solid rgba(170, 122, 17, 0.3);
    box-shadow: 0 4px 12px rgba(170, 122, 17, 0.1);
}

.btn-view:hover {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.1), rgba(212, 165, 23, 0.05));
    border-color: var(--primary);
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 8px 24px rgba(170, 122, 17, 0.25);
}

.btn-reconsider {
    background: var(--bg-card);
    color: var(--info);
    border: 2px solid rgba(124, 58, 237, 0.3);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
}

.btn-reconsider:hover {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05));
    border-color: var(--info);
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.25);
}

/* =========================
   HISTORY INFO
========================= */

.history-info {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.history-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.06), rgba(212, 165, 23, 0.02));
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 600;
    border: 1px solid rgba(170, 122, 17, 0.15);
}

.history-badge i {
    color: var(--primary);
    font-size: 14px;
}

.history-badge strong {
    color: var(--text-main);
}

/* =========================
   EMPTY STATE - PREMIUM
========================= */

.empty-state {
    text-align: center;
    padding: 100px 20px;
}

.empty-illustration {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 32px;
}

.empty-icon {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.1), rgba(212, 165, 23, 0.05));
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    box-shadow: 0 8px 32px rgba(170, 122, 17, 0.15);
}

.empty-icon i {
    font-size: 48px;
    color: var(--primary);
    opacity: 0.6;
}

.empty-circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.circle {
    position: absolute;
    border-radius: 50%;
    border: 2px solid var(--primary);
    opacity: 0.2;
}

.circle-1 {
    top: -10px;
    left: -10px;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    animation: circleFloat 3s ease-in-out infinite;
}

.circle-2 {
    top: -20px;
    left: -20px;
    width: calc(100% + 40px);
    height: calc(100% + 40px);
    animation: circleFloat 3s ease-in-out infinite 0.5s;
}

.circle-3 {
    top: -30px;
    left: -30px;
    width: calc(100% + 60px);
    height: calc(100% + 60px);
    animation: circleFloat 3s ease-in-out infinite 1s;
}

@keyframes circleFloat {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.1;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.3;
    }
}

.empty-state h3 {
    font-size: 22px;
    color: var(--text-main);
    margin-bottom: 10px;
    font-weight: 800;
}

.empty-state p {
    font-size: 15px;
    color: var(--text-muted);
    max-width: 400px;
    margin: 0 auto;
}

/* =========================
   WORKERS GRID - PREMIUM
========================= */

.workers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    padding: 32px;
}

.worker-card {
    position: relative;
    background: var(--bg-card);
    border: 2px solid rgba(170, 122, 17, 0.08);
    border-radius: 24px;
    padding: 28px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
}

.worker-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(180deg, var(--success), #059669);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.worker-card::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%);
    transition: all 0.6s ease;
    pointer-events: none;
}

.worker-card:hover {
    border-color: var(--success);
    box-shadow:
        0 16px 48px rgba(16, 185, 129, 0.15),
        0 0 0 1px rgba(16, 185, 129, 0.05);
    transform: translateY(-6px);
}

.worker-card:hover::before {
    opacity: 1;
}

.worker-card:hover::after {
    top: -25%;
    right: -25%;
}

.worker-header {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(170, 122, 17, 0.08);
}

.worker-avatar-wrapper {
    position: relative;
}

.worker-avatar {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: white;
    font-size: 26px;
    box-shadow: 0 8px 24px rgba(170, 122, 17, 0.3);
}

.avatar-status {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 18px;
    height: 18px;
    background: var(--success);
    border: 3px solid var(--bg-card);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    animation: statusPulse 2s ease-in-out infinite;
}

.worker-info h4 {
    margin: 0 0 6px 0;
    color: var(--text-main);
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.3px;
}

.worker-email {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
}

.worker-email i {
    color: var(--primary);
    opacity: 0.7;
    font-size: 12px;
}

.worker-stats {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}

.stat-box {
    flex: 1;
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.06), rgba(212, 165, 23, 0.02));
    border: 1px solid rgba(170, 122, 17, 0.15);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-box i {
    font-size: 20px;
    color: var(--primary);
}

.stat-box div {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.stat-number {
    font-size: 18px;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1;
}

.stat-text {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.worker-status {
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 800;
    color: var(--success);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 2px solid rgba(16, 185, 129, 0.2);
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--success);
    animation: statusPulse 2s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

/* =========================
   VIEW ALL BUTTON
========================= */

.btn-view-all {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 12px 24px;
    border-radius: 14px;
    font-weight: 800;
    font-size: 14px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 6px 20px rgba(170, 122, 17, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-view-all:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 32px rgba(170, 122, 17, 0.4);
}

.btn-view-all i {
    transition: transform 0.3s ease;
}

.btn-view-all:hover i {
    transform: translateX(4px);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1200px) {
    .workers-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}

@media (max-width: 1024px) {
    .admin-dashboard {
        padding: 32px;
    }

    .admin-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
    }

    .header-right {
        width: 100%;
        flex-direction: column;
    }

    .request-stats {
        width: 100%;
    }

    .stat-item {
        flex: 1;
    }

    .time-display {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .admin-dashboard {
        padding: 20px;
    }

    .admin-icon {
        width: 64px;
        height: 64px;
    }

    .icon-inner {
        font-size: 24px;
    }

    .admin-header h1 {
        font-size: 26px;
    }

    .request-stats {
        flex-direction: column;
    }

    .stat-item {
        width: 100%;
    }

    .request-header {
        flex-direction: column;
        gap: 20px;
    }

    .request-actions,
    .history-actions {
        flex-direction: column;
    }

    .btn-action {
        width: 100%;
    }

    .workers-grid {
        grid-template-columns: 1fr;
    }

    .history-info {
        flex-direction: column;
    }

    .admin-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .request-filters,
    .btn-view-all {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .admin-dashboard {
        padding: 16px;
    }

    .admin-header h1 {
        font-size: 22px;
    }

    .subtitle {
        font-size: 14px;
    }

    .requests-list,
    .workers-grid {
        padding: 20px;
    }

    .request-item {
        padding: 24px;
    }

    .admin-card-header {
        padding: 24px;
    }

    .user-avatar,
    .worker-avatar {
        width: 52px;
        height: 52px;
        font-size: 20px;
    }

    .request-name,
    .worker-info h4 {
        font-size: 16px;
    }
}
</style>