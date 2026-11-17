/**
 * tab-title.spec.ts
 * Il titolo della scheda quando l'utente va altrove (hooks/useAwayTitle.ts): con la pagina
 * nascosta il titolo diventa un richiamo, nella lingua del sito; tornando visibile si
 * rimette com'era, lo stesso di index.html.
 *
 * Playwright non sa nascondere davvero una scheda: il test riscrive document.visibilityState
 * (una proprietà di sola lettura, ridefinita con Object.defineProperty) e lancia l'evento
 * visibilitychange, che è quello che fa il browser quando si cambia scheda.
 */
import { expect, test, type Page } from '@playwright/test'
import { openPreferences } from './preferences.ts'

const ORIGINAL = 'Francesco Mauro · Junior Full Stack Developer'

/** Fa credere alla pagina di essere nascosta (true) o di nuovo visibile (false). */
async function setHidden(page: Page, hidden: boolean) {
  await page.evaluate((isHidden) => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => (isHidden ? 'hidden' : 'visible'),
    })
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => isHidden })
    document.dispatchEvent(new Event('visibilitychange'))
  }, hidden)
}

test('con la pagina nascosta il titolo richiama, tornando visibile si rimette com\'era', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(ORIGINAL)

  await setHidden(page, true)
  await expect(page).toHaveTitle('Torna qui 👋')

  await setHidden(page, false)
  await expect(page).toHaveTitle(ORIGINAL)

  // Una seconda volta, per vedere che il titolo salvato è ancora quello vero.
  await setHidden(page, true)
  await expect(page).toHaveTitle('Torna qui 👋')
  await setHidden(page, false)
  await expect(page).toHaveTitle(ORIGINAL)
})

test('il richiamo segue la lingua del sito', async ({ page }) => {
  await page.goto('/')
  await openPreferences(page)
  await page.getByRole('radio', { name: 'English' }).click()
  // Prima che React applichi la lingua il richiamo è ancora quello italiano.
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await setHidden(page, true)
  await expect(page).toHaveTitle('Come back 👋')

  await setHidden(page, false)
  await expect(page).toHaveTitle(ORIGINAL)
})

test('se la lingua cambia con la pagina nascosta, il richiamo resta e cambia lingua', async ({ page }) => {
  await page.goto('/')
  await openPreferences(page)
  await setHidden(page, true)
  await expect(page).toHaveTitle('Torna qui 👋')

  await page.getByRole('radio', { name: 'English' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Come back 👋')

  await setHidden(page, false)
  await expect(page).toHaveTitle(ORIGINAL)
})
