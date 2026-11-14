/**
 * projects-scroll.spec.ts
 * L'entrata delle schede dei progetti (sections/Projects), fatta solo in CSS con una
 * timeline legata allo scroll: animation-timeline: view(). L'opacità di ogni scheda segue
 * la sua posizione nello schermo, non il tempo: è questo che la distingue dall'entrata di
 * prima (IntersectionObserver più una transizione), dove la scheda, entrata per un quinto,
 * finiva di comparire da sola e non tornava più indietro. Cinque controlli:
 *  - sotto lo schermo la scheda è trasparente, entrata tutta è piena;
 *  - ferma a metà entrata resta a metà, anche aspettando;
 *  - tornando su ridiventa trasparente;
 *  - nella stessa riga le schede entrano una dopo l'altra (a 1440 px, con tre colonne);
 *  - con Motion Off si vedono subito, anche sotto lo schermo.
 * La posizione si calcola dal layout (offsetTop, offsetHeight) e non da
 * getBoundingClientRect, che conterebbe anche lo spostamento dell'animazione.
 */
import { expect, test, type Locator, type Page } from '@playwright/test'
import { setMotion } from './preferences.ts'

const cards = (page: Page) => page.locator('#progetti > ul > li')

const opacityOf = (card: Locator) => card.evaluate((el) => Number(getComputedStyle(el).opacity))

/**
 * Scorre finché la scheda è entrata dal fondo dello schermo per la parte `inside` della
 * sua altezza: 0 è il bordo alto sul fondo dello schermo, 1 è la scheda entrata tutta,
 * un numero negativo è ancora sotto. Senza scorrimento morbido, per arrivare subito.
 */
async function enterBy(card: Locator, inside: number) {
  await card.evaluate((el, inside) => {
    let top = 0
    for (let node = el as HTMLElement | null; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop
    const height = (el as HTMLElement).offsetHeight
    window.scrollTo({ top: top + height * inside - window.innerHeight, behavior: 'instant' })
  }, inside)
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await setMotion(page, 'On')
})

test('sotto lo schermo la scheda è trasparente, entrata tutta è piena', async ({ page }) => {
  const card = cards(page).first()

  await enterBy(card, -0.2)
  await expect.poll(() => opacityOf(card)).toBe(0)

  await enterBy(card, 1.1)
  await expect.poll(() => opacityOf(card)).toBe(1)
})

test('ferma a metà entrata la scheda resta a metà, anche aspettando', async ({ page }) => {
  const card = cards(page).first()

  await enterBy(card, 0.5)
  // Più della transizione di prima (0,9 s): se l'entrata andasse a tempo, sarebbe finita.
  await page.waitForTimeout(1500)

  const opacity = await opacityOf(card)
  expect(opacity).toBeGreaterThan(0.2)
  expect(opacity).toBeLessThan(0.9)
})

test('tornando su la scheda ridiventa trasparente', async ({ page }) => {
  const card = cards(page).first()

  await enterBy(card, 1.1)
  await expect.poll(() => opacityOf(card)).toBe(1)

  await enterBy(card, -0.2)
  await expect.poll(() => opacityOf(card)).toBe(0)
})

test('nella stessa riga le schede entrano una dopo l’altra', async ({ page }) => {
  const [first, second, third] = await cards(page).all()
  // A 1440 px la griglia ha tre colonne: le prime tre schede stanno sulla stessa riga.
  const tops = await Promise.all([first, second, third].map((card) => card.evaluate((el) => (el as HTMLElement).offsetTop)))
  expect(new Set(tops).size).toBe(1)

  await enterBy(first, 0.5)
  await page.waitForTimeout(1500)

  const [a, b, c] = await Promise.all([first, second, third].map(opacityOf))
  expect(a).toBeGreaterThan(b)
  expect(b).toBeGreaterThan(c)
})

test('con Motion Off le schede si vedono subito, anche sotto lo schermo', async ({ page }) => {
  await setMotion(page, 'Off')
  const card = cards(page).first()

  await enterBy(card, -0.2)
  expect(await opacityOf(card)).toBe(1)
})
