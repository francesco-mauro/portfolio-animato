/**
 * projects.ts
 * I cinque progetti della vetrina GitHub, nello stesso ordine del profilo, e in fondo questo sito.
 * Il gestionale documentale è uscito dalla vetrina il 7 novembre 2026 e al suo posto è entrato
 * il portfolio animato (test: tests/projects.spec.ts).
 * Fonti: i README dei repository. Le demo di Boolzapp, Memory e di questo sito sono su GitHub Pages.
 * Ogni progetto ha la sua anteprima: uno scatto vero, importato da src/assets/previews/ (da dove
 * viene ognuno è scritto nel README di quella cartella). Importarle qui fa sì che un file che
 * manca fermi la build.
 * I progetti con una demo online hanno anche un breve video della demo, che parte col mouse sopra
 * la scheda (test: tests/animated-previews.spec.ts), in WebM e in MP4, dalla stessa cartella.
 * Gli incidenti stradali non hanno una demo: il loro video mostra le pagine della dashboard Power BI.
 * La forma dei dati (link, demo, date, doppioni, multiplo di tre, anteprime, video) la controlla data.test.ts.
 */
import type { Project } from '../types/content.ts'
import boolzapp from '../assets/previews/boolzapp.webp'
import boolzappMp4 from '../assets/previews/boolzapp.mp4'
import boolzappWebm from '../assets/previews/boolzapp.webm'
import foodie from '../assets/previews/foodie.webp'
import incidenti from '../assets/previews/incidenti.webp'
import incidentiMp4 from '../assets/previews/incidenti.mp4'
import incidentiWebm from '../assets/previews/incidenti.webm'
import login from '../assets/previews/login.webp'
import memory from '../assets/previews/memory.webp'
import memoryMp4 from '../assets/previews/memory.mp4'
import memoryWebm from '../assets/previews/memory.webm'
import portfolio from '../assets/previews/portfolio.webp'
import portfolioMp4 from '../assets/previews/portfolio.mp4'
import portfolioWebm from '../assets/previews/portfolio.webm'

export const projects: Project[] = [
  {
    repo: 'capston_project_final',
    title: 'Incidenti stradali in Italia',
    summary: 'Dati ISTAT del 2025, indicatori per abitante e per km², K-Means: 1.202 comuni in tre profili, con un punteggio di priorità.',
    stack: ['Python', 'pandas', 'K-Means', 'Power BI'],
    when: 'agosto 2026',
    tone: 'night',
    preview: {
      src: incidenti,
      alt: 'La dashboard Power BI del progetto: i primi dieci comuni per punteggio di priorità e il grafico dei tre profili',
      video: { webm: incidentiWebm, mp4: incidentiMp4 },
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
      video: { webm: boolzappWebm, mp4: boolzappMp4 },
    },
  },
  {
    repo: 'Memory-Game',
    title: 'Gioco del Memory',
    summary: 'Il Memory in JavaScript senza librerie: figure a tratto, timer, mosse, record e tastiera. Logica testata con Node.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    when: 'ottobre 2024',
    demo: 'https://francesco-mauro.github.io/Memory-Game/',
    tone: 'light',
    preview: {
      src: memory,
      alt: 'Il Memory durante una partita: venti carte scure, due coppie trovate con il bordo lime e una carta girata con un triangolo',
      video: { webm: memoryWebm, mp4: memoryMp4 },
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
      video: { webm: portfolioWebm, mp4: portfolioMp4 },
    },
  },
]

/** Link al repository su GitHub a partire dal nome. */
export const repoUrl = (repo: string) => `https://github.com/francesco-mauro/${repo}`
