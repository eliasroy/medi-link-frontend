<template>
  <div class="appointments-container">
    <div class="appointments-content">
      <div class="page-header">
        <button @click="$router.go(-1)" class="back-btn">
          ← Volver
        </button>
        <h1>Mis Citas</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando citas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <button @click="fetchAppointments" class="retry-btn">
          Reintentar
        </button>
      </div>

      <!-- Appointments Table -->
      <div v-else-if="appointments.length > 0" class="table-container">
        <table class="appointments-table">
          <thead>
            <tr>
              <th>ID Cita</th>
              <th>Estado</th>
              <th>Modalidad</th>
              <th>Fecha Registro</th>
              <th>Fecha Actualización</th>
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Estado Horario</th>
              <th>Médico ID</th>
              <th>Nro Colegiatura</th>
              <th>Años Experiencia</th>
              <th>Calificación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id_cita">
              <td>{{ appointment.id_cita }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(appointment.estado)">
                  {{ appointment.estado }}
                </span>
              </td>
              <td>{{ appointment.modalidad }}</td>
              <td>{{ formatDate(appointment.fecha_registro) }}</td>
              <td>{{ formatDate(appointment.fecha_actualizacion) }}</td>
              <td>{{ appointment.horario.titulo }}</td>
              <td>{{ appointment.horario.fecha }}</td>
              <td>{{ appointment.horario.hora_inicio }}</td>
              <td>{{ appointment.horario.hora_fin }}</td>
              <td>
                <span class="status-badge" :class="getScheduleStatusClass(appointment.horario.estado)">
                  {{ appointment.horario.estado }}
                </span>
              </td>
              <td>{{ appointment.horario.medico.id_medico }}</td>
              <td>{{ appointment.horario.medico.nro_colegiatura }}</td>
              <td>{{ appointment.horario.medico.anios_experiencia }}</td>
              <td>
                <span class="rating" :class="getRatingClass(appointment.horario.medico.calificacion_promedio)">
                  ⭐ {{ appointment.horario.medico.calificacion_promedio }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <p>No se encontraron citas.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/index.js'
import { apiService } from '../services/api.js'
import { decodeJWT } from '../utils/helpers.js'

const authStore = useAuthStore()
const appointments = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDIENTE': return 'pending'
    case 'CONFIRMADO': return 'confirmed'
    case 'CANCELADO': return 'cancelled'
    default: return 'default'
  }
}

const getScheduleStatusClass = (status) => {
  switch (status) {
    case 'DISPONIBLE': return 'available'
    case 'OCUPADO': return 'occupied'
    case 'CANCELADO': return 'cancelled'
    default: return 'default'
  }
}

const getRatingClass = (rating) => {
  const numRating = parseFloat(rating)
  if (numRating >= 9) return 'excellent'
  if (numRating >= 8) return 'good'
  if (numRating >= 7) return 'average'
  return 'poor'
}

const fetchAppointments = async () => {
  try {
    const token = authStore.token || localStorage.getItem('token')
    if (!token) {
      error.value = 'No authentication token found'
      return
    }
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.id) {
      error.value = 'Invalid token'
      return
    }
    const patientId = decoded.id
    const response = await apiService.getPatientAppointments(patientId)
    if (response.success) {
      appointments.value = response.data
    } else {
      error.value = 'Failed to fetch appointments'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.appointments-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #25ced1, #ffffff);
  padding: 2rem 1rem;
}

.appointments-content {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  position: relative;
  background: #f8f9fa;
  border-bottom: 2px solid #25ced1;
  padding: 1rem 2rem;
}

.back-btn {
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: #6c757d;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-50%) translateX(-2px);
}

.page-header h1 {
  text-align: center;
  color: #25ced1;
  margin: 0;
  font-size: 2rem;
}

.loading-state,
.error-state,
.no-results {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #25ced1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.retry-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  background: #28a745;
  color: #ffffff;
}

.retry-btn:hover {
  background: #218838;
}

.table-container {
  overflow-x: auto;
  padding: 2rem;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.appointments-table th,
.appointments-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.appointments-table th {
  background: #25ced1;
  color: #ffffff;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.appointments-table tr:nth-child(even) {
  background: #f8f9fa;
}

.appointments-table tr:hover {
  background: #e3f2fd;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.available {
  background: #cce5ff;
  color: #004085;
}

.status-badge.occupied {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.default {
  background: #e2e3e5;
  color: #383d41;
}

.rating {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.rating.excellent {
  background: #d4edda;
  color: #155724;
}

.rating.good {
  background: #cce5ff;
  color: #004085;
}

.rating.average {
  background: #fff3cd;
  color: #856404;
}

.rating.poor {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .appointments-table {
    font-size: 0.9rem;
  }

  .appointments-table th,
  .appointments-table td {
    padding: 0.5rem;
  }

  .table-container {
    padding: 1rem;
  }
}
</style>