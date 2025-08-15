// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Si tu sitio es https://usuario.github.io/<TU_REPO>/
export default defineConfig({
  base: '/my-gift-box/',      // ← nombre del repo (ruta de GitHub Pages)
  build: { outDir: 'docs' },  // ← GitHub Pages publicará la carpeta "docs"
  plugins: [react()],
<<<<<<< HEAD
})
=======
    base: '/<my-gift-box>/',   // <- MUY IMPORTANTE para GitHub Pages de proyecto
  build: { outDir: 'docs' } // <- genera la build dentro de /docs
})
>>>>>>> a662f38 (build: actualizar docs para GitHub Pages)
