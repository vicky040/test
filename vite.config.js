import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['silent-melisent-cryptoo-bba700a0.koyeb.app'], // Add the allowed host here
  },
})
