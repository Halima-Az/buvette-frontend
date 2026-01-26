<template>
    <HeaderPageMenu title="My Orders" />
    <div class="content">
        <div class="orders-page">
            <!-- LISTE DES COMMANDES -->
            <aside class="orders-list">
                <h3>My orders</h3>

                <div v-for="o in displayedOrders" :key="o.id" class="order-item" :class="{ active: selectedOrder?.id === o.id }"
                    @click="selectOrder(o)">
                    <div class="order-code">#{{ o.orderCode }}</div>
                    <div class="order-status" :class="o.status.toLowerCase()">{{ getStatusLabel(o.status) }}</div>
                    <div class="order-date">{{ formatDate(o.createdAt) }}</div>
                </div>
                <button v-if="orders.length >= 3" class="see-more-btn" @click="showAll = !showAll">
                    {{ showAll ? 'See less' : 'See more' }}
                </button>
            </aside>

            <!-- DÉTAILS -->
            <section class="order-details" v-if="selectedOrder">
                <div class="order-header">
                    <h2>Order #{{ selectedOrder.orderCode }}</h2>
                    <span class="status-badge" :class="selectedOrder.status.toLowerCase()">{{ getStatusLabel(selectedOrder.status) }}</span>
                </div>

                <div class="order-meta">
                    <p><strong>Date :</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
                    <p><strong>Total :</strong> {{ selectedOrder.total }} DH</p>
                </div>

                <h3 >Items</h3>
                <div class="item" v-for="item in selectedOrder.items" :key="item.itemId">
                    <span>{{ item.itemName }}</span>
                    <span>x {{ item.quantity }}</span>
                </div>
            </section>

            <!-- ÉTAT VIDE -->
            <section class="order-details empty" v-else>
                <p>Select an order</p>
            </section>
        </div>
    </div>
    <FooterPageMenu />

</template>
<script setup>
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue'
import FooterPageMenu from '@/components/client/FooterPageMenu.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const orders = ref([])
const selectedOrder = ref(null)
const loading = ref(true)

const getToken = () => localStorage.getItem('token')

const fetchOrders = async () => {
    try {
        const res = await axios.get(
            'http://localhost:8088/client/orders',
            { headers: { Authorization: `Bearer ${getToken()}` } }
        )
        orders.value = res.data
    } finally {
        loading.value = false
    }
}

const selectOrder = async (order) => {
    const res = await axios.get(
        `http://localhost:8088/client/orders/${order.id}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
    )
    selectedOrder.value = res.data
}

const formatDate = (date) =>
    new Date(date).toLocaleDateString('fr-FR')

const getStatusLabel = (status) => ({
    pending: 'En attente',
    confirmed: 'Confirmée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
}[status] || status)

const showAll = ref(false)

const displayedOrders = computed(() =>
    showAll.value ? orders.value : orders.value.slice(0, 3)
)

onMounted(fetchOrders)
</script>
<style scoped>
.content {
    background: #f8fafc;
    min-height: 100vh;
}

/* ===== LAYOUT ===== */
.orders-page {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
    padding: 24px;
    max-width: 1200px;
    margin: auto;
}

/* ===== LISTE COMMANDES ===== */
.orders-list {
    background: #ffffff;
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.orders-list h3 {
    font-size: 18px;
    font-weight: 700;
    color: #37311f;
    margin-bottom: 16px;
}

.order-item {
    padding: 14px;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 10px;
    background: #f9fafb;
    transition: all .25s ease;
    border-left: 4px solid transparent;
}

.order-item:hover {
    background: #fffbee;
    transform: translateX(4px);
}

.order-item.active {
    background: #fffbee;
    border-left-color: #dfb838;
}

.order-code {
    font-weight: 600;
    color: #ce9e37;
}

/* ===== STATUS BADGES ===== */
.order-status,
.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    display: inline-block;
    min-width: 70px;
    color: white;
}

/* Couleurs selon le statut */
.order-status.pending,
.status-badge.pending {
    background-color: #facc15; /* jaune / attention */
    color: #78350f;
}

.order-status.confirmed,
.status-badge.confirmed {
    background-color: #3b82f6; /* bleu */
}

.order-status.delivered,
.status-badge.delivered {
    background-color: #10b981; /* vert */
}
.order-status.ready,
.status-badge.ready {
    background-color: #0fb13f; /* vert */
}
.order-status.cancelled,
.status-badge.cancelled {
    background-color: #ef4444; /* rouge */
}

/* Optionnel : légère ombre et transition */
.order-status,
.status-badge {
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.order-status:hover,
.status-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}



.order-date {
    font-size: 12px;
    color: #6b7280;
}

/* ===== SEE MORE ===== */
.see-more-btn {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border: none;
    background: #f0b73e;
    color: white;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: background .2s;
}

.see-more-btn:hover {
    background: #d8971d;
}

/* ===== DETAILS ===== */
.order-details {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    height: fit-content;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.order-header h2 {
    font-size: 20px;
    color: #1f2937;
}

.status-badge {
    padding: 6px 14px;
    border-radius: 20px;
    background: #ebbd25;
    color: white;
    font-size: 12px;
    font-weight: 700;
}

/* ===== META ===== */
.order-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    color: #374151;
}

/* ===== ITEMS ===== */
.item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-radius: 8px;
    background: #f9fafb;
    margin-bottom: 10px;
    font-weight: 500;
}

/* ===== EMPTY ===== */
.order-details.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 16px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .orders-page {
        grid-template-columns: 1fr;
    }
}
</style>