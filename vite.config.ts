/**
 * vite.config.ts
 * Configurazione di Vite: il plugin React (JSX e ricaricamento rapido) e il percorso base.
 * Nella build il sito vive in https://francesco-mauro.github.io/portfolio-animato/,
 * quindi tutti i file partono da /portfolio-animato/; in sviluppo resta /.
 * Documentazione: https://vite.dev/config/
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/portfolio-animato/' : '/',
}))
