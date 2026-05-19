import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __APP_ENV__: JSON.stringify(process.env.VITE_API_URL),
  },
})