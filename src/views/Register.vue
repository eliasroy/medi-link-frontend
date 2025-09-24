<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Registro de Usuario</h2>

      <!-- User Type Selection -->
      <div class="user-type-selection">
        <button
          @click="userType = 'medico'"
          :class="['type-btn', { active: userType === 'medico' }]"
        >
          Médico
        </button>
        <button
          @click="userType = 'paciente'"
          :class="['type-btn', { active: userType === 'paciente' }]"
        >
          Paciente
        </button>
      </div>

      <!-- Medico Registration Form -->
      <form v-if="userType === 'medico'" @submit.prevent="handleRegisterMedico" class="form">
        <h3>Registro de Médico</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="medico-nombre">Nombre:</label>
            <input
              type="text"
              id="medico-nombre"
              v-model="medicoForm.nombre"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="medico-paterno">Apellido Paterno:</label>
            <input
              type="text"
              id="medico-paterno"
              v-model="medicoForm.paterno"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="medico-materno">Apellido Materno:</label>
            <input
              type="text"
              id="medico-materno"
              v-model="medicoForm.materno"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="medico-email">Email:</label>
            <input
              type="email"
              id="medico-email"
              v-model="medicoForm.email"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="medico-password">Contraseña:</label>
            <input
              type="password"
              id="medico-password"
              v-model="medicoForm.password"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="medico-telefono">Teléfono:</label>
            <input
              type="tel"
              id="medico-telefono"
              v-model="medicoForm.telefono"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="medico-colegiatura">Nro. Colegiatura:</label>
            <input
              type="text"
              id="medico-colegiatura"
              v-model="medicoForm.nro_colegiatura"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="medico-experiencia">Años de Experiencia:</label>
            <input
              type="number"
              id="medico-experiencia"
              v-model="medicoForm.anios_experiencia"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label for="medico-especialidad">Especialidad:</label>
          <select
            id="medico-especialidad"
            v-model="medicoForm.id_especialidad"
            required
            class="form-input"
          >
            <option value="">Seleccionar Especialidad</option>
            <option v-for="specialty in specialties" :key="specialty.id_especialidad" :value="specialty.id_especialidad">
              {{ specialty.nombre }}
            </option>
          </select>
        </div>

        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrar Médico' }}
        </button>
      </form>

      <!-- Paciente Registration Form -->
      <form v-if="userType === 'paciente'" @submit.prevent="handleRegisterPaciente" class="form">
        <h3>Registro de Paciente</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="paciente-nombre">Nombre:</label>
            <input
              type="text"
              id="paciente-nombre"
              v-model="pacienteForm.nombre"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="paciente-paterno">Apellido Paterno:</label>
            <input
              type="text"
              id="paciente-paterno"
              v-model="pacienteForm.paterno"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="paciente-materno">Apellido Materno:</label>
            <input
              type="text"
              id="paciente-materno"
              v-model="pacienteForm.materno"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="paciente-email">Email:</label>
            <input
              type="email"
              id="paciente-email"
              v-model="pacienteForm.email"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="paciente-password">Contraseña:</label>
            <input
              type="password"
              id="paciente-password"
              v-model="pacienteForm.password"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="paciente-telefono">Teléfono:</label>
            <input
              type="tel"
              id="paciente-telefono"
              v-model="pacienteForm.telefono"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="paciente-fecha-nacimiento">Fecha de Nacimiento:</label>
            <input
              type="date"
              id="paciente-fecha-nacimiento"
              v-model="pacienteForm.fecha_nacimiento"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="paciente-sexo">Sexo:</label>
            <select
              id="paciente-sexo"
              v-model="pacienteForm.sexo"
              required
              class="form-input"
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        </div>

        <div class="form-group full-width">
          <label for="paciente-direccion">Dirección:</label>
          <textarea
            id="paciente-direccion"
            v-model="pacienteForm.direccion"
            required
            class="form-input"
            rows="3"
          ></textarea>
        </div>

        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrar Paciente' }}
        </button>
      </form>

      <div class="form-footer">
        <router-link to="/login" class="login-link">
          ¿Ya tienes cuenta? Inicia sesión
        </router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/api.js'

const gsap = window.gsap

export default {
  name: 'Register',
  setup() {
    const userType = ref('medico')
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const router = useRouter()

    const medicoForm = ref({
      nombre: '',
      paterno: '',
      materno: '',
      email: '',
      password: '',
      telefono: '',
      nro_colegiatura: '',
      anios_experiencia: '',
      id_especialidad: ''
    })

    const pacienteForm = ref({
      nombre: '',
      paterno: '',
      materno: '',
      email: '',
      password: '',
      telefono: '',
      fecha_nacimiento: '',
      sexo: '',
      direccion: ''
    })

    const specialties = ref([])

    const loadSpecialties = async () => {
      try {
        const response = await apiService.getSpecialties()
        specialties.value = response
      } catch (err) {
        console.error('Error loading specialties:', err)
      }
    }

    const handleRegisterMedico = async () => {
      loading.value = true
      error.value = ''
      success.value = ''
      try {
        const formData = {
          ...medicoForm.value,
          telefono: parseInt(medicoForm.value.telefono),
          anios_experiencia: parseInt(medicoForm.value.anios_experiencia),
          id_especialidad: parseInt(medicoForm.value.id_especialidad)
        }
        const response = await apiService.registerMedico(formData)
        success.value = response.mensaje
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (err) {
        error.value = err.message || 'Error al registrar médico'
      } finally {
        loading.value = false
      }
    }

    const handleRegisterPaciente = async () => {
      loading.value = true
      error.value = ''
      success.value = ''
      try {
        const formData = {
          ...pacienteForm.value,
          telefono: parseInt(pacienteForm.value.telefono)
        }
        const response = await apiService.registerPaciente(formData)
        success.value = response.mensaje
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (err) {
        error.value = err.message || 'Error al registrar paciente'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadSpecialties()

      // GSAP animations
      gsap.utils.toArray('.type-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
      })

      gsap.utils.toArray('.form-input').forEach(input => {
        input.addEventListener('focus', () => gsap.to(input, { scale: 1.02, boxShadow: '0 0 10px rgba(37, 206, 209, 0.5)', duration: 0.3 }))
        input.addEventListener('blur', () => gsap.to(input, { scale: 1, boxShadow: 'none', duration: 0.3 }))
      })

      gsap.utils.toArray('.register-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
      })
    })

    return {
      userType,
      loading,
      error,
      success,
      medicoForm,
      pacienteForm,
      specialties,
      handleRegisterMedico,
      handleRegisterPaciente
    }
  }
}
</script>

<style src="../assets/register.css" scoped></style>