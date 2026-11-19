/**
 * contact.spec.ts
 * Il modulo contatti nella sezione Contatti, con il server Node vero (server/).
 * Il modulo compare solo quando Vite conosce l'indirizzo del server (VITE_CONTACT_URL):
 * per questo playwright.config.ts accende, oltre al sito normale sulla porta 5199, il
 * server dei contatti sulla 5198 e una seconda copia del sito sulla 5200 che lo conosce.
 * Qui si controlla che:
 *  - sul sito normale, com'è online, il modulo non c'è;
 *  - inviando il modulo vuoto ogni campo dice cosa manca, e nessuna richiesta parte;
 *  - un messaggio buono arriva al server, finisce nel suo file, il modulo dice che è
 *    partito e si svuota;
 *  - se il server risponde con un errore, o non risponde, il modulo lo dice e tiene i campi;
 *  - in inglese etichette ed errori sono in inglese.
 * Il file dei messaggi dei test sta in test-results/ (CONTACT_FILE, lo stesso del config).
 */
import { readFile } from 'node:fs/promises'
import { expect, test, type Page } from '@playwright/test'
import { CONTACT_FILE, CONTACT_SITE } from '../playwright.config.ts'

const form = (page: Page) => page.getByRole('form', { name: /Scrivimi|Write to me/ })

async function openContact(page: Page) {
  await page.goto(`${CONTACT_SITE}/#contatti`)
  await page.locator('#contatti').scrollIntoViewIfNeeded()
}

/** Compila i tre campi con un messaggio unico, per ritrovarlo nel file del server. */
async function fill(page: Page) {
  const message = `Messaggio di prova ${Date.now()}-${Math.random()}`
  await page.getByLabel('Nome').fill('Ada Lovelace')
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByLabel('Messaggio').fill(message)
  return message
}

test('sul sito normale, come online, il modulo non c’è', async ({ page }) => {
  await page.goto('/#contatti')
  await expect(page.locator('#contatti')).toBeAttached()
  await expect(page.locator('#contatti form')).toHaveCount(0)
})

test('inviato vuoto, ogni campo dice cosa manca e nessuna richiesta parte', async ({ page }) => {
  await openContact(page)
  let requests = 0
  await page.route('**/api/contact', (route) => {
    requests++
    return route.continue()
  })
  await form(page).getByRole('button', { name: 'Invia' }).click()

  for (const label of ['Nome', 'Email', 'Messaggio']) {
    await expect(page.getByLabel(label)).toHaveAttribute('aria-invalid', 'true')
  }
  await expect(form(page).getByText('Scrivi il tuo nome.')).toBeVisible()
  await expect(form(page).getByText('Scrivi la tua email.')).toBeVisible()
  await expect(form(page).getByText('Scrivi un messaggio.')).toBeVisible()
  // Il primo campo sbagliato riceve il focus, così chi usa la tastiera ci arriva subito.
  await expect(page.getByLabel('Nome')).toBeFocused()
  expect(requests).toBe(0)
})

test('un messaggio buono arriva al server, finisce nel file e il modulo si svuota', async ({ page }) => {
  await openContact(page)
  const message = await fill(page)
  await form(page).getByRole('button', { name: 'Invia' }).click()

  await expect(form(page).getByRole('status')).toHaveText('Messaggio inviato, grazie. Ti rispondo presto.')
  await expect(page.getByLabel('Messaggio')).toHaveValue('')
  await expect
    .poll(async () => (await readFile(CONTACT_FILE, 'utf8').catch(() => '')).includes(message))
    .toBe(true)
})

test('se il server risponde con un errore il modulo lo dice e tiene i campi', async ({ page }) => {
  await openContact(page)
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false,"error":"saveFailed"}' }),
  )
  const message = await fill(page)
  await form(page).getByRole('button', { name: 'Invia' }).click()

  await expect(form(page).getByRole('alert')).toHaveText(
    'Il messaggio non è partito. Riprova tra poco, o scrivimi su LinkedIn.',
  )
  await expect(page.getByLabel('Messaggio')).toHaveValue(message)
})

test('se il server rifiuta un campo il modulo mostra l’errore sotto quel campo', async ({ page }) => {
  await openContact(page)
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: '{"ok":false,"errors":{"email":"invalid"}}',
    }),
  )
  await fill(page)
  await form(page).getByRole('button', { name: 'Invia' }).click()

  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')
  await expect(form(page).getByText('Questa email non sembra giusta.')).toBeVisible()
})

test('se il server non risponde il modulo lo dice', async ({ page }) => {
  await openContact(page)
  await page.route('**/api/contact', (route) => route.abort('connectionrefused'))
  await fill(page)
  await form(page).getByRole('button', { name: 'Invia' }).click()

  await expect(form(page).getByRole('alert')).toHaveText(
    'Il messaggio non è partito. Riprova tra poco, o scrivimi su LinkedIn.',
  )
})

test.describe('in inglese', () => {
  test.use({ locale: 'en-US' })

  test('etichette, bottone ed errori sono in inglese', async ({ page }) => {
    await openContact(page)
    await expect(form(page)).toBeVisible()
    await form(page).getByRole('button', { name: 'Send' }).click()
    await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
    await expect(form(page).getByText('Write your name.')).toBeVisible()
    await expect(page.getByLabel('Message')).toBeVisible()
  })
})
