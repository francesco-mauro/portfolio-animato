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
  // Il caso peggiore: un font largo. Inter e Segoe UI non ci sono ovunque (su Linux, e in
  // GitHub Actions, il browser ripiega su DejaVu Sans, più largo); Verdana lo è ancora di più.
  // Così il test dice la stessa cosa su ogni macchina.
  await page.addStyleTag({ content: "h1 { font-family: Verdana, 'DejaVu Sans', sans-serif !important; }" })
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

test('su un computer il titolo è a 80 px, più grande dei 68 di prima', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const size = await page.getByRole('heading', { level: 1 }).evaluate((el) => getComputedStyle(el).fontSize)

  expect(size).toBe('80px')
})

test('il nome in alto a sinistra e la città in alto a destra si vedono bene', async ({ page }) => {
  await page.goto('/')
  const brand = page.locator('header').first()
  const logo = brand.getByText('Francesco Mauro')
  const badge = brand.getByText('Roma')

  // Il nome è grande e chiuso da un punto corallo, la città sta in una pillola corallo.
  // Il corallo della pillola è quello scuro (--color-coral-deep, #c9402b): sul corallo dei
  // titoli il testo bianco a 15 px non ha abbastanza contrasto (tests/a11y.spec.ts).
  expect(parseFloat(await logo.evaluate((el) => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(26)
  expect(await logo.evaluate((el) => getComputedStyle(el, '::after').content)).toBe('"."')
  expect(await badge.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(201, 64, 43)')
  expect(await badge.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(255, 255, 255)')
})

test('la frase sotto il titolo racconta tutto lo stack, non solo il frontend', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#top p').last()).toHaveText(
    'Interfacce in React e TypeScript, server in Node.js, dati con SQL e Python.',
  )
})
