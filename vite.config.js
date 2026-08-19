import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Trocar de domínio depois da aprovação = mudar VITE_BASE (ou a linha abaixo)
// de '/helena-duailibe/' para '/'. Nada mais no projeto depende disso.
const BASE = process.env.VITE_BASE ?? '/helena-duailibe/'

export default defineConfig({
  base: BASE,
  plugins: [react()],
})
