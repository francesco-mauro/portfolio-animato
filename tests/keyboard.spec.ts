/**
 * keyboard.spec.ts
 * L'uso del sito da tastiera, senza mouse: si gira la pagina con Tab.
 *  - Il primo Tab porta al link «Salta al contenuto», nascosto finché non ha il focus;
 *    con Invio il focus passa al contenuto principale (<main>) e il Tab dopo resta lì.
 *  - L'ordine delle fermate: il link per saltare, il menu (che sta in basso allo schermo
 *    ma viene prima nel DOM, così il link per saltare ha qualcosa da saltare), tutti i
 *    link del contenuto nell'ordine della pagina, e in fondo le preferenze (Motion e tema).
 *    Ogni link e bottone della pagina è una fermata, e una sola volta.
 *    Contano solo gli elementi visibili: sul telefono alcuni pezzi sono nascosti.
 *  - A ogni fermata l'elemento si vede: dentro lo schermo e pieno, non trasparente a metà.
 *    È un controllo di guardia: le schede dei progetti entrano con lo scroll, ma il focus
 *    le porta abbastanza dentro lo schermo da essere già piene (provato il 13 novembre 2026,
 *    a 1280 e a 390 px, togliendo apposta l'entrata dalle schede col focus: resta verde).
 *  - Lo stesso giro a 390 px, un telefono.
 *  - Il contorno: a ogni fermata un anello a due colori, scuro fuori e chiaro dentro, che
 *    si vede su qualsiasi fondo (chiaro, scuro, corallo, le schede colorate). Entra con
 *    un'animazione, che non c'è con Motion Off né col sistema che chiede meno movimento.
 *    Con un click del mouse l'anello non compare (:focus-visible).
 */
import { expect, test, type Page } from '@playwright/test'

/** Il nome di ogni link e bottone della pagina, nell'ordine del DOM, dentro un'area. */
const namesIn = (page: Page, selector: string) =>
  page.evaluate(
    (sel) =>
      [...document.querySelectorAll<HTMLElement>(`${sel} a[href], ${sel} button`)]
        .filter((el) => el.checkVisibility())
        .map(
        (el) => el.getAttribute('aria-label') ?? el.innerText.trim().split('\n')[0],
      ),
    selector,
  )

/** Il nome dell'elemento che ha il focus, o null se il focus è sulla pagina. */
const focusedName = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return null
    return el.getAttribute('aria-label') ?? el.innerText.trim().split('\n')[0]
  })

/** Quanti link e bottoni visibili ci sono in tutta la pagina. */
const stopCount = (page: Page) =>
  page.evaluate(
    () => [...document.querySelectorAll<HTMLElement>('a[href], button')].filter((el) => el.checkVisibility()).length,
  )

/**
 * L'elemento con il focus si vede? Dentro lo schermo, e con l'opacità di lui e di tutti
 * i suoi antenati moltiplicate insieme quasi piena.
 */
const focusedIsVisible = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement
    const box = el.getBoundingClientRect()
    const inside = box.width > 0 && box.top >= 0 && box.bottom <= innerHeight && box.left >= 0 && box.right <= innerWidth
    let opacity = 1
    for (let node: Element | null = el; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity)
    }
    return inside && opacity > 0.98
  })

/** Il contorno dell'elemento con il focus: stile e spessore dell'outline, box-shadow. */
const focusedRing = (page: Page) =>
  page.evaluate(() => {
    const style = getComputedStyle(document.activeElement as HTMLElement)
    return { outlineStyle: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth), boxShadow: style.boxShadow }
  })

/** Le animazioni CSS in corso sull'elemento con il focus, per nome. */
const focusedAnimations = (page: Page) =>
  page.evaluate(() =>
    (document.activeElement as HTMLElement)
      .getAnimations()
      .map((a) => (a as CSSAnimation).animationName ?? '')
      .filter(Boolean),
  )

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
})

test('il primo Tab mostra «Salta al contenuto», e Invio porta al contenuto', async ({ page }) => {
  await page.goto('/')
  const skip = page.getByRole('link', { name: 'Salta al contenuto' })
  await expect(skip).toBeAttached()
  // Prima del focus non si vede: fuori dallo schermo o ritagliato a niente.
  await expect(skip).not.toBeInViewport()

  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport({ ratio: 1 })

  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('MAIN')
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => document.activeElement?.closest('main') !== null)).toBe(true)
})

/** Il giro completo con Tab: ordine delle fermate, nessuna dimenticata, ognuna visibile. */
async function tabTour(page: Page) {
  await page.goto('/')
  const expected = [
    'Salta al contenuto',
    ...(await namesIn(page, 'nav')),
    ...(await namesIn(page, 'main')),
    ...(await namesIn(page, 'aside')),
  ]
  // Il menu ha la casetta e le tre voci; nessuna fermata resta fuori dalle tre aree.
  expect(expected.slice(1, 5)).toEqual(['Torna su', 'Chi sono', 'Progetti', 'Contatti'])
  expect(expected).toHaveLength(await stopCount(page))

  const seen: (string | null)[] = []
  for (let i = 0; i < expected.length; i++) {
    await page.keyboard.press('Tab')
    seen.push(await focusedName(page))
    await expect
      .poll(() => focusedIsVisible(page), { message: `la fermata ${i + 1} (${seen[i]}) non si vede` })
      .toBe(true)
  }
  expect(seen).toEqual(expected)
}

test("con Tab si arriva a ogni link e bottone, nell'ordine giusto, e ognuno si vede", async ({ page }) => {
  await tabTour(page)
})

test('anche sul telefono, a 390 px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await tabTour(page)
})

test('a ogni fermata c\'è un anello a due colori ben visibile', async ({ page }) => {
  await page.goto('/')
  const total = await stopCount(page)
  for (let i = 0; i < total; i++) {
    await page.keyboard.press('Tab')
    const ring = await focusedRing(page)
    const name = await focusedName(page)
    expect(ring.outlineStyle, `outline su ${name}`).toBe('solid')
    expect(ring.outlineWidth, `spessore su ${name}`).toBeGreaterThanOrEqual(3)
    expect(ring.boxShadow, `alone chiaro su ${name}`).not.toBe('none')
  }
})

test('l\'anello entra con un\'animazione, con Motion On', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  expect(await focusedAnimations(page)).toContainEqual(expect.stringContaining('focus-ring'))
})

test('con Motion Off l\'anello c\'è ma non si anima', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: 'Off' }).click()
  await page.locator('body').click({ position: { x: 5, y: 5 } })
  await page.keyboard.press('Tab')
  expect((await focusedRing(page)).outlineStyle).toBe('solid')
  expect(await focusedAnimations(page)).toEqual([])
})

test('col sistema che chiede meno movimento l\'anello non si anima', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.keyboard.press('Tab')
  expect((await focusedRing(page)).outlineStyle).toBe('solid')
  expect(await focusedAnimations(page)).toEqual([])
})

test('con un click del mouse l\'anello non compare', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: 'On' }).click()
  expect((await focusedRing(page)).outlineStyle).toBe('none')
})
