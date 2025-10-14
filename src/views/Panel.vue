<template>
  <MainLayout>
    <div class="panel-container">
      <div class="panel-header">
        <h1>Bienvenido al Panel de Control</h1>
        <p>Selecciona una opción del menú lateral para continuar</p>
      </div>

      <div class="panel-content">
        <!-- Dashboard Section -->
        <div class="dashboard-section">
          <h2>Dashboard de Salud <span class="emoji">📊</span></h2>

          <!-- Dashboard Cards -->
          <div class="dashboard-grid">
            <div class="dashboard-card">
              <div class="card-header">
                <div class="card-icon">📅</div>
                <h3>Citas Programadas</h3>
              </div>
              <div class="card-value">{{ dashboardData.appointments }}</div>
              <div class="card-subtitle">Este mes</div>
            </div>

            <div class="dashboard-card">
              <div class="card-header">
                <div class="card-icon">👨‍⚕️</div>
                <h3>Médicos Visitados</h3>
              </div>
              <div class="card-value">{{ dashboardData.doctorsVisited }}</div>
              <div class="card-subtitle">Este año</div>
            </div>

            <div class="dashboard-card">
              <div class="card-header">
                <div class="card-icon">⭐</div>
                <h3>Calificación Promedio</h3>
              </div>
              <div class="card-value">{{ dashboardData.averageRating }}</div>
              <div class="card-subtitle">De tus citas</div>
            </div>

            <div class="dashboard-card">
              <div class="card-header">
                <div class="card-icon">💰</div>
                <h3>Ahorro Estimado</h3>
              </div>
              <div class="card-value">S/ {{ dashboardData.savings }}</div>
              <div class="card-subtitle">En consultas</div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-section">
            <div class="chart-container">
              <h3>Consultas por Mes</h3>
              <div class="chart-placeholder">
                <div class="bar-chart">
                  <div v-for="(value, index) in monthlyData" :key="index" class="bar" :style="{ '--target-height': value.height + '%' }">
                    <span class="bar-value">{{ value.count }}</span>
                  </div>
                </div>
                <div class="chart-labels">
                  <span v-for="(month, index) in ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']" :key="month">{{ month }}</span>
                </div>
              </div>
            </div>

            <div class="chart-container">
              <h3>Especialidades Más Consultadas</h3>
              <div class="chart-placeholder">
                <div class="pie-chart">
                  <div v-for="(specialty, index) in specialtyData" :key="index" class="pie-segment" :style="{ backgroundColor: specialty.color }">
                    <span class="pie-label">{{ specialty.name }}</span>
                    <span class="pie-value">{{ specialty.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/index.js'
import MainLayout from '../components/MainLayout.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const userRole = computed(() => authStore.user?.rol)

// Mock dashboard data
const dashboardData = ref({
  appointments: 12,
  doctorsVisited: 8,
  averageRating: 4.7,
  savings: 450
})

const monthlyData = ref([
  { count: 3, height: 30 },
  { count: 5, height: 50 },
  { count: 2, height: 20 },
  { count: 8, height: 80 },
  { count: 6, height: 60 },
  { count: 4, height: 40 }
])

const specialtyData = ref([
  { name: 'Medicina General', percentage: 35, color: '#25ced1' },
  { name: 'Cardiología', percentage: 20, color: '#ff6b6b' },
  { name: 'Dermatología', percentage: 15, color: '#4ecdc4' },
  { name: 'Oftalmología', percentage: 12, color: '#45b7d1' },
  { name: 'Otros', percentage: 18, color: '#f9ca24' }
])
</script>

<style scoped>
.panel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.panel-header {
  text-align: center;
  margin-bottom: 40px;
}

.panel-header h1 {
  color: #25ced1;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.panel-header p {
  color: #666;
  font-size: 1.1rem;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.dashboard-section {
  margin-bottom: 40px;
}

.dashboard-section h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 2px solid #f0f0f0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  animation: cardSlideIn 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.dashboard-card:nth-child(1) { animation-delay: 0.1s; }
.dashboard-card:nth-child(2) { animation-delay: 0.2s; }
.dashboard-card:nth-child(3) { animation-delay: 0.3s; }
.dashboard-card:nth-child(4) { animation-delay: 0.4s; }

.dashboard-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border-color: #25ced1;
}

@keyframes cardSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.card-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #25ced1;
  margin-bottom: 5px;
  animation: numberCount 2s ease-out forwards;
  opacity: 0;
}

@keyframes numberCount {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-subtitle {
  color: #666;
  font-size: 0.9rem;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.chart-container {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: chartFadeIn 0.8s ease-out forwards;
  opacity: 0;
  transform: scale(0.95);
}

.chart-container:nth-child(1) { animation-delay: 0.7s; }
.chart-container:nth-child(2) { animation-delay: 0.9s; }

.chart-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

@keyframes chartFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.chart-container h3 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 10px;
  position: relative;
}

.bar-chart {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 200px;
  width: 100%;
  padding: 20px;
}

.bar {
  width: 30px;
  background: linear-gradient(180deg, #25ced1, #1fa3a6);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: bottom;
  animation: barGrow 1s ease-out forwards;
  cursor: pointer;
}

.bar:hover {
  filter: brightness(1.2);
  transform: scaleY(1.05);
}

.bar:nth-child(1) { animation-delay: 0.1s; }
.bar:nth-child(2) { animation-delay: 0.2s; }
.bar:nth-child(3) { animation-delay: 0.3s; }
.bar:nth-child(4) { animation-delay: 0.4s; }
.bar:nth-child(5) { animation-delay: 0.5s; }
.bar:nth-child(6) { animation-delay: 0.6s; }

@keyframes barGrow {
  0% {
    height: 0%;
    opacity: 0;
    transform: scaleY(0);
  }
  50% {
    opacity: 1;
    transform: scaleY(1.1);
  }
  100% {
    height: var(--target-height);
    opacity: 1;
    transform: scaleY(1);
  }
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  padding: 10px 20px 0;
}

.chart-labels span {
  font-size: 0.8rem;
  color: #666;
}

.pie-chart {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 20px;
}

.pie-segment {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: pieFadeIn 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.pie-segment:nth-child(1) { animation-delay: 0.1s; }
.pie-segment:nth-child(2) { animation-delay: 0.2s; }
.pie-segment:nth-child(3) { animation-delay: 0.3s; }
.pie-segment:nth-child(4) { animation-delay: 0.4s; }
.pie-segment:nth-child(5) { animation-delay: 0.5s; }

.pie-segment:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

@keyframes pieFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.pie-label {
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.pie-value {
  font-size: 1.1rem;
}

.welcome-card {
  background: linear-gradient(135deg, #25ced1, #1fa3a6);
  color: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(37, 206, 209, 0.3);
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.welcome-card h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.welcome-card p {
  font-size: 1.1rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.user-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.user-info p {
  margin: 5px 0;
  font-size: 1rem;
}

.quick-actions h3 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #25ced1;
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.action-card h4 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.action-card p {
  color: #666;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .panel-header h1 {
    font-size: 2rem;
  }

  .welcome-card {
    padding: 30px 20px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>