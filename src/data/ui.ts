/**
 * ui.ts
 * I testi dell'interfaccia, in italiano e in inglese: il titolo della prima schermata, il
 * menu, i bottoni, i titoli delle sezioni, i nomi che leggono i lettori di schermo
 * (aria-label), i titoli che compaiono al passaggio del mouse e le etichette della vista X-ray.
 * Prima stavano scritti dentro i componenti: con due lingue stanno qui, così un testo
 * senza traduzione non compila e data.test.ts li controlla tutti insieme.
 * Qui stanno solo i testi che cambiano con la lingua. Le parole già inglesi nel sito
 * italiano («Motion», «Build», «Ease») e il codice restano nei componenti: l'elenco è in
 * testa a tests/language.spec.ts, che si accorge di una scritta rimasta in una lingua sola.
 * I testi su Francesco e sui progetti non stanno qui: profile.ts e projects.ts.
 */
import type { Localized } from '../types/content.ts'

/** Un testo nelle due lingue, scritto su una riga: prima l'italiano, poi l'inglese. */
const text = (it: string, en: string): Localized => ({ it, en })

export const ui = {
  /** Il titolo della prima schermata, nei due pezzi che entrano uno dopo l'altro (tests/hero.spec.ts). */
  headline: [text('Quello che vedi,', 'What you see,'), text("e quello che c'è dietro.", "and what's behind it.")],
  /** Il link nascosto che compare con il primo Tab (tests/keyboard.spec.ts). */
  skipLink: text('Salta al contenuto', 'Skip to content'),
  /** Il nome del bottone delle preferenze e del pannello che apre: lingua, tema e Motion. */
  preferences: text('Preferenze di visualizzazione', 'Display preferences'),
  /** I nomi delle sezioni: nel menu, nei titoli e nei nomi delle regioni. */
  sections: {
    about: text('Chi sono', 'About me'),
    projects: text('Progetti', 'Projects'),
    contact: text('Contatti', 'Contact'),
    stack: text('Stack tecnologico', 'Tech stack'),
  },
  nav: {
    label: text('Sezioni', 'Sections'),
    home: text('Torna su', 'Back to top'),
  },
  /** La scritta visibile dell'interruttore resta «Motion» nelle due lingue: questo è il nome del gruppo per i lettori di schermo. */
  motion: { label: text('Movimento', 'Motion mode') },
  theme: {
    caption: text('Tema', 'Theme'),
    label: text('Tema scuro', 'Dark theme'),
    toLight: text('Passa al tema chiaro', 'Switch to the light theme'),
    toDark: text('Passa al tema scuro', 'Switch to the dark theme'),
  },
  language: { label: text('Lingua', 'Language') },
  hero: {
    firstInShowcase: text('Primo in vetrina', 'Featured project'),
    open: text('Apri', 'Open'),
  },
  marquee: { caption: text('Con cosa lavoro', 'What I work with') },
  projects: {
    viewOnGitHub: text('Vedi su GitHub', 'View on GitHub'),
    tryDemo: text('Prova la demo', 'Try the demo'),
  },
  contact: {
    /** Il titolo grande, sulle sue due righe. */
    title: [text('Parliamo del', "Let's talk about"), text('prossimo progetto', 'the next project')],
    /** {role} e {city} arrivano da profile.ts: li mette fill(). */
    note: text(
      '{role} a {city}. Il codice di ogni progetto è su GitHub.',
      '{role} in {city}. The code for every project is on GitHub.',
    ),
  },
  /** Le etichette della vista X-ray: dicono com'è fatto ogni pezzo. Quelle di solo codice restano nei componenti. */
  xray: {
    nav: text('CSS · pillola · position: fixed', 'CSS · pill · position: fixed'),
    title: text('CSS · titolo · @keyframes word-in', 'CSS · title · @keyframes word-in'),
    buildCard: text('React · FloatingCard · tono green', 'React · FloatingCard · green tone'),
    repoCard: text('React · dati da src/data/projects.ts', 'React · data from src/data/projects.ts'),
    marquee: text('CSS · marquee · translateX(-50%) infinito', 'CSS · marquee · translateX(-50%) infinite'),
    manifesto: text('React · useScrollProgress · opacity per parola', 'React · useScrollProgress · opacity per word'),
    contactDisc: text('CSS · disco · @keyframes spin', 'CSS · disc · @keyframes spin'),
    shapes: {
      sphere: text('CSS · sfera · gradiente radiale', 'CSS · sphere · radial gradient'),
      pill: text('CSS · capsula · border-radius + gradiente', 'CSS · capsule · border-radius + gradient'),
      torus: text('CSS · ciambella · anello di gradiente radiale', 'CSS · donut · ring of radial gradient'),
      disc: text('CSS · disco · rotateX in 3D', 'CSS · disc · rotateX in 3D'),
    },
  },
}

/**
 * Mette i valori al posto dei segnaposto {nome} di un testo. Un segnaposto senza valore
 * resta com'è, così si vede sulla pagina invece di sparire.
 */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (placeholder, name: string) => values[name] ?? placeholder)
