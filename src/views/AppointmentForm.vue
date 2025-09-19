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

<style src="../assets/appointmentForm.css" scoped></style>