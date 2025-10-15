<template>
  <div class="loading-overlay">
    <div class="loading-spinner">
   
      <div class="spinner-ring"></div>
      <div class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    text: {
      type: String,
      default: 'Cargando...'
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(37, 206, 209, 0.3);
  border-top: 4px solid #25ced1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: 0.2s;
}

.spinner-ring:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #25ced1;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>