<template>
    <HeaderPageMenu title="" />

    <div class="dashboard admin-dashboard">
        <div class="dashboard-header admin-header">
            <div class="header-left">
                <div class="icon-badge admin-icon">
                    <i class="fas fa-user-clock"></i>
                </div>
                <div>
                    <h1>Worker Requests</h1>
                    <p class="subtitle">Review and manage worker account requests</p>
                </div>
            </div>

            <div class="header-right">
                <div class="request-stats">
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <span class="stat-value">{{ pendingRequests.length }}</span>
                            <span class="stat-label">Pending</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <span class="stat-value">{{ approvedCount }}</span>
                            <span class="stat-label">Approved</span>
                        </div>
                    </div>
                </div>
                <div class="time-display">
                    <i class="far fa-clock"></i>
                    {{ currentTime }}
                </div>
            </div>
        </div>

        <!-- WORKER REQUESTS -->
        <div class="section-card worker-requests">
            <div class="card-header admin-card-header">
                <h2><i class="fas fa-user-clock"></i> Worker Account Requests</h2>
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
                <div v-for="request in filteredRequests" :key="request.id" class="request-item">
                    <div class="request-info">
                        <div class="request-user">
                            <div class="user-avatar">
                                {{ request.username.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="request-name">{{ request.username }}</p>
                                <p class="request-email">{{ request.email }}</p>
                                <div class="request-meta">
                                    <span class="request-date">
                                        <i class="far fa-calendar"></i>
                                        {{ formatDate(request.createdAt) }}
                                    </span>
                                    <span class="request-time">
                                        <i class="far fa-clock"></i>
                                        {{ formatTime(request.createdAt) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="request-status" :class="request.status.toLowerCase()">
                            <i :class="getStatusIcon(request.status)"></i>
                            {{ request.status }}
                        </div>
                    </div>

                    <div v-if="request.status === 'PENDING'" class="request-details">
                        <div class="request-notes">
                            <h4><i class="fas fa-sticky-note"></i> Application Notes</h4>
                            <p>{{ request.notes || 'No additional notes provided.' }}</p>
                        </div>
                        <div class="request-actions">
                            <button class="btn-approve" @click="approveWorkerRequest(request.id)">
                                <i class="fas fa-check"></i> Approve Request
                            </button>
                            <button class="btn-reject" @click="rejectWorkerRequest(request.id)">
                                <i class="fas fa-times"></i> Reject Request
                            </button>
                            <button class="btn-view" @click="viewApplication(request.id)">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    </div>

                    <div v-else class="request-history">
                        <div class="history-info">
                            <span class="processed-by">
                                <i class="fas fa-user-shield"></i>
                                Processed by: {{ request.processedBy || 'System' }}
                            </span>
                            <span class="processed-date">
                                <i class="far fa-calendar-check"></i>
                                {{ formatDate(request.processedAt) }}
                            </span>
                        </div>
                        <div class="history-actions">
                            <button class="btn-view" @click="viewApplication(request.id)">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button v-if="request.status === 'REJECTED'" 
                                    class="btn-reconsider"
                                    @click="reconsiderRequest(request.id)">
                                <i class="fas fa-redo"></i> Reconsider
                            </button>
                        </div>
                    </div>
                </div>
                
                <div v-if="filteredRequests.length === 0" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No worker requests found</h3>
                    <p>All requests have been processed or no requests match your filter.</p>
                </div>
            </div>
        </div>

        <!-- APPROVED WORKERS -->
        <div class="section-card approved-workers">
            <div class="card-header admin-card-header">
                <h2><i class="fas fa-user-check"></i> Recently Approved Workers</h2>
                <router-link to="/admin/users" class="btn-view-all">
                    View All Workers <i class="fas fa-arrow-right"></i>
                </router-link>
            </div>

            <div class="workers-grid">
                <div v-for="worker in recentApprovedWorkers" :key="worker.id" class="worker-card">
                    <div class="worker-avatar">
                        {{ worker.username.charAt(0).toUpperCase() }}
                    </div>
                    <div class="worker-info">
                        <h4>{{ worker.username }}</h4>
                        <p class="worker-email">{{ worker.email }}</p>
                        <div class="worker-stats">
                            <span class="stat">
                                <i class="fas fa-shopping-bag"></i>
                                {{ worker.ordersProcessed }} orders
                            </span>
                            <span class="stat">
                                <i class="fas fa-star"></i>
                                {{ worker.rating }} rating
                            </span>
                        </div>
                    </div>
                    <div class="worker-status active">
                        <i class="fas fa-circle"></i>
                        Active
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
import axios from 'axios'

// Data
const currentTime = ref('')
const statusFilter = ref('ALL')

// Worker Requests Data
const workerRequests = ref([
    { 
        id: 1, 
        username: 'Mike Wilson', 
        email: 'mike@example.com', 
        status: 'PENDING',
        createdAt: '2024-03-15T10:30:00',
        notes: 'Experienced chef with 5 years in restaurant management.',
        processedBy: null,
        processedAt: null
    },
    { 
        id: 2, 
        username: 'Sarah Brown', 
        email: 'sarah@example.com', 
        status: 'PENDING',
        createdAt: '2024-03-15T09:15:00',
        notes: 'Currently working part-time, looking for flexible hours.',
        processedBy: null,
        processedAt: null
    },
    { 
        id: 3, 
        username: 'Alex Johnson', 
        email: 'alex@example.com', 
        status: 'APPROVED',
        createdAt: '2024-03-14T14:20:00',
        notes: 'Previous experience in food delivery services.',
        processedBy: 'Admin User',
        processedAt: '2024-03-14T16:45:00'
    },
    // More requests...
])

const recentApprovedWorkers = ref([
    { id: 1, username: 'Alex Johnson', email: 'alex@example.com', ordersProcessed: 42, rating: 4.8 },
    { id: 2, username: 'Emma Davis', email: 'emma@example.com', ordersProcessed: 128, rating: 4.9 },
    { id: 3, username: 'Tom Wilson', email: 'tom@example.com', ordersProcessed: 87, rating: 4.7 },
])

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
    if (!confirm("Approve this worker request?")) return
    
    try {
        const token = localStorage.getItem("token")
        await axios.post(`http://localhost:8088/admin/worker-requests/${requestId}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        
        const request = workerRequests.value.find(r => r.id === requestId)
        if (request) {
            request.status = 'APPROVED'
            request.processedAt = new Date().toISOString()
            request.processedBy = 'You' // In real app, get from token
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

const viewApplication = (requestId) => {
    alert(`Viewing application #${requestId}`)
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
/* Worker Requests specific styles */
.request-stats {
    display: flex;
    gap: 16px;
}

.requests-list {
    padding: 20px;
    background: #FFFFFF;
}

.request-item {
    background: #FFFDF7;
    border: 1px solid #F0E6C8;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
}

.request-item:hover {
    background: #FFF8EC;
    border-color: #C7922B;
    box-shadow: 0 4px 16px rgba(199, 146, 43, 0.12);
}

.request-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.request-user {
    display: flex;
    align-items: center;
    gap: 16px;
}

.request-name {
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
    font-size: 18px;
}

.request-email {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 8px 0;
}

.request-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #9CA3AF;
}

.request-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
}

.request-status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.request-status.pending {
    background: rgba(245, 158, 11, 0.15);
    color: #F59E0B;
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.request-status.approved {
    background: rgba(46, 204, 113, 0.15);
    color: #2ECC71;
    border: 1px solid rgba(46, 204, 113, 0.3);
}

.request-status.rejected {
    background: rgba(220, 38, 38, 0.15);
    color: #DC2626;
    border: 1px solid rgba(220, 38, 38, 0.3);
}

.request-details, .request-history {
    border-top: 1px solid #F0E6C8;
    padding-top: 20px;
}

.request-notes h4 {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.request-notes p {
    color: #1f2937;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
}

.request-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.btn-approve, .btn-reject, .btn-view, .btn-reconsider {
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-approve {
    background: linear-gradient(135deg, #2ECC71 0%, #27ae60 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(46, 204, 113, 0.25);
}

.btn-approve:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(46, 204, 113, 0.35);
}

.btn-reject {
    background: #FFF8EC;
    color: #DC2626;
    border: 1px solid rgba(220, 38, 38, 0.3);
}

.btn-reject:hover {
    background: rgba(220, 38, 38, 0.1);
    transform: translateY(-2px);
}

.btn-view {
    background: #FFF8EC;
    color: #C7922B;
    border: 1px solid rgba(199, 146, 43, 0.3);
}

.btn-view:hover {
    background: rgba(199, 146, 43, 0.1);
    transform: translateY(-2px);
}

.btn-reconsider {
    background: #FFF8EC;
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-reconsider:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
}

.history-info {
    display: flex;
    gap: 24px;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 16px;
}

.history-info span {
    display: flex;
    align-items: center;
    gap: 6px;
}

.history-actions {
    display: flex;
    gap: 12px;
}

/* Approved Workers */
.workers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    padding: 20px;
    background: #FFFFFF;
}

.worker-card {
    background: #FFFDF7;
    border: 1px solid #F0E6C8;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
}

.worker-card:hover {
    background: #FFF8EC;
    border-color: #C7922B;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(199, 146, 43, 0.15);
}

.worker-avatar {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #C7922B 0%, #E3B45A 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: white;
    font-size: 20px;
}

.worker-info h4 {
    margin: 0 0 4px 0;
    color: #1f2937;
    font-size: 16px;
}

.worker-email {
    margin: 0 0 12px 0;
    color: #6b7280;
    font-size: 12px;
}

.worker-stats {
    display: flex;
    gap: 16px;
}

.worker-stats .stat {
    font-size: 12px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 4px;
}

.worker-status {
    margin-left: auto;
    padding: 6px 12px;
    background: rgba(46, 204, 113, 0.15);
    color: #2ECC71;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.worker-status i {
    font-size: 8px;
}

/* Responsive */
@media (max-width: 768px) {
    .request-actions {
        flex-direction: column;
    }
    
    .workers-grid {
        grid-template-columns: 1fr;
    }
    
    .request-info {
        flex-direction: column;
        gap: 16px;
    }
    
    .history-info {
        flex-direction: column;
        gap: 8px;
    }
}
</style>