<template>
  <div class="contentx">
    <div class="container">
      <div class="row g-4">

        <!-- Sidebar Profile Card -->
        <div class="col-12 col-lg-4">
          <div class="profile-card">
            <!-- Avatar Section -->
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <div class="avatar-circle">
                  {{ user.fname.charAt(0) }}{{ user.lname.charAt(0) }}
                </div>
                <div class="online-badge"></div>
              </div>
              <h3 class="user-name">{{ user.fname }} {{ user.lname }}</h3>
              <div class="user-role">
                <i class="fas fa-shield-alt"></i>
                {{ user.role.replace('ROLE_', '') }}
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="stats-section" v-if="is_client">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ ordersLength }}</span>
                  <span class="stat-label">Orders</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon warning">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ pendinLength }}</span>
                  <span class="stat-label">Pending</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="action-section" v-if="is_client">
              <button class="btn-primary-gold" @click="$emit('goToMyOrders')">
                <i class="fas fa-box"></i>
                View My Orders
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-12 col-lg-8">

          <!-- Account Information Card -->
          <div class="info-card">
            <div class="card-header">
              <div class="header-title">
                <i class="fas fa-user-circle"></i>
                <h4>Account Information</h4>
              </div>
              <button class="btn-edit" @click="openEditProfile">
                <i class="fas fa-edit"></i>
                Edit
              </button>
            </div>

            <div class="card-body">
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-left">
                    <div class="icon-box">
                      <i class="fas fa-user"></i>
                    </div>
                    <div class="info-label">
                      <span class="label-title">Username</span>
                      <span class="label-subtitle">Your unique identifier</span>
                    </div>
                  </div>
                  <div class="info-value">{{ user.username }}</div>
                </div>

                <div class="info-row">
                  <div class="info-left">
                    <div class="icon-box">
                      <i class="fas fa-envelope"></i>
                    </div>
                    <div class="info-label">
                      <span class="label-title">Email Address</span>
                      <span class="label-subtitle">Your contact email</span>
                    </div>
                  </div>
                  <div class="info-value">{{ user.email }}</div>
                </div>

                <div class="info-row">
                  <div class="info-left">
                    <div class="icon-box">
                      <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="info-label">
                      <span class="label-title">Date of Birth</span>
                      <span class="label-subtitle">Personal information</span>
                    </div>
                  </div>
                  <div class="info-value">{{ user.dob || 'Not provided' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Card -->
          <div class="info-card">
            <div class="card-header">
              <div class="header-title">
                <i class="fas fa-lock"></i>
                <h4>Security & Privacy</h4>
              </div>
            </div>

            <div class="card-body">
              <div class="security-item">
                <div class="security-left">
                  <i class="fas fa-key"></i>
                  <div>
                    <div class="security-title">Password</div>
                    <div class="security-subtitle">Last changed : {{ lastChanged }}</div>
                  </div>
                </div>
                <button class="btn-link" @click="change">Change</button>
              </div>


            </div>
          </div>
          <transition name="modal-fade">
            <div v-if="is_change" class="password-overlay" @click="closeForm">
              <div class="modal-content" @click.stop>
                <ChangePassword 
                @changePass="data => $emit('change-password', data)" 
                @cancel="closeForm"/>
              </div>
            </div>
          </transition>

          <transition name="modal-fade">
            <div v-if="is_edit_profile" class="password-overlay" @click="closeForm">
              <div class="modal-content" @click.stop>
                <EditProfile
                  :user="user"
                  @save="data => $emit('update-profile', data)"
                  @cancel="closeEditProfile"                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import ChangePassword from './ChangePassword.vue'
import EditProfile from './EditProfile.vue'


defineProps({
  ordersLength: {
    type: Number,
    required: true
  },
  pendinLength: {
    type: Number,
    required: true
  },
  user:{
    type:Object,
    required:true
  },
  lastChanged:{
    type:String
  }
})

const role = localStorage.getItem("role")
const is_client = computed(() => role == "ROLE_CLIENT")
const is_change = ref(false)

const is_edit_profile = ref(false)

const openEditProfile = () => {
  is_edit_profile.value = true
}

const closeEditProfile = () => {
  is_edit_profile.value = false
}



const change = () => {
  is_change.value = true
}

const closeForm = () => {
  is_change.value = false
}

</script>


<style scoped>
/* Effet de flou */
.blurred {
  filter: blur(3px);
  pointer-events: none;
  user-select: none;
  transition: filter 0.3s ease;
}

/* Overlay pour le formulaire */
.password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* un fond semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  border-radius: 10px;
  max-width: 550px;
  width: 90%;
}


/* Transitions pour le modal */
.modal-fade-enter-active {
  transition: all 0.3s ease;
}

.modal-fade-leave-active {
  transition: all 0.25s ease;
}

.modal-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .password-overlay {
    width: 95%;

  }
}

.contentx {
  background: #f8f6f1;
  min-height: 100vh;
  padding: 2.5rem 0;
}

.container {
  max-width: 1400px;
}

/* ============ PROFILE CARD (Sidebar) ============ */
.profile-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(170, 122, 17, 0.12);
  overflow: hidden;
  position: sticky;
  top: 2rem;
  border: 1px solid rgba(170, 122, 17, 0.08);
}

.avatar-section {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  padding: 3rem 2rem 2rem;
  text-align: center;
  position: relative;
}

.avatar-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.25rem;
}

.avatar-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #ffffff;
  color: #aa7a11;
  font-size: 2.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  text-transform: uppercase;
}

.online-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.user-name {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  position: relative;
  z-index: 1;
}

.user-role {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.35);
  position: relative;
  z-index: 1;
  text-transform: capitalize;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  background: #fdfaf2;
}

.stat-item {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(170, 122, 17, 0.08);
  border: 1px solid rgba(170, 122, 17, 0.06);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.25);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Action Section */
.action-section {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #fdfaf2;
}

.btn-primary-gold {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

.btn-primary-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(170, 122, 17, 0.35);
  background: linear-gradient(135deg, #8f6610 0%, #b8910f 100%);
}

.btn-secondary {
  background: #ffffff;
  color: #1f2937;
  border: 2px solid rgba(170, 122, 17, 0.15);
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.btn-secondary:hover {
  border-color: #aa7a11;
  color: #aa7a11;
  background: #fdfaf2;
  transform: translateY(-2px);
}

/* ============ INFO CARDS ============ */
.info-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(170, 122, 17, 0.12);
  margin-bottom: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(170, 122, 17, 0.08);
}

.card-header {
  padding: 1.75rem 2rem;
  border-bottom: 2px solid #f8f6f1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fdfaf2;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.header-title i {
  color: #aa7a11;
  font-size: 1.5rem;
}

.header-title h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.btn-edit {
  background: #ffffff;
  color: #aa7a11;
  border: 1px solid rgba(170, 122, 17, 0.15);
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

.card-body {
  padding: 2rem;
  background: #ffffff;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: #fdfaf2;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.info-row:hover {
  border-color: rgba(170, 122, 17, 0.25);
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.12);
  transform: translateX(4px);
}

.info-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aa7a11;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(170, 122, 17, 0.08);
  border: 1px solid rgba(170, 122, 17, 0.1);
  transition: all 0.3s ease;
}

.info-row:hover .icon-box {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
  border-color: transparent;
}

.info-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.label-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
}

.info-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
  background: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(170, 122, 17, 0.1);
}

.info-row:hover .info-value {
  background: #fdfaf2;
  border-color: rgba(170, 122, 17, 0.2);
}

/* Security Section */
.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background: #fdfaf2;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(170, 122, 17, 0.08);
}

.security-item:last-child {
  margin-bottom: 0;
}

.security-item:hover {
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.1);
  border-color: rgba(170, 122, 17, 0.2);
  transform: translateX(4px);
}

.security-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.security-left i {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aa7a11;
  font-size: 1.125rem;
  box-shadow: 0 2px 8px rgba(170, 122, 17, 0.08);
  border: 1px solid rgba(170, 122, 17, 0.1);
  transition: all 0.3s ease;
}

.security-item:hover .security-left i {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

.security-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.security-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
}

.btn-link {
  background: #fdfaf2;
  border: 1px solid rgba(170, 122, 17, 0.15);
  color: #aa7a11;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-link:hover {
  background: linear-gradient(135deg, #aa7a11 0%, #d4a517 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(170, 122, 17, 0.25);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 991px) {
  .profile-card {
    position: relative;
    top: 0;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contentx {
    padding: 1.5rem 0;
  }

  .avatar-section {
    padding: 2rem 1.5rem 1.5rem;
  }

  .avatar-circle {
    width: 90px;
    height: 90px;
    font-size: 2.25rem;
  }

  .user-name {
    font-size: 1.25rem;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .info-value {
    align-self: stretch;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card,
.info-card {
  animation: fadeIn 0.5s ease;
}

.info-row:nth-child(1) {
  animation: fadeIn 0.5s ease 0.1s backwards;
}

.info-row:nth-child(2) {
  animation: fadeIn 0.5s ease 0.2s backwards;
}

.info-row:nth-child(3) {
  animation: fadeIn 0.5s ease 0.3s backwards;
}
</style>
