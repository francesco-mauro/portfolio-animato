/**
 * projects.spec.ts
 * La vetrina dei progetti (data/projects.ts): il gestionale documentale ne è uscito il
 * 7 novembre 2026, quindi non deve comparire da nessuna parte nella pagina, e la scheda
 * «Primo in vetrina» della prima schermata mostra il progetto che ora è primo.
 * Al suo posto c'è il sito stesso, con il link alla sua demo.
 * Le due schede in evidenza (gli incidenti stradali e questo sito) stanno in testa, più
 * grandi, e raccontano il progetto in tre parti: il punto di partenza, cosa ho fatto, cosa
 * ne è uscito. Le altre quattro stanno sotto, corte: su una riga sul computer, due per riga
 * sul tablet, una sotto l'altra sul telefono. La posizione si legge dal layout
 * (offsetLeft, offsetTop, offsetWidth), non da getBoundingClientRect, che conterebbe anche
 * lo spostamento dell'entrata con lo scroll.
 */
import { expect, test, type Page } from '@playwright/test'

/** Le due liste della sezione: la prima con le schede in evidenza, la seconda con le altre. */
const featured = (page: Page) => page.locator('#progetti > ul').nth(0).locator(':scope > li')
const others = (page: Page) => page.locator('#progetti > ul').nth(1).locator(':scope > li')

/** Posto e larghezza di ogni scheda di una lista, rispetto alla pagina. */
const boxes = (page: Page, which: 'featured' | 'others') =>
  (which === 'featured' ? featured(page) : others(page)).evaluateAll((els) =>
    els.map((el) => {
      let left = 0
      let top = 0
      for (let node = el as HTMLElement | null; node; node = node.offsetParent as HTMLElement | null) {
        left += node.offsetLeft
        top += node.offsetTop
      }
      return { left, top, width: (el as HTMLElement).offsetWidth }
    }),
  )

/** Quante schede stanno su ogni riga, dall'alto in basso. */
const perRow = (list: { top: number }[]) => {
  const rows = new Map<number, number>()
  for (const { top } of list) rows.set(top, (rows.get(top) ?? 0) + 1)
  return [...rows.values()]
}

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

test('il sito animato è in vetrina, con il link alla sua demo', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#progetti')).toContainText('Portfolio animato')
  await expect(page.locator('#progetti a[href="https://github.com/francesco-mauro/portfolio-animato"]')).toHaveCount(1)
  await expect(page.locator('#progetti a[href="https://francesco-mauro.github.io/portfolio-animato/"]')).toHaveCount(1)
})

test('in evidenza ci sono gli incidenti stradali e questo sito, raccontati in tre parti', async ({ page }) => {
  await page.goto('/')
  await expect(featured(page)).toHaveCount(2)
  await expect(featured(page).getByRole('heading', { level: 3 })).toHaveText(['Incidenti stradali in Italia', 'Portfolio animato'])
  for (const card of await featured(page).all()) {
    for (const label of ['Il punto di partenza', 'Cosa ho fatto', 'Cosa ne è uscito']) {
      await expect(card.getByText(label, { exact: true })).toBeVisible()
    }
  }
  await expect(featured(page).nth(0)).toContainText('1.202 comuni')
  await expect(featured(page).nth(1)).toContainText('test end-to-end con Playwright')
})

test('le altre quattro schede sono corte, e Foodie dice qual è stata la mia parte', async ({ page }) => {
  await page.goto('/')
  await expect(others(page)).toHaveCount(4)
  await expect(others(page).getByText('Il punto di partenza')).toHaveCount(0)
  await expect(others(page).filter({ hasText: 'Foodie Journal' })).toContainText('La mia parte')
})

test('a 1440 px le due in evidenza sono affiancate e più larghe, le altre quattro su una riga', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const big = await boxes(page, 'featured')
  const small = await boxes(page, 'others')
  expect(perRow(big)).toEqual([2])
  expect(perRow(small)).toEqual([4])
  expect(Math.min(...big.map((box) => box.width))).toBeGreaterThan(1.5 * Math.max(...small.map((box) => box.width)))
})

test('a 768 px le due in evidenza sono una sotto l’altra, le altre due per riga', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/')
  expect(perRow(await boxes(page, 'featured'))).toEqual([1, 1])
  expect(perRow(await boxes(page, 'others'))).toEqual([2, 2])
})

test('a 390 px tutte le schede sono una sotto l’altra e stanno nello schermo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const all = [...(await boxes(page, 'featured')), ...(await boxes(page, 'others'))]
  expect(perRow(all)).toEqual([1, 1, 1, 1, 1, 1])
  for (const box of all) expect(box.left + box.width).toBeLessThanOrEqual(390)
})
