// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: base debe ser el nombre del repo entre slashes
// En dev usa '/', en producción usa '/my-gift-box/'
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/my-gift-box/' : '/',
  build: {
    outDir: 'docs',     // para GitHub Pages (deploy from /docs)
    assetsDir: 'assets' // carpeta de estáticos
  }
})
