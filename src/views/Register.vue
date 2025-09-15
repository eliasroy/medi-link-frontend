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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/api.js'

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
      anios_experiencia: ''
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

    const handleRegisterMedico = async () => {
      loading.value = true
      error.value = ''
      success.value = ''
      try {
        const formData = {
          ...medicoForm.value,
          telefono: parseInt(medicoForm.value.telefono),
          anios_experiencia: parseInt(medicoForm.value.anios_experiencia)
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

    return {
      userType,
      loading,
      error,
      success,
      medicoForm,
      pacienteForm,
      handleRegisterMedico,
      handleRegisterPaciente
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #25ced1, #ffffff);
  padding: 2rem 1rem;
}

.register-form {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #25ced1;
}

h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #25ced1;
}

.user-type-selection {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-btn {
  padding: 0.75rem 2rem;
  border: 2px solid #25ced1;
  background: #ffffff;
  color: #25ced1;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.type-btn.active {
  background: #25ced1;
  color: #ffffff;
}

.type-btn:hover {
  background: #25ced1;
  color: #ffffff;
}

.form {
  margin-bottom: 2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1rem;
}

.form-group.full-width {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #25ced1;
}

.register-btn {
  width: 100%;
  padding: 0.75rem;
  background: #25ced1;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

.register-btn:hover:not(:disabled) {
  background: #1fa3a6;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.login-link {
  color: #25ced1;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #ffe6e6;
  border-radius: 4px;
}

.success {
  color: green;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #e6ffe6;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .user-type-selection {
    flex-direction: column;
  }

  .type-btn {
    width: 100%;
  }
}
</style>