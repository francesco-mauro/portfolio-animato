/**
 * animated-previews.spec.ts
 * Le anteprime animate delle schede dei progetti (sections/Projects): le schede dei
 * progetti con una demo online hanno, sopra l'immagine ferma, un breve video della demo
 * (src/assets/previews/, da dove viene ognuno è scritto nel README di quella cartella).
 * Col mouse sopra la scheda il video parte e si vede, togliendo il mouse si ferma, sparisce
 * e torna all'inizio. Undici controlli:
 *  - hanno il video solo le schede con il link «Prova la demo» e quella degli incidenti
 *    stradali, che al posto della demo mostra le pagine della dashboard Power BI, ognuna
 *    con due formati (WebM per Chrome e Firefox, MP4 per Safari);
 *  - il tag è quello di un video decorativo e leggero: muto, in loop, dentro la pagina sul
 *    telefono (playsinline), nascosto ai lettori di schermo (l'immagine ha già il testo
 *    alternativo) e senza scarico anticipato (preload="none");
 *  - aprendo la pagina e scorrendo fino ai progetti nessun video viene scaricato;
 *  - nessun video comincia con la pagina ancora bianca: nei primi due secondi ogni
 *    fotogramma ha qualcosa da far vedere (il 12 novembre 2026 Boolzapp partiva con più
 *    di due secondi di bianco e il portfolio con mezzo, perché la registrazione era stata
 *    tagliata prima che la demo si caricasse). Lo misura sul WebM, l'unico formato che il
 *    Chromium dei test in Actions sa leggere: l'MP4 nasce dallo stesso taglio;
 *  - il video di Boolzapp comincia con la pagina già caricata tutta: l'intestazione a
 *    sinistra (foto, icone, fascia blu delle notifiche), che nel video non cambia mai, nel
 *    primo fotogramma è uguale a com'è al secondo 1,5 (il 13 novembre 2026 per circa mezzo
 *    secondo le icone erano quadratini vuoti, perché il loro carattere non era ancora
 *    arrivato, mentre l'immagine ferma le aveva);
 *  - col mouse sopra il video parte e si vede, a riposo è fermo e trasparente;
 *  - parte col mouse sopra anche il video della dashboard, nella scheda che non ha una demo;
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
/** La scheda degli incidenti stradali non ha una demo: il suo video mostra la dashboard Power BI. */
const dashboardCard = (page: Page) => cards(page).filter({ hasText: 'Incidenti stradali in Italia' })
const videoCards = (page: Page) => cards(page).filter({ has: page.locator('video') })

/** Lo stato del video come lo vede il browser: in pausa o no, a che secondo, quanto è visibile. */
const stateOf = (video: Locator) =>
  video.evaluate((el: HTMLVideoElement) => ({
    paused: el.paused,
    time: el.currentTime,
    opacity: Number(getComputedStyle(el).opacity),
  }))

/**
 * Quanto è vario un fotogramma: la deviazione standard della luminosità, da 0 a 255, su
 * una copia piccola (72×45) disegnata in un canvas. Un foglio bianco, o di un colore solo,
 * dà circa 0; una pagina con testo e forme molto di più. Carica il video in un elemento
 * nuovo, fuori dalla pagina, e lo porta a ogni secondo richiesto.
 */
const contrastAt = (page: Page, src: string, times: number[]) =>
  page.evaluate(
    async ({ src, times }) => {
      const video = document.createElement('video')
      video.muted = true
      video.preload = 'auto'
      video.src = src
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve
        video.onerror = () => reject(new Error(`non si carica: ${src}`))
      })
      const canvas = document.createElement('canvas')
      canvas.width = 72
      canvas.height = 45
      const context = canvas.getContext('2d', { willReadFrequently: true })!
      const result: number[] = []
      for (const time of times) {
        video.currentTime = time
        await new Promise((resolve) => (video.onseeked = resolve))
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
        const light: number[] = []
        for (let i = 0; i < data.length; i += 4) light.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
        const mean = light.reduce((a, b) => a + b, 0) / light.length
        result.push(Math.sqrt(light.reduce((a, b) => a + (b - mean) ** 2, 0) / light.length))
      }
      return result
    },
    { src, times },
  )

/**
 * La differenza media, da 0 a 255, tra due fotogrammi dello stesso video dentro un
 * rettangolo (in pixel del video, 720×450): 0 vuol dire identici.
 */
const regionDifference = (
  page: Page,
  src: string,
  [first, second]: [number, number],
  rect: { x: number; y: number; width: number; height: number },
) =>
  page.evaluate(
    async ({ src, times, rect }) => {
      const video = document.createElement('video')
      video.muted = true
      video.preload = 'auto'
      video.src = src
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve
        video.onerror = () => reject(new Error(`non si carica: ${src}`))
      })
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d', { willReadFrequently: true })!
      const frames: Uint8ClampedArray[] = []
      for (const time of times) {
        video.currentTime = time
        await new Promise((resolve) => (video.onseeked = resolve))
        context.drawImage(video, 0, 0)
        frames.push(context.getImageData(rect.x, rect.y, rect.width, rect.height).data)
      }
      let total = 0
      for (let i = 0; i < frames[0].length; i += 4) {
        for (let c = 0; c < 3; c++) total += Math.abs(frames[0][i + c] - frames[1][i + c])
      }
      return total / ((frames[0].length / 4) * 3)
    },
    { src, times: [first, second], rect },
  )

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

  test('hanno il video solo le schede con la demo e quella con la dashboard, in WebM e in MP4', async ({ page }) => {
    const withDemo = await demoCards(page).count()
    expect(withDemo).toBeGreaterThan(0)
    await expect(dashboardCard(page)).toHaveCount(1)
    await expect(dashboardCard(page).locator('video')).toHaveCount(1)
    await expect(cards(page).locator('video')).toHaveCount(withDemo + 1)

    for (const card of await videoCards(page).all()) {
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

  test('nessun video comincia con la pagina bianca', async ({ page }) => {
    const sources = await cards(page).locator('video source[type="video/webm"]').all()
    expect(sources.length).toBeGreaterThan(0)
    const times = [0, 0.5, 1, 1.5, 2]

    for (const source of sources) {
      const src = (await source.getAttribute('src'))!
      const contrast = await contrastAt(page, src, times)
      contrast.forEach((value, i) => {
        // 8 su 255: sopra un foglio bianco o la pagina vuota del portfolio prima delle forme.
        expect(value, `${src} al secondo ${times[i]}: fotogramma quasi tutto di un colore`).toBeGreaterThan(8)
      })
    }
  })

  test('il video di Boolzapp comincia con la pagina già caricata', async ({ page }) => {
    const card = cards(page).filter({ hasText: 'Boolzapp' })
    const src = (await card.locator('video source[type="video/webm"]').getAttribute('src'))!
    // L'intestazione della colonna dei contatti: foto, tre icone e la fascia blu delle notifiche.
    const header = { x: 72, y: 10, width: 213, height: 85 }
    // 2 su 255: sopra il rumore della compressione, sotto le icone che mancano.
    expect(await regionDifference(page, src, [0, 1.5], header)).toBeLessThan(2)
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

  test('col mouse sopra parte anche il video della dashboard, nella scheda senza demo', async ({ page }) => {
    await page.getByRole('radio', { name: 'On' }).click()
    const card = dashboardCard(page)
    await card.scrollIntoViewIfNeeded()
    const video = card.locator('video')
    expect((await stateOf(video)).paused, 'a riposo è fermo').toBe(true)

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
