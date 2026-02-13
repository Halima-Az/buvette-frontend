<template>
    <HeaderPageMenu title="" />

    <div class="dashboard admin-dashboard">
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
                <button class="btn-add-user" @click="showAddUserModal = true">
                    <i class="fas fa-user-plus"></i> Add User
                </button>
                <div class="time-display">
                    <i class="far fa-clock"></i>
                    {{ currentTime }}
                </div>
            </div>
        </div>

        <!-- USER MANAGEMENT -->
        <div class="section-card user-management">
            <div class="card-header admin-card-header">
                <h2><i class="fas fa-user-cog"></i> User Management</h2>
                <div class="user-filters">
                    <input type="text" v-model="searchQuery" placeholder="Search users..." class="search-input">
                    <select v-model="statusFilter" class="filter-select">
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BLOCKED">Blocked</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                    <select v-model="roleFilter" class="filter-select">
                        <option value="ALL">All Roles</option>
                        <option value="ROLE_CLIENT">Client</option>
                        <option value="ROLE_WORKER">Worker</option>
                        <option value="ROLE_ADMIN">Admin</option>
                    </select>
                </div>
            </div>

            <div class="user-tabs">
                <button @click="userActiveTab = 'ALL'"
                    :class="['tab-btn', { active: userActiveTab === 'ALL' }]">
                    <i class="fas fa-users"></i> All Users ({{ totalUsers }})
                </button>
                <button @click="userActiveTab = 'BLOCKED'"
                    :class="['tab-btn', { active: userActiveTab === 'BLOCKED' }]">
                    <i class="fas fa-ban"></i> Blocked Users ({{ blockedUsersCount }})
                </button>
            </div>

            <div class="users-table-container">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in filteredUsers" :key="user.id">
                            <td class="user-id">#{{ user.id }}</td>
                            <td class="user-info">
                                <div class="user-avatar">
                                    {{ user.username.charAt(0).toUpperCase() }}
                                </div>
                                <div>
                                    <div class="user-name">{{ user.username }}</div>
                                    <div class="user-join">Joined {{ formatDate(user.createdAt) }}</div>
                                </div>
                            </td>
                            <td class="user-email">{{ user.email }}</td>
                            <td>
                                <span :class="['role-badge', user.role.toLowerCase()]">
                                    {{ user.role.replace('ROLE_', '') }}
                                </span>
                            </td>
                            <td>
                                <span :class="['status-badge', user.status.toLowerCase()]">
                                    <span class="status-dot"></span>
                                    {{ user.status }}
                                </span>
                            </td>
                            <td class="user-actions">
                                <button v-if="user.status !== 'BLOCKED'" 
                                        class="btn-action btn-block"
                                        @click="blockUser(user.id)"
                                        title="Block User">
                                    <i class="fas fa-ban"></i>
                                </button>
                                <button v-else 
                                        class="btn-action btn-unblock"
                                        @click="unblockUser(user.id)"
                                        title="Unblock User">
                                    <i class="fas fa-check-circle"></i>
                                </button>
                                <button class="btn-action btn-edit"
                                        @click="editUser(user)"
                                        title="Edit User">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action btn-delete"
                                        @click="deleteUser(user.id)"
                                        title="Delete User">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <button class="btn-action btn-details"
                                        @click="viewUserDetails(user.id)"
                                        title="View Details">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div v-if="filteredUsers.length === 0" class="empty-state">
                    <i class="fas fa-users-slash"></i>
                    <h3>No users found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL -->
    <div v-if="showAddUserModal" class="modal-overlay" @click="showAddUserModal = false">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3><i class="fas fa-user-plus"></i> Add New User</h3>
                <button class="modal-close" @click="showAddUserModal = false">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="addNewUser">
                    <div class="form-group">
                        <label for="username"><i class="fas fa-user"></i> Username</label>
                        <input type="text" id="username" v-model="newUser.username" required>
                    </div>
                    <div class="form-group">
                        <label for="email"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="email" v-model="newUser.email" required>
                    </div>
                    <div class="form-group">
                        <label for="password"><i class="fas fa-lock"></i> Password</label>
                        <input type="password" id="password" v-model="newUser.password" required>
                    </div>
                    <div class="form-group">
                        <label for="role"><i class="fas fa-user-tag"></i> Role</label>
                        <select id="role" v-model="newUser.role" required>
                            <option value="ROLE_CLIENT">Client</option>
                            <option value="ROLE_WORKER">Worker</option>
                            <option value="ROLE_ADMIN">Admin</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status"><i class="fas fa-circle"></i> Status</label>
                        <select id="status" v-model="newUser.status" required>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="BLOCKED">Blocked</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" @click="showAddUserModal = false">
                            Cancel
                        </button>
                        <button type="submit" class="btn-submit">
                            <i class="fas fa-plus"></i> Add User
                        </button>
                    </div>
                </form>
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
const userActiveTab = ref('ALL')
const showAddUserModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('ALL')
const roleFilter = ref('ALL')

// Users Data
const users = ref([
    { id: 1, username: 'John Doe', email: 'john@example.com', role: 'ROLE_CLIENT', status: 'ACTIVE', createdAt: '2024-01-15' },
    { id: 2, username: 'Jane Smith', email: 'jane@example.com', role: 'ROLE_WORKER', status: 'ACTIVE', createdAt: '2024-01-20' },
    { id: 3, username: 'Bob Johnson', email: 'bob@example.com', role: 'ROLE_CLIENT', status: 'BLOCKED', createdAt: '2024-01-10' },
    { id: 4, username: 'Admin User', email: 'admin@snack.com', role: 'ROLE_ADMIN', status: 'ACTIVE', createdAt: '2024-01-01' },
    // More users...
])

const newUser = ref({
    username: '',
    email: '',
    password: '',
    role: 'ROLE_CLIENT',
    status: 'ACTIVE'
})

// Computed
const filteredUsers = computed(() => {
    let filtered = users.value
    
    // Apply search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(user => 
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
    }
    
    // Apply status filter
    if (statusFilter.value !== 'ALL') {
        filtered = filtered.filter(user => user.status === statusFilter.value)
    }
    
    // Apply role filter
    if (roleFilter.value !== 'ALL') {
        filtered = filtered.filter(user => user.role === roleFilter.value)
    }
    
    // Apply tab filter
    switch (userActiveTab.value) {
        case 'BLOCKED':
            return filtered.filter(u => u.status === 'BLOCKED')
        case 'VIP':
            return filtered.filter(u => u.role === 'ROLE_ADMIN')
        default:
            return filtered
    }
})

const totalUsers = computed(() => users.value.length)
const blockedUsersCount = computed(() => users.value.filter(u => u.status === 'BLOCKED').length)
const vipUsersCount = computed(() => users.value.filter(u => u.role === 'ROLE_ADMIN').length)

// Methods
const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
}

const blockUser = async (userId) => {
    if (!confirm("Are you sure you want to block this user?")) return
    
    try {
        const token = localStorage.getItem("token")
        await axios.put(`http://localhost:8088/admin/users/${userId}/block`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        
        const user = users.value.find(u => u.id === userId)
        if (user) user.status = 'BLOCKED'
    } catch (err) {
        console.error("Error blocking user:", err)
        alert("Failed to block user")
    }
}

const unblockUser = async (userId) => {
    try {
        const token = localStorage.getItem("token")
        await axios.put(`http://localhost:8088/admin/users/${userId}/unblock`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        
        const user = users.value.find(u => u.id === userId)
        if (user) user.status = 'ACTIVE'
    } catch (err) {
        console.error("Error unblocking user:", err)
        alert("Failed to unblock user")
    }
}

const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
    
    try {
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:8088/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        
        users.value = users.value.filter(u => u.id !== userId)
    } catch (err) {
        console.error("Error deleting user:", err)
        alert("Failed to delete user")
    }
}

const editUser = (user) => {
    // Implement edit user modal
    alert(`Edit user: ${user.username}`)
}

const viewUserDetails = (userId) => {
    alert(`Viewing details for user #${userId}`)
}

const addNewUser = async () => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post('http://localhost:8088/admin/users', newUser.value, {
            headers: { Authorization: `Bearer ${token}` }
        })
        
        users.value.push(response.data)
        showAddUserModal.value = false
        resetNewUserForm()
    } catch (err) {
        console.error("Error adding user:", err)
        alert("Failed to add user")
    }
}

const resetNewUserForm = () => {
    newUser.value = {
        username: '',
        email: '',
        password: '',
        role: 'ROLE_CLIENT',
        status: 'ACTIVE'
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
   LAYOUT
========================= */

.admin-dashboard {
    background: #f9fafb;
    padding: 40px;
    min-height: 100vh;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.admin-icon {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    background: linear-gradient(135deg, #111827, #374151);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 22px;
}

.admin-header h1 {
    font-size: 26px;
    font-weight: 800;
    margin: 0;
    color: #111827;
}

.subtitle {
    font-size: 14px;
    color: #6b7280;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.time-display {
    background: white;
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 600;
    color: #374151;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* =========================
   BUTTONS
========================= */

.btn-add-user {
    background: #111827;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
}

.btn-add-user:hover {
    background: #000;
    transform: translateY(-1px);
}

/* =========================
   CARD
========================= */

.section-card {
    background: white;
    border-radius: 18px;
    box-shadow: 0 8px 25px rgb(236, 138, 25,0.05);
    overflow: hidden;
}

.admin-card-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.admin-card-header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
}

/* =========================
   FILTERS
========================= */

.user-filters {
    display: flex;
    gap: 12px;
}

.search-input,
.filter-select {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    font-size: 14px;
    background: #f9fafb;
    transition: 0.2s;
}

.search-input:focus,
.filter-select:focus {
    outline: none;
    border-color: rgb(236, 138, 25);;
    background: white;
}

/* =========================
   TABS
========================= */

.user-tabs {
    display: flex;
    gap: 12px;
    padding: 20px 24px 0 24px;
}

.tab-btn {
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    background: #f3f4f6;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;
}

.tab-btn.active {
    background:rgb(236, 138, 25);;
    color: white;
}

.tab-btn:hover {
    background: #e5e7eb;
}

/* =========================
   TABLE
========================= */

.users-table-container {
    padding: 24px;
    overflow-x: auto;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th {
    text-align: left;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #6b7280;
    padding-bottom: 12px;
}

.users-table td {
    padding: 16px 0;
    border-top: 1px solid #f1f5f9;
    font-size: 14px;
    vertical-align: middle;
}

.user-id {
    font-weight: 700;
    color: #6b7280;
}

/* USER INFO */
.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgb(236, 138, 25);
    color: white;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-name {
    font-weight: 600;
}

.user-join {
    font-size: 12px;
    color: #9ca3af;
}

/* =========================
   BADGES
========================= */

.role-badge,
.status-badge {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

.role_client {
    background: #eef2ff;
    color: #4338ca;
}

.role_worker {
    background: #ecfdf5;
    color: #059669;
}

.role_admin {
    background: #fef3c7;
    color: #b45309;
}

.status_active {
    background: #ecfdf5;
    color: #059669;
}

.status_blocked {
    background: #fee2e2;
    color: #b91c1c;
}

.status_inactive {
    background: #f3f4f6;
    color: #6b7280;
}

/* =========================
   ACTION BUTTONS
========================= */

.user-actions {
    display: flex;
    gap: 8px;
}

.btn-action {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    transition: 0.2s;
}

.btn-action:hover {
    background: #e5e7eb;
}

.btn-delete:hover {
    background: #fee2e2;
    color: #b91c1c;
}

/* =========================
   EMPTY STATE
========================= */

.empty-state {
    text-align: center;
    padding: 60px 0;
    color: #9ca3af;
}

.empty-state i {
    font-size: 40px;
    margin-bottom: 10px;
}

/* =========================
   MODAL
========================= */

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    width: 420px;
    height: 420px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(226, 128, 16, 0.2);
   
    animation: slideUp 0.3s ease;
}
@keyframes slideUp {
   from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }   
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-radius: 16px 16px 0px  0;
    background-color: #d39333;
    padding: 20px 14px;
    color: #000;
}

.modal-close {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
}
.modal-close:hover{
    transform: rotate(90deg) scale(1.5);

}
.modal-body{
    padding: 28px;
    margin: 10px;
    max-height: calc(85vh - 100px);
    overflow-y: auto;
    /* Style de la scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgb(83, 82, 80) #f1f5f9;
}

.form-group {
    margin-bottom: 16px;
   
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 6px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.btn-cancel {
    background: #f3f4f6;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
}

.btn-submit {
    background:rgb(192, 108, 11);
    color: rgb(255, 255, 255);
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
}

</style>
