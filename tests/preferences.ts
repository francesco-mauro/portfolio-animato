/**
 * preferences.ts
 * Aiuti comuni ai test per il pannello delle preferenze (components/Preferences): lingua,
 * tema e Motion stanno dentro il pannello, che parte chiuso, quindi un test che vuole
 * cambiare lingua, tema o Motion deve prima aprirlo. Non è un file di test (non finisce
 * in .spec.ts): lo importano gli altri.
 */
import { expect, type Page } from '@playwright/test'

/** Il bottone che apre e chiude il pannello, nel menu a pillola. Il nome cambia con la lingua. */
export const preferencesButton = (page: Page) =>
  page.getByRole('button', { name: /^(Preferenze di visualizzazione|Display preferences)$/ })

/** Apre il pannello se è chiuso. */
export async function openPreferences(page: Page) {
  const button = preferencesButton(page)
  if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click()
  await expect(button).toHaveAttribute('aria-expanded', 'true')
}

/** Chiude il pannello se è aperto, con un click sul bottone. */
export async function closePreferences(page: Page) {
  const button = preferencesButton(page)
  if ((await button.getAttribute('aria-expanded')) === 'true') await button.click()
  await expect(button).toHaveAttribute('aria-expanded', 'false')
}

/**
 * Sceglie la modalità di Motion (Off, On, X-ray) e richiude il pannello, così la pagina
 * resta come la vede chi ha appena scelto: niente pannello sopra il contenuto.
 */
export async function setMotion(page: Page, mode: string) {
  await openPreferences(page)
  await page.getByRole('radio', { name: mode }).click()
  await closePreferences(page)
}
