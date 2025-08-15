import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  // ⚠️ IMPORTANTE: cuando sepas el nombre real del repo, cámbialo.
  // Si tu repo se llamará "my-gift-box", deja así:
  base: '/my-gift-box/',
  build: { outDir: 'docs' }, // para GitHub Pages (rama main + carpeta docs)
})
