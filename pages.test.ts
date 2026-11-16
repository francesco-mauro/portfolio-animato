/**
 * pages.test.ts
 * Le pagine HTML del sito, con Vitest (npm run test:unit): index.html e 404.html.
 * GitHub Pages mostra 404.html per ogni indirizzo che non esiste, ma solo se la build la
 * mette in dist/: Vite costruisce soltanto le pagine scritte negli input di vite.config.ts.
 * Le due pagine scelgono tema e lingua con lo stesso script nella testa, prima che la pagina
 * si disegni: se uno cambia e l'altro no, la 404 si aprirebbe nel tema o nella lingua
 * sbagliati. La pagina 404 nel browser la prova tests/not-found.spec.ts.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import viteConfig from './vite.config.ts'

const read = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8')

/**
 * Lo script senza attributi nella testa di una pagina: quello che sceglie tema e lingua.
 * Le fini riga contano come una sola: su Windows git può scriverle \r\n, su Linux sono \n.
 */
const headScript = (html: string) => html.match(/<script>([\s\S]*?)<\/script>/)?.[1].replaceAll('\r\n', '\n').trim()

describe('pagine del sito', () => {
  test('la build costruisce la prima pagina e la 404', async () => {
    const config = await viteConfig({ command: 'build', mode: 'production' })
    const input = config.build?.rolldownOptions?.input
    const files = Object.values(input ?? {}).map((path) => String(path).replaceAll('\\', '/'))
    expect(files.some((path) => path.endsWith('/index.html'))).toBe(true)
    expect(files.some((path) => path.endsWith('/404.html'))).toBe(true)
  })

  test('la 404 sceglie tema e lingua con lo stesso script della prima pagina', () => {
    const main = headScript(read('./index.html'))
    expect(main).toContain("localStorage.getItem('theme')")
    expect(headScript(read('./404.html'))).toBe(main)
  })

  test('la 404 non finisce nei motori di ricerca', () => {
    expect(read('./404.html')).toContain('<meta name="robots" content="noindex" />')
  })
})
