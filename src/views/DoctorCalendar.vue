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

const gsap = window.gsap

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

      // GSAP animations
      gsap.from('.vuecal', { opacity: 0, y: 20, duration: 1, ease: 'power2.out' })

      gsap.utils.toArray('.back-btn, .create-btn, .book-btn, .cancel-btn, .save-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
      })

      gsap.utils.toArray('.filter-select').forEach(select => {
        select.addEventListener('focus', () => gsap.to(select, { scale: 1.02, boxShadow: '0 0 10px rgba(37, 206, 209, 0.5)', duration: 0.3 }))
        select.addEventListener('blur', () => gsap.to(select, { scale: 1, boxShadow: 'none', duration: 0.3 }))
      })

      // Modal inputs
      gsap.utils.toArray('input[type="date"], input[type="time"], select').forEach(input => {
        input.addEventListener('focus', () => gsap.to(input, { scale: 1.02, boxShadow: '0 0 10px rgba(37, 206, 209, 0.5)', duration: 0.3 }))
        input.addEventListener('blur', () => gsap.to(input, { scale: 1, boxShadow: 'none', duration: 0.3 }))
      })
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

<style src="../assets/doctorCalendar.css" scoped></style>