import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://medilink-frontend-latest.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})