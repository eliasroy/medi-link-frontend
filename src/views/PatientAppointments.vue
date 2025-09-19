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
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Médico</th>
              <th>Calificación</th>
              <th>Accion</th>
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
              <td>{{ appointment.horario.titulo }}</td>
              <td>{{ appointment.horario.fecha }}</td>
              <td>{{ appointment.horario.hora_inicio }}</td>
              <td>{{ appointment.horario.hora_fin }}</td>
              <td>{{ appointment.horario?.medico?.usuario?.nombre }} {{ appointment.horario?.medico?.usuario?.paterno }}</td>
              <td>
                <span class="rating" :class="getRatingClass(appointment.horario?.medico?.calificacion_promedio)">
                  ⭐ {{ appointment.consulta?.calificacion || '0' }}
                </span>
              </td>
              <td>
                <button v-if="appointment.estado !== 'ATENDIDA' && appointment.estado !== 'CANCELADA'" @click="deleteAppointment(appointment.id_cita)" class="delete-btn">Eliminar</button>
                <button v-if="appointment.estado === 'ATENDIDA'" @click="openCalificarModal(appointment)" class="calificar-btn">Calificar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <p>No se encontraron citas.</p>
      </div>

      <!-- Calificar Modal -->
      <div v-if="showCalificarModal" class="modal-overlay" @click="closeCalificarModal">
        <div class="modal-content" @click.stop>
          <h3>Calificar Consulta</h3>
          <form @submit.prevent="submitCalificar">
            <div class="form-group">
              <label for="calificacion">Calificación:</label>
              <select id="calificacion" v-model="calificacion" required>
                <option value="">Seleccionar calificación</option>
                <option value="1">1 - Muy malo</option>
                <option value="2">2 - Malo</option>
                <option value="3">3 - Regular</option>
                <option value="4">4 - Bueno</option>
                <option value="5">5 - Excelente</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeCalificarModal" class="cancel-btn">Cancelar</button>
              <button type="submit" class="submit-btn">Calificar</button>
            </div>
          </form>
        </div>
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
const showCalificarModal = ref(false)
const selectedAppointment = ref(null)
const calificacion = ref('')

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

const deleteAppointment = async (appointmentId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
    return
  }
  try {
    const response = await apiService.deleteCita(appointmentId)
    if (response.success || response.mensaje) {
      // Refresh the list
      await fetchAppointments()
    } else {
      error.value = 'Failed to delete appointment'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while deleting'
  }
}

const openCalificarModal = (appointment) => {
  selectedAppointment.value = appointment
  calificacion.value = ''
  showCalificarModal.value = true
}

const closeCalificarModal = () => {
  showCalificarModal.value = false
  selectedAppointment.value = null
  calificacion.value = ''
}

const submitCalificar = async () => {
  if (!calificacion.value) return

  try {
    // Get consulta by cita id
    const consultaResponse = await apiService.getConsultaByCita(selectedAppointment.value.id_cita)
    if (!consultaResponse.success || !consultaResponse.data) {
      alert('No se encontró la consulta para calificar')
      return
    }

    const idConsulta = consultaResponse.data.id_consulta

    const response = await apiService.calificarConsulta({
      id_consulta: idConsulta,
      calificacion: parseInt(calificacion.value)
    })

    if (response.success) {
      alert('Consulta calificada exitosamente')
      closeCalificarModal()
      await fetchAppointments()
    } else {
      alert('Error al calificar la consulta')
    }
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style src="../assets/patientAppointments.css" scoped></style>