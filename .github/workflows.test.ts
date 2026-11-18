/**
 * workflows.test.ts
 * Test del workflow di pubblicazione (.github/workflows/deploy.yml), con Vitest
 * (npm run test:unit). Ogni azione usata deve essere a una versione che gira su Node 24:
 * GitHub ha deprecato Node 20 per le azioni (https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)
 * e lo segnala con un avviso in ogni esecuzione.
 * La tabella dice, per ogni azione, la prima versione maggiore su Node 24, letta nel suo
 * action.yml (runs.using: node24; upload-pages-artifact è composita e dalla v5 usa
 * upload-artifact v7, su Node 24). Un'azione nuova nel workflow che non è in tabella fa
 * fallire il test: prima di aggiungerla si controlla su che Node gira.
 * Il controllo vero resta in Actions: dopo il push l'esecuzione non deve avere l'avviso.
 * Controlla anche che il controllo Lighthouse (scripts/lighthouse.mjs) giri tra la build
 * e la pubblicazione, con Google Chrome.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

const FIRST_NODE24_MAJOR: Record<string, number> = {
  'actions/checkout': 5,
  'actions/setup-node': 5,
  'actions/upload-pages-artifact': 5,
  'actions/deploy-pages': 5,
}

const workflow = readFileSync(new URL('./workflows/deploy.yml', import.meta.url), 'utf8')
const uses = [...workflow.matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@(\S+)/g)].map(([, action, ref]) => ({ action, ref }))

describe('deploy.yml', () => {
  test('usa almeno un\'azione', () => {
    expect(uses.length).toBeGreaterThan(0)
  })

  test.each(uses)('$action@$ref gira su Node 24', ({ action, ref }) => {
    expect(Object.keys(FIRST_NODE24_MAJOR), `${action} non è in tabella: controlla su che Node gira`).toContain(action)
    const major = /^v(\d+)$/.exec(ref)
    expect(major, `${action}@${ref}: serve una versione maggiore, come v5`).not.toBeNull()
    expect(Number(major![1])).toBeGreaterThanOrEqual(FIRST_NODE24_MAJOR[action])
  })

  test('i test e la build girano su Node 24', () => {
    expect(workflow).toMatch(/node-version:\s*24\b/)
  })

  // Il controllo delle prestazioni (scripts/lighthouse.mjs) misura la build: va dopo
  // npm run build e prima della pubblicazione, con Google Chrome e non col Chromium di
  // Playwright (perché, nel commento in testa allo script).
  test('il controllo Lighthouse gira dopo la build e prima della pubblicazione, con Chrome', () => {
    // Solo le righe dei passi (- run: / - uses:), non i commenti, che nominano gli stessi comandi
    const steps = workflow.split('\n').map((line) => line.trim()).filter((line) => /^- (run|uses):/.test(line))
    const at = (text: string) => steps.findIndex((step) => step.includes(text))
    const lighthouse = at('npm run test:lighthouse')
    expect(lighthouse, 'manca il passo npm run test:lighthouse').toBeGreaterThan(-1)
    expect(lighthouse).toBeGreaterThan(at('npm run build'))
    expect(lighthouse).toBeLessThan(at('actions/upload-pages-artifact'))
    // CHROME_PATH sta nell'env del passo Lighthouse: le righe subito dopo, prima del passo seguente
    const after = workflow.slice(workflow.indexOf('- run: npm run test:lighthouse'))
    const ownBlock = after.slice(0, after.indexOf('\n      - ', 1))
    expect(ownBlock).toMatch(/CHROME_PATH:\s*\/usr\/bin\/google-chrome/)
  })
})
