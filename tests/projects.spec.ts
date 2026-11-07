/**
 * projects.spec.ts
 * La vetrina dei progetti (data/projects.ts): il gestionale documentale ne è uscito il
 * 7 novembre 2026, quindi non deve comparire da nessuna parte nella pagina, e la scheda
 * «Primo in vetrina» della prima schermata mostra il progetto che ora è primo.
 */
import { expect, test } from '@playwright/test'

test('il gestionale documentale non è più nella pagina', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/gestionale documentale/i)).toHaveCount(0)
  await expect(page.locator('a[href*="gestionale-documentale"]')).toHaveCount(0)
})

test('«Primo in vetrina» mostra gli incidenti stradali', async ({ page }) => {
  await page.goto('/')
  const card = page.getByText('Primo in vetrina').locator('..')
  await expect(card).toContainText('Incidenti stradali in Italia')
})
