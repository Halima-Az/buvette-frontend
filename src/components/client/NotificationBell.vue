<template>
  <div class="notif-wrapper">
    <button class="card-btn" @click.stop="toggle">
      <i class="fa-solid fa-bell"></i>
    </button>

    <span v-if="unreadCount > 0" class="badge">
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </span>

    <div v-if="open" class="notif-panel" v-click-outside="closePanel">
      <div class="panel-header">
        <p class="title">Notifications</p>
        <div class="panel-actions">
          <button v-if="unreadCount > 0" @click="markAllAsRead" class="mark-all-btn">
            Mark all read
          </button>
          <button @click="refreshNotifications" class="refresh-btn" :class="{ refreshing: loading }">
            <i class="fa-solid fa-rotate"></i>
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fa-solid fa-spinner fa-spin"></i> Loading...
      </div>

      <div v-else-if="notifications.length === 0" class="empty">
        <i class="fa-regular fa-bell"></i>
        <p>No notifications</p>
      </div>

      <div v-else class="notif-container">
        <ul class="notif-list">
          <li v-for="notification in notifications" 
              :key="notification.id"
              :class="['notif-item', { unread: !notification.read }]"
              @click="markAsRead(notification.id)">
            
            <div class="notif-icon" :class="getNotificationClass(notification.type)">
              <i :class="getNotificationIcon(notification.type)"></i>
            </div>
            
            <div class="notif-content">
              <div class="notif-title">{{ notification.title }}</div>
              <div class="notif-message">{{ notification.message }}</div>
              <div class="notif-time">{{ formatTime(notification.createdAt) }}</div>
            </div>
            
            <div v-if="!notification.read" class="unread-dot"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import axios from 'axios'

const open = ref(false)
const notifications = ref([])
const loading = ref(false)
const pollInterval = ref(null)

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Fetch notifications
const fetchNotifications = async () => {
  try {
    const token = getToken()
    if (!token) return

    const response = await axios.get('http://localhost:8088/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    notifications.value = response.data
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

// Fetch unread count
const fetchUnreadCount = async () => {
  try {
    const token = getToken()
    if (!token) return 0

    const response = await axios.get('http://localhost:8088/api/notifications/unread-count', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    return response.data.count || 0
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
}

// Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    const token = getToken()
    await axios.put(`http://localhost:8088/api/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Update local state
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

// Mark all as read
const markAllAsRead = async () => {
  try {
    const token = getToken()
    await axios.put('http://localhost:8088/api/notifications/mark-all-read', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Update local state
    notifications.value.forEach(n => n.read = true)
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

// Refresh notifications
const refreshNotifications = async () => {
  if (loading.value) return
  
  loading.value = true
  await fetchNotifications()
  loading.value = false
}

// Toggle panel
const toggle = () => {
  open.value = !open.value
  if (open.value) {
    refreshNotifications()
  }
}

// Close panel when clicking outside
const closePanel = () => {
  open.value = false
}

// Format time
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}

// Get notification icon based on type
const getNotificationIcon = (type) => {
  const icons = {
    'ORDER_PENDING': 'fa-solid fa-clock',
    'ORDER_PREPARING': 'fa-solid fa-utensils',
    'ORDER_READY': 'fa-solid fa-check-circle',
    'ORDER_DELIVERED': 'fa-solid fa-truck-fast',
    'ORDER_CANCELLED': 'fa-solid fa-ban',
    'PROMOTION': 'fa-solid fa-percent',
    'SYSTEM': 'fa-solid fa-info-circle'
  }
  return icons[type] || 'fa-solid fa-bell'
}

// Get notification class for styling
const getNotificationClass = (type) => {
  const classes = {
    'ORDER_PENDING': 'type-pending',
    'ORDER_PREPARING': 'type-preparing',
    'ORDER_READY': 'type-ready',
    'ORDER_DELIVERED': 'type-delivered',
    'ORDER_CANCELLED': 'type-cancelled',
    'PROMOTION': 'type-promo',
    'SYSTEM': 'type-system'
  }
  return classes[type] || ''
}

// Computed property for unread count
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Poll for new notifications every 30 seconds
const startPolling = () => {
  pollInterval.value = setInterval(async () => {
    if (open.value) {
      await fetchNotifications()
    }
  }, 30000) // 30 seconds
}

// Stop polling
const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
  }
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchNotifications()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.notif-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.badge {
  position: absolute;
  top: -6px;
  right: -4px;
  background: #ff4d4f;
  color: white;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  border: 2px solid #FFF8EC;
  z-index: 1;
}

.card-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #FFE6C2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  font-size: 20px;
  color: #A9682A;
  margin: 0 5px;
}

.card-btn:hover {
  background: #E7A73C;
  color: white;
  transform: scale(1.05);
}

.notif-panel {
  position: absolute;
  top: 42px;
  right: 0;
  width: 320px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0,0,0,.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
  border-radius: 12px 12px 0 0;
}

.title {
  font-weight: 600;
  margin: 0;
  color: #333;
  font-size: 16px;
}

.panel-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.mark-all-btn {
  background: none;
  border: none;
  color: #A9682A;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.mark-all-btn:hover {
  background: #f5f5f5;
}

.refresh-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #f5f5f5;
  color: #A9682A;
}

.refresh-btn.refreshing {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading, .empty {
  text-align: center;
  padding: 30px 20px;
  color: #888;
}

.empty i {
  font-size: 40px;
  margin-bottom: 10px;
  opacity: 0.5;
  color: #A9682A;
}

.notif-container {
  flex: 1;
  overflow-y: auto;
}

.notif-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}

.notif-item:hover {
  background: #f9f9f9;
}

.notif-item.unread {
  background: #f8fbff;
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 16px;
}

.type-pending {
  background: #fff8e6;
  color: #faad14;
}

.type-preparing {
  background: #e6f7ff;
  color: #1890ff;
}

.type-ready {
  background: #f6ffed;
  color: #52c41a;
}

.type-delivered {
  background: #f9f0ff;
  color: #722ed1;
}

.type-cancelled {
  background: #fff1f0;
  color: #ff4d4f;
}

.type-promo {
  background: #fff0f6;
  color: #eb2f96;
}

.type-system {
  background: #f6ffed;
  color: #52c41a;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  font-size: 14px;
}

.notif-message {
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notif-time {
  color: #999;
  font-size: 11px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1890ff;
  flex-shrink: 0;
  margin-left: 8px;
  margin-top: 4px;
}

/* Scrollbar styling */
.notif-container::-webkit-scrollbar {
  width: 6px;
}

.notif-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.notif-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.notif-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>