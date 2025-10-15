<template>
  <div class="login-container">
    <!-- Loading Spinner for Panel Redirect -->
    <LoadingSpinner v-if="redirectingToPanel" text="Cargando Panel..." />

    <form @submit.prevent="handleLogin" class="login-form" v-show="!redirectingToPanel">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="form-input"
        />
      </div>
      <button type="submit" class="login-btn" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <div class="form-footer">
        <router-link to="/register" class="register-link">
          ¿No tienes cuenta? Regístrate
        </router-link>
        <button type="button" @click="showForgotPassword = true" class="forgot-password-link">
          Me olvidé contraseña
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="closeForgotPassword">
      <div class="modal-content" @click.stop>
        <h3>Restablecer Contraseña</h3>
        <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
          <div class="form-group">
            <label for="reset-email">Correo Electrónico:</label>
            <input
              type="email"
              id="reset-email"
              v-model="resetEmail"
              required
              class="form-input"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          <div class="form-group">
            <label for="new-password">Nueva Contraseña:</label>
            <input
              type="password"
              id="new-password"
              v-model="newPassword"
              required
              class="form-input"
              placeholder="Ingresa tu nueva contraseña"
              minlength="6"
            />
            <small class="password-hint">Mínimo 6 caracteres</small>
          </div>
          <div class="modal-actions">
            <button type="submit" class="reset-btn" :disabled="resetLoading">
              {{ resetLoading ? 'Actualizando...' : 'Restablecer Contraseña' }}
            </button>
          </div>
        </form>
        <p v-if="resetError" class="error">{{ resetError }}</p>
        <p v-if="resetSuccess" class="success">{{ resetSuccess }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/api.js'
import { useAuthStore } from '../stores/index.js'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const gsap = window.gsap

export default {
  name: 'Login',
  components: {
    LoadingSpinner
  },
  setup() {
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const redirectingToPanel = ref(false)
    const error = ref('')
    const success = ref('')
    const showForgotPassword = ref(false)
    const resetEmail = ref('')
    const newPassword = ref('')
    const resetLoading = ref(false)
    const resetError = ref('')
    const resetSuccess = ref('')
    const router = useRouter()
    const authStore = useAuthStore()

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      success.value = ''
      try {
        const response = await apiService.login(email.value, password.value)
        success.value = response.mensaje
        authStore.setToken(response.token)
        authStore.setUser(response.usuario)

        // Show loading spinner while redirecting to panel
        redirectingToPanel.value = true

        // Add a small delay to show the loading state, then redirect
        setTimeout(() => {
          router.push('/panel')
        }, 1500)
      } catch (err) {
        error.value = err.message || 'Login failed'
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = async () => {
      resetLoading.value = true
      resetError.value = ''
      resetSuccess.value = ''
      try {
        const response = await apiService.changePassword({
          email: resetEmail.value,
          newPassword: newPassword.value
        })
        resetSuccess.value = response.mensaje

        // Close modal and redirect to login after success
        setTimeout(() => {
          closeForgotPassword()
          // Clear login form messages
          error.value = ''
          success.value = 'Contraseña actualizada exitosamente. Por favor inicia sesión.'
        }, 2000)
      } catch (err) {
        resetError.value = err.message || 'Error al cambiar la contraseña'
      } finally {
        resetLoading.value = false
      }
    }

    const closeForgotPassword = () => {
      showForgotPassword.value = false
      resetEmail.value = ''
      newPassword.value = ''
      resetError.value = ''
      resetSuccess.value = ''
    }

    onMounted(() => {
      // GSAP animations for form inputs
      gsap.utils.toArray('.form-input').forEach(input => {
        input.addEventListener('focus', () => gsap.to(input, { scale: 1.02, boxShadow: '0 0 10px rgba(37, 206, 209, 0.5)', duration: 0.3 }))
        input.addEventListener('blur', () => gsap.to(input, { scale: 1, boxShadow: 'none', duration: 0.3 }))
      })

      // Animation for login button
      const loginBtn = document.querySelector('.login-btn')
      if (loginBtn) {
        loginBtn.addEventListener('mouseenter', () => gsap.to(loginBtn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
        loginBtn.addEventListener('mouseleave', () => gsap.to(loginBtn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
      }
    })

    return {
      email,
      password,
      loading,
      redirectingToPanel,
      error,
      success,
      showForgotPassword,
      resetEmail,
      newPassword,
      resetLoading,
      resetError,
      resetSuccess,
      handleLogin,
      handleForgotPassword,
      closeForgotPassword,
      authStore
    }
  }
}
</script>

<style src="../assets/login.css" scoped></style>