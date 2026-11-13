/**
 * vite.config.ts
 * Configurazione di Vite: il plugin React (JSX e ricaricamento rapido) e il percorso base.
 * Nella build il sito vive in https://francesco-mauro.github.io/portfolio-animato/,
 * quindi tutti i file partono da /portfolio-animato/; in sviluppo resta /.
 * In fondo la parte di Vitest (npm run test:unit), che legge questa stessa configurazione:
 * per questo defineConfig viene da vitest/config, che aggiunge il campo test a quello di Vite.
 * Documentazione: https://vite.dev/config/ e https://vitest.dev/config/
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/portfolio-animato/' : '/',
  test: {
    // I test accanto al codice in src/ e quello del workflow in .github/. Quelli in tests/
    // sono di Playwright (npm run test:e2e): hanno bisogno di un browser e Vitest non deve prenderli.
    include: ['src/**/*.test.ts', '.github/**/*.test.ts'],
  },
}))
