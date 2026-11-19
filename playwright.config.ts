/**
 * playwright.config.ts
 * Configurazione dei test end-to-end (npm run test:e2e): Playwright avvia il sito
 * con Vite sulla porta 5199 e lo apre in un browser vero, perché le animazioni CSS
 * si possono controllare solo lì. In locale usa Chrome già installato; in GitHub
 * Actions (variabile CI) usa il Chromium scaricato da Playwright.
 * Per il modulo contatti (tests/contact.spec.ts) accende anche il server dei contatti
 * (server/, porta 5198) e una seconda copia del sito sulla 5200 che ne conosce l'indirizzo
 * (VITE_CONTACT_URL): il modulo compare solo lì, e tutti gli altri test vedono il sito
 * com'è online, senza modulo. I messaggi dei test finiscono in test-results/.
 * Documentazione: https://playwright.dev/docs/test-configuration
 */
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const PORT = 5199
const CONTACT_PORT = 5198
const CONTACT_SITE_PORT = 5200

/** La copia del sito con il modulo contatti acceso. */
export const CONTACT_SITE = `http://localhost:${CONTACT_SITE_PORT}`
/** Il file dove il server dei contatti salva i messaggi dei test. */
export const CONTACT_FILE = fileURLToPath(new URL('./test-results/contact-messages.jsonl', import.meta.url))

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    channel: process.env.CI ? undefined : 'chrome',
    // Il sito parte nella lingua del browser, e i test cercano i testi italiani: il browser
    // dei test è in italiano. Quello in un'altra lingua lo prova tests/language.spec.ts.
    locale: 'it-IT',
  },
  webServer: [
    {
      command: `npx vite --port ${PORT} --strictPort`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'node server/index.ts',
      // Pronto quando la porta risponde: a una GET il server dà 405, che Playwright non accetta come «acceso».
      port: CONTACT_PORT,
      reuseExistingServer: !process.env.CI,
      env: {
        CONTACT_PORT: String(CONTACT_PORT),
        CONTACT_MESSAGES_FILE: CONTACT_FILE,
        CONTACT_ALLOWED_ORIGINS: CONTACT_SITE,
      },
    },
    {
      command: `npx vite --port ${CONTACT_SITE_PORT} --strictPort`,
      url: CONTACT_SITE,
      reuseExistingServer: !process.env.CI,
      env: { VITE_CONTACT_URL: `http://localhost:${CONTACT_PORT}/api/contact` },
    },
  ],
})
