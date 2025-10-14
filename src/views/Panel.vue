<template>
  <MainLayout>
    <div class="panel-container">
      <div class="panel-header">
        <h1>Bienvenido al Panel de Control</h1>
        <p>Selecciona una opción del menú lateral para continuar</p>
      </div>

      <div class="panel-content">
        <div class="welcome-card">
          <div class="welcome-icon">🏥</div>
          <h2>MediLink Panel</h2>
          <p>Tu centro de control para gestionar citas médicas y acceder a servicios de salud.</p>
          <div class="user-info" v-if="user">
            <p><strong>Usuario:</strong> {{ user.nombre }} {{ user.paterno }}</p>
            <p><strong>Rol:</strong> {{ user.rol }}</p>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Acciones Rápidas</h3>
          <div class="actions-grid">
            <div v-if="userRole !== 'MEDICO'" class="action-card" @click="$router.push('/doctors')">
              <div class="action-icon">👨‍⚕️</div>
              <h4>Buscar Médicos</h4>
              <p>Encuentra y agenda con especialistas</p>
            </div>

            <div v-if="userRole !== 'MEDICO'" class="action-card" @click="$router.push('/patient-appointments')">
              <div class="action-icon">📅</div>
              <h4>Mis Citas</h4>
              <p>Ve y gestiona tus citas programadas</p>
            </div>

            <div v-if="userRole === 'MEDICO'" class="action-card" @click="$router.push(`/doctor/${user?.id}/calendar`)">
              <div class="action-icon">🗓️</div>
              <h4>Mi Calendario</h4>
              <p>Revisa tu calendario de citas disponibles</p>
            </div>

            <div v-if="userRole === 'MEDICO'" class="action-card" @click="$router.push('/doctor-appointments')">
              <div class="action-icon">📋</div>
              <h4>Gestionar Citas</h4>
              <p>Administra las citas de tus pacientes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/index.js'
import MainLayout from '../components/MainLayout.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const userRole = computed(() => authStore.user?.rol)
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