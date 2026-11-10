/**
 * data.test.ts
 * Test dei dati del sito (projects.ts, profile.ts, stack.ts) con Vitest: girano in Node,
 * senza browser, in un attimo (npm run test:unit). Un portfolio vive dei suoi link: un
 * indirizzo scritto male o un progetto messo due volte qui si vede prima di pubblicare.
 * Controllano la forma dei dati, non la rete: che un indirizzo risponda davvero non si
 * prova qui, perché un test che dipende da internet diventa rosso per motivi che non
 * sono del codice.
 */
import { describe, expect, it } from 'vitest'
import { profile } from './profile.ts'
import { projects, repoUrl } from './projects.ts'
import { stack } from './stack.ts'

const GITHUB = 'https://github.com/francesco-mauro'
const PAGES = 'https://francesco-mauro.github.io'
const MONTHS = 'gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre'

/** Vero se nella lista non c'è due volte la stessa voce. */
const allDifferent = (list: string[]) => new Set(list).size === list.length

describe('i progetti', () => {
  it('riempiono le righe della griglia a tre colonne, senza un posto vuoto in fondo', () => {
    expect(projects.length).toBeGreaterThan(0)
    expect(projects.length % 3).toBe(0)
  })

  it('compaiono una volta sola: repository e titoli sono tutti diversi', () => {
    // Il nome del repository fa anche da chiave delle schede in React.
    expect(allDifferent(projects.map((project) => project.repo))).toBe(true)
    expect(allDifferent(projects.map((project) => project.title))).toBe(true)
  })

  it.each(projects)('$title: titolo, descrizione e stack ci sono', (project) => {
    expect(project.title.trim()).not.toBe('')
    expect(project.summary.trim()).not.toBe('')
    expect(project.summary.endsWith('.'), 'la descrizione è una frase finita').toBe(true)
    expect(project.stack.length).toBeGreaterThan(0)
    expect(allDifferent(project.stack), 'nessuna tecnologia scritta due volte').toBe(true)
  })

  it.each(projects)('$title: il link al repository è un indirizzo https di GitHub', (project) => {
    expect(project.repo).toMatch(/^[\w.-]+$/)
    expect(repoUrl(project.repo)).toBe(`${GITHUB}/${project.repo}`)
  })

  it.each(projects.filter((project) => project.demo))('$title: la demo sta su GitHub Pages, nella cartella del suo repository', (project) => {
    expect(project.demo).toBe(`${PAGES}/${project.repo}/`)
  })

  it.each(projects)('$title: ha l’anteprima in WebP, con un testo alternativo di più di 15 caratteri', (project) => {
    // Vite, e Vitest con lui, trasforma l'import dell'immagine nel suo indirizzo.
    expect(project.preview.src).toMatch(/\.webp$/)
    expect(project.preview.alt.trim().length).toBeGreaterThan(15)
  })

  it('non hanno due anteprime uguali, né nell’immagine né nella descrizione', () => {
    expect(allDifferent(projects.map((project) => project.preview.src))).toBe(true)
    expect(allDifferent(projects.map((project) => project.preview.alt))).toBe(true)
  })

  it.each(projects.filter((project) => project.when))('$title: la data è scritta «mese anno»', (project) => {
    expect(project.when).toMatch(new RegExp(`^(${MONTHS}) 20\\d\\d$`))
  })
})

describe('il profilo', () => {
  it('ha nome, ruolo, città, frase, testo del Manifesto e almeno un link', () => {
    for (const text of [profile.name, profile.role, profile.city, profile.intro, profile.manifesto]) {
      expect(text.trim()).not.toBe('')
    }
    // Senza questo, con la lista vuota i test dei link qui sotto non girerebbero affatto.
    expect(profile.links.length).toBeGreaterThan(0)
  })

  it.each(profile.links)('$label è un indirizzo https', (link) => {
    expect(link.label.trim()).not.toBe('')
    expect(new URL(link.href).protocol).toBe('https:')
  })

  it('non ha due link con la stessa etichetta o lo stesso indirizzo', () => {
    expect(allDifferent(profile.links.map((link) => link.label))).toBe(true)
    expect(allDifferent(profile.links.map((link) => link.href))).toBe(true)
  })
})

describe('lo stack', () => {
  it('ha almeno una voce, nessuna vuota e nessuna ripetuta', () => {
    expect(stack.length).toBeGreaterThan(0)
    expect(stack.every((tech) => tech.trim() !== '')).toBe(true)
    expect(allDifferent(stack)).toBe(true)
  })
})
