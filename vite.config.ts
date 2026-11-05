/**
 * vite.config.ts
 * Configurazione di Vite: solo il plugin React (JSX e ricaricamento rapido).
 * Documentazione: https://vite.dev/config/
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
})
