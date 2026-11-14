/**
 * theme.spec.ts
 * Test del tema chiaro e scuro (components/ThemeToggle e lo script in index.html).
 * Il sito parte dal tema del sistema (prefers-color-scheme, emulato con colorScheme),
 * il bottone lo cambia e la scelta resta dopo il ricaricamento, perché è salvata in
 * localStorage. Il tema si legge da <html data-theme> e, per essere sicuri che si
 * veda davvero, dal colore di fondo della pagina.
 */
import { expect, test, type Page } from '@playwright/test'
import { openPreferences } from './preferences.ts'

const html = (page: Page) => page.locator('html')
/** Il bottone del tema sta nel pannello delle preferenze: prima lo apre, se è chiuso. */
async function themeButton(page: Page) {
  await openPreferences(page)
  return page.getByRole('button', { name: /tema/i })
}
const bodyBackground = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor)

test('parte dal tema del sistema', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(html(page)).toHaveAttribute('data-theme', 'dark')

  await page.emulateMedia({ colorScheme: 'light' })
  await page.reload()
  await expect(html(page)).toHaveAttribute('data-theme', 'light')
})

test('il bottone cambia tema e la scelta resta dopo il ricaricamento', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(html(page)).toHaveAttribute('data-theme', 'light')
  const lightBackground = await bodyBackground(page)

  await (await themeButton(page)).click()
  await expect(html(page)).toHaveAttribute('data-theme', 'dark')
  await expect.poll(() => bodyBackground(page)).not.toBe(lightBackground)

  // Il sistema resta chiaro: se dopo il ricaricamento è scuro, è la scelta salvata.
  await page.reload()
  await expect(html(page)).toHaveAttribute('data-theme', 'dark')
  await expect(await themeButton(page)).toHaveAttribute('aria-pressed', 'true')

  await (await themeButton(page)).click()
  await page.reload()
  await expect(html(page)).toHaveAttribute('data-theme', 'light')
})
