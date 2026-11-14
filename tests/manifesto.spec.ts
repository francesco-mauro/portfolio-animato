/**
 * manifesto.spec.ts
 * Test del Manifesto (sections/Manifesto, la sezione «Chi sono»): il testo grande che si
 * accende parola per parola mentre scorri. È l'effetto più delicato della pagina, perché
 * dipende dal calcolo dello scroll (hooks/useScrollProgress), dall'altezza della sezione
 * e dal CSS: se uno dei tre cambia, le parole restano spente o si accendono tutte insieme.
 * Si controlla che con l'inizio della sezione a metà schermo le parole siano spente, che
 * in fondo siano tutte accese e che con Motion Off siano accese subito, senza scorrere.
 * Accesa o spenta si legge dal colore, quello che vede chi guarda la pagina.
 */
import { expect, test, type Page } from '@playwright/test'
import { setMotion } from './preferences.ts'

const LIT = 'rgb(244, 244, 246)' // --color-light, parola accesa

const section = (page: Page) => page.getByRole('region', { name: 'Chi sono' })

/** Quante parole sono accese e quante sono in tutto. */
const litCount = (page: Page) =>
  section(page)
    .locator('p span')
    .evaluateAll((spans, lit) => ({
      lit: spans.filter((s) => getComputedStyle(s).color === lit).length,
      total: spans.length,
    }), LIT)

/** Porta l'inizio della sezione a metà schermo, oppure la sua fine in fondo allo schermo. */
async function scrollTo(page: Page, where: 'inizio' | 'fine') {
  await section(page).evaluate((el, where) => {
    const box = el.getBoundingClientRect()
    const top = box.top + window.scrollY
    const y = where === 'inizio' ? top - window.innerHeight / 2 : top + box.height - window.innerHeight
    window.scrollTo(0, y)
  }, where)
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await setMotion(page, 'On')
})

test('con l’inizio della sezione a metà schermo le parole sono spente', async ({ page }) => {
  await scrollTo(page, 'inizio')
  await expect.poll(async () => (await litCount(page)).lit).toBe(0)
})

test('in fondo alla sezione le parole sono tutte accese', async ({ page }) => {
  await scrollTo(page, 'fine')
  await expect.poll(async () => {
    const { lit, total } = await litCount(page)
    return total > 0 && lit === total
  }).toBe(true)
})

test('con Motion Off le parole sono tutte accese anche senza scorrere', async ({ page }) => {
  await setMotion(page, 'Off')
  await scrollTo(page, 'inizio')
  await expect.poll(async () => {
    const { lit, total } = await litCount(page)
    return total > 0 && lit === total
  }).toBe(true)
})
