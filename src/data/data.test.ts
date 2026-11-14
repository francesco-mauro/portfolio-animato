/**
 * data.test.ts
 * Test dei dati del sito (projects.ts, profile.ts, stack.ts, ui.ts) con Vitest: girano in Node,
 * senza browser, in un attimo (npm run test:unit). Un portfolio vive dei suoi link: un
 * indirizzo scritto male o un progetto messo due volte qui si vede prima di pubblicare.
 * Controllano la forma dei dati, non la rete: che un indirizzo risponda davvero non si
 * prova qui, perché un test che dipende da internet diventa rosso per motivi che non
 * sono del codice.
 * Il sito è in due lingue: i testi che cambiano con la lingua sono oggetti { it, en }, e
 * l'ultimo gruppo di test controlla che l'inglese ci sia ovunque, che sia davvero tradotto
 * e che numeri e date dicano la stessa cosa dell'italiano. Se la traduzione è buona non lo
 * può dire un test; che sulla pagina cambi tutto lo guarda tests/language.spec.ts.
 */
import { describe, expect, it } from 'vitest'
import { profile } from './profile.ts'
import { projects, repoUrl } from './projects.ts'
import { stack } from './stack.ts'
import { fill, ui } from './ui.ts'
import type { Localized, Project } from '../types/content.ts'

/** Le schede in evidenza sono quelle che raccontano il progetto (story) invece di riassumerlo. */
const featured = projects.filter((project) => project.story)
const others = projects.filter((project) => !project.story)

/** Le frasi che descrivono un progetto: le tre del racconto, o la descrizione corta. */
const descriptionOf = (project: Project): Localized[] =>
  project.story ? [project.story.start, project.story.did, project.story.result] : [project.summary]

const GITHUB = 'https://github.com/francesco-mauro'
const PAGES = 'https://francesco-mauro.github.io'
/** I progetti senza demo online che hanno lo stesso un video: quello della loro dashboard. */
const VIDEO_WITHOUT_DEMO = ['capston_project_final']
const LANGS = ['it', 'en'] as const
/** I mesi nelle due lingue, nello stesso ordine: la posizione dice se due date sono lo stesso mese. */
const MONTHS = {
  it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

/** Vero se nella lista non c'è due volte la stessa voce. */
const allDifferent = (list: string[]) => new Set(list).size === list.length

/** Un testo bilingue trovato dentro i dati, con il punto in cui sta, per dirlo quando un test fallisce. */
interface Found {
  path: string
  text: Record<string, unknown>
}

/** Cerca dentro un dato ogni oggetto che ha la chiave `it` o la chiave `en`: i testi bilingui. */
function localizedIn(value: unknown, path: string): Found[] {
  if (Array.isArray(value)) return value.flatMap((item, i) => localizedIn(item, `${path}[${i}]`))
  if (value === null || typeof value !== 'object') return []
  const record = value as Record<string, unknown>
  if ('it' in record || 'en' in record) return [{ path, text: record }]
  return Object.entries(record).flatMap(([key, item]) => localizedIn(item, `${path}.${key}`))
}

const profileTexts = localizedIn(profile, 'profile')
const projectTexts = localizedIn(projects, 'projects')
const uiTexts = localizedIn(ui, 'ui')
const everyText = [...profileTexts, ...projectTexts, ...uiTexts]

/** I numeri di un testo, senza i separatori delle migliaia: «1.202» e «1,202» sono lo stesso numero. */
const numbersIn = (text: string) => (text.match(/\d[\d.,]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]/g, '')).sort()

/** I segnaposto di un testo, come {role} e {city}. */
const placeholdersIn = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort()

describe('i progetti', () => {
  it('due in evidenza, in testa: gli incidenti stradali e questo sito', () => {
    expect(featured.map((project) => project.repo)).toEqual(['capston_project_final', 'portfolio-animato'])
    expect(projects.slice(0, featured.length)).toEqual(featured)
  })

  it('il racconto di questo sito non dice che i test fermano la pubblicazione, in nessuna lingua', () => {
    // La pipeline che ferma la pubblicazione non l'ha costruita l'autore: la scheda racconta solo i test.
    const site = projects.find((project) => project.repo === 'portfolio-animato')!
    const told = descriptionOf(site).flatMap((sentence) => [sentence.it, sentence.en]).join(' ')
    expect(told).not.toMatch(/non viene pubblicato|not published/i)
  })

  it('le altre riempiono le righe da quattro della griglia, senza un posto vuoto in fondo', () => {
    expect(others.length).toBeGreaterThan(0)
    expect(others.length % 4).toBe(0)
  })

  it('compaiono una volta sola: repository e titoli sono tutti diversi, in ogni lingua', () => {
    // Il nome del repository fa anche da chiave delle schede in React.
    expect(allDifferent(projects.map((project) => project.repo))).toBe(true)
    for (const lang of LANGS) expect(allDifferent(projects.map((project) => project.title[lang]))).toBe(true)
  })

  it.each(projects)('$repo: titolo e stack ci sono, e una descrizione o un racconto, mai tutti e due', (project) => {
    expect(Boolean(project.story) !== Boolean(project.summary), 'o la descrizione o il racconto').toBe(true)
    for (const lang of LANGS) {
      expect(project.title[lang].trim()).not.toBe('')
      for (const sentence of descriptionOf(project)) {
        expect(sentence[lang].trim()).not.toBe('')
        expect(sentence[lang].endsWith('.'), `«${sentence[lang]}» è una frase finita`).toBe(true)
      }
    }
    expect(project.stack.length).toBeGreaterThan(0)
    expect(allDifferent(project.stack), 'nessuna tecnologia scritta due volte').toBe(true)
  })

  it.each(projects)('$repo: il link al repository è un indirizzo https di GitHub', (project) => {
    expect(project.repo).toMatch(/^[\w.-]+$/)
    expect(repoUrl(project.repo)).toBe(`${GITHUB}/${project.repo}`)
  })

  it.each(projects.filter((project) => project.demo))('$repo: la demo sta su GitHub Pages, nella cartella del suo repository', (project) => {
    expect(project.demo).toBe(`${PAGES}/${project.repo}/`)
  })

  it.each(projects)('$repo: ha l’anteprima in WebP, con un testo alternativo di più di 15 caratteri', (project) => {
    // Vite, e Vitest con lui, trasforma l'import dell'immagine nel suo indirizzo.
    expect(project.preview.src).toMatch(/\.webp$/)
    for (const lang of LANGS) expect(project.preview.alt[lang].trim().length).toBeGreaterThan(15)
  })

  it('non hanno due anteprime uguali, né nell’immagine né nella descrizione', () => {
    expect(allDifferent(projects.map((project) => project.preview.src))).toBe(true)
    for (const lang of LANGS) expect(allDifferent(projects.map((project) => project.preview.alt[lang]))).toBe(true)
  })

  it.each(projects)('$repo: ha il video dell’anteprima se ha una demo online, o una dashboard da far vedere', (project) => {
    // Il video mostra la demo che si muove. Senza demo non c'è niente da far vedere, tranne che
    // per i progetti di VIDEO_WITHOUT_DEMO: lì il video mostra le pagine della dashboard.
    const expected = Boolean(project.demo) || VIDEO_WITHOUT_DEMO.includes(project.repo)
    expect(Boolean(project.preview.video)).toBe(expected)
  })

  it.each(projects.filter((project) => project.preview.video))('$repo: il video c’è in WebM e in MP4, diversi dagli altri', (project) => {
    expect(project.preview.video!.webm).toMatch(/\.webm$/)
    expect(project.preview.video!.mp4).toMatch(/\.mp4$/)
    const others = projects.filter((other) => other !== project && other.preview.video)
    for (const other of others) expect(other.preview.video!.webm).not.toBe(project.preview.video!.webm)
  })

  it.each(projects.filter((project) => project.when))('$repo: la data è scritta «mese anno», e in inglese è lo stesso mese dello stesso anno', (project) => {
    const [monthIt, yearIt] = project.when!.it.split(' ')
    const [monthEn, yearEn] = project.when!.en.split(' ')
    expect(MONTHS.it, `«${project.when!.it}»`).toContain(monthIt)
    expect(MONTHS.en, `«${project.when!.en}»`).toContain(monthEn)
    expect(yearIt).toMatch(/^20\d\d$/)
    expect(MONTHS.en.indexOf(monthEn)).toBe(MONTHS.it.indexOf(monthIt))
    expect(yearEn).toBe(yearIt)
  })
})

describe('il profilo', () => {
  it('ha nome, ruolo, città, frase, testo del Manifesto e almeno un link', () => {
    const texts = [profile.name, profile.role, ...LANGS.flatMap((lang) => [profile.city[lang], profile.intro[lang], profile.manifesto[lang]])]
    for (const text of texts) expect(text.trim()).not.toBe('')
    // Senza questo, con la lista vuota i test dei link qui sotto non girerebbero affatto.
    expect(profile.links.length).toBeGreaterThan(0)
  })

  it('ha i testi di «Chi sono»: paragrafo, percorso, esperienze, lingue e cosa cerca', () => {
    const { text, path, experience, languages, lookingFor } = profile.about
    expect(path.length).toBeGreaterThan(0)
    expect(experience.length).toBeGreaterThan(0)
    for (const item of [text, ...path, ...experience, languages, lookingFor]) {
      for (const lang of LANGS) expect(item[lang].trim()).not.toBe('')
    }
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

describe('le due lingue', () => {
  it('i testi bilingui si trovano: profilo, progetti e interfaccia', () => {
    // Senza questo, se la ricerca non trovasse niente i test qui sotto passerebbero a vuoto.
    expect(profileTexts.length).toBeGreaterThanOrEqual(3)
    expect(projectTexts.length).toBeGreaterThanOrEqual(projects.length * 3)
    expect(uiTexts.length).toBeGreaterThan(20)
  })

  it.each(everyText)('$path: c’è in italiano e in inglese, e solo in quelle due lingue', ({ text }) => {
    expect(Object.keys(text).sort()).toEqual(['en', 'it'])
    for (const lang of LANGS) {
      expect(typeof text[lang]).toBe('string')
      expect(text[lang]).not.toBe('')
      expect(text[lang], 'senza spazi in testa o in coda').toBe(String(text[lang]).trim())
    }
  })

  it.each(uiTexts)('$path: il testo dell’interfaccia cambia da una lingua all’altra', ({ text }) => {
    // In ui.ts stanno solo i testi che cambiano: una parola uguale nelle due lingue resta nel componente.
    expect(text.en).not.toBe(text.it)
  })

  it('città, frase, Manifesto e testi di «Chi sono» del profilo sono tradotti', () => {
    const { text: about, path, experience, languages, lookingFor } = profile.about
    const texts = [profile.city, profile.intro, profile.manifesto, about, ...path, ...experience, languages, lookingFor]
    for (const text of texts) expect(text.en).not.toBe(text.it)
  })

  it.each(projects)('$repo: descrizione o racconto e testo alternativo sono tradotti', (project) => {
    // Il titolo no: «Boolzapp» e «Foodie Journal» sono nomi, uguali in ogni lingua.
    for (const sentence of descriptionOf(project)) expect(sentence.en).not.toBe(sentence.it)
    expect(project.preview.alt.en).not.toBe(project.preview.alt.it)
  })

  it.each(everyText)('$path: i numeri sono gli stessi nelle due lingue', ({ text }) => {
    expect(numbersIn(String(text.en))).toEqual(numbersIn(String(text.it)))
  })

  it.each(everyText)('$path: i segnaposto sono gli stessi nelle due lingue', ({ text }) => {
    expect(placeholdersIn(String(text.en))).toEqual(placeholdersIn(String(text.it)))
  })

  it('fill mette i valori al posto dei segnaposto, e lascia stare quelli che non conosce', () => {
    expect(fill('{role} a {city}.', { role: 'Developer', city: 'Roma' })).toBe('Developer a Roma.')
    expect(fill('{role} e {altro}', { role: 'Developer' })).toBe('Developer e {altro}')
  })
})
