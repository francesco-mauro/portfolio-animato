/**
 * playwright.config.ts
 * Configurazione dei test end-to-end (npm run test:e2e): Playwright avvia il sito
 * con Vite sulla porta 5199 e lo apre in un browser vero, perché le animazioni CSS
 * si possono controllare solo lì. In locale usa Chrome già installato; in GitHub
 * Actions (variabile CI) usa il Chromium scaricato da Playwright.
 * Documentazione: https://playwright.dev/docs/test-configuration
 */
import { defineConfig, devices } from '@playwright/test'

const PORT = 5199

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
  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
})
