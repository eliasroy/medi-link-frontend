<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="250"
      :collapsed-width="80"
      theme="light"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="logo">
        <h2 v-if="!collapsed">MediLink</h2>
        <h2 v-else>ML</h2>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="light"
        @click="handleMenuClick"
      >
        <a-menu-item key="home" v-if="isAuthenticated">
          <home-outlined />
          <span>Home</span>
        </a-menu-item>
        <a-menu-item key="doctors" v-if="isAuthenticated && userRole !== 'MEDICO'">
          <user-outlined />
          <span>Lista de Médicos</span>
        </a-menu-item>
        <a-menu-item key="patient-appointments" v-if="isAuthenticated && userRole !== 'MEDICO'">
          <calendar-outlined />
          <span>Mis Citas</span>
        </a-menu-item>
        <a-menu-item key="doctor-calendar" v-if="isAuthenticated && userRole === 'MEDICO'">
          <calendar-outlined />
          <span>Mi Calendario</span>
        </a-menu-item>
        <a-menu-item key="doctor-appointments" v-if="isAuthenticated && userRole === 'MEDICO'">
          <file-text-outlined />
          <span>Gestionar Citas</span>
        </a-menu-item>
        <a-menu-item key="login" v-if="!isAuthenticated">
          <login-outlined />
          <span>Iniciar Sesión</span>
        </a-menu-item>
        <a-menu-item key="register" v-if="!isAuthenticated">
          <user-add-outlined />
          <span>Registro</span>
        </a-menu-item>
        <a-menu-item key="logout" v-if="isAuthenticated">
          <logout-outlined />
          <span>Cerrar Sesión</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
        <a-button
          type="text"
          @click="toggleCollapsed"
          style="font-size: 16px; width: 64px; height: 64px;"
        >
          <menu-unfold-outlined v-if="collapsed" />
          <menu-fold-outlined v-else />
        </a-button>
        <div>
          <h1 style="margin: 0; color: #25ced1;">Sistema Médico</h1>
        </div>
        <div></div>
      </a-layout-header>
      <a-layout-content style="margin: 24px 16px; padding: 24px; background: #fff; min-height: 280px;">
        <div class="home-content">
          <header class="home-header">
            <p>Gestión de usuarios y médicos</p>
          </header>

          <nav class="navigation-grid" v-if="isAuthenticated">
            <div v-if="userRole !== 'MEDICO'" class="nav-card">
              <div class="nav-icon">👨‍⚕️</div>
              <h3>Lista de Médicos</h3>
              <p>Buscar y filtrar médicos por especialidad, nombre y calificación</p>
              <router-link to="/doctors" class="nav-btn">
                Ver Médicos
              </router-link>
            </div>

            <div v-if="userRole !== 'MEDICO'" class="nav-card">
              <div class="nav-icon">📅</div>
              <h3>Mis Citas</h3>
              <p>Ver y gestionar tus citas médicas</p>
              <router-link to="/patient-appointments" class="nav-btn">
                Ver Citas
              </router-link>
            </div>

            <div v-if="userRole === 'MEDICO'" class="nav-card">
              <div class="nav-icon">🗓️</div>
              <h3>Mi Calendario</h3>
              <p>Ver calendario de mis citas disponibles</p>
              <router-link :to="`/doctor/${featuredDoctorId}/calendar`" class="nav-btn">
                Ver Calendario
              </router-link>
            </div>

            <div v-if="userRole === 'MEDICO'" class="nav-card">
              <div class="nav-icon">📋</div>
              <h3>Gestionar Citas</h3>
              <p>Ver y gestionar citas de pacientes</p>
              <router-link to="/doctor-appointments" class="nav-btn">
                Ver Citas
              </router-link>
            </div>
          </nav>

          <div v-if="!isAuthenticated" class="auth-section">
            <div class="nav-card">
              <div class="nav-icon">🔐</div>
              <h3>Iniciar Sesión</h3>
              <p>Accede a tu cuenta de usuario</p>
              <router-link to="/login" class="nav-btn secondary">
                Iniciar Sesión
              </router-link>
            </div>

            <div class="nav-card">
              <div class="nav-icon">📝</div>
              <h3>Registro</h3>
              <p>Crea una nueva cuenta como médico o paciente</p>
              <router-link to="/register" class="nav-btn secondary">
                Registrarse
              </router-link>
            </div>
          </div>

          <footer class="home-footer">
            <p>&copy; 2025 MediLink. Todos los derechos reservados.</p>
          </footer>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/index.js'
import { apiService } from '../services/api.js'
import { useRouter } from 'vue-router'
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'
import { Layout, Menu, Button } from 'ant-design-vue'

const gsap = window.gsap

const router = useRouter()
const authStore = useAuthStore()
const featuredDoctorId = ref(2)
const collapsed = ref(true)
const manualCollapsed = ref(true)
const selectedKeys = ref(['home'])

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userRole = computed(() => authStore.user?.rol)

const handleLogout = () => {
  authStore.logout()
}

const handleMenuClick = ({ key }) => {
  if (key === 'logout') {
    handleLogout()
  } else if (key === 'doctor-calendar') {
    router.push(`/doctor/${featuredDoctorId.value}/calendar`)
  } else {
    router.push(`/${key}`)
  }
}

const toggleCollapsed = () => {
  manualCollapsed.value = !manualCollapsed.value
  collapsed.value = manualCollapsed.value
}

const handleMouseEnter = () => {
  if (manualCollapsed.value) {
    collapsed.value = false
  }
}

const handleMouseLeave = () => {
  if (manualCollapsed.value) {
    collapsed.value = true
  }
}

onMounted(async () => {
  featuredDoctorId.value = authStore.user?.id || 2

  // GSAP animations for buttons
  gsap.utils.toArray('.nav-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' }))
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }))
  })

  // Animation for toggle button
  const toggleBtn = document.querySelector('.ant-btn')
  if (toggleBtn) {
    toggleBtn.addEventListener('mouseenter', () => gsap.to(toggleBtn, { scale: 1.1, duration: 0.2 }))
    toggleBtn.addEventListener('mouseleave', () => gsap.to(toggleBtn, { scale: 1, duration: 0.2 }))
  }
})
</script>

<style src="../assets/home.css" scoped></style>