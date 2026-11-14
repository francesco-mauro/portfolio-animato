/**
 * content.ts
 * I tipi dei contenuti del sito: profilo, progetti e voci dello stack.
 * I dati veri stanno in src/data/: qui c'è solo la loro forma, così TypeScript
 * segnala un campo mancante o scritto male.
 * Il sito è in due lingue: un testo che cambia con la lingua è un Localized, cioè lo
 * stesso testo in italiano e in inglese. Così un testo senza traduzione non compila.
 * I nomi e le tecnologie, uguali in ogni lingua, restano stringhe semplici.
 */

/** Le lingue del sito. */
export type Lang = 'it' | 'en'

/** Lo stesso testo nelle due lingue. Nei componenti si legge con t() di useLanguage. */
export type Localized = Record<Lang, string>

/** Chi sei e dove trovarti. */
export interface Profile {
  name: string
  /** Il ruolo è già in inglese, come si scrive anche in Italia: non cambia con la lingua. */
  role: string
  city: Localized
  /** Frase sotto il titolo grande. */
  intro: Localized
  /** La frase grande che si accende parola per parola, in cima alla sezione «Chi sono». */
  manifesto: Localized
  /** Il resto della sezione «Chi sono», sotto la frase grande. */
  about: About
  links: ProfileLink[]
}

/** I testi della sezione «Chi sono»: un paragrafo e quattro blocchi. */
export interface About {
  /** Il paragrafo sotto il titolo: da dove arrivi. */
  text: Localized
  /** Il blocco Percorso: corsi e studi, uno per riga. */
  path: Localized[]
  /** Il blocco Esperienze: un lavoro per riga. */
  experience: Localized[]
  /** Il blocco Lingue, su una riga. */
  languages: Localized
  /** Il blocco Cosa cerco: il ruolo e dove. */
  lookingFor: Localized
}

export interface ProfileLink {
  label: string
  href: string
}

/** Il racconto di un progetto in evidenza, in tre frasi. */
export interface ProjectStory {
  /** Il punto di partenza: cosa chiedeva il progetto. */
  start: Localized
  /** Cosa ho fatto. */
  did: Localized
  /** Cosa ne è uscito. */
  result: Localized
}

/**
 * Un progetto del portfolio, preso dalla vetrina GitHub. Ha una descrizione corta (summary)
 * oppure, se è in evidenza, il racconto in tre frasi (story): mai tutti e due, e TypeScript
 * non compila un progetto che li ha entrambi o nessuno.
 */
export type Project = ProjectBase &
  ({ summary: Localized; story?: undefined } | { story: ProjectStory; summary?: undefined })

interface ProjectBase {
  /** Nome del repository su GitHub, usato anche come chiave. */
  repo: string
  title: Localized
  stack: string[]
  /** Quando è stato fatto, come scritto nei README ("aprile 2024", "April 2024"). */
  when?: Localized
  /** Link alla demo online, se c'è (GitHub Pages). */
  demo?: string
  /** Colore della scheda: uno dei toni di components/FloatingCard. */
  tone: 'coral' | 'green' | 'blue' | 'pink' | 'night' | 'light'
  /** L'immagine in cima alla scheda: uno scatto vero del progetto, da src/assets/previews/. */
  preview: ProjectPreview
}

/** L'anteprima di un progetto: 720×450 px, in WebP. */
export interface ProjectPreview {
  /** L'indirizzo dell'immagine, quello che dà Vite quando la si importa. */
  src: string
  /** Cosa si vede, per chi non vede l'immagine. */
  alt: Localized
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
