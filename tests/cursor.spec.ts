/**
 * cursor.spec.ts
 * Test del cursore personalizzato (components/Cursor): il punto pieno sta sul mouse,
 * l'anello lo insegue in ritardo. Con Motion su On tutti e due devono raggiungere il
 * puntatore, anche quando si sposta di nuovo; con Off non devono esserci, e il
 * cursore vero del sistema deve tornare visibile, altrimenti non si vedrebbe niente.
 * La posizione si legge dal centro del riquadro dell'elemento, con expect.poll
 * perché l'inseguimento dura qualche fotogramma.
 */
import { expect, test, type Locator, type Page } from '@playwright/test'
import { setMotion } from './preferences.ts'

const dot = (page: Page) => page.getByTestId('cursor-dot')
const ring = (page: Page) => page.getByTestId('cursor-ring')

async function distanceFrom(el: Locator, x: number, y: number): Promise<number> {
  const box = await el.boundingBox()
  if (!box) return Infinity
  return Math.hypot(box.x + box.width / 2 - x, box.y + box.height / 2 - y)
}

async function expectToReach(el: Locator, x: number, y: number) {
  await expect.poll(() => distanceFrom(el, x, y), { timeout: 3000 }).toBeLessThan(2)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('con Motion On punto e anello seguono il puntatore', async ({ page }) => {
  await setMotion(page, 'On')

  // Due punti lontani tra loro: se il cursore arriva su tutti e due, lo sta seguendo
  // davvero e non è fermo per caso nel posto giusto.
  for (const [x, y] of [
    [300, 200],
    [900, 500],
  ]) {
    await page.mouse.move(x, y, { steps: 5 })
    await expectToReach(dot(page), x, y)
    await expectToReach(ring(page), x, y)
  }
})

test('con Motion Off punto e anello non si vedono', async ({ page }) => {
  // Prima con On il cursore c'è: così il test non passa solo perché non trova niente.
  await setMotion(page, 'On')
  await page.mouse.move(400, 300)
  await expect(dot(page)).toBeVisible()

  await setMotion(page, 'Off')

  await expect(dot(page)).toHaveCount(0)
  await expect(ring(page)).toHaveCount(0)
  // Senza il cursore disegnato, deve tornare quello del sistema.
  await expect(page.locator('body')).not.toHaveCSS('cursor', 'none')
})
