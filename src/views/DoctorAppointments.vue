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
              <th>Acciones</th>
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
              <td>
                <button v-if="appointment.estado === 'PENDIENTE'" @click="openAtenderModal(appointment)" class="atender-btn">Atender</button>
                <button v-if="appointment.estado === 'CONFIRMADA'" @click="openDetalleModal(appointment)" class="detalle-btn">Detalle</button>
              </td>
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

const gsap = window.gsap
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

  // GSAP animations
  gsap.utils.toArray('.back-btn, .atender-btn, .detalle-btn, .retry-btn, .cancel-btn, .submit-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
  })

  gsap.utils.toArray('textarea, select').forEach(input => {
    input.addEventListener('focus', () => gsap.to(input, { scale: 1.02, boxShadow: '0 0 10px rgba(37, 206, 209, 0.5)', duration: 0.3 }))
    input.addEventListener('blur', () => gsap.to(input, { scale: 1, boxShadow: 'none', duration: 0.3 }))
  })
})
</script>

<style src="../assets/doctorAppointments.css" scoped></style>