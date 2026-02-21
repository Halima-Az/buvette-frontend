<template>
  <HeaderPageMenu title="" />

  <div class="dashboard admin-dashboard">
    <!-- HEADER -->
    <div class="dashboard-header admin-header">
      <div class="header-left">
        <div class="icon-badge admin-icon">
          <i class="fas fa-users-cog"></i>
        </div>
        <div>
          <h1>User Management</h1>
          <p class="subtitle">Manage all system users</p>
        </div>
      </div>

      <div class="header-right">
        <div class="time-display">
          <i class="far fa-clock"></i>
          {{ currentTime }}
        </div>
      </div>
    </div>

    <!-- USER MANAGEMENT -->
    <div class="section-card user-management">
      <div class="card-header admin-card-header">
        <h2><i class="fas fa-user-cog"></i> Users</h2>

        <div class="user-filters">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search users..."
              class="search-input"
            />
          </div>

          <select v-model="statusFilter" class="filter-select">
            <option value="ALL">All</option>
            <option value="BLOCKED">Blocked</option>
            <option value="NOT_BLOCKED">Not Blocked</option>
          </select>

          <select v-model="roleFilter" class="filter-select">
            <option value="ALL">All Roles</option>
            <option value="ROLE_CLIENT">Client</option>
            <option value="ROLE_WORKER">Worker</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <!-- TABS -->
      <div class="user-tabs">
        <button
          @click="userActiveTab = 'ALL'"
          :class="['tab-btn', { active: userActiveTab === 'ALL' }]"
        >
          <i class="fas fa-users"></i>
          All Users <span class="tab-count">{{ totalUsers }}</span>
        </button>

        <button
          @click="userActiveTab = 'BLOCKED'"
          :class="['tab-btn', { active: userActiveTab === 'BLOCKED' }]"
        >
          <i class="fas fa-ban"></i>
          Blocked <span class="tab-count">{{ blockedUsersCount }}</span>
        </button>
      </div>

      <!-- TABLE -->
      <div class="users-table-container" v-if="!loading">
        <table v-if="filteredUsers.length" class="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="user-id">#{{ user.username }}</td>

              <td class="user-info">
                <div class="user-avatar" :style="{ backgroundColor: getAvatarColor(user.username) }">
                  {{ (user.username?.charAt(0) || '?').toUpperCase() }}
                </div>
                <div>
                  <div class="user-name">
                    {{ user.username || 'Unknown' }}
                  </div>
                </div>
              </td>

              <td class="user-email">
                {{ user.email || '-' }}
              </td>

              <!-- ROLE -->
              <td>
                <span class="role-badge" :class="`role-${user.role?.toLowerCase()}`">
                  {{ formatRole(user.role) }}
                </span>
              </td>

              <!-- STATUS -->
              <td>
                <span
                  :class="[
                    'status-badge',
                    user.status === 'BLOCKED' ? 'status-blocked' : 'status-active'
                  ]"
                >
                  <span class="status-dot"></span>
                  {{ user.status === 'BLOCKED' ? 'Blocked' : 'Active' }}
                </span>
              </td>

              <!-- ACTIONS -->
              <td class="user-actions">
                <button
                  v-if="user.status !== 'BLOCKED'"
                  class="btn-action btn-block"
                  @click="blockUser(user.id)"
                  title="Block User"
                >
                  <i class="fas fa-ban"></i>
                </button>

                <button
                  v-else
                  class="btn-action btn-unblock"
                  @click="unblockUser(user.id)"
                  title="Unblock User"
                >
                  <i class="fas fa-check-circle"></i>
                </button>

                <button
                  class="btn-action btn-delete"
                  @click="deleteUser(user.id)"
                  title="Delete User"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-state">
          <i class="fas fa-users-slash"></i>
          <h3>No users found</h3>
          <p>Try adjusting your filters or add a new user</p>
        </div>
      </div>

      <div v-else class="loading-state">
        <div class="spinner"></div>
        <p>Loading users...</p>
      </div>
    </div>
  </div>

  <AdminFooter />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue'
import AdminFooter from '@/components/admin/adminFooter.vue'

const API = 'http://localhost:8088/admin/users'
const token = localStorage.getItem('token')

const users = ref([])
const loading = ref(false)

const searchQuery = ref('')
const statusFilter = ref('ALL')
const roleFilter = ref('ALL')
const userActiveTab = ref('ALL')
const showAddUserModal = ref(false)
const currentTime = ref('')

const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'ROLE_CLIENT'
})

// Helper to generate avatar background color based on username
const getAvatarColor = (username) => {
  if (!username) return '#ec8a19'
  const colors = ['#ec8a19', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b']
  const index = username.charCodeAt(0) % colors.length
  return colors[index]
}

const formatRole = role => {
  if (role === 'ROLE_CLIENT') return 'Client'
  if (role === 'ROLE_WORKER') return 'Worker'
  if (role === 'ROLE_ADMIN') return 'Admin'
  return '-'
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get(API, {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = res.data
  } finally {
    loading.value = false
  }
}

const blockUser = async id => {
  if (!confirm('Are you sure you want to block this user?')) return
  await axios.put(`${API}/${id}/block`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  await fetchUsers()
}

const unblockUser = async id => {
  await axios.put(`${API}/${id}/unblock`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  await fetchUsers()
}

const deleteUser = async id => {
  if (!confirm('Delete this user permanently? This action cannot be undone.')) return
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  await fetchUsers()
}

const addNewUser = async () => {
  await axios.post(API, newUser.value, {
    headers: { Authorization: `Bearer ${token}` }
  })

  showAddUserModal.value = false
  newUser.value = {
    username: '',
    email: '',
    password: '',
    role: 'ROLE_CLIENT'
  }

  await fetchUsers()
}

const filteredUsers = computed(() => {
  let list = users.value
  

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u =>
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  }

  if (roleFilter.value !== 'ALL') {
    list = list.filter(u => u.role === roleFilter.value)
  }

  if (statusFilter.value === 'BLOCKED') {
    list = list.filter(u => u.status === 'BLOCKED')
  }

  if (statusFilter.value === 'NOT_BLOCKED') {
    list = list.filter(u => u.status !== 'BLOCKED')
  }

  if (userActiveTab.value === 'BLOCKED') {
    list = list.filter(u => u.status === 'BLOCKED')
  }

  return list
})

const totalUsers = computed(() => users.value.length)
const blockedUsersCount = computed(() =>
  users.value.filter(u => u.status === 'BLOCKED').length
)

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

let timer = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 60000)
  fetchUsers()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

formatRole
</script>

<style scoped>

/* =========================
   LIGHT MODERN DASHBOARD
========================= */

:root {
  --primary: #ec8a19;
  --primary-dark: #c06c0b;
  --primary-soft: rgba(236, 138, 25, 0.12);

  --bg-main: #fefefe;
  --bg-glass: rgba(255, 255, 255, 0.85);
  --border-soft: rgba(0, 0, 0, 0.07);

  --text-strong: #1f2937;
  --text-muted: #6b7280;

  --danger: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;

  --radius-xl: 1.8rem;
  --radius-lg: 1.2rem;
  --radius-md: 0.9rem;
  --radius-sm: 0.5rem;

  --shadow-soft: 0 6px 15px rgba(0,0,0,0.05);
  --shadow-medium: 0 12px 30px rgba(0,0,0,0.08);
}

/* =========================
   DASHBOARD BACKGROUND
========================= */

.admin-dashboard {
  background:
    radial-gradient(circle at 15% 25%, rgba(236,138,25,0.06), transparent 50%),
    radial-gradient(circle at 85% 80%, rgba(59,130,246,0.04), transparent 50%),
    var(--bg-main);
  min-height: 100vh;
  padding: 2.5rem;
  font-family: 'Inter', sans-serif;
}

/* =========================
   HEADER
========================= */

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-icon {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.6rem;
  box-shadow: var(--shadow-medium);
}

.admin-header h1 {
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--text-strong);
}

.subtitle {
  color: var(--text-muted);
  margin-top: 0.2rem;
  font-weight: 500;
}

/* =========================
   ADD USER BUTTON
========================= */

.btn-add-user {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-user:hover {
  transform: translateY(-2px);
  background: var(--primary-dark);
  box-shadow: 0 6px 15px rgba(236,138,25,0.3);
}

/* =========================
   CARD
========================= */

.section-card {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: 1.5rem 2rem;
  box-shadow: var(--shadow-medium);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}

/* =========================
   FILTERS
========================= */

.user-filters {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 0.6rem 1rem;
  border-radius: 2rem;
  border: 1px solid var(--border-soft);
  background: #fff;
  transition: all 0.2s ease;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

/* =========================
   TABS
========================= */

.user-tabs {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: 1px solid var(--border-soft);
  background: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary-dark);
  box-shadow: 0 6px 18px rgba(236,138,25,0.2);
}

/* =========================
   TABLE
========================= */

.users-table-container {
  padding-top: 1rem;
}

.users-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

.users-table th {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-muted);
  padding-bottom: 0.4rem;
}

.users-table td {
  background: #fff;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  transition: all 0.2s ease;
}

.users-table tbody tr:hover td {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
  background: rgba(236,138,25,0.05);
}

/* =========================
   USER AVATAR
========================= */

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================
   BADGES
========================= */

.role-badge,
.status-badge {
  padding: 0.25rem 0.7rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.status-blocked {
  background: rgba(239,68,68,0.12);
  color: var(--danger);
}

.status-badge.status-active {
  background: rgba(16,185,129,0.12);
  color: var(--success);
}

/* =========================
   ACTION BUTTONS (COOL)
========================= */

.btn-action {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

/* Block */
.btn-block {
  background: #fef3f2;
  color: var(--danger);
}

.btn-block:hover {
  background: var(--danger);
  color: white;
  transform: scale(1.1);
}

/* Unblock */
.btn-unblock {
  background: #ecfdf5;
  color: var(--success);
}

.btn-unblock:hover {
  background: var(--success);
  color: white;
  transform: scale(1.1);
}

/* Delete */
.btn-delete {
  background: #fefce8;
  color: var(--warning);
}

.btn-delete:hover {
  background: var(--warning);
  color: white;
  transform: scale(1.1);
}

/* =========================
   EMPTY / LOADING
========================= */

.empty-state,
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

/* =========================
   MODAL
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-glass);
  backdrop-filter: blur(18px);
  border-radius: var(--radius-xl);
  padding: 2rem;
  width: 90%;
  max-width: 480px;
  box-shadow:
    0 20px 40px rgba(0,0,0,0.1),
    0 8px 20px rgba(0,0,0,0.08);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* =========================
   FORM
========================= */

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-soft);
  transition: 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1.5rem;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-filters {
    flex-direction: column;
    width: 100%;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }
}

</style>
