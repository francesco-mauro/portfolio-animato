/**
 * a11y.spec.ts
 * Controllo automatico di accessibilità con axe-core (https://github.com/dequelabs/axe-core),
 * lanciato dentro la pagina vera con @axe-core/playwright. axe legge il DOM e gli stili
 * calcolati e applica le sue regole: contrasto dei colori, nome accessibile di link e
 * bottoni, ruoli ARIA, landmark, lingua della pagina. Qui la pagina deve uscirne senza
 * nessuna violazione, di nessuna gravità.
 *
 * La pagina cambia aspetto con il tema (chiaro, scuro) e con l'interruttore Motion
 * (Off, On, X-ray), quindi il controllo gira nelle sei combinazioni, due volte ciascuna:
 * in cima, com'è la pagina appena aperta, e in fondo, quando lo scroll ha fatto entrare
 * le schede e acceso il Manifesto. La regola del contrasto non misura il testo con
 * opacità 0, lo dà per buono (in axe-core 4.14 è il controllo `opacityHidden`): una
 * scheda non ancora entrata passerebbe sempre. In fondo alla pagina, e sempre con
 * Motion Off, il testo si vede tutto e viene misurato.
 * Altri due controlli: a 390 px, un telefono, dove menu e interruttori cambiano misura
 * e posto; e con il mouse sopra una voce del menu, che cambia fondo.
 *
 * Cosa non dice. axe trova solo quello che una regola automatica può decidere da sola.
 * Dove non riesce a calcolare il contrasto mette l'elemento tra gli «incomplete», che
 * qui non fanno fallire il test e restano da guardare a mano. In questa pagina sono:
 *  - il testo delle schede che fluttuano e delle schede dei progetti (axe trova uno
 *    pseudo-elemento sul fondo e si ferma);
 *  - il testo sopra una sfumatura: le parole del Manifesto e i Contatti. Tra queste le
 *    parole ancora spente del Manifesto (#4a4d5e sul blu notte, 2,05 a 1), che con
 *    Motion On si accendono solo scorrendo: è un effetto voluto, e nessuno lo misura;
 *  - le parole di una sola lettera del Manifesto, troppo corte perché axe si fidi;
 *  - le frecce dei link, che sono decorazione (aria-hidden).
 * Non prova i lettori di schermo; la tastiera la prova tests/keyboard.spec.ts.
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** Le violazioni trovate da axe, una riga ciascuna: regola, gravità, cosa chiede, dove. */
async function violations(page: Page, include?: string): Promise<string[]> {
  const builder = new AxeBuilder({ page })
  if (include) builder.include(include)
  const results = await builder.analyze()
  return results.violations.map(
    (v) => `${v.id} [${v.impact}] ${v.help}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  )
}

/**
 * Aspetta che la pagina stia ferma: le animazioni di entrata e le transizioni finite.
 * Restano fuori quelle senza fine (le forme che fluttuano, la fascia dello stack) e
 * quelle legate allo scroll, che vanno avanti solo scorrendo.
 */
async function settle(page: Page) {
  await page.evaluate(async () => {
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
    await Promise.allSettled(
      document
        .getAnimations()
        .filter((a) => a.timeline === document.timeline && a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished),
    )
  })
}

/** Porta la pagina in fondo senza scorrimento morbido. */
async function scrollToBottom(page: Page) {
  await page.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: max, behavior: 'instant' })
  })
}

for (const theme of ['light', 'dark'] as const) {
  for (const mode of ['Off', 'On', 'X-ray']) {
    test(`nessuna violazione con tema ${theme} e Motion ${mode}, in cima e in fondo`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme })
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      await page.getByRole('radio', { name: mode }).click()
      await settle(page)
      expect(await violations(page), 'in cima alla pagina').toEqual([])

      await scrollToBottom(page)
      await settle(page)
      expect(await violations(page), 'in fondo alla pagina').toEqual([])
    })
  }
}

test('nessuna violazione a 390 px, la larghezza di un telefono', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await settle(page)
  expect(await violations(page), 'in cima alla pagina').toEqual([])

  await scrollToBottom(page)
  await settle(page)
  expect(await violations(page), 'in fondo alla pagina').toEqual([])
})

test('il menu resta leggibile con il mouse sopra una voce', async ({ page }) => {
  await page.goto('/')
  await settle(page)
  const link = page.getByRole('navigation', { name: 'Sezioni' }).getByRole('link', { name: 'Progetti' })
  const before = await link.evaluate((el) => getComputedStyle(el).backgroundColor)
  await link.hover()
  // Il fondo cambia davvero: così il controllo non passa solo perché il mouse non è arrivato.
  await expect.poll(() => link.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(before)
  await settle(page)
  expect(await violations(page, 'nav')).toEqual([])
})
