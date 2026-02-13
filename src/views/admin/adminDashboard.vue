<template>
    <HeaderPageMenu title="" />

    <div class="dashboard admin-dashboard">
        <!-- HEADER -->
        <div class="dashboard-header admin-header">
            <div class="header-left">
                <div class="icon-badge admin-icon">
                    👑
                </div>
                <div>
                    <h1>Admin Dashboard</h1>
                    <p class="subtitle">System Overview & Statistics</p>
                </div>
            </div>

            <div class="header-right">
                <div class="admin-stats">
                    <div class="stat-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <span class="stat-value">{{ totalUsers }}</span>
                            <span class="stat-label">Total Users</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <span class="stat-value">{{ activeWorkers }}</span>
                            <span class="stat-label">Active Workers</span>
                        </div>
                    </div>
                </div>
                <div class="time-display">
                    <i class="far fa-clock"></i>
                    {{ currentTime }}
                </div>
            </div>
        </div>

        <!-- STATISTICS GRID -->
        <div class="stats-grid">
            <div class="stat-card revenue">
                <div class="stat-icon">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="stat-content">
                    <h3>Total Revenue</h3>
                    <div class="stat-value">${{ totalRevenue.toLocaleString() }}</div>
                    <div class="stat-trend positive">
                        <i class="fas fa-arrow-up"></i>
                        12.5% this month
                    </div>
                </div>
            </div>

            <div class="stat-card visitors">
                <div class="stat-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-content">
                    <h3>Website Visitors</h3>
                    <div class="stat-value">{{ websiteVisitors.toLocaleString() }}</div>
                    <div class="stat-trend positive">
                        <i class="fas fa-arrow-up"></i>
                        8.3% increase
                    </div>
                </div>
            </div>

            <div class="stat-card orders">
                <div class="stat-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-content">
                    <h3>24h Orders</h3>
                    <div class="stat-value">{{ orders24h }}</div>
                    <div class="stat-trend neutral">
                        <i class="fas fa-minus"></i>
                        Similar to yesterday
                    </div>
                </div>
            </div>

        </div>

        <!-- CONTENT GRID -->
        <div class="dashboard-content admin-content">
            <!-- LEFT COLUMN - QUICK ACTIONS -->
            <div class="main-section">
                <!-- QUICK ACTIONS -->
                <div class="section-card quick-actions">
                    <div class="card-header admin-card-header">
                        <h2><i class="fas fa-bolt"></i> Quick Actions</h2>
                    </div>

                    <div class="actions-grid">
                        <router-link to="/admin/usersGestion" class="action-btn">
                            <div class="action-icon">
                                <i class="fas fa-users-cog"></i>
                            </div>
                            <span>Manage Users</span>
                        </router-link>
                        
                        <router-link to="/admin/workerRequests" class="action-btn">
                            <div class="action-icon">
                                <i class="fas fa-user-clock"></i>
                            </div>
                            <span>Worker Requests</span>
                        </router-link>
                        
                        <router-link to="/admin/analytics" class="action-btn">
                            <div class="action-icon">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <span>Analytics</span>
                        </router-link>
                        
                        <button class="action-btn" @click="exportData">
                            <div class="action-icon">
                                <i class="fas fa-download"></i>
                            </div>
                            <span>Export Data</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </div>
    <AdminFooter />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue'
import AdminFooter from '@/components/admin/adminFooter.vue'

const currentTime = ref('')
const totalRevenue = ref(45280.50)
const websiteVisitors = ref(12845)
const orders24h = ref(342)
const totalUsers = ref(256)
const activeWorkers = ref(18)

const exportData = () => {
    alert("Exporting data...")
}

const openBackup = () => {
    alert("Opening backup settings...")
}

const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })
}

let timer

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 60000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>


<style scoped>
.admin-dashboard {
    background: linear-gradient(135deg, #FFF9EC 0%, #FFF3DA 100%);
    padding: 40px;
    min-height: 100vh;
}

/* HEADER */
.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.admin-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, #C7922B, #E8B84B);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    box-shadow: 0 10px 25px rgba(199, 146, 43, 0.25);
}

.admin-header h1 {
    font-size: 28px;
    margin: 0;
    font-weight: 800;
}

.subtitle {
    font-size: 14px;
    color: #6b7280;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 30px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-value {
    font-weight: 800;
    font-size: 18px;
}

.stat-label {
    font-size: 12px;
    color: #6b7280;
}

.time-display {
    background: white;
    padding: 10px 18px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

/* STAT GRID */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    border-radius: 24px;
    padding: 28px;
    display: flex;
    gap: 18px;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 12px 30px rgba(0,0,0,0.05);
}

.stat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 35px rgba(0,0,0,0.08);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.revenue .stat-icon {
    background: rgba(46, 204, 113, 0.15);
    color: #2ECC71;
}

.visitors .stat-icon {
    background: rgba(199, 146, 43, 0.15);
    color: #C7922B;
}

.orders .stat-icon {
    background: rgba(245, 158, 11, 0.15);
    color: #F59E0B;
}

.stat-content h3 {
    margin: 0 0 6px 0;
    font-size: 13px;
    color: #6b7280;
}

.stat-card .stat-value {
    font-size: 26px;
}

.stat-trend {
    font-size: 12px;
    font-weight: 600;
}

.stat-trend.positive {
    color: #2ECC71;
}

.stat-trend.neutral {
    color: #6b7280;
}

/* QUICK ACTIONS */
.section-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.05);
}

.admin-card-header {
    padding: 24px;
    border-bottom: 1px solid #F3E8C8;
}

.admin-card-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
    padding: 28px;
}

.action-btn {
    background: #FFFCF4;
    border-radius: 18px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    text-decoration: none;
    color: #1f2937;
    transition: all 0.3s ease;
    border: 1px solid #F4E6C2;
}

.action-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(199, 146, 43, 0.15);
    border-color: #C7922B;
}

.action-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: linear-gradient(135deg, #F8E5B5, #F3D38B);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #9C6B00;
}

.action-btn span {
    font-weight: 600;
    font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .admin-dashboard {
        padding: 20px;
    }

    .admin-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .header-right {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
}
</style>
