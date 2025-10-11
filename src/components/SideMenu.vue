<template>
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
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/index.js'
import { useRouter } from 'vue-router'
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
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
    const featuredDoctorId = authStore.user?.id || 2
    router.push(`/doctor/${featuredDoctorId}/calendar`)
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

// Expose toggleCollapsed for parent components
defineExpose({
  toggleCollapsed
})
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #25ced1;
  color: white;
  font-weight: bold;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
}

.ant-menu-item {
  background: transparent !important;
}

.ant-menu-item:hover {
  background: transparent !important;
}

.ant-menu-item-selected {
  background: transparent !important;
}

.ant-menu-item-active {
  background: transparent !important;
}
</style>