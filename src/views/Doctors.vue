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

<style scoped>
.doctors-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #25ced1, #ffffff);
  padding: 2rem 1rem;
}

.doctors-content {
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

.filters-section {
  padding: 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.filter-input,
.filter-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #25ced1;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.clear-btn,
.search-btn,
.retry-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn {
  background: #6c757d;
  color: #ffffff;
}

.clear-btn:hover {
  background: #5a6268;
}

.search-btn {
  background: #25ced1;
  color: #ffffff;
}

.search-btn:hover:not(:disabled) {
  background: #1fa3a6;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.retry-btn {
  background: #28a745;
  color: #ffffff;
}

.retry-btn:hover {
  background: #218838;
}

.results-section {
  padding: 2rem;
}

.results-header {
  margin-bottom: 1.5rem;
}

.results-header h3 {
  margin: 0;
  color: #333;
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

.table-container {
  overflow-x: auto;
}

.doctors-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.doctors-table th,
.doctors-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.doctors-table th {
  background: #25ced1;
  color: #ffffff;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.doctors-table tr:nth-child(even) {
  background: #f8f9fa;
}

.doctors-table tr:hover {
  background: #e3f2fd;
}

.specialty-cell strong {
  display: block;
  color: #25ced1;
  margin-bottom: 0.25rem;
}

.specialty-cell small {
  color: #6c757d;
  font-size: 0.85rem;
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

.calendar-btn {
  background: #17a2b8;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  white-space: nowrap;
}

.calendar-btn:hover {
  background: #138496;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.calendar-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }

  .doctors-table {
    font-size: 0.9rem;
  }

  .doctors-table th,
  .doctors-table td {
    padding: 0.5rem;
  }
}
</style>