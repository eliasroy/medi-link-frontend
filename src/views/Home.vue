<template>
  <div class="home-container">
    <div class="home-content">
      <header class="home-header">
        <h1>Sistema Médico</h1>
        <p>Gestión de usuarios y médicos</p>
      </header>

      <nav class="navigation-grid">
        <div v-if="isAuthenticated" class="nav-card">
          <div class="nav-icon">👨‍⚕️</div>
          <h3>Lista de Médicos</h3>
          <p>Buscar y filtrar médicos por especialidad, nombre y calificación</p>
          <router-link to="/doctors" class="nav-btn">
            Ver Médicos
          </router-link>
        </div>

        <div v-if="isAuthenticated" class="nav-card">
          <div class="nav-icon">📅</div>
          <h3>Mis Citas</h3>
          <p>Ver y gestionar tus citas médicas</p>
          <router-link to="/patient-appointments" class="nav-btn">
            Ver Citas
          </router-link>
        </div>

        <div v-if="isAuthenticated" class="nav-card">
          <div class="nav-icon">🚪</div>
          <h3>Cerrar Sesión</h3>
          <p>Salir de tu cuenta de usuario</p>
          <button @click="handleLogout" class="nav-btn logout-btn">
            Cerrar Sesión
          </button>
        </div>

        <div v-if="!isAuthenticated" class="nav-card">
          <div class="nav-icon">🔐</div>
          <h3>Iniciar Sesión</h3>
          <p>Accede a tu cuenta de usuario</p>
          <router-link to="/login" class="nav-btn secondary">
            Iniciar Sesión
          </router-link>
        </div>

        <div v-if="!isAuthenticated" class="nav-card">
          <div class="nav-icon">📝</div>
          <h3>Registro</h3>
          <p>Crea una nueva cuenta como médico o paciente</p>
          <router-link to="/register" class="nav-btn secondary">
            Registrarse
          </router-link>
        </div>
      </nav>

      <footer class="home-footer">
        <p>&copy; 2025 MediLink. Todos los derechos reservados.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/index.js'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #25ced1, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.home-content {
  max-width: 1000px;
  width: 100%;
  text-align: center;
}

.home-header {
  margin-bottom: 3rem;
}

.home-header h1 {
  font-size: 3rem;
  color: #ffffff;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.home-header p {
  font-size: 1.2rem;
  color: #ffffff;
  margin: 0;
  opacity: 0.9;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.nav-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.nav-card h3 {
  font-size: 1.5rem;
  color: #25ced1;
  margin: 0 0 1rem 0;
}

.nav-card p {
  color: #666;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.nav-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #25ced1;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: #1fa3a6;
}

.nav-btn.secondary {
  background: #6c757d;
}

.nav-btn.secondary:hover {
  background: #5a6268;
}

.nav-btn.logout-btn {
  background: #dc3545;
}

.nav-btn.logout-btn:hover {
  background: #c82333;
}

.home-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.home-footer p {
  color: #ffffff;
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .home-header h1 {
    font-size: 2rem;
  }

  .navigation-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .nav-card {
    padding: 1.5rem;
  }
}
</style>