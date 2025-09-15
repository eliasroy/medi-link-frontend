<template>
  <div class="appointments-container">
    <div class="appointments-content">
      <div class="page-header">
        <button @click="$router.go(-1)" class="back-btn">
          ← Volver
        </button>
        <h1>Citas de Pacientes</h1>
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
              <th>Paciente Nombre</th>
              <th>Paciente Paterno</th>
              <th>Paciente Materno</th>
              <th>Estado</th>
              <th>Calificación</th>
              <th>Modalidad</th>
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id_cita">
              <td>{{ appointment.id_cita }}</td>
              <td>{{ appointment.paciente.usuario.nombre }}</td>
              <td>{{ appointment.paciente.usuario.paterno }}</td>
              <td>{{ appointment.paciente.usuario.materno }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(appointment.estado)">
                  {{ appointment.estado }}
                </span>
              </td>
              <td>
                <span class="rating" :class="getRatingClass(appointment.consulta?.calificacion)">
                  ⭐ {{ appointment.consulta?.calificacion || '0' }}
                </span>
              </td>
              <td>{{ appointment.modalidad }}</td>
              <td>{{ appointment.horario.titulo }}</td>
              <td>{{ appointment.horario.fecha }}</td>
              <td>{{ appointment.horario.hora_inicio }}</td>
              <td>{{ appointment.horario.hora_fin }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <p>No se encontraron citas.</p>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h3>{{ modalMode === 'atender' ? 'Iniciar Consulta' : 'Detalle de Consulta' }}</h3>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="motivo">Motivo de la consulta:</label>
              <textarea id="motivo" v-model="consultaData.motivo" :required="modalMode === 'atender'" placeholder="Ingrese el motivo de la consulta"></textarea>
            </div>
            <div v-if="modalMode === 'detalle'" class="form-group">
              <label for="diagnostico">Diagnóstico:</label>
              <textarea id="diagnostico" v-model="consultaData.diagnostico" placeholder="Ingrese el diagnóstico"></textarea>
            </div>
            <div v-if="modalMode === 'detalle'" class="form-group">
              <label for="pathArchivo">Path Archivo:</label>
              <input type="text" id="pathArchivo" v-model="consultaData.pathArchivo" placeholder="Ingrese el path del archivo">
            </div>
            <div v-if="modalMode === 'detalle'" class="form-group">
              <label for="tratamiento">Tratamiento:</label>
              <textarea id="tratamiento" v-model="consultaData.tratamiento" placeholder="Ingrese el tratamiento"></textarea>
            </div>
            <div v-if="modalMode === 'detalle'" class="form-group">
              <label for="observaciones">Observaciones:</label>
              <textarea id="observaciones" v-model="consultaData.observaciones" placeholder="Ingrese las observaciones"></textarea>
            </div>
            <div v-if="modalMode === 'detalle'" class="form-group">
              <label for="estado">Estado:</label>
              <select id="estado" v-model="consultaData.estado">
                <option value="">Seleccionar estado</option>
                <option v-if="selectedAppointment?.modalidad === 'PRESENCIAL'" value="DIAGNOSTICADA">Diagnosticada</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-btn">Cancelar</button>
              <button type="submit" class="submit-btn">{{ modalMode === 'atender' ? 'Iniciar Consulta' : 'Actualizar' }}</button>
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
const showModal = ref(false)
const modalMode = ref('') // 'atender' or 'detalle'
const selectedAppointment = ref(null)
const consultaData = ref({
  id_consulta: null,
  motivo: '',
  diagnostico: '',
  pathArchivo: '',
  tratamiento: '',
  observaciones: '',
  estado: ''
})

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

const getRatingClass = (rating) => {
  if (!rating) return 'default'
  const numRating = parseFloat(rating)
  if (numRating >= 5) return 'excellent'
  if (numRating >= 3) return 'good'
  if (numRating >= 1) return 'average'
  return 'poor'
}

const getStars = (rating) => {
  if (!rating) return 'N/A'
  const num = parseInt(rating)
  return '⭐'.repeat(num)
}

const getScheduleStatusClass = (status) => {
  switch (status) {
    case 'DISPONIBLE': return 'available'
    case 'OCUPADO': return 'occupied'
    case 'CANCELADO': return 'cancelled'
    default: return 'default'
  }
}

const fetchAppointments = async () => {
  try {
    const response = await apiService.getDoctorAppointments()
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

const openAtenderModal = (appointment) => {
  selectedAppointment.value = appointment
  modalMode.value = 'atender'
  consultaData.value = {
    id_consulta: null,
    motivo: '',
    diagnostico: '',
    pathArchivo: '',
    tratamiento: '',
    observaciones: ''
  }
  showModal.value = true
}

const openDetalleModal = async (appointment) => {
  selectedAppointment.value = appointment
  modalMode.value = 'detalle'

  try {
    const response = await apiService.getConsultaByCita(appointment.id_cita)
    if (response.success && response.data) {
      consultaData.value = {
        id_consulta: response.data.id_consulta,
        motivo: response.data.motivo || '',
        diagnostico: response.data.diagnostico || '',
        pathArchivo: response.data.pathArchivo || '',
        tratamiento: response.data.tratamiento || '',
        observaciones: response.data.observaciones || '',
        estado: response.data.estado || ''
      }
    } else {
      // No consulta exists, initialize empty
      consultaData.value = {
        id_consulta: null,
        motivo: '',
        diagnostico: '',
        pathArchivo: '',
        tratamiento: '',
        observaciones: '',
        estado: ''
      }
    }
  } catch (err) {
    alert('Error al cargar detalles: ' + err.message)
    return
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedAppointment.value = null
  modalMode.value = ''
  consultaData.value = {
    id_consulta: null,
    motivo: '',
    diagnostico: '',
    pathArchivo: '',
    tratamiento: '',
    observaciones: '',
    estado: ''
  }
}

const submitForm = async () => {
  if (modalMode.value === 'atender') {
    if (!consultaData.value.motivo.trim()) return

    try {
      const response = await apiService.iniciarConsulta({
        id_cita: selectedAppointment.value.id_cita,
        motivo: consultaData.value.motivo.trim()
      })
      if (response.success) {
        alert('Consulta iniciada exitosamente')
        closeModal()
        await fetchAppointments()
      } else {
        alert('Error al iniciar la consulta')
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  } else if (modalMode.value === 'detalle') {
    if (!consultaData.value.id_consulta) return

    try {
      const updateData = {
        diagnostico: consultaData.value.diagnostico,
        pathArchivo: consultaData.value.pathArchivo,
        tratamiento: consultaData.value.tratamiento,
        observaciones: consultaData.value.observaciones,
        estado: consultaData.value.estado
      }
      const response = await apiService.updateConsulta(consultaData.value.id_consulta, updateData)
      if (response.success) {
        alert('Consulta actualizada exitosamente')
        closeModal()
      } else {
        alert('Error al actualizar la consulta')
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
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

.atender-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  background: #007bff;
  color: #ffffff;
}

.atender-btn:hover {
  background: #0056b3;
}

.detalle-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  background: #17a2b8;
  color: #ffffff;
  margin-left: 0.5rem;
}

.detalle-btn:hover {
  background: #138496;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #25ced1;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.75rem 2rem;
  border: 1px solid #6c757d;
  background: #ffffff;
  color: #6c757d;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #f8f9fa;
}

.submit-btn {
  padding: 0.75rem 2rem;
  border: none;
  background: #28a745;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #218838;
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