<template>
    <HeaderPageMenu title="" />

    <div class="dashboard admin-dashboard">
        <div class="dashboard-header admin-header">
            <div class="header-left">
                <div class="icon-badge admin-icon">
                    <i class="fas fa-chart-bar"></i>
                </div>
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p class="subtitle">Comprehensive business insights and metrics</p>
                </div>
            </div>

            <div class="header-right">
                <div class="date-range">
                    <button class="date-btn" @click="setDateRange('today')" :class="{ active: dateRange === 'today' }">
                        Today
                    </button>
                    <button class="date-btn" @click="setDateRange('week')" :class="{ active: dateRange === 'week' }">
                        This Week
                    </button>
                    <button class="date-btn" @click="setDateRange('month')" :class="{ active: dateRange === 'month' }">
                        This Month
                    </button>
                    <button class="date-btn" @click="setDateRange('year')" :class="{ active: dateRange === 'year' }">
                        This Year
                    </button>
                </div>
                <div class="time-display">
                    <i class="far fa-clock"></i>
                    {{ currentTime }}
                </div>
            </div>
        </div>

        <!-- KEY METRICS -->
        <div class="analytics-metrics">
            <div class="metric-card">
                <div class="metric-header">
                    <h3><i class="fas fa-money-bill-wave"></i> Revenue</h3>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 12.5%
                    </div>
                </div>
                <div class="metric-value">${{ formatNumber(revenue) }}</div>
                <div class="metric-trend">
                    <div class="trend-chart">
                        <div v-for="(value, index) in revenueTrend" :key="index" 
                             class="trend-bar" 
                             :style="{ height: `${value}%` }">
                        </div>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <h3><i class="fas fa-users"></i> New Users</h3>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 8.3%
                    </div>
                </div>
                <div class="metric-value">{{ formatNumber(newUsers) }}</div>
                <div class="metric-trend">
                    <div class="trend-chart line">
                        <svg width="100%" height="50" viewBox="0 0 200 50">
                            <path :d="generateLineChart(newUsersTrend)" 
                                  fill="none" 
                                  stroke="#C7922B" 
                                  stroke-width="2" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <h3><i class="fas fa-shopping-bag"></i> Orders</h3>
                    <div class="metric-change neutral">
                        <i class="fas fa-minus"></i> 0.5%
                    </div>
                </div>
                <div class="metric-value">{{ formatNumber(totalOrders) }}</div>
                <div class="metric-trend">
                    <div class="trend-chart">
                        <div v-for="(value, index) in ordersTrend" :key="index" 
                             class="trend-dot" 
                             :style="{ left: `${index * 20}%`, bottom: `${value}%` }">
                        </div>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <h3><i class="fas fa-percentage"></i> Conversion</h3>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 2.1%
                    </div>
                </div>
                <div class="metric-value">{{ conversionRate }}%</div>
                <div class="circular-progress" :style="conversionCircleStyle">
                    <span>{{ conversionRate }}%</span>
                </div>
            </div>
        </div>

        <!-- CHARTS GRID -->
        <div class="charts-grid">
            <!-- REVENUE CHART -->
            <div class="chart-card">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-line"></i> Revenue Trend</h3>
                    <div class="chart-period">Last 7 Days</div>
                </div>
                <div class="chart-container">
                    <canvas ref="revenueChart"></canvas>
                </div>
            </div>

            <!-- USER GROWTH CHART -->
            <div class="chart-card">
                <div class="chart-header">
                    <h3><i class="fas fa-user-plus"></i> User Growth</h3>
                    <div class="chart-period">Last 30 Days</div>
                </div>
                <div class="chart-container">
                    <canvas ref="userGrowthChart"></canvas>
                </div>
            </div>

            <!-- ORDER DISTRIBUTION -->
            <div class="chart-card">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-pie"></i> Order Distribution</h3>
                    <div class="chart-period">By Status</div>
                </div>
                <div class="chart-container">
                    <canvas ref="orderDistributionChart"></canvas>
                </div>
            </div>

            <!-- TOP PRODUCTS -->
            <div class="chart-card">
                <div class="chart-header">
                    <h3><i class="fas fa-star"></i> Top Products</h3>
                    <div class="chart-period">By Sales</div>
                </div>
                <div class="top-products-list">
                    <div v-for="(product, index) in topProducts" :key="product.id" class="product-item">
                        <div class="product-rank">{{ index + 1 }}</div>
                        <div class="product-info">
                            <div class="product-name">{{ product.name }}</div>
                            <div class="product-sales">{{ product.sales }} sold</div>
                        </div>
                        <div class="product-revenue">${{ product.revenue }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- DETAILED STATISTICS -->
        <div class="detailed-stats">
            <!-- HOURLY ACTIVITY -->
            <div class="stats-card">
                <div class="stats-header">
                    <h3><i class="fas fa-clock"></i> Hourly Activity</h3>
                    <div class="stats-subtitle">Peak Order Times</div>
                </div>
                <div class="hourly-chart">
                    <div v-for="hour in hourlyActivity" :key="hour.time" class="hour-bar">
                        <div class="bar-label">{{ hour.time }}</div>
                        <div class="bar-container">
                            <div class="bar-fill" :style="{ height: `${hour.orders * 2}px` }"></div>
                        </div>
                        <div class="bar-value">{{ hour.orders }}</div>
                    </div>
                </div>
            </div>

            <!-- USER DEMOGRAPHICS -->
            <div class="stats-card">
                <div class="stats-header">
                    <h3><i class="fas fa-user-friends"></i> User Demographics</h3>
                    <div class="stats-subtitle">Active Users Breakdown</div>
                </div>
                <div class="demographics-grid">
                    <div class="demo-item">
                        <div class="demo-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="demo-content">
                            <div class="demo-value">{{ demographics.workers }}</div>
                            <div class="demo-label">Active Workers</div>
                        </div>
                    </div>
                    <div class="demo-item">
                        <div class="demo-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="demo-content">
                            <div class="demo-value">{{ demographics.clients }}</div>
                            <div class="demo-label">Active Clients</div>
                        </div>
                    </div>
                    <div class="demo-item">
                        <div class="demo-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="demo-content">
                            <div class="demo-value">{{ demographics.mobile }}%</div>
                            <div class="demo-label">Mobile Users</div>
                        </div>
                    </div>
                    <div class="demo-item">
                        <div class="demo-icon">
                            <i class="fas fa-desktop"></i>
                        </div>
                        <div class="demo-content">
                            <div class="demo-value">{{ demographics.desktop }}%</div>
                            <div class="demo-label">Desktop Users</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PERFORMANCE METRICS -->
            <div class="stats-card">
                <div class="stats-header">
                    <h3><i class="fas fa-tachometer-alt"></i> Performance Metrics</h3>
                    <div class="stats-subtitle">System & Service Performance</div>
                </div>
                <div class="performance-metrics">
                    <div class="perf-item">
                        <div class="perf-label">Avg. Order Time</div>
                        <div class="perf-value">{{ performance.avgOrderTime }} min</div>
                        <div class="perf-progress">
                            <div class="progress-bar" :style="{ width: '85%' }"></div>
                        </div>
                    </div>
                    <div class="perf-item">
                        <div class="perf-label">Customer Satisfaction</div>
                        <div class="perf-value">{{ performance.satisfaction }}%</div>
                        <div class="perf-progress">
                            <div class="progress-bar" :style="{ width: '92%' }"></div>
                        </div>
                    </div>
                    <div class="perf-item">
                        <div class="perf-label">Order Accuracy</div>
                        <div class="perf-value">{{ performance.accuracy }}%</div>
                        <div class="perf-progress">
                            <div class="progress-bar" :style="{ width: '98%' }"></div>
                        </div>
                    </div>
                    <div class="perf-item">
                        <div class="perf-label">System Uptime</div>
                        <div class="perf-value">{{ performance.uptime }}%</div>
                        <div class="perf-progress">
                            <div class="progress-bar" :style="{ width: '99.8%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <AdminFooter />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue'
import AdminFooter from '@/components/admin/adminFooter.vue'

// Data
const currentTime = ref('')
const dateRange = ref('month')

// Metrics
const revenue = ref(45280.50)
const newUsers = ref(12845)
const totalOrders = ref(3421)
const conversionRate = ref(4.8)

const revenueTrend = ref([40, 60, 75, 65, 85, 95, 100])
const newUsersTrend = ref([30, 45, 60, 50, 70, 80, 90])
const ordersTrend = ref([45, 60, 70, 55, 75, 85, 95])

const topProducts = ref([
    { id: 1, name: 'Classic Burger', sales: 542, revenue: 3252 },
    { id: 2, name: 'French Fries', sales: 487, revenue: 1948 },
    { id: 3, name: 'Coca Cola', sales: 421, revenue: 1684 },
    { id: 4, name: 'Chicken Wings', sales: 389, revenue: 2334 },
    { id: 5, name: 'Caesar Salad', sales: 321, revenue: 1605 },
])

const hourlyActivity = ref([
    { time: '8 AM', orders: 12 },
    { time: '10 AM', orders: 25 },
    { time: '12 PM', orders: 48 },
    { time: '2 PM', orders: 32 },
    { time: '4 PM', orders: 41 },
    { time: '6 PM', orders: 56 },
    { time: '8 PM', orders: 38 },
    { time: '10 PM', orders: 18 },
])

const demographics = ref({
    workers: 42,
    clients: 892,
    mobile: 68,
    desktop: 32
})

const performance = ref({
    avgOrderTime: 18,
    satisfaction: 92,
    accuracy: 98,
    uptime: 99.8
})

// Chart refs
const revenueChart = ref(null)
const userGrowthChart = ref(null)
const orderDistributionChart = ref(null)

// Computed
const conversionCircleStyle = computed(() => {
    const circumference = 2 * Math.PI * 40
    const offset = circumference - (conversionRate.value / 100) * circumference
    return {
        '--circle-dasharray': circumference,
        '--circle-dashoffset': offset,
    }
})

// Methods
const formatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
    }
    return num.toLocaleString()
}

const generateLineChart = (data) => {
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 200
        const y = 50 - (value / 100) * 50
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    return points.join(' ')
}

const setDateRange = (range) => {
    dateRange.value = range
    // In a real app, this would trigger data refresh
}

// Initialize charts
const initCharts = () => {
    // Revenue Chart
    if (revenueChart.value) {
        new Chart(revenueChart.value, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 1500, 2100, 1800, 2500, 2200],
                    borderColor: '#C7922B',
                    backgroundColor: 'rgba(199, 146, 43, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#F0E6C8' }
                    },
                    x: {
                        grid: { color: '#F0E6C8' }
                    }
                }
            }
        })
    }

    // User Growth Chart
    if (userGrowthChart.value) {
        new Chart(userGrowthChart.value, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'New Users',
                    data: [45, 52, 60, 71],
                    backgroundColor: 'rgba(46, 204, 113, 0.6)',
                    borderColor: '#2ECC71',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#F0E6C8' }
                    },
                    x: {
                        grid: { color: '#F0E6C8' }
                    }
                }
            }
        })
    }

    // Order Distribution Chart
    if (orderDistributionChart.value) {
        new Chart(orderDistributionChart.value, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Preparing', 'Pending', 'Cancelled'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: [
                        '#2ECC71',
                        '#C7922B',
                        '#F59E0B',
                        '#DC2626'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        })
    }
}

// Lifecycle
onMounted(() => {
    updateTime()
    const timer = setInterval(updateTime, 60000)
    
    // Initialize charts after DOM is ready
    setTimeout(initCharts, 100)
    
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
/* Analytics specific styles */
.date-range {
    display: flex;
    gap: 8px;
    background: #FFF8EC;
    padding: 6px;
    border-radius: 12px;
    border: 1px solid #F0E6C8;
}

.date-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s ease;
}

.date-btn:hover {
    background: #F0E6C8;
    color: #1f2937;
}

.date-btn.active {
    background: #C7922B;
    color: white;
}

/* Analytics Metrics */
.analytics-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 32px 0;
}

.metric-card {
    background: #FFFFFF;
    border: 1px solid #F0E6C8;
    border-radius: 20px;
    padding: 24px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.metric-card:hover {
    transform: translateY(-4px);
    border-color: #C7922B;
    box-shadow: 0 12px 32px rgba(199, 146, 43, 0.15);
}

.metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.metric-header h3 {
    margin: 0;
    font-size: 16px;
    color: #6b7280;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.metric-change {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
}

.metric-change.positive {
    background: rgba(46, 204, 113, 0.15);
    color: #2ECC71;
}

.metric-change.neutral {
    background: rgba(245, 158, 11, 0.15);
    color: #F59E0B;
}

.metric-change.negative {
    background: rgba(220, 38, 38, 0.15);
    color: #DC2626;
}

.metric-value {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 20px;
}

.trend-chart {
    height: 40px;
    display: flex;
    align-items: flex-end;
    gap: 4px;
}

.trend-bar {
    flex: 1;
    background: linear-gradient(to top, #C7922B, #E3B45A);
    border-radius: 2px;
    min-height: 4px;
}

.trend-chart.line {
    background: transparent;
}

.trend-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #C7922B;
    border-radius: 50%;
    transform: translateX(-50%);
}

.circular-progress {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: conic-gradient(#C7922B calc(var(--circle-dashoffset) * 1deg), #F0E6C8 0deg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 0 auto;
}

.circular-progress::before {
    content: '';
    position: absolute;
    width: 64px;
    height: 64px;
    background: white;
    border-radius: 50%;
}

.circular-progress span {
    position: relative;
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    z-index: 1;
}

/* Charts Grid */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.chart-card {
    background: #FFFFFF;
    border: 1px solid #F0E6C8;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.chart-header h3 {
    margin: 0;
    font-size: 18px;
    color: #1f2937;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
}

.chart-period {
    font-size: 12px;
    color: #6b7280;
    background: #FFF8EC;
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid #F0E6C8;
}

.chart-container {
    height: 250px;
    position: relative;
}

.top-products-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #FFFDF7;
    border-radius: 12px;
    border: 1px solid #F0E6C8;
    transition: all 0.3s ease;
}

.product-item:hover {
    background: #FFF8EC;
    border-color: #C7922B;
}

.product-rank {
    width: 32px;
    height: 32px;
    background: #C7922B;
    color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 14px;
}

.product-info {
    flex: 1;
}

.product-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
}

.product-sales {
    font-size: 12px;
    color: #6b7280;
}

.product-revenue {
    font-weight: 700;
    color: #2ECC71;
}

/* Detailed Statistics */
.detailed-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.stats-card {
    background: #FFFFFF;
    border: 1px solid #F0E6C8;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.stats-header {
    margin-bottom: 24px;
}

.stats-header h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #1f2937;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
}

.stats-subtitle {
    font-size: 14px;
    color: #6b7280;
}

/* Hourly Activity */
.hourly-chart {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 200px;
    padding: 20px 0;
}

.hour-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.bar-label {
    font-size: 12px;
    color: #6b7280;
}

.bar-container {
    flex: 1;
    width: 12px;
    display: flex;
    align-items: flex-end;
}

.bar-fill {
    width: 100%;
    background: linear-gradient(to top, #C7922B, #E3B45A);
    border-radius: 6px;
    transition: height 0.3s ease;
}

.bar-value {
    font-size: 12px;
    font-weight: 600;
    color: #1f2937;
}

/* Demographics Grid */
.demographics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.demo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #FFFDF7;
    border-radius: 12px;
    border: 1px solid #F0E6C8;
    transition: all 0.3s ease;
}

.demo-item:hover {
    background: #FFF8EC;
    border-color: #C7922B;
}

.demo-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(199, 146, 43, 0.15) 0%, rgba(199, 146, 43, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #C7922B;
}

.demo-content {
    flex: 1;
}

.demo-value {
    font-size: 20px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 4px;
}

.demo-label {
    font-size: 12px;
    color: #6b7280;
}

/* Performance Metrics */
.performance-metrics {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.perf-item {
    display: flex;
    align-items: center;
    gap: 16px;
}

.perf-label {
    flex: 1;
    font-size: 14px;
    color: #6b7280;
    font-weight: 600;
}

.perf-value {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    min-width: 60px;
}

.perf-progress {
    flex: 2;
    height: 6px;
    background: #F0E6C8;
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #2ECC71, #C7922B);
    border-radius: 3px;
}

/* Responsive */
@media (max-width: 1200px) {
    .analytics-metrics {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .charts-grid {
        grid-template-columns: 1fr;
    }
    
    .detailed-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .analytics-metrics {
        grid-template-columns: 1fr;
    }
    
    .detailed-stats {
        grid-template-columns: 1fr;
    }
    
    .date-range {
        flex-wrap: wrap;
    }
    
    .demographics-grid {
        grid-template-columns: 1fr;
    }
}
</style>