<template>
  <div class="profile-container" v-if="user">
    <!-- Header avec avatar -->
    <div class="profile-header">
      <div class="avatar">
        {{ user.fname.charAt(0) }}{{ user.lname.charAt(0) }}
      </div>
      <h2 class="name">{{ user.fname }} {{ user.lname }}</h2>
      <p class="role"><i class="fas fa-user-tag"></i> {{ user.role }}</p>
    </div>

    <!-- Infos utilisateur -->
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
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const user = ref(null)

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
</script>

<style>
.profile-container {
  max-width: 500px;
  margin: 40px auto;
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.12);
  text-align: center;
  border: 2px solid rgb(206, 151, 32);
}

.profile-header {
  margin-bottom: 25px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgb(206, 151, 32);
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: rgb(206, 151, 32);
}

.role {
  font-size: 14px;
  color: #666;
}

.profile-info {
  text-align: left;
  margin-top: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-item i {
  color: rgb(206, 151, 32);
  font-size: 18px;
}

.label {
  font-weight: 600;
  color: #333;
}

.value {
  color: #555;
}
</style>
