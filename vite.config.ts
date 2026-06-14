import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/Ecopulse/", // Correct base format for GitHub Pages subfolders
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Exposes the server on local network and ensures localhost resolves correctly
    port: 5173,
    strictPort: true
  }
})
