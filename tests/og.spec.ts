/**
 * og.spec.ts
 * Test dell'anteprima del link (Open Graph): quando qualcuno incolla l'indirizzo
 * del sito su LinkedIn, WhatsApp o Telegram, la piattaforma legge i meta `og:` di
 * index.html e mostra titolo, descrizione e immagine. Senza, si vede un link spoglio.
 * Le piattaforme vogliono indirizzi assoluti, quindi og:url e og:image puntano alla
 * demo su github.io. Nei test però il sito gira in locale, prima di essere pubblicato:
 * per controllare che l'immagine esista davvero, si prende il nome del file dal suo
 * indirizzo e lo si chiede al server locale, che serve la stessa cartella public/.
 * Le misure si leggono dall'intestazione del PNG (larghezza e altezza ai byte 16-23).
 * Documentazione del protocollo: https://ogp.me
 */
import { expect, test, type Page } from '@playwright/test'

const DEMO = 'https://francesco-mauro.github.io/portfolio-animato/'

// Legge il content di un meta, o null se manca: subito, senza aspettare che compaia,
// perché i meta stanno in index.html e ci sono già al caricamento.
const meta = (page: Page, key: string) =>
  page.evaluate(
    (k) =>
      document.querySelector(`meta[property="${k}"], meta[name="${k}"]`)?.getAttribute('content') ??
      null,
    key,
  )

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('i meta Open Graph ci sono e puntano alla demo', async ({ page }) => {
  expect(await meta(page, 'og:type')).toBe('website')
  expect(await meta(page, 'og:url')).toBe(DEMO)
  expect(await meta(page, 'og:title')).toContain('Francesco Mauro')
  expect(await meta(page, 'og:description')).toBeTruthy()
  expect(await meta(page, 'og:image')).toMatch(new RegExp(`^${DEMO}.+\\.png$`))
  expect(await meta(page, 'og:image:alt')).toBeTruthy()
  // twitter:card "summary_large_image" chiede l'immagine grande anche a X e a Slack
  expect(await meta(page, 'twitter:card')).toBe('summary_large_image')
})

test("l'immagine di anteprima esiste ed è un PNG da 1200×630", async ({ page, request }) => {
  const image = (await meta(page, 'og:image')) ?? ''
  const file = image.slice(DEMO.length)

  const response = await request.get(`/${file}`)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('image/png')

  // Un PNG comincia con 8 byte fissi; poi il blocco IHDR dice larghezza e altezza.
  const bytes = await response.body()
  expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG')
  expect(bytes.readUInt32BE(16)).toBe(1200)
  expect(bytes.readUInt32BE(20)).toBe(630)

  // Le misure dichiarate nei meta devono essere quelle vere.
  expect(await meta(page, 'og:image:width')).toBe('1200')
  expect(await meta(page, 'og:image:height')).toBe('630')
})
