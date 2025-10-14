<template>
  <MainLayout>
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
          <h3>Resultados ({{ totalDoctors }} médicos)</h3>
          <div class="pagination-controls">
            <label for="pageSize">Mostrar:</label>
            <select id="pageSize" v-model="pageSize" @change="handlePageSizeChange" class="page-size-select">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <div class="pagination-info">
              Mostrando {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalDoctors) }} de {{ totalDoctors }}
            </div>
          </div>
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
        <div v-else-if="paginatedDoctors.length > 0" class="table-container">
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
              <tr v-for="doctor in paginatedDoctors" :key="doctor.id_medico">
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

          <!-- Pagination -->
          <div class="pagination">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              ‹ Anterior
            </button>

            <div class="page-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="['page-number', { active: page === currentPage }]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Siguiente ›
            </button>
          </div>
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
  </MainLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/api.js'
import MainLayout from '../components/MainLayout.vue'
import debounce from 'lodash.debounce'

const gsap = window.gsap

export default {
  name: 'Doctors',
  components: {
    MainLayout
  },
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

    // Pagination
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalDoctors = ref(0)

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
        totalDoctors.value = data.length
        currentPage.value = 1 // Reset to first page when loading new data
      } catch (err) {
        error.value = err.message || 'Error al cargar la lista de médicos'
        doctors.value = []
        totalDoctors.value = 0
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

    // Pagination computed properties
    const totalPages = computed(() => Math.ceil(totalDoctors.value / pageSize.value))

    const paginatedDoctors = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return doctors.value.slice(start, end)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }

      return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
    })

    // Pagination methods
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const handlePageSizeChange = () => {
      currentPage.value = 1 // Reset to first page when changing page size
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

      // GSAP animations
      gsap.utils.toArray('.filter-input, .filter-select').forEach(input => {
        input.addEventListener('focus', () => gsap.to(input, { scale: 1.02, boxShadow: '0 0 10px rgba(37, 206, 209, 0.5)', duration: 0.3 }))
        input.addEventListener('blur', () => gsap.to(input, { scale: 1, boxShadow: 'none', duration: 0.3 }))
      })

      gsap.utils.toArray('.clear-btn, .search-btn, .calendar-btn, .retry-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
      })
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
      router,
      // Pagination
      currentPage,
      pageSize,
      totalDoctors,
      totalPages,
      paginatedDoctors,
      visiblePages,
      goToPage,
      handlePageSizeChange
    }
  }
}
</script>

<style src="../assets/doctors.css" scoped></style>

<style scoped>
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-size-select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 20px 0;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #25ced1;
  color: white;
  border-color: #25ced1;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
  text-align: center;
}

.page-number:hover {
  background: #f5f5f5;
}

.page-number.active {
  background: #25ced1;
  color: white;
  border-color: #25ced1;
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .pagination-controls {
    flex-wrap: wrap;
    gap: 10px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: 1;
    width: 100%;
    justify-content: center;
  }

  .pagination-btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>