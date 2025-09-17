<template>
  <div class="calendar-container">
    <div class="calendar-content">
      <header class="calendar-header">
        <button @click="goBack" class="back-btn">
          ← Volver a Médicos
        </button>
        <h1>Calendario de Citas</h1>
        <div class="doctor-info">
          <h2>{{ doctorName }}</h2>
          <p>ID: {{ doctorId }}</p>
          <button v-if="userRole === 'MEDICO'" @click="openCreateModal" class="create-btn">
            Crear Horario
          </button>
        </div>
      </header>

      <!-- Filters Section -->
      <div class="filters-section">
        <h3>Filtros de Citas</h3>
        <div class="filters-grid">
          <div class="filter-group">
            <label for="estado">Estado:</label>
            <select
              id="estado"
              v-model="filters.estado"
              class="filter-select"
              @change="handleFilterChange"
            >
              <option value="">Todos</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="OCUPADO">Ocupado</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="modalidad">Modalidad:</label>
            <select
              id="modalidad"
              v-model="filters.modalidad"
              class="filter-select"
              @change="handleFilterChange"
            >
              <option value="">Todos</option>
              <option value="VIRTUAL">Virtual</option>
              <option value="PRESENCIAL">Presencial</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Vue Cal Calendar -->
      <VueCal
        :events="events"
        :time="true"
        :active-view="'week'"
        :disable-views="['years', 'year', 'month', 'day']"
        :hide-view-selector="true"
        :time-format="'HH:mm'"
        :time-from="8 * 60"
        :time-to="18 * 60"
        :time-step="60"
        @event-click="onEventClick"
        @view-change="handleViewChange"
        style="height: 600px;"
      ></VueCal>

      <!-- Selected Appointment -->
      <div v-if="selectedSlot && userRole !== 'MEDICO'" class="appointment-section">
        <h3>Cita Seleccionada</h3>
        <div class="appointment-details">
          <p><strong>Fecha:</strong> {{ selectedSlot.date }}</p>
          <p><strong>Hora Inicio:</strong> {{ selectedSlot.time }}</p>
          <p><strong>Hora Fin:</strong> {{ selectedSlot.endTime }}</p>
          <p><strong>Médico:</strong> {{ doctorName }}</p>
        </div>
        <div v-if="selectedSlot.estado === 'DISPONIBLE'" class="appointment-actions">
          <button @click="bookAppointment" class="book-btn">
            Reservar Cita
          </button>
          <button @click="cancelSelection" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="message" :class="{ 'success': message.type === 'success', 'error': message.type === 'error' }">
        {{ message.text }}
      </div>

      <!-- Create Horario Modal -->
      <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
        <div class="modal-content" @click.stop>
          <h3>Crear Nuevo Horario</h3>
          <form @submit.prevent="saveHorario">
            <div class="form-group">
              <label for="fecha">Fecha:</label>
              <input type="date" id="fecha" v-model="formData.fecha" required />
            </div>
            <div class="form-group">
              <label for="hora_inicio">Hora Inicio:</label>
              <input type="time" id="hora_inicio" v-model="formData.hora_inicio" required />
            </div>
            <div class="form-group">
              <label for="hora_fin">Hora Fin:</label>
              <input type="time" id="hora_fin" v-model="formData.hora_fin" required />
            </div>
            <div class="form-group">
              <label for="modalidad">Modalidad:</label>
              <select id="modalidad" v-model="formData.modalidad" required>
                <option value="VIRTUAL">Virtual</option>
                <option value="PRESENCIAL">Presencial</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="save-btn">Guardar</button>
              <button type="button" @click="closeCreateModal" class="cancel-btn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '../services/api.js'
import { useAuthStore } from '../stores/index.js'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  name: 'DoctorCalendar',
  components: {
    VueCal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const userRole = computed(() => authStore.user?.rol)

    const doctorId = ref(route.params.doctorId)
    const doctorName = ref('Médico')
    const selectedSlot = ref(null)
    const message = ref(null)
    const events = ref([])
    const filters = ref({
      estado: '',
      modalidad: ''
    })
    const currentView = ref(null)
    const showCreateModal = ref(false)
    const formData = reactive({
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      modalidad: 'VIRTUAL'
    })

    const loadDoctorInfo = async () => {
      try {
        const doctors = await apiService.getDoctors({ id_medico: doctorId.value })
        if (doctors && doctors.length > 0) {
          const doctor = doctors[0]
          doctorName.value = `${doctor.nombre} ${doctor.paterno} ${doctor.materno}`
        }
      } catch (error) {
        console.error('Error loading doctor info:', error)
      }
    }

    const loadAvailableSlots = async (fechaInicio = null, fechaFin = null) => {
      try {
        let response

        if (fechaInicio && fechaFin) {
          console.log('Loading slots for doctor:', doctorId.value, 'date range:', fechaInicio, 'to', fechaFin, 'with filters:', filters.value)
          response = await apiService.getDoctorSlotsByDateRange(doctorId.value, fechaInicio, fechaFin, filters.value)
        } else {
          console.log('Loading slots for doctor:', doctorId.value, 'with filters:', filters.value)
          response = await apiService.getDoctorAvailableSlots(doctorId.value, filters.value)
        }

        console.log('API response:', response)
        if (response.success && response.data && response.data.length > 0) {
          events.value = response.data.map(slot => ({
            start: `${slot.fecha} ${slot.hora_inicio.substring(0, 5)}`,
            end: `${slot.fecha} ${slot.hora_fin.substring(0, 5)}`,
            title: slot.titulo,
            content: `Estado: ${slot.estado} <br> Modalidad: ${slot.modalidad}`,
            class: slot.estado === 'DISPONIBLE' ? 'available-slot' : 'occupied-slot',
            id: slot.id_horario,
            modalidad: slot.modalidad
          }))
          console.log('Mapped events:', events.value)
        } else {
          console.log('No data from API, using mock data')
          // Mock data for testing - generate for the requested date range
          const mockEvents = []
          const startDate = fechaInicio ? new Date(fechaInicio) : new Date()
          const endDate = fechaFin ? new Date(fechaFin) : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)

          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + i)
            const dateStr = currentDate.toISOString().split('T')[0]

           
          }
          events.value = mockEvents
        }
      } catch (error) {
        console.error('Error loading available slots:', error)
        // Fallback to mock data
        events.value = [
          {
            start: '2025-09-15 10:00',
            end: '2025-09-15 11:00',
            title: 'Consulta dermatología',
            content: 'Especialidad: Medicina de Emergencias<br>Médico: CMP0002',
            class: 'available-slot',
            id: 1,
            modalidad: 'VIRTUAL'
          }
        ]
      }
    }

    const onEventClick = (event) => {
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)
      const date = startDate.toISOString().split('T')[0]
      const time = startDate.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
      const endTime = endDate.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
      const estado = event.class === 'available-slot' ? 'DISPONIBLE' : 'OCUPADO'
      selectedSlot.value = {
        date,
        time,
        endTime,
        id: event.id,
        estado,
        modalidad: event.modalidad
      }
      message.value = null
    }

    const handleFilterChange = () => {
      console.log('Filters changed, loading available slots for current week')
      loadAvailableSlots()
    }

    const handleViewChange = (view) => {
      currentView.value = view
      console.log('View changed:', view)
      if (view.view === 'week') {
        // Calculate the start and end dates of the current week
        const startDate = new Date(view.startDate)
        const endDate = new Date(view.endDate)

        // Format dates as YYYY-MM-DD
        const fechaInicio = startDate.toISOString().split('T')[0]
        const fechaFin = endDate.toISOString().split('T')[0]

        console.log('Loading data for date range:', fechaInicio, 'to', fechaFin)
        loadAvailableSlots(fechaInicio, fechaFin)
      }
    }

    const bookAppointment = () => {
      if (!selectedSlot.value) return

      // Redirect to appointment form with slot data
      router.push({
        name: 'AppointmentForm',
        query: {
          idMedico: doctorId.value,
          idHorario: selectedSlot.value.id,
          fecha: selectedSlot.value.date,
          hora_inicio: selectedSlot.value.time + ':00', // Add seconds
          hora_fin: selectedSlot.value.endTime + ':00',
          modalidad: selectedSlot.value.modalidad || 'VIRTUAL'
        }
      })
    }

    const cancelSelection = () => {
      selectedSlot.value = null
      message.value = null
    }

    const goBack = () => {
      if (userRole.value === 'MEDICO') {
        router.push('/')
      } else {
        router.push('/doctors')
      }
    }

    const openCreateModal = () => {
      showCreateModal.value = true
    }

    const closeCreateModal = () => {
      showCreateModal.value = false
      formData.fecha = ''
      formData.hora_inicio = ''
      formData.hora_fin = ''
      formData.modalidad = 'VIRTUAL'
    }

    const saveHorario = async () => {
      try {
        const data = {
          id_medico: doctorId.value,
          ...formData
        }
        await apiService.saveHorario(data)
        message.value = { text: 'Horario creado exitosamente', type: 'success' }
        closeCreateModal()
        // Reload current view
        if (currentView.value) {
          handleViewChange(currentView.value)
        } else {
          loadAvailableSlots()
        }
      } catch (error) {
        message.value = { text: 'Error al crear horario: ' + error.message, type: 'error' }
      }
    }

    onMounted(async () => {
      await loadDoctorInfo()

      // Calculate dates for the current week starting from today
      const now = new Date()
      const startOfWeek = new Date(now)
      const endOfWeek = new Date(now)
      endOfWeek.setDate(now.getDate() + 7)

      const fechaInicio = startOfWeek.toISOString().split('T')[0]
      const fechaFin = endOfWeek.toISOString().split('T')[0]

      console.log('Loading initial data for date range:', fechaInicio, 'to', fechaFin)
      loadAvailableSlots(fechaInicio, fechaFin)
    })

    return {
      doctorId,
      doctorName,
      selectedSlot,
      message,
      events,
      filters,
      userRole,
      onEventClick,
      handleFilterChange,
      handleViewChange,
      bookAppointment,
      cancelSelection,
      goBack,
      showCreateModal,
      formData,
      openCreateModal,
      closeCreateModal,
      saveHorario
    }
  }
}
</script>

<style scoped>
.calendar-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #25ced1, #ffffff);
  padding: 2rem 1rem;
}

.calendar-content {
  max-width: 1400px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  padding: 2rem;
  background: #f8f9fa;
  border-bottom: 2px solid #25ced1;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.back-btn {
  background: #6c757d;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #5a6268;
}

.doctor-info h2 {
  margin: 0 0 0.5rem 0;
  color: #25ced1;
}

.doctor-info p {
  margin: 0;
  color: #666;
}

.filters-section {
  padding: 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.filters-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #25ced1;
}

.date-navigation {
  padding: 1.5rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  background: #25ced1;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: #1fa3a6;
}

.calendar-grid {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  border-top: 1px solid #dee2e6;
}

.time-column,
.day-column {
  border-right: 1px solid #dee2e6;
}

.time-header,
.day-header {
  padding: 1rem;
  background: #25ced1;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.day-name {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 0.8rem;
  opacity: 0.9;
}

.time-slot,
.time-slot-cell {
  height: 60px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
}

.time-slot {
  background: #f8f9fa;
  font-weight: 500;
  cursor: default;
}

.time-slot-cell.available {
  background: #d4edda;
  color: #155724;
}

.time-slot-cell.available:hover {
  background: #c3e6cb;
}

.time-slot-cell.unavailable {
  background: #f8d7da;
  color: #721c24;
  cursor: not-allowed;
}

.available-text,
.unavailable-text {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Vue Cal custom event styles */
:deep(.available-slot) {
  background: #28a745 !important;
  color: #ffffff !important;
  border: 1px solid #28a745 !important;
}

:deep(.occupied-slot) {
  background: #dc3545 !important;
  color: #ffffff !important;
  border: 1px solid #dc3545 !important;
}

.appointment-section {
  padding: 2rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.appointment-details {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #dee2e6;
}

.appointment-details p {
  margin: 0.5rem 0;
  color: #333;
}

.appointment-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.book-btn,
.cancel-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.book-btn {
  background: #28a745;
  color: #ffffff;
}

.book-btn:hover:not(:disabled) {
  background: #218838;
}

.book-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: #ffffff;
}

.cancel-btn:hover {
  background: #5a6268;
}

.message {
  padding: 1rem;
  margin: 1rem 2rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.create-btn {
  background: #25ced1;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.create-btn:hover {
  background: #1fa3a6;
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
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  margin: 1rem;
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
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.save-btn,
.cancel-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.save-btn {
  background: #28a745;
  color: #ffffff;
}

.save-btn:hover {
  background: #218838;
}

.cancel-btn {
  background: #6c757d;
  color: #ffffff;
}

.cancel-btn:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .date-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .calendar-grid {
    grid-template-columns: 80px repeat(7, 1fr);
    font-size: 0.8rem;
  }

  .time-slot,
  .time-slot-cell {
    height: 50px;
    font-size: 0.8rem;
  }

  .appointment-actions {
    flex-direction: column;
  }
}
</style>