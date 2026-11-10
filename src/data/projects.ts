/**
 * projects.ts
 * I cinque progetti della vetrina GitHub, nello stesso ordine del profilo, e in fondo questo sito.
 * Il gestionale documentale è uscito dalla vetrina il 7 novembre 2026 e al suo posto è entrato
 * il portfolio animato (test: tests/projects.spec.ts).
 * Fonti: i README dei repository. Le demo di Boolzapp, Memory e di questo sito sono su GitHub Pages.
 * Ogni progetto ha la sua anteprima: uno scatto vero, importato da src/assets/previews/ (da dove
 * viene ognuno è scritto nel README di quella cartella). Importarle qui fa sì che un file che
 * manca fermi la build.
 * La forma dei dati (link, demo, date, doppioni, multiplo di tre, anteprime) la controlla data.test.ts.
 */
import type { Project } from '../types/content.ts'
import boolzapp from '../assets/previews/boolzapp.webp'
import foodie from '../assets/previews/foodie.webp'
import incidenti from '../assets/previews/incidenti.webp'
import login from '../assets/previews/login.webp'
import memory from '../assets/previews/memory.webp'
import portfolio from '../assets/previews/portfolio.webp'

export const projects: Project[] = [
  {
    repo: 'capston_project_final',
    title: 'Incidenti stradali in Italia',
    summary: 'Dati ISTAT del 2024, indicatori per abitante e per km², K-Means: 1.187 comuni in tre classi di rischio.',
    stack: ['Python', 'pandas', 'K-Means', 'Power BI'],
    when: 'agosto 2026',
    tone: 'night',
    preview: {
      src: incidenti,
      alt: 'Grafico a dispersione dei comuni divisi in tre classi di rischio: basso, medio e alto',
    },
  },
  {
    repo: '01_07_2026_myLoginTest',
    title: 'Autenticazione in React',
    summary: 'Login, registrazione e recupero password in una single page app.',
    stack: ['React', 'TypeScript', 'CSS Modules'],
    tone: 'blue',
    preview: {
      src: login,
      alt: 'La pagina di accesso: email, password, il bottone «Continua con Google» e il link per registrarsi',
    },
  },
  {
    repo: 'proj-html-vuejs',
    title: 'Foodie Journal',
    summary: 'Replica di un tema food in Vue, progetto di gruppo: header, icone social, pagina Chi siamo.',
    stack: ['Vue.js', 'HTML', 'CSS'],
    when: 'maggio 2024',
    tone: 'pink',
    preview: {
      src: foodie,
      alt: 'La home con il logo Avada Food: il menu, le icone social e l’articolo in evidenza sopra la foto di una ciotola con uovo e verdure',
    },
  },
  {
    repo: 'vue-boolzapp',
    title: 'Boolzapp',
    summary: 'Replica di WhatsApp Web in Vue 3.',
    stack: ['Vue 3', 'JavaScript'],
    when: 'aprile 2024',
    demo: 'https://francesco-mauro.github.io/vue-boolzapp/',
    tone: 'green',
    preview: {
      src: boolzapp,
      alt: 'Boolzapp: l’elenco delle chat a sinistra e una conversazione aperta a destra',
    },
  },
  {
    repo: 'Memory-Game',
    title: 'Gioco del Memory',
    summary: 'Il Memory in JavaScript senza librerie: carte mescolate, timer, mosse, vittoria.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    when: 'ottobre 2024',
    demo: 'https://francesco-mauro.github.io/Memory-Game/',
    tone: 'light',
    preview: {
      src: memory,
      alt: 'Il Memory durante una partita: venti carte, una scoperta e una che si sta girando',
    },
  },
  {
    repo: 'portfolio-animato',
    title: 'Portfolio animato',
    summary: 'Questo sito: forme 3D in CSS, cursore che insegue, testo che si accende allo scroll, vista X-ray. Test con Playwright.',
    stack: ['React', 'TypeScript', 'Vite', 'Playwright'],
    when: 'novembre 2026',
    demo: 'https://francesco-mauro.github.io/portfolio-animato/',
    tone: 'coral',
    preview: {
      src: portfolio,
      alt: 'La prima schermata di questo sito: il titolo corallo tra forme 3D e schede che fluttuano',
    },
  },
]

/** Link al repository su GitHub a partire dal nome. */
export const repoUrl = (repo: string) => `https://github.com/francesco-mauro/${repo}`
