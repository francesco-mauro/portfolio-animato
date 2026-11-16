/**
 * vite.config.ts
 * Configurazione di Vite: il plugin React (JSX e ricaricamento rapido) e il percorso base.
 * Nella build il sito vive in https://francesco-mauro.github.io/portfolio-animato/,
 * quindi tutti i file partono da /portfolio-animato/; in sviluppo resta /.
 * Le pagine sono due: index.html, il sito, e 404.html, che GitHub Pages mostra per ogni
 * indirizzo che non esiste. Vite costruisce solo le pagine scritte negli input della build.
 * In sviluppo Vite si comporta come Pages: appType 'mpa' toglie il ritorno a index.html
 * per ogni indirizzo sconosciuto, e il plugin notFoundPage serve al suo posto 404.html con
 * lo stato 404 (tests/not-found.spec.ts).
 * In fondo la parte di Vitest (npm run test:unit), che legge questa stessa configurazione:
 * per questo defineConfig viene da vitest/config, che aggiunge il campo test a quello di Vite.
 * Documentazione: https://vite.dev/config/, https://vite.dev/guide/build#multi-page-app
 * e https://vitest.dev/config/
 */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const page = (file: string) => fileURLToPath(new URL(file, import.meta.url))

/**
 * In sviluppo, una richiesta di pagina che nessun file soddisfa riceve 404.html con lo
 * stato 404, come su GitHub Pages. È la funzione restituita da configureServer, quindi gira
 * dopo che Vite ha tradotto gli indirizzi delle pagine nei loro file (/ diventa /index.html)
 * ma prima che Vite serva quei file: per questo un .html che esiste passa avanti, e tutto
 * il resto riceve la 404.
 * Solo per le richieste di una pagina (Accept: text/html): un'immagine che manca resta un 404 vuoto.
 */
function notFoundPage(): Plugin {
  return {
    name: 'not-found-page',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== 'GET' || !req.headers.accept?.includes('text/html')) return next()
          const path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
          if (path.endsWith('.html') && existsSync(join(server.config.root, path))) return next()
          try {
            const html = await readFile(page('./404.html'), 'utf8')
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(await server.transformIndexHtml('/404.html', html, req.originalUrl))
          } catch (error) {
            next(error)
          }
        })
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [react(), notFoundPage()],
  base: command === 'build' ? '/portfolio-animato/' : '/',
  appType: 'mpa',
  build: {
    rolldownOptions: {
      input: {
        main: page('./index.html'),
        notFound: page('./404.html'),
      },
    },
  },
  test: {
    // I test accanto al codice in src/, quello del workflow in .github/ e quello delle pagine
    // (pages.test.ts). Quelli in tests/ sono di Playwright (npm run test:e2e): hanno bisogno
    // di un browser e Vitest non deve prenderli.
    include: ['src/**/*.test.ts', '.github/**/*.test.ts', 'pages.test.ts'],
  },
}))
