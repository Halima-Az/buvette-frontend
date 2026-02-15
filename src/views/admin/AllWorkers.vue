<template>
    <div class="section-card approved-workers">
        <div class="card-header admin-card-header">
            <div class="header-content">
                <h2>
                    <span class="header-icon success">
                        <i class="fas fa-user-check"></i>
                    </span>
                    Recently Approved Workers
                </h2>
                <p class="header-subtitle">{{ filteredWorkers.length }} active team members</p>
            </div>
            
            <!-- Filters and Search -->
            <div class="header-actions">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Search workers..."
                        class="search-input"
                    />
                </div>
                <select v-model="sortBy" class="sort-select">
                    <option value="name">Sort by Name</option>
                    <option value="orders">Sort by Orders</option>
                    <option value="delivered">Sort by Delivered</option>
                    <option value="date">Sort by Date</option>
                </select>
            </div>
        </div>

        <div class="workers-grid">
            <div v-for="worker in paginatedWorkers" :key="worker.id" class="worker-card">
                <div class="worker-header">
                    <div class="worker-avatar-wrapper">
                        <div class="worker-avatar">
                            {{ worker.firstName?.charAt(0).toUpperCase() || 'W' }}
                        </div>
                        <div class="avatar-status" :class="{ inactive: worker.isDeactivated }"></div>
                    </div>
                    <div class="worker-info">
                        <h4>{{ worker.firstName }} {{ worker.lastName }}</h4>
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
                            <span class="stat-number">{{ allOrders}}</span>
                            <span class="stat-text">Orders</span>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <span class="stat-number">{{ delevredOrders }}</span>
                            <span class="stat-text">Delivered</span>
                        </div>
                    </div>
                </div>
                
                <div class="worker-actions">
                    <button 
                        class="btn-worker btn-deactivate" 
                        @click="toggleWorkerStatus(worker)"
                        :class="{ active: !worker.isDeactivated }"
                    >
                        <i :class="worker.isDeactivated ? 'fas fa-user-check' : 'fas fa-user-slash'"></i>
                        <span>{{ worker.isDeactivated ? 'Activate' : 'Deactivate' }}</span>
                    </button>
                   
                </div>
                
                <div class="worker-status" :class="{ inactive: worker.isDeactivated }">
                    <span class="status-indicator"></span>
                    <span>{{ worker.isDeactivated ? 'Inactive' : 'Active Now' }}</span>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredWorkers.length === 0" class="empty-workers-state">
            <div class="empty-illustration">
                <div class="empty-icon">
                    <i class="fas fa-user-slash"></i>
                </div>
            </div>
            <h3>No workers found</h3>
            <p>Try adjusting your search or filters</p>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" v-if="filteredWorkers.length > workersPerPage">
            <button 
                class="pagination-btn" 
                @click="currentPage--"
                :disabled="currentPage === 1"
            >
                <i class="fas fa-chevron-left"></i>
                Previous
            </button>
            
            <div class="pagination-pages">
                <button 
                    v-for="page in totalPages" 
                    :key="page"
                    class="pagination-page"
                    :class="{ active: page === currentPage }"
                    @click="currentPage = page"
                >
                    {{ page }}
                </button>
            </div>
            
            <button 
                class="pagination-btn" 
                @click="currentPage++"
                :disabled="currentPage === totalPages"
            >
                Next
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Data
const recentApprovedWorkers = ref([])
const allOrders = ref([])
const searchQuery = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const workersPerPage = ref(3)
const delevredOrders=ref(0)

// Fetch Data
onMounted(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
        // Fetch workers
        const res = await axios.get("http://localhost:8088/admin/requests", {
            headers: { Authorization: `Bearer ${token}` },
        });
        recentApprovedWorkers.value = res.data
            .filter(worker => worker.status === "APPROVED")
            .map(worker => ({ ...worker, isDeactivated: false }))
        
        // Fetch orders
        const resOrder = await axios.get("http://localhost:8088/admin/orders", {
            headers: { Authorization: `Bearer ${token}` },
        });
        allOrders.value = resOrder.data.length
        delevredOrders.value=resOrder.data.filter(o=>o.status==="DELIVERED").length
    } catch (err) {
        console.error("Error fetching data:", err)
    }
})

// Computed
const filteredWorkers = computed(() => {
    let filtered = recentApprovedWorkers.value
    
    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(worker => 
            worker.firstName?.toLowerCase().includes(query) ||
            worker.lastName?.toLowerCase().includes(query) ||
            worker.email?.toLowerCase().includes(query)
        )
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
        switch (sortBy.value) {
            case 'name':
                return (a.firstName || '').localeCompare(b.firstName || '')
            case 'orders':
                return getWorkerOrders(b.id) - getWorkerOrders(a.id)
            case 'delivered':
                return getWorkerDelivered(b.id) - getWorkerDelivered(a.id)
            case 'date':
                return new Date(b.createdAt) - new Date(a.createdAt)
            default:
                return 0
        }
    })
    
    return filtered
})

const totalPages = computed(() => 
    Math.ceil(filteredWorkers.value.length / workersPerPage.value)
)

const paginatedWorkers = computed(() => {
    const start = (currentPage.value - 1) * workersPerPage.value
    const end = start + workersPerPage.value
    return filteredWorkers.value.slice(start, end)
})


const toggleWorkerStatus = async (worker) => {
    if (!confirm(`Are you sure you want to ${worker.isDeactivated ? 'activate' : 'deactivate'} this worker?`)) {
        return
    }
    
    try {
        const token = localStorage.getItem("token")
        const endpoint = worker.isDeactivated ? 'activate' : 'deactivate'
        
        await axios.put(
            `http://localhost:8088/admin/workers/${worker.email}/${endpoint}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        worker.isDeactivated = !worker.isDeactivated
    } catch (err) {
        console.error("Error toggling worker status:", err)
        alert("Failed to update worker status")
    }
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
   CARD HEADER
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
}

.admin-card-header {
    padding: 28px 32px;
    border-bottom: 2px solid rgba(170, 122, 17, 0.08);
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
   HEADER ACTIONS (NEW)
========================= */
.header-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
}

.search-box {
    position: relative;
    flex: 1;
    min-width: 250px;
}

.search-box i {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary);
    font-size: 14px;
}

.search-input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 2px solid rgba(170, 122, 17, 0.15);
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    background: var(--bg-card);
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(170, 122, 17, 0.1);
}

.search-input::placeholder {
    color: var(--text-muted);
    font-weight: 500;
}

.sort-select {
    padding: 12px 40px 12px 16px;
    border: 2px solid rgba(170, 122, 17, 0.15);
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    background: var(--bg-card);
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath fill='%23aa7a11' d='M7 10L2 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
}

.sort-select:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(170, 122, 17, 0.15);
}

.sort-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(170, 122, 17, 0.1);
}

/* =========================
   WORKERS GRID
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

/* =========================
   WORKER HEADER
========================= */
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

.avatar-status.inactive {
    background: var(--text-muted);
    box-shadow: 0 2px 8px rgba(107, 114, 128, 0.4);
    animation: none;
}

@keyframes statusPulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.6;
        transform: scale(1.2);
    }
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

/* =========================
   WORKER STATS
========================= */
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
    transition: all 0.3s ease;
}

.stat-box:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 16px rgba(170, 122, 17, 0.1);
    transform: translateY(-2px);
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

/* =========================
   WORKER ACTIONS (NEW)
========================= */
.worker-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
}

.btn-worker {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.btn-deactivate {
    background: var(--bg-card);
    color: var(--danger);
    border: 2px solid rgba(239, 68, 68, 0.3);
}

.btn-deactivate.active:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
    border-color: var(--danger);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2);
}

.btn-deactivate:not(.active) {
    color: var(--success);
    border-color: rgba(16, 185, 129, 0.3);
}

.btn-deactivate:not(.active):hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
    border-color: var(--success);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.2);
}

.btn-view {
    background: var(--bg-card);
    color: var(--primary);
    border: 2px solid rgba(170, 122, 17, 0.3);
}

.btn-view:hover {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.1), rgba(212, 165, 23, 0.05));
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(170, 122, 17, 0.2);
}

/* =========================
   WORKER STATUS
========================= */
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

.worker-status.inactive {
    background: linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(107, 114, 128, 0.05));
    color: var(--text-muted);
    border-color: rgba(107, 114, 128, 0.2);
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--success);
    animation: statusPulse 2s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.worker-status.inactive .status-indicator {
    background: var(--text-muted);
    box-shadow: none;
    animation: none;
}

/* =========================
   EMPTY STATE
========================= */
.empty-workers-state {
    text-align: center;
    padding: 80px 20px;
}

.empty-illustration {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto 24px;
}

.empty-icon {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.1), rgba(212, 165, 23, 0.05));
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(170, 122, 17, 0.15);
}

.empty-icon i {
    font-size: 40px;
    color: var(--primary);
    opacity: 0.6;
}

.empty-workers-state h3 {
    font-size: 20px;
    color: var(--text-main);
    margin-bottom: 8px;
    font-weight: 800;
}

.empty-workers-state p {
    font-size: 14px;
    color: var(--text-muted);
}

/* =========================
   PAGINATION (NEW)
========================= */
.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 28px 32px;
    border-top: 2px solid rgba(170, 122, 17, 0.08);
    background: linear-gradient(135deg, rgba(253, 250, 242, 0.5), rgba(255, 255, 255, 0.3));
}

.pagination-btn {
    padding: 10px 18px;
    background: var(--bg-card);
    border: 2px solid rgba(170, 122, 17, 0.2);
    border-radius: 12px;
    font-weight: 700;
    font-size: 13px;
    color: var(--primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.pagination-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.1), rgba(212, 165, 23, 0.05));
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(170, 122, 17, 0.15);
}

.pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination-pages {
    display: flex;
    gap: 8px;
}

.pagination-page {
    width: 40px;
    height: 40px;
    background: var(--bg-card);
    border: 2px solid rgba(170, 122, 17, 0.15);
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination-page:hover {
    border-color: var(--primary);
    background: rgba(170, 122, 17, 0.05);
    transform: translateY(-2px);
}

.pagination-page.active {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 16px rgba(170, 122, 17, 0.3);
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 1200px) {
    .workers-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}

@media (max-width: 768px) {
    .header-actions {
        flex-direction: column;
    }

    .search-box {
        width: 100%;
    }

    .sort-select {
        width: 100%;
    }

    .workers-grid {
        grid-template-columns: 1fr;
        padding: 20px;
    }

    .worker-actions {
        flex-direction: column;
    }

    .btn-worker {
        width: 100%;
    }

    .pagination-container {
        flex-direction: column;
        gap: 12px;
    }

    .pagination-btn {
        width: 100%;
        justify-content: center;
    }

    .pagination-pages {
        flex-wrap: wrap;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .admin-card-header {
        padding: 20px;
    }

    .workers-grid {
        padding: 16px;
    }

    .worker-card {
        padding: 20px;
    }

    .worker-avatar {
        width: 52px;
        height: 52px;
        font-size: 20px;
    }

    .worker-info h4 {
        font-size: 16px;
    }

    .pagination-page {
        width: 36px;
        height: 36px;
        font-size: 13px;
    }
}
</style>