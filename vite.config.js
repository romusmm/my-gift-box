// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Si tu sitio es https://usuario.github.io/<TU_REPO>/
export default defineConfig({
  plugins: [react()],
    base: '/<my-gift-box>/',   // <- MUY IMPORTANTE para GitHub Pages de proyecto
  build: { outDir: 'docs' } // <- genera la build dentro de /docs
})
