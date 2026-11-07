/**
 * hero.spec.ts
 * Test del titolo della prima schermata (sections/Hero): il titolo dice che il lavoro
 * copre tutto il percorso, da quello che si vede a quello che c'è dietro, e non solo
 * il frontend. Entra in due pezzi, uno dopo l'altro: qui si controlla il testo intero
 * e che sia diviso in quei due pezzi. Si controlla anche che a 390 px, la larghezza
 * di un telefono, il titolo non esca di lato.
 */
import { expect, test } from '@playwright/test'

test('il titolo è «Quello che vedi, e quello che c’è dietro.» in due pezzi', async ({ page }) => {
  await page.goto('/')
  const title = page.getByRole('heading', { level: 1 })

  await expect(title).toHaveText("Quello che vedi, e quello che c'è dietro.", { useInnerText: true })
  await expect(title.locator('span')).toHaveText(['Quello che vedi,', "e quello che c'è dietro."])
})

test('su un computer (1440 px) ogni pezzo del titolo sta su una riga', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const pieces = page.getByRole('heading', { level: 1 }).locator('span')

  // Le righe si contano dai rettangoli del testo (un Range per pezzo): un rettangolo per
  // riga. Non dall'altezza, che durante l'entrata cambia perché l'animazione ingrandisce.
  for (const piece of await pieces.all()) {
    const lines = await piece.evaluate((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size
    })
    expect(lines).toBe(1)
  }
})

test('a 390 px il titolo resta dentro lo schermo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const box = await page.getByRole('heading', { level: 1 }).boundingBox()

  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
})
