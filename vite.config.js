// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/my-gift-box/',      // ← nombre del repo (ruta de GitHub Pages)
  build: { outDir: 'docs' },  // ← GitHub Pages publicará la carpeta "docs"
  plugins: [react()],
})
