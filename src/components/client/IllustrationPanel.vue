<template>
  <div class="illustration-panel">
    <div class="illustration-content">
      <div class="text-content">
        <h1 class="title">Welcome to SnackUp!</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="image-wrapper">
        <img src="/images/body7.png" alt="SnackUp Illustration" class="illustration-img" />
      </div>
    </div>
  </div>
</template>


<script setup>
    
const props=defineProps({
    subtitle:String
})
</script>

<style scoped>
.illustration-panel {
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

.illustration-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.illustration-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 500px;
}

.text-content {
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1.25rem 0;
  letter-spacing: -0.5px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.6s ease;
}

.subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.8;
  font-weight: 500;
  animation: fadeInUp 0.6s ease 0.2s backwards;
}

.image-wrapper {
  position: relative;
  animation: fadeInUp 0.6s ease 0.4s backwards;
}

.illustration-img {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  border: 4px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.illustration-img:hover {
  transform: scale(1.02) translateY(-5px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
}

/* Animations */
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

/* Responsive */
@media (max-width: 991px) {
  .illustration-panel {
    min-height: 400px;
    padding: 2rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
