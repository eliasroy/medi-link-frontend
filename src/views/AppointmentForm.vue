<template>
  <div class="form-container">
    <div class="form-content">
      <header class="form-header">
        <button @click="goBack" class="back-btn">
          ← Volver al Calendario
        </button>
        <h1>Reservar Cita</h1>
      </header>

      <form @submit.prevent="submitForm" class="appointment-form">
        <div class="form-group">
          <label for="titulo">Título de la Cita:</label>
          <input
            id="titulo"
            v-model="formData.titulo"
            type="text"
            required
            placeholder="Ingrese el título de la cita"
            class="form-input"
          />
        </div>


        <div class="appointment-details">
          <h3>Detalles de la Cita</h3>
          <p><strong>Fecha:</strong> {{ slotData.fecha }}</p>
          <p><strong>Hora Inicio:</strong> {{ slotData.hora_inicio }}</p>
          <p><strong>Hora Fin:</strong> {{ slotData.hora_fin }}</p>
          <p><strong>Médico ID:</strong> {{ slotData.idMedico }}</p>
          <p><strong>ID Horario:</strong> {{ slotData.idHorario }}</p>
          <p><strong>Modalidad:</strong> {{ slotData.modalidad }}</p>
        </div>

        <button type="submit" :disabled="submitting" class="submit-btn">
          {{ submitting ? 'Reservando...' : 'Reservar Cita' }}
        </button>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="message" class="message" :class="{ 'success': message.type === 'success', 'error': message.type === 'error' }">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '../services/api.js'

export default {
  name: 'AppointmentForm',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const formData = ref({
      titulo: ''
    })

    const slotData = ref({
      idMedico: '',
      idHorario: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      modalidad: ''
    })

    const submitting = ref(false)
    const message = ref(null)

    const goBack = () => {
      router.go(-1)
    }

    const submitForm = async () => {
      if (!formData.value.titulo) {
        message.value = {
          type: 'error',
          text: 'Por favor complete el título de la cita.'
        }
        return
      }

      submitting.value = true
      message.value = null

      try {
        const citaData = {
          idMedico: parseInt(slotData.value.idMedico),
          idHorario: parseInt(slotData.value.idHorario),
          titulo: formData.value.titulo,
          fecha: slotData.value.fecha,
          hora_inicio: slotData.value.hora_inicio,
          hora_fin: slotData.value.hora_fin,
          modalidad: slotData.value.modalidad
        }

        const response = await apiService.saveCita(citaData)

        message.value = {
          type: 'success',
          text: 'Cita reservada exitosamente.'
        }

        // Optionally redirect after success
        setTimeout(() => {
          router.push('/doctors')
        }, 2000)

      } catch (error) {
        console.error('Error saving cita:', error)
        message.value = {
          type: 'error',
          text: 'Error al reservar la cita. Intente nuevamente.'
        }
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      // Get data from query params
      slotData.value = {
        idMedico: route.query.idMedico || '',
        idHorario: route.query.idHorario || '',
        fecha: route.query.fecha || '',
        hora_inicio: route.query.hora_inicio || '',
        hora_fin: route.query.hora_fin || '',
        modalidad: route.query.modalidad || ''
      }
    })

    return {
      formData,
      slotData,
      submitting,
      message,
      goBack,
      submitForm
    }
  }
}
</script>

<style scoped>
.form-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #25ced1, #ffffff);
  padding: 2rem 1rem;
}

.form-content {
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
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

.appointment-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #25ced1;
}

.appointment-details {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #dee2e6;
}

.appointment-details h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.appointment-details p {
  margin: 0.5rem 0;
  color: #666;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #218838;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>