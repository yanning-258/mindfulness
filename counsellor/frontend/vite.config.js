import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/stats':    'http://localhost:8001',
      '/students': 'http://localhost:8001',
      '/sessions': 'http://localhost:8001',
      '/student':  'http://localhost:8001',
    },
  },
})
