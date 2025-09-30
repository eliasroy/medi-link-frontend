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
        <div></div>
      </a-layout-header>
      <a-layout-content style="margin: 24px 16px; padding: 24px; background: #fff; min-height: 280px;">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
import SideMenu from './SideMenu.vue'
import { Button } from 'ant-design-vue'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

const sideMenuRef = ref(null)
const collapsed = ref(true)

const toggleMenu = () => {
  if (sideMenuRef.value) {
    sideMenuRef.value.toggleCollapsed()
    collapsed.value = !collapsed.value
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>