/**
 * previews.spec.ts
 * Le anteprime nelle schede dei progetti (sections/Projects): ogni scheda mostra in alto
 * un'immagine vera del progetto, presa da src/assets/previews/ (da dove viene ognuna è
 * scritto nel README di quella cartella). Sei controlli:
 *  - ogni scheda ha la sua anteprima, con un testo alternativo diverso dalle altre;
 *  - le immagini si caricano davvero e sono larghe 720 px: qui si vede un file rovinato
 *    o salvato con altre misure (un file che manca ferma già la build, perché le
 *    immagini sono importate in data/projects.ts);
 *  - il tag dichiara le misure (width e height, 720×450, cioè 16:10) e il caricamento
 *    pigro (loading="lazy"): con le misure nel tag il browser riserva lo spazio prima
 *    che l'immagine arrivi. Il test guarda gli attributi, non il momento dello scarico;
 *  - col mouse sopra la scheda l'anteprima si ingrandisce un poco;
 *  - con Motion Off resta ferma;
 *  - resta ferma anche se il sistema chiede meno movimento (prefers-reduced-motion).
 * Gli ultimi tre guardano la prima scheda: la regola CSS è una sola per tutte.
 * Le schede si trovano dalla struttura (#progetti > ul > li), perché le classi dei
 * CSS Modules cambiano nome a ogni build.
 */
import { expect, test, type Locator, type Page } from '@playwright/test'
import { setMotion } from './preferences.ts'

const cards = (page: Page) => page.locator('#progetti > ul > li')

/** Di quanto è ingrandita l'immagine: 1 a riposo, più di 1 con il mouse sopra la scheda. */
const scaleOf = (img: Locator) => img.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a)

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
})

test('ogni scheda ha la sua anteprima, con il testo alternativo', async ({ page }) => {
  const all = await cards(page).all()
  expect(all.length).toBeGreaterThan(0)

  const alts: string[] = []
  for (const card of all) {
    const img = card.locator('img')
    await expect(img).toHaveCount(1)
    const alt = (await img.getAttribute('alt'))?.trim() ?? ''
    expect(alt.length, 'il testo alternativo descrive cosa si vede').toBeGreaterThan(15)
    alts.push(alt)
  }
  expect(new Set(alts).size, 'ogni anteprima ha una descrizione sua').toBe(alts.length)
})

test('le anteprime si caricano davvero', async ({ page }) => {
  const images = await cards(page).locator('img').all()
  expect(images.length).toBeGreaterThan(0)

  for (const img of images) {
    await img.scrollIntoViewIfNeeded()
    // 720 px di larghezza: il doppio di quanto è larga in pagina, nitida sugli schermi densi
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0)))
      .toBe(720)
  }
})

test('il tag dell’anteprima dichiara le misure in 16:10 e il caricamento pigro', async ({ page }) => {
  const img = cards(page).first().locator('img')

  await expect(img).toHaveAttribute('width', '720')
  await expect(img).toHaveAttribute('height', '450')
  await expect(img).toHaveAttribute('loading', 'lazy')

  await img.scrollIntoViewIfNeeded()
  const box = await img.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.width / box!.height).toBeCloseTo(1.6, 1)
})

test('col mouse sopra la scheda l’anteprima si ingrandisce', async ({ page }) => {
  await setMotion(page, 'On')
  const card = cards(page).first()
  await card.scrollIntoViewIfNeeded()
  const img = card.locator('img')

  expect(await scaleOf(img)).toBe(1)
  await card.hover()
  await expect.poll(() => scaleOf(img)).toBeGreaterThan(1.03)
})

test('con Motion Off l’anteprima resta ferma anche col mouse sopra', async ({ page }) => {
  await setMotion(page, 'Off')
  const card = cards(page).first()
  await card.scrollIntoViewIfNeeded()
  const img = card.locator('img')

  await card.hover()
  // Con Off le transizioni sono spente: uno zoom, se ci fosse, sarebbe già arrivato.
  expect(await scaleOf(img)).toBe(1)
})

test('con il sistema che chiede meno movimento l’anteprima resta ferma', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  // Con questa richiesta il sito parte da Off: si rimette On, così a tenere ferma
  // l'anteprima resta solo la regola @media di Projects.module.css.
  await setMotion(page, 'On')
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
  const card = cards(page).first()
  await card.scrollIntoViewIfNeeded()
  const img = card.locator('img')

  await card.hover()
  // Le transizioni sono spente da global.css: uno zoom, se ci fosse, sarebbe già arrivato.
  expect(await scaleOf(img)).toBe(1)
})
