<template>
  <a-layout style="min-height: 100vh">
    <SideMenu ref="sideMenuRef" />
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
        <a-button
          type="text"
          @click="toggleMenu"
          style="font-size: 16px; width: 64px; height: 64px;"
        >
          <menu-unfold-outlined v-if="collapsed" />
          <menu-fold-outlined v-else />
        </a-button>
        <div>
          <h1 style="margin: 0; color: #25ced1;">Sistema Médico</h1>
        </div>
        <div class="header-user-info">
          <div class="user-icon" @mouseenter="showUserInfo = true" @mouseleave="showUserInfo = false">
            👤
            <div v-if="showUserInfo" class="user-tooltip">
              <p><strong>Usuario:</strong> {{ user?.nombre }} {{ user?.paterno }}</p>
              <p><strong>Rol:</strong> {{ user?.rol }}</p>
            </div>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 24px 16px; padding: 24px; background: #fff; min-height: 280px;">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import SideMenu from './SideMenu.vue'
import { Button } from 'ant-design-vue'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '../stores/index.js'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const sideMenuRef = ref(null)
const collapsed = ref(true)
const showUserInfo = ref(false)

const toggleMenu = () => {
  if (sideMenuRef.value) {
    sideMenuRef.value.toggleCollapsed()
    collapsed.value = !collapsed.value
  }
}
</script>

<style scoped>
.header-user-info {
  display: flex;
  align-items: center;
}

.user-icon {
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.user-icon:hover {
  background-color: rgba(37, 206, 209, 0.1);
}

.user-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 180px;
  animation: tooltipFadeIn 0.3s ease-out;
  margin-top: 5px;
}

.user-tooltip p {
  margin: 3px 0;
  font-size: 0.85rem;
  color: #333;
}

@keyframes tooltipFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>