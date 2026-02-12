<template>
  <nav class="admin-footer">
    <router-link to="/adminhome" class="nav-item" active-class="active">
      <i class="fa-solid fa-chart-pie icon"></i>
      <span class="label">Dashboard</span>
    </router-link>

    <router-link to="/admin/usersGestion" class="nav-item" active-class="active">
      <i class="fa-solid fa-users-gear icon"></i>
      <span class="label">Users</span>
    </router-link>

    <router-link to="/admin/workerRequests" class="nav-item" active-class="active">
      <i class="fa-solid fa-user-shield icon"></i>
      <span class="label">Workers</span>
    </router-link>

    <router-link to="/admin/analytics" class="nav-item" active-class="active">
      <i class="fa-solid fa-chart-line icon"></i>
      <span class="label">Analytics</span>
    </router-link>
    <router-link
      to="/profile"
      class="nav-item profile"
    >
      <i class="fa-solid fa-user icon"></i>
      <span class="dot"></span>
    </router-link>

  </nav>
</template>


<style scoped>
.admin-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #FFF8EC;
  border-top: 2px solid #F0E6C8;
  box-shadow: 0 -10px 40px rgba(199, 146, 43, 0.1);
  z-index: 999;
  padding: 0 20px;
}

.nav-item {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  opacity: 0.6;
  min-width: 70px;
  background: transparent;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #C7922B;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

.nav-item:hover {
  opacity: 1;
  transform: translateY(-5px);
  background: rgba(199, 146, 43, 0.1);
}

.nav-item.active {
  opacity: 1;
  background: linear-gradient(135deg, rgba(199, 146, 43, 0.15) 0%, rgba(199, 146, 43, 0.05) 100%);
  border: 1px solid rgba(199, 146, 43, 0.3);
  box-shadow: 
    0 0 20px rgba(199, 146, 43, 0.1),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.nav-item.active::before {
  opacity: 1;
  top: -6px;
  background: #E3B45A;
}

.nav-item.active .icon {
  color: #C7922B;
  transform: scale(1.1);
}

.nav-item.active .label {
  color: #1f2937;
  font-weight: 600;
}

.icon {
  font-size: 22px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

/* Active indicator animation */
.nav-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #C7922B 0%, #E3B45A 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-item.active::after {
  width: 40px;
}

/* Hover effects */
.nav-item:hover .icon {
  transform: translateY(-2px);
  color: #C7922B;
}

.nav-item:hover .label {
  color: #1f2937;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-footer {
    height: 65px;
    padding: 0 10px;
  }
  
  .nav-item {
    padding: 10px 12px;
    min-width: 60px;
  }
  
  .icon {
    font-size: 20px;
  }
  
  .label {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .admin-footer {
    height: 60px;
  }
  
  .nav-item {
    padding: 8px 10px;
    min-width: 50px;
  }
  
  .icon {
    font-size: 18px;
  }
  
  .label {
    display: none;
  }
  
  .nav-item.active .label {
    display: block;
    position: absolute;
    bottom: -20px;
    background: #FFF8EC;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    border: 1px solid rgba(199, 146, 43, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>