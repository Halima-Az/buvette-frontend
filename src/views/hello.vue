<template>
  <section class="landing">
    <div class="hero">
      <span class="badge">Fresh & Tasty</span>

      <h1>
        Discover Delicious <br />
        Food & Drinks
      </h1>

      <p>
        Order your favorite meals and beverages easily, quickly,
        and enjoy a delightful experience every time.
      </p>

      <div class="actions">
        <button class="btn-primary" ><a href="/register">Get Started</a></button>
        <button class="btn-secondary"><a href="/login">Explore Menu</a></button>
      </div>
    </div>

    <div class="hero-image">
      <img src="/images/body5.png" alt="Food illustration" />
    </div>
  </section>
</template>

<script setup>
import { defineOptions } from 'vue'

defineOptions({
  name: 'Hello'
})
</script>
<style scoped>
  .landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 80px;
  background: linear-gradient(
    135deg,
    #fff8ec 0%,
    rgba(206, 151, 31, 0.08) 100%
  );
  font-family: "Inter", sans-serif;
}

.hero {
  max-width: 520px;
}

.badge {
  display: inline-block;
  background: rgba(206, 151, 31, 0.15);
  color: #ce971f;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 18px;
}

.hero h1 {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.2;
  color: #1f2937;
  margin-bottom: 18px;
}

.hero p {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 16px;
}

.btn-primary {
  background: #ce971f;
  color: white;
  border: none;
  padding: 14px 26px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(206, 151, 31, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary a{
  color:white;
  text-decoration: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(206, 151, 31, 0.45);
}

.btn-secondary {
  background: transparent;
  color: #ce971f;
  border: 2px solid #ce971f;
  padding: 12px 24px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.btn-secondary a{
  color: #ce971f;
  text-decoration: none;
}
.btn-secondary:hover {
  background: #ce971f;
  color: white;
}
.btn-secondary:hover a  {
  
  color: white;
}
.hero-image img {
  max-width: 460px;
  width: 100%;
  border-radius: 20px;
  transition : transform 0.4s ease , box-shadow 0.4s ease ,border 0.4s ease;
  animation: float 5s ease-in-out infinite;
  will-change: transform;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
  100% { transform: translateY(0); }
}

.hero-image img:hover {
  animation-play-state: paused;
  transform: rotate(4deg) scale(1.09);
  cursor: pointer;
  border: 2px solid #ce971f;
  box-shadow: 0 20px 50px rgba(206, 151, 31, 0.45);
}

/* Responsive */
@media (max-width: 900px) {
  .landing {
    flex-direction: column;
    text-align: center;
    padding: 40px 24px;
  }

  .actions {
    justify-content: center;
  }

  .hero-image {
    margin-top: 40px;
  }

  .hero h1 {
    font-size: 34px;
  }
}

</style>