import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'medilink-frontend-latest.onrender.com' 
    ],
    proxy: {
      '/api': {
        target: 'https://medilink-backend-latest.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
