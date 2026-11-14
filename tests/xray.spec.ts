/**
 * xray.spec.ts
 * La vista X-ray (styles/xray.css), la modalità che mostra com'è fatto il sito: con
 * l'interruttore su X-ray ogni pezzo che ha l'attributo data-xray prende un contorno
 * tratteggiato e un'etichetta, un ::after che legge il testo dall'attributo.
 * Uno pseudo-elemento non si trova con un selettore: si legge con
 * getComputedStyle(elemento, '::after'). Cinque controlli:
 *  - con X-ray ogni pezzo mostra la sua etichetta, con il testo del suo data-xray,
 *    e in ogni sezione della pagina ce n'è almeno uno;
 *  - con On etichette e contorni non ci sono;
 *  - nessun pezzo taglia la propria etichetta con il suo overflow: sta 30 px sopra
 *    l'elemento, quindi un overflow nascosto la farebbe sparire (per questo nella
 *    FloatingCard, che taglia il suo contenuto, l'etichetta sta sulla cornice intorno);
 *  - X-ray lascia acceso il movimento: la fascia dello stack continua a scorrere;
 *  - ogni etichetta è dritta: né il pezzo che la porta né i suoi genitori ruotano, si
 *    inclinano in 3D o si schiacciano (prima la capsula la girava di 28 gradi e il disco
 *    la schiacciava a metà), anche con la scheda inclinata dal mouse.
 * Cosa non controlla: un contenitore con l'overflow nascosto (la prima schermata, i
 * Contatti) taglierebbe l'etichetta di un pezzo messo a meno di 30 px dal suo bordo alto.
 * Oggi nessuno sta così in alto; chi sposta una forma lo guardi a occhio in X-ray.
 */
import { expect, test, type Page } from '@playwright/test'
import { setMotion } from './preferences.ts'

/** Dove deve esserci almeno un pezzo etichettato: le cinque sezioni e il menu. */
const PLACES = ['#top', '#stack', '#chi-sono', '#progetti', '#contatti', 'nav']

/**
 * Per ogni pezzo: il testo dell'attributo e cosa disegnano davvero lui e il suo ::after.
 * Il contorno sta sul pezzo, o sulla sua parte che si muove (il figlio con
 * data-xray-outline): in quel caso il pezzo stesso non ne disegna un secondo.
 */
const pieces = (page: Page) =>
  page.locator('[data-xray]').evaluateAll((els) =>
    els.map((el) => {
      const own = getComputedStyle(el)
      const after = getComputedStyle(el, '::after')
      const body = el.querySelector(':scope > [data-xray-outline]')
      return {
        text: el.getAttribute('data-xray') ?? '',
        label: after.content,
        labelDisplay: after.display,
        outline: getComputedStyle(body ?? el).outlineStyle,
        secondOutline: body ? own.outlineStyle : 'none',
        overflow: `${own.overflowX} ${own.overflowY}`,
      }
    }),
  )

/** Il testo di un'etichetta come lo restituisce il browser: tra virgolette. */
const quoted = (text: string) => `"${text}"`

async function choose(page: Page, mode: 'On' | 'X-ray') {
  await setMotion(page, mode)
  await expect(page.locator('html')).toHaveAttribute('data-motion', mode === 'On' ? 'on' : 'xray')
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('con X-ray ogni pezzo mostra la sua etichetta', async ({ page }) => {
  await choose(page, 'X-ray')

  for (const place of PLACES) {
    const inside = place === 'nav' ? page.locator('nav[data-xray]') : page.locator(`${place}[data-xray], ${place} [data-xray]`)
    expect(await inside.count(), `in ${place} c'è almeno un pezzo con data-xray`).toBeGreaterThan(0)
  }

  for (const piece of await pieces(page)) {
    expect(piece.text.length, 'un data-xray vuoto non spiega niente').toBeGreaterThan(0)
    expect(piece.label, `etichetta di «${piece.text}»`).toBe(quoted(piece.text))
    expect(piece.labelDisplay, `etichetta di «${piece.text}»`).not.toBe('none')
    expect(piece.outline, `contorno di «${piece.text}»`).toBe('dashed')
    expect(piece.secondOutline, `secondo contorno di «${piece.text}»`).toBe('none')
  }
})

test('con On etichette e contorni non ci sono', async ({ page }) => {
  await choose(page, 'On')
  const all = await pieces(page)

  expect(all.length).toBeGreaterThan(0)
  for (const piece of all) {
    expect(piece.label, `etichetta di «${piece.text}»`).not.toBe(quoted(piece.text))
    expect(piece.outline, `contorno di «${piece.text}»`).toBe('none')
  }
})

test('con X-ray nessun pezzo taglia la propria etichetta con il suo overflow', async ({ page }) => {
  await choose(page, 'X-ray')
  const all = await pieces(page)

  expect(all.length).toBeGreaterThan(0)
  for (const piece of all) {
    expect(piece.overflow, `overflow di «${piece.text}»`).toBe('visible visible')
  }
})

test('con X-ray il movimento resta acceso', async ({ page }) => {
  await choose(page, 'X-ray')
  await page.locator('#stack').scrollIntoViewIfNeeded()
  const offsetX = () => page.locator('#stack ul').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)

  const before = await offsetX()
  await page.waitForTimeout(600)
  expect(await offsetX()).not.toBe(before)
})

/**
 * Cosa piega l'etichetta di un pezzo: rotazioni, scale e trasformazioni del pezzo e dei
 * suoi genitori, fino a html. Lo spostamento (translate, il galleggiare) è ammesso, e
 * anche una prospettiva da sola, che sul piano dell'elemento non cambia niente.
 * Una lista vuota vuol dire etichetta dritta e a grandezza piena.
 */
const bentBy = (page: Page, index: number) =>
  page.locator('[data-xray]').nth(index).evaluate((el) => {
    const near = (a: number, b: number) => Math.abs(a - b) < 0.001
    const bent: string[] = []
    for (let node: Element | null = el; node && node !== document.documentElement; node = node.parentElement) {
      const style = getComputedStyle(node)
      const name = `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}`
      if (style.rotate !== 'none' && !/^0(deg)?$/.test(style.rotate)) bent.push(`${name}: rotate ${style.rotate}`)
      if (style.scale !== 'none' && style.scale.split(' ').some((v) => !near(parseFloat(v), 1))) bent.push(`${name}: scale ${style.scale}`)
      if (style.transform !== 'none') {
        const m = new DOMMatrix(style.transform)
        const flat = near(m.m11, 1) && near(m.m12, 0) && near(m.m21, 0) && near(m.m22, 1) && near(m.m14, 0) && near(m.m24, 0) && near(m.m44, 1)
        if (!flat) bent.push(`${name}: transform ${style.transform}`)
      }
    }
    return bent
  })

test('con X-ray ogni etichetta è dritta e a grandezza piena', async ({ page }) => {
  await choose(page, 'X-ray')
  const all = page.locator('[data-xray]')
  const count = await all.count()

  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    // Al centro dello schermo, dove le schede dei progetti hanno finito di entrare
    // (la loro entrata le rimpicciolisce un poco finché arrivano).
    await all.nth(i).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.waitForTimeout(300)
    const text = await all.nth(i).getAttribute('data-xray')
    expect.soft(await bentBy(page, i), `etichetta di «${text}»`).toEqual([])
  }
})

test('con X-ray l\'etichetta resta dritta anche quando il mouse inclina la scheda', async ({ page }) => {
  await choose(page, 'X-ray')
  const all = page.locator('[data-xray]')
  const index = await all.evaluateAll((els) => els.findIndex((el) => el.textContent?.includes('tsc -b')))
  expect(index, 'la scheda Build della prima schermata').toBeGreaterThanOrEqual(0)

  const card = all.nth(index)
  const box = await card.boundingBox()
  expect(box).not.toBeNull()
  // Il mouse verso l'angolo in basso a sinistra, dove l'inclinazione si vede, ma dentro il
  // bordo arrotondato (sull'angolo esatto la scheda non lo sente). Non a destra: con un
  // carattere più largo, come in GitHub Actions, lì sopra la scheda arriva il titolo.
  const x = box!.x + box!.width * 0.15
  const y = box!.y + box!.height * 0.85
  const onCard = await card.evaluate((el, [px, py]) => el.contains(document.elementFromPoint(px, py)), [x, y])
  expect(onCard, 'il punto del mouse è sulla scheda, non coperto da altro').toBe(true)
  await page.mouse.move(x, y)
  await page.waitForTimeout(700)

  expect(await bentBy(page, index)).toEqual([])
  // E la scheda si è inclinata davvero: il contorno, che sta sulla parte che si muove, la segue.
  const body = card.locator('[data-xray-outline]')
  await expect(body).toHaveCount(1)
  const tilt = await body.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11)
  expect(tilt).toBeLessThan(0.9999)
})
