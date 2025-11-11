import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwind(),react()],
  server: {
    host: "0.0.0.0",
    port: 5173
  }
})
