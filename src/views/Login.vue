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
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>
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
      handleLogin,
      authStore
    }
  }
}
</script>

<style src="../assets/login.css" scoped></style>