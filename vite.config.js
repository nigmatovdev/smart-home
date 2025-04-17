import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api/proxy': {
        target: 'http://84.54.118.39:8920',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '')
      }
    }
  }
})
