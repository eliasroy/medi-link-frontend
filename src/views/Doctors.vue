<template>
  <div class="doctors-container">
    <div class="doctors-content">
      <div class="page-header">
        <button @click="$router.go(-1)" class="back-btn">
          ← Volver
        </button>
        <h1>Lista de Médicos</h1>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <h3>Filtros de Búsqueda</h3>
        <div class="filters-grid">
          <div class="filter-group">
            <label for="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              v-model="filters.nombre"
              placeholder="Buscar por nombre..."
              class="filter-input"
              @input="debouncedSearch"
            />
          </div>

          <div class="filter-group">
            <label for="paterno">Apellido Paterno:</label>
            <input
              type="text"
              id="paterno"
              v-model="filters.paterno"
              placeholder="Buscar por apellido..."
              class="filter-input"
              @input="debouncedSearch"
            />
          </div>

          <div class="filter-group">
            <label for="especialidad">Especialidad:</label>
            <select
              id="especialidad"
              v-model="filters.id_especialidad"
              class="filter-select"
              @change="handleFilterChange"
            >
              <option value="">Todas las especialidades</option>
              <option
                v-for="specialty in specialties"
                :key="specialty.id_especialidad"
                :value="specialty.id_especialidad"
              >
                {{ specialty.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="calificacion">Calificación Mínima:</label>
            <input
              type="number"
              id="calificacion"
              v-model="filters.calificacion_promedio"
              placeholder="Ej: 9"
              min="0"
              max="10"
              step="0.1"
              class="filter-input"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <div class="filter-actions">
          <button @click="clearFilters" class="clear-btn">
            Limpiar Filtros
          </button>
          <button @click="applyFilters" class="search-btn" :disabled="loading">
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <div class="results-header">
          <h3>Resultados ({{ doctors.length }} médicos)</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando médicos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="loadDoctors" class="retry-btn">
            Reintentar
          </button>
        </div>

        <!-- Doctors Table -->
        <div v-else-if="doctors.length > 0" class="table-container">
          <table class="doctors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Colegiatura</th>
                <th>Especialidad</th>
                <th>Experiencia</th>
                <th>Calificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doctor in doctors" :key="doctor.id_medico">
                <td>{{ doctor.id_medico }}</td>
                <td>{{ doctor.nombre }} {{ doctor.paterno }} {{ doctor.materno }}</td>
                <td>{{ doctor.nro_colegiatura }}</td>
                <td>
                  <div class="specialty-cell">
                    <strong>{{ doctor.especialidad }}</strong>
                    <small>{{ doctor.especialidad_descripcion }}</small>
                  </div>
                </td>
                <td>{{ doctor.anios_experiencia }} años</td>
                <td>
                  <span class="rating" :class="getRatingClass(doctor.calificacion_promedio)">
                    ⭐ {{ doctor.calificacion_promedio }}
                  </span>
                </td>
                <td>
                  <button
                    @click="viewCalendar(doctor)"
                    class="calendar-btn"
                    title="Ver calendario de citas disponibles"
                  >
                    📅 Agendar Cita
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
          <p>No se encontraron médicos con los criterios de búsqueda.</p>
          <button @click="clearFilters" class="retry-btn">
            Limpiar filtros e intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/api.js'
import debounce from 'lodash.debounce'

export default {
  name: 'Doctors',
  setup() {
    const router = useRouter()
    const doctors = ref([])
    const specialties = ref([])
    const loading = ref(false)
    const error = ref('')
    const filters = ref({
      nombre: '',
      paterno: '',
      id_especialidad: '',
      calificacion_promedio: ''
    })

    // Debounced search function
    const debouncedSearch = debounce(() => {
      applyFilters()
    }, 500)

    const loadSpecialties = async () => {
      try {
        const response = await apiService.getSpecialties()
        specialties.value = response.data || response
      } catch (err) {
        console.error('Error loading specialties:', err)
      }
    }

    const loadDoctors = async () => {
      loading.value = true
      error.value = ''
      try {
        const activeFilters = {}
        Object.keys(filters.value).forEach(key => {
          if (filters.value[key] !== '' && filters.value[key] !== null && filters.value[key] !== undefined) {
            activeFilters[key] = filters.value[key]
          }
        })

        const data = await apiService.getDoctors(activeFilters)
        doctors.value = data
      } catch (err) {
        error.value = err.message || 'Error al cargar la lista de médicos'
        doctors.value = []
      } finally {
        loading.value = false
      }
    }

    const applyFilters = () => {
      loadDoctors()
    }

    const handleFilterChange = () => {
      applyFilters()
    }

    const clearFilters = () => {
      filters.value = {
        nombre: '',
        paterno: '',
        id_especialidad: '',
        calificacion_promedio: ''
      }
      loadDoctors()
    }

    const getRatingClass = (rating) => {
      const numRating = parseFloat(rating)
      if (numRating >= 9) return 'excellent'
      if (numRating >= 8) return 'good'
      if (numRating >= 7) return 'average'
      return 'poor'
    }

    const viewCalendar = (doctor) => {
      // Navigate to calendar view with doctor information
      router.push({
        name: 'DoctorCalendar',
        params: { doctorId: doctor.id_medico },
        query: { doctorName: `${doctor.nombre} ${doctor.paterno} ${doctor.materno}` }
      })
    }

    onMounted(() => {
      loadSpecialties()
      loadDoctors()
    })

    return {
      doctors,
      specialties,
      loading,
      error,
      filters,
      debouncedSearch,
      loadDoctors,
      applyFilters,
      handleFilterChange,
      clearFilters,
      getRatingClass,
      viewCalendar,
      router
    }
  }
}
</script>

<style src="../assets/doctors.css" scoped></style>