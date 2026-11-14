/**
 * about.spec.ts
 * La sezione «Chi sono» (sections/About): prima la frase grande che si accende allo scroll
 * (sections/Manifesto), poi un titolo vero, un paragrafo e quattro blocchi: Percorso,
 * Esperienze, Lingue, Cosa cerco. I testi stanno in data/profile.ts. Cinque controlli:
 *  - è una regione con il suo titolo di secondo livello, e i quattro blocchi hanno il loro;
 *  - la frase grande è quella nuova, e paragrafo e blocchi dicono le cose del profilo;
 *  - in inglese cambiano titolo e blocchi;
 *  - a 1440 e 768 px i blocchi stanno su due colonne, a 390 su una, e niente esce dallo schermo;
 *  - in X-ray i blocchi hanno la loro etichetta, e quella della frase grande dice il vero:
 *    le parole cambiano colore, non opacità.
 */
import { expect, test, type Page } from '@playwright/test'
import { openPreferences, setMotion } from './preferences.ts'

const region = (page: Page, name = 'Chi sono') => page.getByRole('region', { name })

/** I quattro blocchi: il genitore di ogni titolo di terzo livello della sezione. */
const blocks = (page: Page) => region(page).getByRole('heading', { level: 3 }).locator('..')

test('è una regione con il titolo «Chi sono», e i quattro blocchi hanno il loro titolo', async ({ page }) => {
  await page.goto('/')
  await expect(region(page).getByRole('heading', { level: 2, name: 'Chi sono' })).toHaveCount(1)
  await expect(region(page).getByRole('heading', { level: 3 })).toHaveText(['Percorso', 'Esperienze', 'Lingue', 'Cosa cerco'])
})

test('la frase grande è quella nuova, e i blocchi dicono le cose del profilo', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('manifesto')).toContainText('Costruisco app web in React e TypeScript')
  const about = region(page)
  await expect(about).toContainText('dieci esami di Ingegneria Gestionale')
  await expect(about).toContainText('Universitas Mercatorum')
  await expect(about).toContainText('Schulz Italia')
  await expect(about).toContainText('Comune di Zagarolo')
  await expect(about).toContainText('inglese C1')
  await expect(about).toContainText('full remote in Italia')
})

test('in inglese cambiano il titolo e i blocchi', async ({ page }) => {
  await page.goto('/')
  await openPreferences(page)
  await page.getByRole('radio', { name: 'English' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(region(page, 'About me').getByRole('heading', { level: 2, name: 'About me' })).toHaveCount(1)
  await expect(region(page, 'About me').getByRole('heading', { level: 3 })).toHaveText([
    'Education',
    'Experience',
    'Languages',
    "What I'm looking for",
  ])
})

for (const [width, columns] of [
  [1440, 2],
  [768, 2],
  [390, 1],
] as const) {
  test(`a ${width} px i blocchi stanno su ${columns === 2 ? 'due colonne' : 'una colonna'} e dentro lo schermo`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const boxes = await blocks(page).evaluateAll((els) =>
      els.map((el) => {
        const box = el.getBoundingClientRect()
        return { left: Math.round(box.left), right: box.right }
      }),
    )
    expect(boxes).toHaveLength(4)
    expect(new Set(boxes.map((box) => box.left)).size).toBe(columns)
    for (const box of boxes) expect(box.right).toBeLessThanOrEqual(width)
  })
}

test('in X-ray i blocchi hanno la loro etichetta, e la frase grande dice che cambia il colore', async ({ page }) => {
  await page.goto('/')
  await setMotion(page, 'X-ray')
  const labelled = region(page).locator('[data-xray]')
  const labels = await labelled.evaluateAll((els) => els.map((el) => el.getAttribute('data-xray') ?? ''))
  expect(labels.some((label) => label.includes('profile.ts'))).toBe(true)
  const manifesto = await page.getByTestId('manifesto').locator('[data-xray]').getAttribute('data-xray')
  expect(manifesto).toContain('colore')
  expect(manifesto).not.toContain('opacity')
})
