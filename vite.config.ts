import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
    // 确保能解析 ./forms/ 路径
    alias: {
      '@forms': '/src/pages/goods/forms'
    }
  }
})
