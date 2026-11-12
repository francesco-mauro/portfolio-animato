/**
 * animated-previews.spec.ts
 * Le anteprime animate delle schede dei progetti (sections/Projects): le schede dei
 * progetti con una demo online hanno, sopra l'immagine ferma, un breve video della demo
 * (src/assets/previews/, da dove viene ognuno è scritto nel README di quella cartella).
 * Col mouse sopra la scheda il video parte e si vede, togliendo il mouse si ferma, sparisce
 * e torna all'inizio. Otto controlli:
 *  - hanno il video solo le schede con il link «Prova la demo», ognuna con due formati
 *    (WebM per Chrome e Firefox, MP4 per Safari);
 *  - il tag è quello di un video decorativo e leggero: muto, in loop, dentro la pagina sul
 *    telefono (playsinline), nascosto ai lettori di schermo (l'immagine ha già il testo
 *    alternativo) e senza scarico anticipato (preload="none");
 *  - aprendo la pagina e scorrendo fino ai progetti nessun video viene scaricato;
 *  - col mouse sopra il video parte e si vede, a riposo è fermo e trasparente;
 *  - togliendo il mouse si ferma, sparisce e riparte da capo;
 *  - con Motion Off resta fermo anche col mouse sopra;
 *  - resta fermo anche se il sistema chiede meno movimento, con Motion rimesso su On;
 *  - sul telefono, toccando la scheda, non parte e non si scarica: lì vale l'immagine.
 * «Parte» vuol dire che il video non è in pausa e il suo tempo va avanti: lo dice il
 * browser, non un'animazione CSS. Le schede si trovano dalla struttura (#progetti > ul > li),
 * perché le classi dei CSS Modules cambiano nome a ogni build.
 */
import { expect, test, type Locator, type Page } from '@playwright/test'

const cards = (page: Page) => page.locator('#progetti > ul > li')
const demoCards = (page: Page) => cards(page).filter({ has: page.getByRole('link', { name: /Prova la demo/ }) })

/** Lo stato del video come lo vede il browser: in pausa o no, a che secondo, quanto è visibile. */
const stateOf = (video: Locator) =>
  video.evaluate((el: HTMLVideoElement) => ({
    paused: el.paused,
    time: el.currentTime,
    opacity: Number(getComputedStyle(el).opacity),
  }))

/** La prima scheda con la demo, portata nello schermo, e il suo video. */
async function firstDemoCard(page: Page) {
  const card = demoCards(page).first()
  await card.scrollIntoViewIfNeeded()
  return { card, video: card.locator('video') }
}

test.describe('col mouse, sul computer', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
  })

  test('hanno il video solo le schede con la demo, in WebM e in MP4', async ({ page }) => {
    const withDemo = await demoCards(page).count()
    expect(withDemo).toBeGreaterThan(0)
    await expect(cards(page).locator('video')).toHaveCount(withDemo)

    for (const card of await demoCards(page).all()) {
      const sources = card.locator('video source')
      await expect(sources).toHaveCount(2)
      await expect(sources.nth(0)).toHaveAttribute('type', 'video/webm')
      await expect(sources.nth(0)).toHaveAttribute('src', /\.webm$/)
      await expect(sources.nth(1)).toHaveAttribute('type', 'video/mp4')
      await expect(sources.nth(1)).toHaveAttribute('src', /\.mp4$/)
    }
  })

  test('il video è muto, in loop, nascosto ai lettori di schermo e non si scarica in anticipo', async ({ page }) => {
    const videos = await cards(page).locator('video').all()
    expect(videos.length).toBeGreaterThan(0)
    for (const video of videos) {
      expect(await video.evaluate((el: HTMLVideoElement) => el.muted), 'muto').toBe(true)
      await expect(video).toHaveAttribute('loop', '')
      await expect(video).toHaveAttribute('playsinline', '')
      await expect(video).toHaveAttribute('preload', 'none')
      await expect(video).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('aprendo la pagina e scorrendo fino ai progetti nessun video viene scaricato', async ({ page }) => {
    const videoRequests: string[] = []
    // Solo le richieste del browser per un video (resourceType 'media'): in sviluppo Vite
    // chiede anche «boolzapp.mp4?import», che è il modulo con l'indirizzo, non il file.
    page.on('request', (request) => {
      if (request.resourceType() === 'media') videoRequests.push(request.url())
    })
    await page.goto('/')
    for (const card of await cards(page).all()) await card.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    expect(videoRequests).toEqual([])
  })

  test('col mouse sopra il video parte e si vede', async ({ page }) => {
    await page.getByRole('radio', { name: 'On' }).click()
    const { card, video } = await firstDemoCard(page)

    const atRest = await stateOf(video)
    expect(atRest.paused, 'a riposo è fermo').toBe(true)
    expect(atRest.opacity, 'a riposo è trasparente').toBe(0)

    await card.hover()
    await expect.poll(async () => (await stateOf(video)).time, { timeout: 8000 }).toBeGreaterThan(0.3)
    expect((await stateOf(video)).paused).toBe(false)
    await expect.poll(async () => (await stateOf(video)).opacity).toBe(1)
  })

  test('togliendo il mouse il video si ferma, sparisce e riparte da capo', async ({ page }) => {
    await page.getByRole('radio', { name: 'On' }).click()
    const { card, video } = await firstDemoCard(page)

    await card.hover()
    await expect.poll(async () => (await stateOf(video)).time, { timeout: 8000 }).toBeGreaterThan(0.3)

    await page.mouse.move(5, 5)
    await expect.poll(async () => (await stateOf(video)).paused).toBe(true)
    expect((await stateOf(video)).time, 'riparte da capo').toBe(0)
    await expect.poll(async () => (await stateOf(video)).opacity).toBe(0)
  })

  test('con Motion Off il video resta fermo anche col mouse sopra', async ({ page }) => {
    await page.getByRole('radio', { name: 'Off' }).click()
    const { card, video } = await firstDemoCard(page)

    await card.hover()
    await page.waitForTimeout(800)
    const state = await stateOf(video)
    expect(state.paused).toBe(true)
    expect(state.time).toBe(0)
    expect(state.opacity).toBe(0)
  })

  test('con il sistema che chiede meno movimento il video resta fermo', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    // Con questa richiesta il sito parte da Off: si rimette On, così a tenere fermo il video
    // resta solo il controllo di prefers-reduced-motion.
    await page.getByRole('radio', { name: 'On' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
    const { card, video } = await firstDemoCard(page)

    await card.hover()
    await page.waitForTimeout(800)
    const state = await stateOf(video)
    expect(state.paused).toBe(true)
    expect(state.opacity).toBe(0)
  })
})

test.describe('sul telefono', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('toccando la scheda il video non parte e non si scarica: vale l’immagine', async ({ page }) => {
    // Con un dito l'uscita arriva subito dopo il tocco e fermerebbe il video comunque: quello
    // che conta qui è che il tocco non lo faccia partire, cioè che il telefono non lo scarichi.
    const videoRequests: string[] = []
    page.on('request', (request) => {
      if (request.resourceType() === 'media') videoRequests.push(request.url())
    })
    await page.goto('/')
    await page.getByRole('radio', { name: 'On' }).click()
    const { card, video } = await firstDemoCard(page)

    // Si tocca il titolo, non un link: la scheda riceve il tocco senza cambiare pagina.
    await card.locator('h3').tap()
    await page.waitForTimeout(800)
    expect(videoRequests).toEqual([])
    const state = await stateOf(video)
    expect(state.paused).toBe(true)
    expect(state.opacity).toBe(0)
  })
})
