/**
 * marquee.spec.ts
 * Test della fascia con lo stack (sezione #stack). Con Motion su On la fascia deve
 * continuare a scorrere anche quando il cursore ci passa sopra; con Off deve stare
 * ferma. Il test legge la posizione della traccia (transform) due volte, a 600 ms
 * di distanza, e guarda se è cambiata.
 */
import { expect, test, type Page } from '@playwright/test'
import { setMotion } from './preferences.ts'

const track = (page: Page) => page.locator('#stack ul')

async function offsetX(page: Page): Promise<number> {
  return track(page).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)
}

async function movesWithin(page: Page, ms: number): Promise<boolean> {
  const before = await offsetX(page)
  await page.waitForTimeout(ms)
  return (await offsetX(page)) !== before
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.locator('#stack').scrollIntoViewIfNeeded()
})

test('con Motion On la fascia scorre anche con il cursore sopra', async ({ page }) => {
  await setMotion(page, 'On')
  // Il cursore va al centro del riquadro della fascia, che sta fermo: la traccia
  // dentro si muove, e Playwright non ci punterebbe sopra.
  await track(page).locator('..').hover()
  expect(await movesWithin(page, 600)).toBe(true)
})

test('con Motion Off la fascia sta ferma', async ({ page }) => {
  await setMotion(page, 'Off')
  expect(await movesWithin(page, 600)).toBe(false)
})
