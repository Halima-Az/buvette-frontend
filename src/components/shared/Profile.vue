<template>
  <div class="contentx">
    <div class="container ">
      <div class="row justify-content-center">

        <!-- Left column : See Orders -->
        <div class="col-12 col-md-3 seeOrders" v-if="is_client">
          <button @click="goToMyOrders"> my orders</button>
        </div>

        <!-- Right column : Profile -->
        <div class="col-12 col-md-9" v-if="user">
          <div class="profile-container">

            <!-- Header -->
            <div class="profile-header">
              <div class="avatar">
                {{ user.fname.charAt(0) }}{{ user.lname.charAt(0) }}
              </div>
              <h2 class="name">{{ user.fname }} {{ user.lname }}</h2>
              <p class="role">
                <i class="fas fa-user-tag"></i> {{ user.role }}
              </p>
            </div>

            <!-- User info -->
            <div class="profile-info">
              <div class="info-item">
                <i class="fas fa-user"></i>
                <span class="label">Username:</span>
                <span class="value">{{ user.username }}</span>
              </div>

              <div class="info-item">
                <i class="fas fa-envelope"></i>
                <span class="label">Email:</span>
                <span class="value">{{ user.email }}</span>
              </div>

              <div class="info-item">
                <i class="fas fa-calendar-alt"></i>
                <span class="label">Date of Birth:</span>
                <span class="value">{{ user.dob || 'Not provided' }}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router =useRouter()
const user = ref(null)

const role = localStorage.getItem("role")
const is_client=computed(()=>role=="ROLE_CLIENT")

onMounted(async () => {
  const token = localStorage.getItem("token")
  if (!token) return
  try {
    const res = await axios.get("http://localhost:8088/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = res.data
  } catch (err) {
    console.error("Erreur lors de la récupération de user:", err)
  }
})

const goToMyOrders =()=>{
  router.push('/orders')
}
</script>

<style>
.contentx {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: url('/images/body.png') !important;
  background-repeat: no-repeat;
  background-size: cover;
}

.seeOrders {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
}

.seeOrders button {
  padding: 16px 36px 16px 44px;
  background: linear-gradient(135deg, #cf961b 0%, #ce9e0f 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(170, 122, 17, 0.25);
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.seeOrders button::before {
  content: '📦';
  font-size: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.seeOrders button:hover::after {
  transform: translateX(6px);
}

.seeOrders button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(170, 122, 17, 0.35);
}

.seeOrders button:active {
  transform: translateY(-1px);
}
.profile-container {
  max-width: 800px;
  margin: 20px 60px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: 40;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
  position: relative;
  margin-left: auto;

}

.profile-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, #ce9720 0%, #f0b12f 100%);
  z-index: 0;
}

.profile-header {
  position: relative;
  padding: 10px 10px 20px;
  z-index: 1;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #ce9720;
  font-size: 38px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 5px solid rgba(255, 255, 255, 0.9);
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.avatar:hover {
  transform: scale(1.04) translateY(-4px);
  box-shadow: 0 15px 40px rgba(206, 151, 32, 0.4);
}

.name {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.role {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: inline-block;
  padding: 8px 10px;
  border-radius: 20px;
  margin: 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.role i {
  margin-right: 6px;
}

.profile-info {
  background: white;
  padding: 20px 40px;
  text-align: left;
  position: relative;
  z-index: 1;
}

.info-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  border-radius: 12px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #ce9720 0%, #f0b12f 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.info-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(206, 151, 32, 0.15);
  border-color: #ce9720;
}

.info-item:hover::before {
  transform: scaleY(1);
}

.info-item i {
  color: #ce9720;
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(206, 151, 32, 0.1) 0%, rgba(240, 177, 47, 0.1) 100%);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.info-item:hover i {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #ce9720 0%, #f0b12f 100%);
  color: white;
}

.label {
  font-weight: 700;
  color: #2d3748;
  font-size: 15px;
  letter-spacing: -0.2px;
}

.value {
  color: #4a5568;
  font-size: 15px;
  font-weight: 500;
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    margin: 10px 15px;
    border-radius: 20px;
    margin-bottom: 60px;
  }

  .profile-container::before {
    height: 150px;
  }

  .profile-header {
    padding: 10px 15px 15px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }

  .name {
    font-size: 16px;
  }

  .role {
    font-size: 12px;
    padding: 6px 16px;
  }

  .profile-info {
    padding: 25px 20px;
  }

  .info-item {
    grid-template-columns: auto 1fr;
    gap: 0px;
    padding: 10px;
  }

  .value {
    grid-column: 2;
    text-align: left;
  }
}

/* Animation d'apparition */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-container {
  animation: fadeInUp 0.6s ease;
}

.info-item:nth-child(1) {
  animation: fadeInUp 0.6s ease 0.1s backwards;
}

.info-item:nth-child(2) {
  animation: fadeInUp 0.6s ease 0.2s backwards;
}

.info-item:nth-child(3) {
  animation: fadeInUp 0.6s ease 0.3s backwards;
}
</style>