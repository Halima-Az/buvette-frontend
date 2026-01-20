<template>
  <div class="illustration-panel">
    <div class="contentFirst">
      <h1>Welcome to SnackUp!</h1>
      <p>{{subtitle || 'hhhh'}}</p>
      <img src="/images/body.png" alt="SnackUp Illustration" class="imgsub"/>
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  color: #fff;
  height: 100%;
}

.illustration-panel .contentFirst h1 {
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
}

.illustration-panel .contentFirst p {
  font-size: 18px;
  margin-bottom: 20px;
}

.illustration-panel .contentFirst img {
  max-width: 80%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}


/* Responsive */
@media (max-width: 768px) {
  .illustration-panel {
    display: none; /* Masqué sur mobile pour laisser place au formulaire */
  }
}
</style>
