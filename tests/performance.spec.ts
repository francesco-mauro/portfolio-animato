/**
 * performance.spec.ts
 * Il primo layout della pagina leggero: le sezioni sotto la prima schermata (#stack,
 * #chi-sono, #progetti, #contatti) hanno content-visibility: auto, quindi il browser salta
 * il loro layout finché non ci si avvicina scorrendo. Sul telefono di Lighthouse il primo
 * layout dell'intera pagina era il compito più lungo (misure del 18 novembre 2026 nel
 * README, sezione Performance); il punteggio lo controlla scripts/lighthouse.mjs, questo
 * file controlla che la regola ci sia e che non rompa niente.
 * Controlla: la prima schermata (#top) resta disegnata subito, le quattro sezioni sotto
 * hanno content-visibility: auto e una stima d'altezza che il browser ricorda
 * (contain-intrinsic-size: auto ...), mai sotto quella vera e al massimo il 30% sopra, a
 * nove larghezze da 320 a 1440 px, comprese quelle dove ogni sezione è più alta nella sua
 * fascia (chi aggiunge un progetto o un blocco aggiorna le stime nei CSS delle sezioni);
 * a 320, 599, 768, 899 e 1440 px il tasto Fine porta proprio in fondo alla pagina (due
 * colpi: il perché nel test);
 * in X-ray tornano a visible, perché il contenimento del disegno taglierebbe le
 * etichette che escono dalla sezione; saltando dal menu a «Progetti» e a «Contatti», a 390
 * e a 1440 px, la sezione arriva in cima allo schermo, anche se le sezioni prima non
 * erano mai state disegnate e il browser conosceva solo la loro stima.
 */
import { expect, test } from '@playwright/test'
import { setMotion } from './preferences.ts'

const BELOW_FOLD = ['#stack', '#chi-sono', '#progetti', '#contatti']

test.describe('primo layout leggero', () => {
  test('le sezioni sotto la prima schermata saltano il layout finché non servono', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#top')).toHaveCSS('content-visibility', 'visible')
    for (const id of BELOW_FOLD) {
      const section = page.locator(id)
      await expect(section, id).toHaveCSS('content-visibility', 'auto')
      // "auto" davanti alla stima: dopo il primo disegno il browser ricorda l'altezza vera
      await expect(section, id).toHaveCSS('contain-intrinsic-height', /^auto \d+px$/)
    }
  })

  // Le larghezze dove le sezioni sono più alte nella loro fascia (599, 699, 899, 1099) e alcune comuni
  for (const width of [320, 390, 599, 699, 768, 899, 1000, 1099, 1440]) {
    test(`a ${width} px la stima d'altezza di ogni sezione sta sopra quella vera, di poco`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')
      const estimates = await page.evaluate((ids) => ids.map((id) => parseFloat(getComputedStyle(document.querySelector(id)!).containIntrinsicHeight.replace('auto ', ''))), BELOW_FOLD)
      // L'altezza vera: le sezioni disegnate tutte, senza padding (la stima vale per il contenuto)
      await page.addStyleTag({ content: 'main > section { content-visibility: visible !important }' })
      const real = await page.evaluate((ids) => ids.map((id) => {
        const s = document.querySelector<HTMLElement>(id)!
        const style = getComputedStyle(s)
        return s.getBoundingClientRect().height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      }), BELOW_FOLD)
      BELOW_FOLD.forEach((id, i) => {
        const label = `${id}: stima ${estimates[i]}, vera ${Math.round(real[i])}`
        // Mai sotto: la pagina crescerebbe dopo il disegno e Fine non arriverebbe in fondo
        expect(estimates[i], label).toBeGreaterThanOrEqual(real[i])
        expect(estimates[i] / real[i], label).toBeLessThan(1.3)
      })
    })
  }

  for (const width of [320, 599, 768, 899, 1440]) {
    test(`a ${width} px il tasto Fine porta proprio in fondo alla pagina`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')
      // Il primo colpo di solito basta (23 prove su 24 il 18 novembre 2026). Se una sezione si
      // disegna mentre lo scroll morbido sta arrivando, il browser può fermarsi prima di
      // quanto la sezione si è accorciata (una volta 105 px, a 899): il secondo colpo arriva.
      // Il test chiede quello che si può promettere sempre: dopo due colpi si è in fondo.
      await page.keyboard.press('End')
      await page.waitForTimeout(1500)
      await page.keyboard.press('End')
      const gap = () => page.evaluate(() => document.documentElement.scrollHeight - (scrollY + innerHeight))
      const message = 'px tra il fondo dello schermo e il fondo della pagina'
      await expect.poll(gap, { message, timeout: 5000 }).toBeLessThanOrEqual(2)
      await page.waitForTimeout(500)
      expect(await gap(), message).toBeLessThanOrEqual(2)
      await expect(page.getByText(/^© \d{4} /)).toBeInViewport({ ratio: 1 })
    })
  }

  test('in X-ray le sezioni si disegnano tutte e non tagliano le etichette', async ({ page }) => {
    await page.goto('/')
    await setMotion(page, 'X-ray')
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'xray')
    for (const id of BELOW_FOLD) await expect(page.locator(id), id).toHaveCSS('content-visibility', 'visible')
  })

  for (const width of [390, 1440]) {
    for (const target of ['#progetti', '#contatti']) {
      test(`a ${width} px il menu porta a ${target} in cima allo schermo`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 })
        await page.goto('/')
        await page.locator(`nav a[href="${target}"]`).click()
        await expect(page).toHaveURL(new RegExp(`${target}$`))
        // Lo scroll è morbido e le sezioni prima si disegnano mentre si scende: si aspetta che arrivi
        await expect
          .poll(async () => Math.round(await page.locator(target).evaluate((s) => s.getBoundingClientRect().top)), {
            timeout: 5000,
          })
          .toBeLessThanOrEqual(2)
        const top = await page.locator(target).evaluate((s) => s.getBoundingClientRect().top)
        expect(top).toBeGreaterThanOrEqual(-2)
      })
    }
  }
})
