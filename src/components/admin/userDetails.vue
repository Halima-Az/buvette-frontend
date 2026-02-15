<template>
    <div v-if="showUserDetailsModal" class="modal-overlay" @click="closeUserDetails">
        <div class="modal-container" @click.stop>
            <div class="modal-header">
                <div class="header-content-modal">
                    <div class="modal-icon">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div>
                        <h3>User Details</h3>
                        <p class="modal-subtitle">Complete information</p>
                    </div>
                </div>
                <button class="modal-close" @click="closeUserDetails">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body" v-if="selectedUser">
                <!-- User Profile Section -->
                <div class="user-profile-section">
                    <div class="profile-avatar-large">
                        <div class="avatar-large">
                            {{ selectedUser.fname?.charAt(0).toUpperCase() || 'U' }}
                        </div>
                        <div class="avatar-glow-modal"></div>
                    </div>
                    <div class="profile-info-center">
                        <h2>{{ selectedUser.fname }} {{ selectedUser.lname }}</h2>
                        <p class="user-role-badge">
                            <i class="fas fa-briefcase"></i>
                            {{ selectedUser.role || 'Worker' }}
                        </p>
                    </div>
                </div>

                <!-- Info Grid -->
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-icon email">
                            <i class="far fa-envelope"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Email Address</span>
                            <span class="info-value">{{ selectedUser.email }}</span>
                        </div>
                    </div>

                    <div class="info-card">
                        <div class="info-icon phone">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Phone Number</span>
                            <span class="info-value">{{ selectedUser.phone || 'Not provided' }}</span>
                        </div>
                    </div>

                    <div class="info-card">
                        <div class="info-icon calendar">
                            <i class="far fa-calendar-alt"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Date of birthday</span>
                            <span class="info-value">{{ formatDate(selectedUser.dob) || 'Not provided' }}</span>
                        </div>
                    </div>

                    <div class="info-card">
                        <div class="info-icon status">
                            <i class="fas fa-circle"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Account Status</span>
                            <span class="info-value status-active">
                                <span class="status-dot-inline"></span>
                                {{ selectedUser.status || 'Active' }}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn-modal btn-secondary-modal" @click="closeUserDetails">
                    <i class="fas fa-times"></i>
                    Close
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps,defineEmits } from 'vue'

const { showUserDetailsModal, selectedUser } = defineProps({
  showUserDetailsModal: Boolean,
  selectedUser: Object
})
const emit =defineEmits(['closeUserDetails'])

const closeUserDetails = () => {
    emit('closeUserDetails')
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString()
}

</script>

<style scoped>
/* =========================
   MODAL USER DETAILS - PREMIUM
========================= */

.modal-overlay {
    position: fixed !important;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    /* 👇 IMPORTANT */
    top: 0 !important;
    left: 0 !important;
    transform: none !important;
    z-index: 99999 !important;
}
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal-container {
    background: var(--bg-card);
    border-radius: 28px;
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow:
        0 20px 60px rgba(170, 122, 17, 0.2),
        0 0 0 1px rgba(170, 122, 17, 0.1);
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    flex-direction: column;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Modal Header */
.modal-header {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    padding: 28px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
}

.modal-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: glow 4s ease-in-out infinite;
}

@keyframes glow {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(-20px, -20px);
    }
}

.header-content-modal {
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 1;
}

.modal-icon {
    width: 52px;
    height: 52px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header h3 {
    margin: 0;
    color: white;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.3px;
}

.modal-subtitle {
    margin: 4px 0 0 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 500;
}

.modal-close {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.3s ease;
    z-index: 1;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg);
}

/* Modal Body */
.modal-body {
    padding: 32px;
    overflow-y: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: var(--primary) rgba(170, 122, 17, 0.1);
}

.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: rgba(170, 122, 17, 0.05);
    border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--primary), var(--secondary));
    border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
}

/* User Profile Section */
.user-profile-section {
    text-align: center;
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 2px solid rgba(170, 122, 17, 0.1);
}

.profile-avatar-large {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
}

.avatar-large {
    width: 100px;
    height: 100px;
    border-radius: 28px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    font-size: 42px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 32px rgba(170, 122, 17, 0.3);
    position: relative;
    z-index: 2;
}

.avatar-glow-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 28px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    filter: blur(25px);
    opacity: 0.4;
    animation: glowPulse 3s ease-in-out infinite;
    z-index: 1;
}

@keyframes glowPulse {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(1.1);
    }
}

.profile-info-center h2 {
    margin: 0 0 12px 0;
    font-size: 28px;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.5px;
}

.user-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.1), rgba(212, 165, 23, 0.05));
    padding: 8px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: var(--primary);
    border: 2px solid rgba(170, 122, 17, 0.2);
}

/* Info Grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.info-card {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.03), rgba(212, 165, 23, 0.01));
    border: 2px solid rgba(170, 122, 17, 0.1);
    border-radius: 18px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
}

.info-card:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 24px rgba(170, 122, 17, 0.1);
    transform: translateY(-2px);
}

.info-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}

.info-icon.email {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.15), rgba(212, 165, 23, 0.05));
    color: var(--primary);
}

.info-icon.phone {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
    color: var(--success);
}

.info-icon.calendar {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05));
    color: var(--info);
}

.info-icon.status {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05));
    color: var(--warning);
}

.info-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 15px;
    color: var(--text-main);
    font-weight: 700;
}

.status-active {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--success);
}

.status-dot-inline {
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: 50%;
    animation: statusPulse 2s ease-in-out infinite;
}

/* Additional Info Section */
.additional-info-section,
.stats-section {
    margin-bottom: 28px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.section-title i {
    color: var(--primary);
}

.info-box {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.03), rgba(212, 165, 23, 0.01));
    border: 2px solid rgba(170, 122, 17, 0.1);
    border-radius: 18px;
    padding: 20px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 14px 0;
    border-bottom: 1px solid rgba(170, 122, 17, 0.08);
    gap: 16px;
}

.info-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.info-row:first-child {
    padding-top: 0;
}

.row-label {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 600;
    min-width: 120px;
}

.row-value {
    font-size: 14px;
    color: var(--text-main);
    font-weight: 600;
    text-align: right;
    flex: 1;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
}

.stat-card-modal {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.03), rgba(212, 165, 23, 0.01));
    border: 2px solid rgba(170, 122, 17, 0.1);
    border-radius: 18px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.3s ease;
}

.stat-card-modal:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 24px rgba(170, 122, 17, 0.15);
    transform: translateY(-3px);
}

.stat-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
}

.stat-icon-wrapper.orders {
    background: linear-gradient(135deg, rgba(170, 122, 17, 0.15), rgba(212, 165, 23, 0.05));
    color: var(--primary);
}

.stat-icon-wrapper.delivered {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
    color: var(--success);
}

.stat-icon-wrapper.rating {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05));
    color: var(--warning);
}

.stat-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-number-modal {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1;
}

.stat-label-modal {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Modal Footer */
.modal-footer {
    padding: 24px 32px;
    border-top: 2px solid rgba(170, 122, 17, 0.1);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: linear-gradient(135deg, rgba(253, 250, 242, 0.5), rgba(255, 255, 255, 0.3));
}

.btn-modal {
    padding: 12px 24px;
    border-radius: 14px;
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
}

.btn-secondary-modal {
    background: var(--bg-card);
    color: var(--text-muted);
    border: 2px solid rgba(170, 122, 17, 0.2);
}

.btn-secondary-modal:hover {
    background: rgba(170, 122, 17, 0.05);
    border-color: var(--primary);
    color: var(--text-main);
    transform: translateY(-2px);
}

.btn-primary-modal {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 20px rgba(170, 122, 17, 0.3);
}

.btn-primary-modal:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 32px rgba(170, 122, 17, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
    .modal-container {
        max-width: 100%;
        max-height: 95vh;
        border-radius: 20px;
    }

    .modal-header {
        padding: 20px 24px;
    }

    .modal-body {
        padding: 24px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .modal-footer {
        flex-direction: column-reverse;
        padding: 20px 24px;
    }

    .btn-modal {
        width: 100%;
        justify-content: center;
    }

    .info-row {
        flex-direction: column;
        align-items: start;
        gap: 6px;
    }

    .row-label {
        min-width: auto;
    }

    .row-value {
        text-align: left;
    }
}

@media (max-width: 480px) {
    .modal-header h3 {
        font-size: 18px;
    }

    .avatar-large {
        width: 80px;
        height: 80px;
        font-size: 32px;
    }

    .profile-info-center h2 {
        font-size: 22px;
    }

    .section-title {
        font-size: 14px;
    }
}
</style>