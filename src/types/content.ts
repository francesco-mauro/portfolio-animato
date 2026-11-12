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
  /** L'immagine in cima alla scheda: uno scatto vero del progetto, da src/assets/previews/. */
  preview: ProjectPreview
}

/** L'anteprima di un progetto: 720×450 px, in WebP. */
export interface ProjectPreview {
  /** L'indirizzo dell'immagine, quello che dà Vite quando la si importa. */
  src: string
  /** Cosa si vede, per chi non vede l'immagine. */
  alt: string
  /** Il breve video della demo che parte col mouse sopra la scheda: solo per i progetti con una demo online. */
  video?: PreviewVideo
}

/** Lo stesso video, 720×450 px e muto, in due formati: il browser prende il primo che sa leggere. */
export interface PreviewVideo {
  /** VP9: Chrome, Edge, Firefox e i Safari recenti. */
  webm: string
  /** H.264: per i Safari che non leggono il WebM. */
  mp4: string
}
