/**
 * content.ts
 * I tipi dei contenuti del sito: profilo, progetti e voci dello stack.
 * I dati veri stanno in src/data/: qui c'è solo la loro forma, così TypeScript
 * segnala un campo mancante o scritto male.
 */

/** Chi sei e dove trovarti. */
export interface Profile {
  name: string
  role: string
  city: string
  /** Frase sotto il titolo grande. */
  intro: string
  /** Testo che si accende parola per parola nella sezione Manifesto. */
  manifesto: string
  links: ProfileLink[]
}

export interface ProfileLink {
  label: string
  href: string
}

/** Un progetto del portfolio, preso dalla vetrina GitHub. */
export interface Project {
  /** Nome del repository su GitHub, usato anche come chiave. */
  repo: string
  title: string
  summary: string
  stack: string[]
  /** Quando è stato fatto, come scritto nei README ("aprile 2024"). */
  when?: string
  /** Link alla demo online, se c'è (GitHub Pages). */
  demo?: string
  /** Colore della scheda: uno dei toni presi dalle schede del video. */
  tone: 'coral' | 'green' | 'blue' | 'pink' | 'night' | 'light'
}
