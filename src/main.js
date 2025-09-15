import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(router)
const pinia = createPinia()
app.use(pinia)
app.use(Antd)

// Initialize auth store
import { useAuthStore } from './stores/index.js'
const authStore = useAuthStore(pinia)
authStore.initializeAuth()

app.mount('#app')