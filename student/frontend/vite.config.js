import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/mood':    'http://localhost:8000',
      '/journal': 'http://localhost:8000',
      '/events':  'http://localhost:8000',
      '/scores':  'http://localhost:8000',
      '/chat':    'http://localhost:8000',
    },
  },
})
