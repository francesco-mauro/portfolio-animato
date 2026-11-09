/**
 * mobile.spec.ts
 * Il sito a 390 px, la larghezza di un telefono, che è da dove si apre quasi sempre
 * un link arrivato da LinkedIn o da una chat. Tre controlli sulla prima schermata:
 *  - nessuna forma corallo tocca le lettere del titolo: titolo e forme sono dello
 *    stesso colore, quindi dove si sovrappongono le lettere spariscono (il 7 novembre
 *    2026 la sfera grande copriva la virgola dopo «vedi»);
 *  - il menu in basso non copre il titolo;
 *  - niente esce di lato, quindi la pagina non scorre in orizzontale.
 * Si aspetta la fine delle animazioni di entrata, perché spostano le parole del titolo.
 */
import { expect, test, type Page } from '@playwright/test'

type Box = { x: number; y: number; width: number; height: number }

// Le forme fluttuano: salgono fino a 18 px (Shape.module.css, @keyframes float).
// Per questo il rettangolo di ogni forma, riportato a riposo, si allunga in alto di 18 px.
const FLOAT = 18

function overlaps(a: Box, b: Box) {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
}

async function openPhone(page: Page, width = 390, height = 844) {
  await page.setViewportSize({ width, height })
  await page.goto('/')
  // Aspetta solo le animazioni che finiscono (le entrate), non quelle infinite.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished),
    ),
  )
}

// Un rettangolo per ogni riga di testo del titolo, preso dalle lettere e non dai blocchi
// dei due pezzi (larghi quanto la colonna), così lo spazio vuoto ai lati non conta.
async function titleLines(page: Page): Promise<Box[]> {
  return page.getByRole('heading', { level: 1 }).evaluate((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const boxes = []
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const range = document.createRange()
      range.selectNodeContents(node)
      for (const r of range.getClientRects()) boxes.push({ x: r.x, y: r.y, width: r.width, height: r.height })
    }
    return boxes
  })
}

// Tre telefoni: uno stretto, quello di riferimento, uno largo. A 430 px il secondo pezzo
// del titolo sta su una riga sola e arriva più a destra.
for (const [width, height] of [
  [360, 740],
  [390, 844],
  [430, 932],
]) {
  test(`a ${width} px nessuna forma tocca le lettere del titolo`, async ({ page }) => {
    await openPhone(page, width, height)
    const lines = await titleLines(page)
    const shapes = page.locator('#top [data-shape]')

    expect(lines.length).toBeGreaterThan(0)
    expect(await shapes.count()).toBe(5)

    for (const shape of await shapes.all()) {
      const box = await shape.boundingBox()
      if (!box) continue
      // Il rettangolo è preso in un punto qualsiasi del fluttuare: si toglie lo spostamento
      // del momento (la proprietà translate) per tornare alla posizione di riposo, poi si
      // allunga verso l'alto fino al punto più alto, 18 px sopra.
      const lift = await shape.evaluate((el) => parseFloat(getComputedStyle(el).translate.split(' ')[1] ?? '0') || 0)
      const restY = box.y - lift
      const reach = { ...box, y: restY - FLOAT, height: box.height + FLOAT }
      const kind = await shape.getAttribute('data-shape')
      for (const line of lines) {
        expect(overlaps(reach, line), `la forma ${kind} tocca il titolo`).toBe(false)
      }
    }
  })
}

test('a 390 px il menu non copre il titolo', async ({ page }) => {
  await openPhone(page)
  const lines = await titleLines(page)
  const nav = await page.getByRole('navigation').first().boundingBox()

  expect(nav).not.toBeNull()
  for (const line of lines) {
    expect(overlaps(nav!, line)).toBe(false)
  }
})

test('a 390 px la pagina non scorre di lato', async ({ page }) => {
  await openPhone(page)
  const width = await page.evaluate(() => document.documentElement.scrollWidth)

  expect(width).toBeLessThanOrEqual(390)
})
