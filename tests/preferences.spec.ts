/**
 * preferences.spec.ts
 * Il pannello delle preferenze (components/Preferences). Prima lingua, tema e Motion erano
 * tre blocchi fissi in basso a destra: sul telefono, insieme al menu, coprivano circa 155 px
 * di pagina e il copyright restava sotto il menu. Ora in basso c'è un oggetto solo, il menu
 * a pillola, e il suo ultimo bottone apre un pannello con i tre controlli.
 * I test dicono:
 *  - a pannello chiuso, in basso di fisso c'è solo il menu, a ogni larghezza;
 *  - il bottone apre il pannello, che sta tutto nello schermo e non copre il menu;
 *  - lingua, tema e Motion funzionano da dentro il pannello, che resta aperto;
 *  - si chiude con Esc (il focus torna al bottone), con un click fuori (anche su una voce
 *    del menu) e uscendo con Tab; un click su un punto vuoto del pannello non lo chiude;
 *  - da tastiera le sei fermate del pannello sono nell'ordine in cui si vedono, dentro lo
 *    schermo e con l'anello del focus, anche sul telefono;
 *  - il menu con il bottone in più sta nello schermo anche su un telefono stretto;
 *  - in fondo alla pagina il copyright non è sotto il menu.
 */
import { expect, test, type Page } from '@playwright/test'
import { openPreferences, preferencesButton } from './preferences.ts'

type Box = { x: number; y: number; width: number; height: number }

const apart = (a: Box, b: Box) =>
  a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y

const nav = (page: Page) => page.getByRole('navigation').first()
const panel = (page: Page) => page.getByRole('group', { name: 'Preferenze di visualizzazione' })

/** Apre la pagina a una larghezza e aspetta che il menu sia salito al suo posto. */
async function open(page: Page, width: number, height = 844) {
  await page.setViewportSize({ width, height })
  await page.goto('/')
  await expect(nav(page)).toBeVisible()
  await nav(page).evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)))
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
})

for (const width of [390, 768, 1440]) {
  test(`a ${width} px, a pannello chiuso, in basso di fisso c'è solo il menu`, async ({ page }) => {
    await open(page, width)
    await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByRole('radio')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Tema scuro' })).toHaveCount(0)

    // Ogni elemento fisso che tocca gli ultimi 200 px dello schermo deve stare nel menu.
    const strays = await page.evaluate(() => {
      const found: string[] = []
      for (const el of document.body.querySelectorAll<HTMLElement>('*')) {
        if (getComputedStyle(el).position !== 'fixed' || !el.checkVisibility()) continue
        const box = el.getBoundingClientRect()
        if (box.width === 0 || box.bottom <= innerHeight - 200 || box.top >= innerHeight) continue
        if (!el.closest('nav')) found.push(el.tagName + '.' + el.className)
      }
      return found
    })
    expect(strays, 'elementi fissi in basso fuori dal menu').toEqual([])
  })

  test(`a ${width} px il bottone apre il pannello, tutto nello schermo e senza coprire il menu`, async ({ page }) => {
    await open(page, width)
    await openPreferences(page)

    const box = await panel(page).boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    expect(box!.y).toBeGreaterThanOrEqual(0)

    await expect(page.getByRole('radiogroup', { name: 'Lingua' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tema scuro' })).toBeVisible()
    await expect(page.getByRole('radiogroup', { name: 'Movimento' })).toBeVisible()

    // Il pannello sta sopra le voci del menu, non sopra di loro: si vedono e si cliccano ancora.
    for (const name of ['Torna su', 'Chi sono', 'Progetti', 'Contatti']) {
      const link = await nav(page).getByRole('link', { name }).boundingBox()
      expect(apart(box!, link!), `il pannello copre «${name}»`).toBe(true)
    }
  })
}

test('lingua, tema e Motion funzionano dal pannello, che resta aperto', async ({ page }) => {
  await open(page, 1280)
  await openPreferences(page)
  const html = page.locator('html')

  await page.getByRole('radio', { name: 'English' }).click()
  await expect(html).toHaveAttribute('lang', 'en')
  await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'true')

  await page.getByRole('button', { name: 'Dark theme' }).click()
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'true')

  await page.getByRole('radio', { name: 'X-ray' }).click()
  await expect(html).toHaveAttribute('data-motion', 'xray')
  await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'true')
})

test('Esc chiude il pannello e riporta il focus sul bottone', async ({ page }) => {
  await open(page, 1280)
  await openPreferences(page)
  await page.getByRole('radio', { name: 'English' }).focus()

  await page.keyboard.press('Escape')
  await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'false')
  await expect(panel(page)).toHaveCount(0)
  await expect(preferencesButton(page)).toBeFocused()
})

test('un click fuori chiude il pannello', async ({ page }) => {
  await open(page, 1280)
  await openPreferences(page)

  await page.locator('body').click({ position: { x: 5, y: 5 } })
  await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'false')
})

test('un click su un punto vuoto del pannello non lo chiude, una voce del menu sì, e poi si riapre', async ({ page }) => {
  await open(page, 1280)
  await openPreferences(page)

  // «Motion», la scritta della terza riga: è testo, non un controllo.
  await panel(page).getByText('Motion', { exact: true }).click()
  await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'true')

  await nav(page).getByRole('link', { name: 'Progetti' }).click()
  await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'false')

  await openPreferences(page)
  await expect(panel(page)).toBeVisible()
})

for (const width of [1280, 390]) {
  test(`a ${width} px, da tastiera: Invio apre, Tab passa per i sei controlli nell'ordine in cui si vedono, ognuno con l'anello, e uscendo si chiude`, async ({ page }) => {
    await open(page, width)
    await preferencesButton(page).focus()
    await page.keyboard.press('Enter')
    await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'true')

    const stops: { name: string; x: number; y: number }[] = []
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement
        const box = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        return {
          name: el.getAttribute('aria-label') ?? el.innerText.trim(),
          x: box.left,
          y: box.top,
          inside: box.width > 0 && box.top >= 0 && box.bottom <= innerHeight && box.left >= 0 && box.right <= innerWidth,
          outlineStyle: style.outlineStyle,
          outlineWidth: parseFloat(style.outlineWidth),
          boxShadow: style.boxShadow,
        }
      })
      expect(stop.inside, `${stop.name} è dentro lo schermo`).toBe(true)
      expect(stop.outlineStyle, `outline su ${stop.name}`).toBe('solid')
      expect(stop.outlineWidth, `spessore su ${stop.name}`).toBeGreaterThanOrEqual(3)
      expect(stop.boxShadow, `alone chiaro su ${stop.name}`).not.toBe('none')
      stops.push(stop)
    }
    expect(stops.map((stop) => stop.name)).toEqual(['Italiano', 'English', 'Tema scuro', 'Off', 'On', 'X-ray'])
    // L'ordine del Tab è quello dello schermo: ogni fermata sta più in basso della
    // precedente, o sulla stessa riga più a destra.
    for (let i = 1; i < stops.length; i++) {
      const [before, after] = [stops[i - 1], stops[i]]
      const sameRow = Math.abs(after.y - before.y) < 12
      expect(sameRow ? after.x > before.x : after.y > before.y, `${after.name} viene dopo ${before.name} sullo schermo`).toBe(true)
    }

    await page.keyboard.press('Tab')
    await expect(preferencesButton(page)).toHaveAttribute('aria-expanded', 'false')
    expect(await page.evaluate(() => document.activeElement?.closest('main') !== null)).toBe(true)
  })
}

// Il caso peggiore, un carattere largo: gli stessi caratteri di hero.spec.ts e
// language.spec.ts, qui su tutta la pagina, per dire la stessa cosa su ogni macchina (il sito
// usa il carattere del sistema, che cambia da una macchina all'altra). Allarga sia il menu
// sia il copyright.
const WIDE_FONT = "* { font-family: Verdana, 'DejaVu Sans', sans-serif !important; }"

for (const [width, lang, font] of [
  [320, 'it', 'di sistema'],
  [320, 'en', 'di sistema'],
  [360, 'it', 'di sistema'],
  [320, 'en', 'largo'],
  [360, 'en', 'largo'],
] as const) {
  test(`a ${width} px in ${lang} con il carattere ${font} il menu con il bottone sta nello schermo`, async ({ page }) => {
    await page.addInitScript((l) => localStorage.setItem('lang', l), lang)
    await open(page, width)
    if (font === 'largo') await page.addStyleTag({ content: WIDE_FONT })
    const box = await nav(page).boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    // (La pagina intera a 320 px scorre già di 1 px di lato per conto suo, per una forma
    // della prima schermata: per questo qui si guarda il menu e non la larghezza della pagina.)

    await openPreferences(page)
    const opened = await page.locator('#preferenze').boundingBox()
    expect(opened!.x).toBeGreaterThanOrEqual(0)
    expect(opened!.x + opened!.width).toBeLessThanOrEqual(width)
  })
}

// 660 e 700 px: la fascia in cui il menu, più largo sopra i 640, torna vicino al copyright.
// 900 e 920 px: a cavallo della soglia oltre la quale il copyright torna nell'angolo.
for (const [width, font] of [
  [320, 'di sistema'],
  [390, 'di sistema'],
  [660, 'di sistema'],
  [700, 'di sistema'],
  [768, 'di sistema'],
  [1440, 'di sistema'],
  [390, 'largo'],
  [660, 'largo'],
  [768, 'largo'],
  [900, 'largo'],
  [920, 'largo'],
] as const) {
  test(`a ${width} px con il carattere ${font}, in fondo alla pagina, il copyright non è sotto il menu`, async ({ page }) => {
    await open(page, width)
    if (font === 'largo') await page.addStyleTag({ content: WIDE_FONT })
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
    const copyright = page.getByText(/^© \d{4} /)
    await expect(copyright).toBeInViewport({ ratio: 1 })

    const text = await copyright.boundingBox()
    const menu = await nav(page).boundingBox()
    expect(apart(text!, menu!), 'il menu copre il copyright').toBe(true)
  })
}
