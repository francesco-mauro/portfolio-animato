/**
 * reading-bar.spec.ts
 * La barra di lettura (components/ReadingBar): una riga sottile in cima allo schermo che
 * si riempie da sinistra a destra man mano che la pagina scorre. È solo CSS, una timeline
 * legata allo scroll della pagina (animation-timeline: scroll()), senza ascoltare lo
 * scroll in JavaScript. Quanto è piena si legge dalla sua trasformazione: scaleX va da 0
 * (vuota) a 1 (piena). Quattro controlli:
 *  - in cima alla pagina è vuota;
 *  - a metà pagina è piena a metà;
 *  - in fondo è piena e larga quanto lo schermo;
 *  - con Motion Off resta vuota, come ogni altro movimento del sito.
 */
import { expect, test, type Page } from '@playwright/test'

const bar = (page: Page) => page.getByTestId('reading-bar')

/** Quanto è piena la barra, da 0 a 1. */
const fill = (page: Page) => bar(page).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a)

/** Porta la pagina a una parte del suo scorrimento: 0 è la cima, 1 il fondo. Senza scorrimento morbido. */
async function scrollToPart(page: Page, part: number) {
  await page.evaluate((part) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: max * part, behavior: 'instant' })
  }, part)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: 'On' }).click()
})

test('in cima alla pagina la barra è vuota', async ({ page }) => {
  await scrollToPart(page, 0)
  await expect.poll(() => fill(page)).toBe(0)
})

test('a metà pagina la barra è piena a metà', async ({ page }) => {
  await scrollToPart(page, 0.5)
  await expect.poll(() => fill(page)).toBeCloseTo(0.5, 1)
})

test('in fondo alla pagina la barra è piena, larga quanto lo schermo', async ({ page }) => {
  await scrollToPart(page, 1)
  await expect.poll(() => fill(page)).toBeGreaterThan(0.99)

  const box = await bar(page).boundingBox()
  const width = await page.evaluate(() => document.documentElement.clientWidth)
  expect(box).not.toBeNull()
  expect(box!.y).toBe(0)
  expect(Math.abs(box!.width - width)).toBeLessThan(2)
})

test('con Motion Off la barra resta vuota', async ({ page }) => {
  // Prima con On, in fondo, la barra c'è: così il test non passa solo perché non trova niente.
  await scrollToPart(page, 1)
  await expect.poll(() => fill(page)).toBeGreaterThan(0.99)

  await page.getByRole('radio', { name: 'Off' }).click()
  await expect.poll(() => fill(page)).toBe(0)
})
