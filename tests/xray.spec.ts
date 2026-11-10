/**
 * xray.spec.ts
 * La vista X-ray (styles/xray.css), la modalità che mostra com'è fatto il sito: con
 * l'interruttore su X-ray ogni pezzo che ha l'attributo data-xray prende un contorno
 * tratteggiato e un'etichetta, un ::after che legge il testo dall'attributo.
 * Uno pseudo-elemento non si trova con un selettore: si legge con
 * getComputedStyle(elemento, '::after'). Quattro controlli:
 *  - con X-ray ogni pezzo mostra la sua etichetta, con il testo del suo data-xray,
 *    e in ogni sezione della pagina ce n'è almeno uno;
 *  - con On etichette e contorni non ci sono;
 *  - nessun pezzo taglia la propria etichetta con il suo overflow: sta 30 px sopra
 *    l'elemento, quindi un overflow nascosto la farebbe sparire (è il motivo della regola
 *    X-ray in components/FloatingCard/FloatingCard.module.css);
 *  - X-ray lascia acceso il movimento: la fascia dello stack continua a scorrere.
 * Cosa non controlla: un contenitore con l'overflow nascosto (la prima schermata, i
 * Contatti) taglierebbe l'etichetta di un pezzo messo a meno di 30 px dal suo bordo alto.
 * Oggi nessuno sta così in alto; chi sposta una forma lo guardi a occhio in X-ray.
 */
import { expect, test, type Page } from '@playwright/test'

/** Dove deve esserci almeno un pezzo etichettato: le cinque sezioni e il menu. */
const PLACES = ['#top', '#stack', '#chi-sono', '#progetti', '#contatti', 'nav']

/** Per ogni pezzo: il testo dell'attributo e cosa disegnano davvero lui e il suo ::after. */
const pieces = (page: Page) =>
  page.locator('[data-xray]').evaluateAll((els) =>
    els.map((el) => {
      const own = getComputedStyle(el)
      const after = getComputedStyle(el, '::after')
      return {
        text: el.getAttribute('data-xray') ?? '',
        label: after.content,
        labelDisplay: after.display,
        outline: own.outlineStyle,
        overflow: `${own.overflowX} ${own.overflowY}`,
      }
    }),
  )

/** Il testo di un'etichetta come lo restituisce il browser: tra virgolette. */
const quoted = (text: string) => `"${text}"`

async function choose(page: Page, mode: 'On' | 'X-ray') {
  await page.getByRole('radio', { name: mode }).click()
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
