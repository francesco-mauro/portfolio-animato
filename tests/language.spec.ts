/**
 * language.spec.ts
 * La versione inglese del sito (components/LanguageToggle, context/LanguageContext e lo
 * script in index.html). Il sito parte nella lingua del browser, italiano se il browser è
 * in italiano e inglese per tutti gli altri; l'interruttore IT · EN la cambia e la scelta
 * resta dopo il ricaricamento, perché è salvata in localStorage. La lingua si legge da
 * <html lang>.
 *
 * Due controlli tengono insieme la promessa «cambia tutti i testi»:
 *  - dai dati alla pagina: ogni testo bilingue di src/data/ (profile.ts, projects.ts, ui.ts)
 *    sta sulla pagina nella lingua scelta, e non nell'altra. I dati non sono copiati qui:
 *    il test li chiede a Vite dentro la pagina, gli stessi moduli che la pagina usa, perché
 *    projects.ts importa immagini e video e Node da solo non lo saprebbe leggere;
 *  - dalla pagina ai dati: passando a EN, ogni pezzo di testo della pagina cambia, tranne
 *    quelli che non hanno lingua (nomi, tecnologie, codice, numeri). È questo che si accorge
 *    di una scritta italiana lasciata dentro un componente invece che in src/data/.
 * Per «testo» qui si intende anche quello che non si vede subito: aria-label (lettori di
 * schermo), alt (immagini), title (al passaggio del mouse), data-xray (le etichette X-ray).
 *
 * Cosa non controlla: i meta della pagina (titolo, descrizione, anteprima Open Graph), che
 * restano in italiano perché chi legge il link da fuori non esegue JavaScript; e la qualità
 * della traduzione, che un test non può giudicare.
 */
import { expect, test, type Page } from '@playwright/test'

type Lang = 'it' | 'en'
type Localized = Record<Lang, string>

const OTHER: Record<Lang, Lang> = { it: 'en', en: 'it' }

/** I moduli dei dati, con l'indirizzo che hanno sul server di sviluppo di Vite. */
const DATA_FILES = ['/src/data/profile.ts', '/src/data/projects.ts', '/src/data/stack.ts', '/src/data/ui.ts']

/** Gli attributi che portano testo anche se sulla pagina non si legge. */
const TEXT_ATTRIBUTES = ['aria-label', 'alt', 'title', 'data-xray']

/**
 * I testi dell'interfaccia uguali nelle due lingue, scritti nei componenti: parole inglesi
 * già nel sito italiano (l'interruttore Motion, le schede della prima schermata), codice,
 * sigle delle lingue, la freccia dei link. I nomi e le tecnologie non stanno qui: arrivano
 * dai dati (siteData).
 */
const NO_LANGUAGE = [
  'Motion',
  'Off',
  'On',
  'X-ray',
  'IT',
  'EN',
  'Italiano',
  'English',
  'Build',
  'Ease',
  'Out back',
  'tsc -b && vite build',
  '0.34, 1.56, 0.64, 1',
  '→',
  'CSS · cubic-bezier(0.34, 1.56, 0.64, 1)',
  'CSS · animation-timeline: view() · usePointerTilt',
]

/** Il numero d'ordine delle schede (01, 02…) e la riga del copyright (anno e nome). */
const NO_LANGUAGE_PATTERNS = [/^\d\d$/, /^© \d{4} /]

/**
 * I dati del sito, letti dentro la pagina: i testi bilingui ({ it, en }) e tutte le
 * stringhe semplici, che sono nomi, tecnologie e indirizzi e quindi non hanno lingua.
 * Un testo bilingue uguale nelle due lingue (un nome proprio, come «Boolzapp») conta
 * anche tra quelli senza lingua. In più il titolo del bottone del tema che compare solo
 * nel tema scuro, perché nel tema chiaro sulla pagina non c'è.
 */
async function siteData(page: Page) {
  return page.evaluate(async (files) => {
    const localized: { it: string; en: string }[] = []
    const neutral: string[] = []
    const walk = (value: unknown) => {
      if (typeof value === 'string') neutral.push(value)
      else if (Array.isArray(value)) value.forEach(walk)
      else if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>
        if (typeof record.it === 'string' && typeof record.en === 'string') {
          localized.push({ it: record.it, en: record.en })
          if (record.it === record.en) neutral.push(record.it)
        } else Object.values(record).forEach(walk)
      }
    }
    let onlyInDark: { it: string; en: string } | null = null
    for (const file of files) {
      const module = { ...(await import(/* @vite-ignore */ file)) }
      if (module.ui) onlyInDark = module.ui.theme.toLight
      walk(module)
    }
    return { localized, neutral, onlyInDark }
  }, DATA_FILES)
}

/**
 * Tutto quello che la pagina dice.
 *  - lines: per ogni elemento il suo testo diretto, il suo testo intero e i suoi attributi
 *    di testo. Serve a cercare una frase: una frase spezzata in più elementi (le parole
 *    del Manifesto) si trova nel testo intero del paragrafo.
 *  - pieces: solo il testo diretto di ogni elemento e gli attributi, cioè i pezzi più
 *    piccoli. Serve a vedere quali cambiano con la lingua. Le parole del Manifesto restano
 *    fuori: una per elemento, molte («React,», «TypeScript») sono uguali nelle due lingue,
 *    e la frase intera la controlla già il primo test.
 */
async function pageSays(page: Page) {
  return page.evaluate((attributes) => {
    const clean = (text: string | null) => (text ?? '').replace(/\s+/g, ' ').trim()
    const lines = new Set<string>()
    const pieces = new Set<string>()
    for (const el of document.body.querySelectorAll('*')) {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue
      const direct = clean(
        [...el.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent)
          .join(' '),
      )
      if (direct) {
        lines.add(direct)
        if (!el.closest('#chi-sono')) pieces.add(direct)
      }
      const whole = clean(el.textContent)
      if (whole) lines.add(whole)
      for (const name of attributes) {
        const value = clean(el.getAttribute(name))
        if (value) {
          lines.add(value)
          pieces.add(value)
        }
      }
    }
    return { lines: [...lines], pieces: [...pieces] }
  }, TEXT_ATTRIBUTES)
}

/**
 * I pezzi fissi di un testo: un testo con i segnaposto («{role} a {city}. Il codice…») sulla
 * pagina non c'è così com'è, ci sono i pezzi tra un segnaposto e l'altro. Quelli di tre
 * lettere o meno (« a ») si saltano: troppo corti per dire qualcosa.
 */
const fixedParts = (text: string) =>
  text
    .split(/\{\w+\}/)
    .map((part) => part.trim())
    .filter((part) => part.length > 3)

/**
 * Vero se una delle righe dice la frase, come parola intera: «Apri» non deve risultare
 * presente perché sulla pagina inglese c'è «April». Il confine vale solo dove la frase
 * comincia o finisce con una lettera o una cifra: un pezzo che parte da un punto
 * («. Il codice…») sta attaccato alla parola prima, ed è giusto così.
 */
function says(lines: string[], phrase: string) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const before = /^[\p{L}\p{N}]/u.test(phrase) ? '(?<![\\p{L}\\p{N}])' : ''
  const after = /[\p{L}\p{N}]$/u.test(phrase) ? '(?![\\p{L}\\p{N}])' : ''
  const whole = new RegExp(`${before}${escaped}${after}`, 'u')
  return lines.some((line) => whole.test(line))
}

/** Il bottone di una lingua nell'interruttore: il nome è quello della lingua, scritto in quella lingua. */
const languageButton = (page: Page, lang: Lang) =>
  page.getByRole('radio', { name: lang === 'it' ? 'Italiano' : 'English' })

/** La pagina è in questa lingua: <html lang>, il bottone acceso, e ogni testo dei dati. */
async function expectLanguage(page: Page, lang: Lang, texts: Localized[], skip: Localized | null) {
  await expect(page.locator('html')).toHaveAttribute('lang', lang)
  await expect(languageButton(page, lang)).toHaveAttribute('aria-checked', 'true')
  await expect(languageButton(page, OTHER[lang])).toHaveAttribute('aria-checked', 'false')

  const { lines } = await pageSays(page)
  for (const text of texts) {
    if (skip && text.it === skip.it) continue
    for (const part of fixedParts(text[lang])) {
      expect(says(lines, part), `manca «${part}» con la pagina in ${lang}`).toBe(true)
    }
    if (text.it === text.en) continue
    const mine = fixedParts(text[lang])
    for (const part of fixedParts(text[OTHER[lang]]).filter((p) => !mine.includes(p))) {
      expect(says(lines, part), `«${part}» è rimasto con la pagina in ${lang}`).toBe(false)
    }
  }
}

/** Le righe su cui sta un pezzo del titolo: un rettangolo di testo per riga (come in hero.spec.ts). */
const titlePieceLines = (page: Page) =>
  page
    .getByRole('heading', { level: 1 })
    .locator('span')
    .evaluateAll((spans) =>
      spans.map((el) => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size
      }),
    )

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
})

test.describe('con il browser in italiano', () => {
  test.use({ locale: 'it-IT' })

  test('il sito parte in italiano', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    await expect(languageButton(page, 'it')).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('heading', { level: 1 }).locator('span')).toHaveText([
      'Quello che vedi,',
      "e quello che c'è dietro.",
    ])
  })

  test('EN mette in inglese ogni testo dei dati, e IT li rimette in italiano', async ({ page }) => {
    await page.goto('/')
    const data = await siteData(page)
    // Se il test non trovasse i dati passerebbe a vuoto: profilo, sei progetti e interfaccia sono più di 40 testi.
    expect(data.localized.length).toBeGreaterThan(40)
    expect(data.onlyInDark).not.toBeNull()

    await expectLanguage(page, 'it', data.localized, data.onlyInDark)
    await languageButton(page, 'en').click()
    await expectLanguage(page, 'en', data.localized, data.onlyInDark)

    // Il titolo del bottone del tema che c'è solo nel tema scuro, anche lui in inglese.
    await page.getByRole('button', { name: data.localized.find((t) => t.it === 'Tema scuro')!.en }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(says((await pageSays(page)).lines, data.onlyInDark!.en)).toBe(true)

    await languageButton(page, 'it').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    expect(says((await pageSays(page)).lines, data.onlyInDark!.it)).toBe(true)
  })

  test('passando a EN non resta niente in italiano: cambia ogni testo che non sia un nome, una tecnologia o codice', async ({ page }) => {
    await page.goto('/')
    const data = await siteData(page)
    const italian = await pageSays(page)
    await languageButton(page, 'en').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    const english = await pageSays(page)

    const noLanguage = new Set([...data.neutral, ...NO_LANGUAGE])
    const unchanged = italian.pieces
      .filter((piece) => english.pieces.includes(piece))
      .filter((piece) => !noLanguage.has(piece) && !NO_LANGUAGE_PATTERNS.some((pattern) => pattern.test(piece)))
    expect(unchanged, 'testi rimasti uguali passando a EN').toEqual([])
  })

  test('la scelta resta dopo il ricaricamento', async ({ page }) => {
    await page.goto('/')
    await languageButton(page, 'en').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    // Il browser resta in italiano: se dopo il ricaricamento è in inglese, è la scelta salvata.
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(languageButton(page, 'en')).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('heading', { level: 1 }).locator('span').first()).toHaveText('What you see,')
  })

  test('una scelta salvata che non è una lingua del sito non conta: vale la lingua del browser', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('lang', 'xx'))
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    await expect(languageButton(page, 'it')).toHaveAttribute('aria-checked', 'true')
  })

  test('senza localStorage il sito parte lo stesso e la lingua si cambia', async ({ page }) => {
    // Come in una navigazione privata che blocca la memoria del sito: leggere localStorage lancia un errore.
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('localStorage bloccato')
        },
      })
    })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    await languageButton(page, 'en').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 }).locator('span').first()).toHaveText('What you see,')
  })

  test('in inglese il titolo sta su una riga per pezzo a 1440 px, e a 390 px resta dentro lo schermo', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await languageButton(page, 'en').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    // Il caso peggiore, un font largo: lo stesso di hero.spec.ts, per dire la stessa cosa su ogni macchina.
    await page.addStyleTag({ content: "h1 { font-family: Verdana, 'DejaVu Sans', sans-serif !important; }" })
    expect(await titlePieceLines(page)).toEqual([1, 1])

    await page.setViewportSize({ width: 390, height: 844 })
    const box = await page.getByRole('heading', { level: 1 }).boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(390)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  })

  for (const width of [1280, 390]) {
    test(`a ${width} px l'interruttore della lingua sta nello schermo e non copre gli altri controlli`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')
      const language = await page.getByRole('radiogroup', { name: 'Lingua' }).boundingBox()
      expect(language).not.toBeNull()
      expect(language!.x).toBeGreaterThanOrEqual(0)
      expect(language!.x + language!.width).toBeLessThanOrEqual(width)
      expect(language!.y + language!.height).toBeLessThanOrEqual(844)

      const others = {
        Motion: page.getByRole('radiogroup', { name: 'Movimento' }),
        tema: page.getByRole('button', { name: 'Tema scuro' }),
        menu: page.getByRole('navigation', { name: 'Sezioni' }),
      }
      for (const [name, locator] of Object.entries(others)) {
        const box = await locator.boundingBox()
        expect(box, name).not.toBeNull()
        const apart =
          language!.x + language!.width <= box!.x ||
          box!.x + box!.width <= language!.x ||
          language!.y + language!.height <= box!.y ||
          box!.y + box!.height <= language!.y
        expect(apart, `l'interruttore della lingua copre ${name}`).toBe(true)
      }
    })
  }
})

test.describe('con il browser in un’altra lingua', () => {
  test.use({ locale: 'de-DE' })

  test('il sito parte in inglese', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(languageButton(page, 'en')).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('heading', { level: 1 }).locator('span')).toHaveText([
      'What you see,',
      "and what's behind it.",
    ])
  })

  test('la lingua scelta con il bottone vince su quella del browser', async ({ page }) => {
    await page.goto('/')
    await languageButton(page, 'it').click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    await expect(languageButton(page, 'it')).toHaveAttribute('aria-checked', 'true')
  })
})
