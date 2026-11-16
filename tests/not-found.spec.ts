/**
 * not-found.spec.ts
 * La pagina 404 del sito (404.html, src/pages/NotFound/): GitHub Pages la mostra per ogni
 * indirizzo che non esiste sotto /portfolio-animato/, al posto della sua pagina grigia.
 * In sviluppo Vite fa lo stesso: un indirizzo sbagliato risponde 404 con questa pagina
 * (il plugin notFoundPage in vite.config.ts), così il test prova un indirizzo sbagliato vero
 * e non la pagina aperta per nome.
 * Controlla: lo stato 404 e i testi, anche su un indirizzo con più cartelle (i file della
 * pagina devono avere indirizzi assoluti); il link che riporta al sito; l'inglese col
 * browser in inglese o con la scelta salvata; il tema scuro; il «404» che entra con il
 * movimento e resta fermo se il sistema chiede meno movimento; nessuna violazione di axe;
 * dentro lo schermo a 390 e 320 px. Che la build produca dist/404.html lo controlla
 * pages.test.ts con Vitest.
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WRONG = '/questa-pagina-non-esiste'
const WRONG_DEEP = '/una/cartella/che-non-esiste/'

/** Le animazioni ancora attive sulle cifre del «404», contate dopo il primo disegno. */
const digitAnimations = (page: Page) =>
  page.getByTestId('not-found-code').evaluate((code) => code.getAnimations({ subtree: true }).length)

test.describe('pagina 404', () => {
  test('un indirizzo sbagliato risponde 404 con la pagina del sito', async ({ page }) => {
    const response = await page.goto(WRONG)
    expect(response?.status()).toBe(404)
    await expect(page).toHaveTitle(/404/)
    await expect(page.getByTestId('not-found-code')).toHaveAttribute('aria-hidden', 'true')
    await expect(page.getByText('Errore 404')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questa pagina non c’è.')
    await expect(page.getByRole('link', { name: 'Torna al sito' })).toBeVisible()
  })

  test('anche un indirizzo con più cartelle mostra la pagina con il suo stile', async ({ page }) => {
    const response = await page.goto(WRONG_DEEP)
    expect(response?.status()).toBe(404)
    const title = page.getByRole('heading', { level: 1 })
    await expect(title).toBeVisible()
    // Il CSS è arrivato: la pillola ha il fondo corallo scuro dei token, non quello trasparente di partenza.
    await expect(page.getByText('Errore 404')).toHaveCSS('background-color', 'rgb(201, 64, 43)')
  })

  test('il link riporta alla prima pagina del sito', async ({ page }) => {
    await page.goto(WRONG_DEEP)
    await page.getByRole('link', { name: 'Torna al sito' }).click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('#top h1')).toContainText('Quello che vedi')
  })

  test('anche il nome in alto riporta al sito', async ({ page }) => {
    await page.goto(WRONG)
    await page.getByRole('link', { name: 'Francesco Mauro' }).click()
    await expect(page).toHaveURL('/')
  })

  test('la prima pagina risponde ancora 200', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('#top h1')).toBeVisible()
  })

  test.describe('col browser in inglese', () => {
    test.use({ locale: 'en-GB' })

    test('la pagina è in inglese', async ({ page }) => {
      await page.goto(WRONG)
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await expect(page.getByText('Error 404')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page isn’t here.')
      await expect(page.getByRole('link', { name: 'Back to the site' })).toBeVisible()
    })
  })

  test('la lingua scelta sul sito vince su quella del browser', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('lang', 'en'))
    await page.goto(WRONG)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page isn’t here.')
  })

  test.describe('col sistema in scuro', () => {
    test.use({ colorScheme: 'dark' })

    test('la pagina è nel tema scuro', async ({ page }) => {
      await page.goto(WRONG)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questa pagina non c’è.')
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
      await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(18, 19, 27)')
    })
  })

  test('il «404» entra con il movimento', async ({ page }) => {
    await page.goto(WRONG)
    await expect(page.getByTestId('not-found-code')).toBeVisible()
    expect(await digitAnimations(page)).toBeGreaterThan(0)
  })

  test.describe('col sistema che chiede meno movimento', () => {
    test.use({ reducedMotion: 'reduce' })

    test('il «404» resta fermo', async ({ page }) => {
      await page.goto(WRONG)
      await expect(page.getByTestId('not-found-code')).toBeVisible()
      expect(await digitAnimations(page)).toBe(0)
    })
  })

  for (const scheme of ['light', 'dark'] as const) {
    test.describe(`axe, tema ${scheme === 'light' ? 'chiaro' : 'scuro'}`, () => {
      test.use({ colorScheme: scheme, reducedMotion: 'reduce' })

      test('nessuna violazione', async ({ page }) => {
        await page.goto(WRONG)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questa pagina non c’è.')
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
      })
    })
  }

  for (const width of [390, 320]) {
    test(`a ${width} px tutto sta nello schermo`, async ({ page }) => {
      await page.setViewportSize({ width, height: 760 })
      await page.goto(WRONG)
      const link = page.getByRole('link', { name: 'Torna al sito' })
      await expect(link).toBeVisible()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, 'la pagina scorre di lato').toBeLessThanOrEqual(0)
      for (const element of [page.getByTestId('not-found-code'), page.getByRole('heading', { level: 1 }), link]) {
        const box = await element.boundingBox()
        expect(box).not.toBeNull()
        expect(box!.x).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width).toBeLessThanOrEqual(width)
      }
    })
  }
})
