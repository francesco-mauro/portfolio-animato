/**
 * lighthouse.mjs
 * Il controllo delle prestazioni: serve la build (dist/) sotto /portfolio-animato/, come
 * GitHub Pages, la misura con Lighthouse da telefono (le impostazioni di default:
 * schermo piccolo, rete 4G lenta e processore rallentato quattro volte, simulati) e
 * prende la mediana del punteggio Performance su più giri, perché un giro solo
 * oscilla molto (sulla demo, il 18 novembre 2026, da 75 a 93 in cinque giri).
 * Esce con 1 se la mediana è sotto la soglia: in GitHub Actions ferma la pubblicazione.
 *
 *   npm run test:lighthouse                        5 giri, soglia 95, cartella dist/
 *   node scripts/lighthouse.mjs --giri 3 --soglia 90 --dist altra-cartella
 *
 * Il browser è Google Chrome, come sui telefoni e in PageSpeed Insights: CHROME_PATH se
 * c'è (in Actions il Chrome già installato sulle macchine Ubuntu di GitHub), altrimenti
 * quello che trova chrome-launcher sul PC, e solo se Chrome non c'è il Chromium di
 * Playwright. Esce con 1 anche con --giri o --soglia che non sono numeri.
 * Non si parte dal Chromium di Playwright perché su Windows, il 18 novembre 2026, la
 * stessa build faceva 70 con lui (un compito di quasi 4 secondi fuori dalla pagina,
 * «Unattributable») e 99 con Chrome.
 * Stampa ogni giro (punteggio, tempo bloccato, LCP) e la mediana. Prima serve npm run build.
 * Il punteggio della demo online sta nel README, sezione Performance.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { chromium } from '@playwright/test'

const { values } = parseArgs({
  options: {
    giri: { type: 'string', default: '5' },
    soglia: { type: 'string', default: '95' },
    dist: { type: 'string', default: 'dist' },
  },
})
const RUNS = Number(values.giri)
const THRESHOLD = Number(values.soglia)
// Un valore che non è un numero darebbe una mediana NaN, e NaN < soglia è falso: uscirebbe verde
if (!Number.isInteger(RUNS) || RUNS < 1 || !Number.isFinite(THRESHOLD)) {
  console.error(`--giri deve essere un intero da 1 in su e --soglia un numero (ricevuti: ${values.giri}, ${values.soglia}).`)
  process.exit(1)
}
const ROOT = resolve(values.dist)
const BASE = '/portfolio-animato/'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
}

if (!existsSync(join(ROOT, 'index.html'))) {
  console.error(`Manca ${join(ROOT, 'index.html')}: prima npm run build.`)
  process.exit(1)
}

/** Un server statico minimo: /portfolio-animato/qualcosa → dist/qualcosa, il resto 404. */
const server = createServer((req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0])
  if (!path.startsWith(BASE)) return res.writeHead(404).end()
  let file = normalize(join(ROOT, path.slice(BASE.length)))
  if (!file.startsWith(ROOT)) return res.writeHead(403).end()
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file)) return res.writeHead(404).end()
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
})
await new Promise((done) => server.listen(0, '127.0.0.1', done))
const url = `http://127.0.0.1:${server.address().port}${BASE}`

/** Il Chrome installato, o undefined: su Linux chrome-launcher, se non lo trova, lancia un errore. */
function installedChrome() {
  try {
    return chromeLauncher.Launcher.getFirstInstallation()
  } catch {
    return undefined
  }
}
const chromePath = process.env.CHROME_PATH || installedChrome() || chromium.executablePath()
console.log(`Chrome: ${chromePath}`)
const median = (list) => {
  const sorted = [...list].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

const scores = []
try {
  for (let i = 1; i <= RUNS; i++) {
    // Un Chrome nuovo per ogni giro: niente cache né lavoro rimasto dal giro prima
    const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox'] })
    try {
      const { lhr } = await lighthouse(url, { port: chrome.port, onlyCategories: ['performance'], logLevel: 'error' })
      const score = Math.round(lhr.categories.performance.score * 100)
      const tbt = Math.round(lhr.audits['total-blocking-time'].numericValue)
      const lcp = Math.round(lhr.audits['largest-contentful-paint'].numericValue)
      scores.push(score)
      console.log(`giro ${i}/${RUNS}: Performance ${score}, tempo bloccato ${tbt} ms, LCP ${lcp} ms`)
    } finally {
      await chrome.kill()
    }
  }
} finally {
  server.close()
}

const result = median(scores)
console.log(`Mediana Performance: ${result} (giri: ${scores.join(', ')}), soglia ${THRESHOLD}`)
if (result < THRESHOLD) {
  console.error(`Sotto la soglia: ${result} < ${THRESHOLD}.`)
  process.exit(1)
}
