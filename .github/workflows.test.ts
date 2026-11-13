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
})
