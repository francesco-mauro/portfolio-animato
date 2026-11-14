/**
 * projects.ts
 * I cinque progetti della vetrina GitHub, nello stesso ordine del profilo, e in fondo questo sito.
 * Il gestionale documentale è uscito dalla vetrina il 7 novembre 2026 e al suo posto è entrato
 * il portfolio animato (test: tests/projects.spec.ts).
 * Fonti: i README dei repository. Le demo di Foodie Journal, Boolzapp, Memory e di questo sito sono su GitHub Pages.
 * Ogni progetto ha la sua anteprima: uno scatto vero, importato da src/assets/previews/ (da dove
 * viene ognuno è scritto nel README di quella cartella). Importarle qui fa sì che un file che
 * manca fermi la build.
 * I progetti con una demo online hanno anche un breve video della demo, che parte col mouse sopra
 * la scheda (test: tests/animated-previews.spec.ts), in WebM e in MP4, dalla stessa cartella.
 * Gli incidenti stradali non hanno una demo: il loro video mostra le pagine della dashboard Power BI.
 * La forma dei dati (link, demo, date, doppioni, multiplo di tre, anteprime, video) la controlla data.test.ts.
 * Titolo, descrizione, data e testo alternativo hanno l'italiano e l'inglese ({ it, en }): data.test.ts
 * controlla anche che l'inglese ci sia ovunque e che numeri e date siano gli stessi dell'italiano.
 * I titoli che sono nomi («Boolzapp», «Foodie Journal») sono uguali nelle due lingue.
 * Nei testi alternativi una scritta che si legge nell'immagine resta com'è nell'immagine, tra
 * virgolette, anche nell'inglese («Continua con Google», «Normale»): l'immagine non cambia lingua.
 */
import type { Project } from '../types/content.ts'
import boolzapp from '../assets/previews/boolzapp.webp'
import boolzappMp4 from '../assets/previews/boolzapp.mp4'
import boolzappWebm from '../assets/previews/boolzapp.webm'
import foodie from '../assets/previews/foodie.webp'
import foodieMp4 from '../assets/previews/foodie.mp4'
import foodieWebm from '../assets/previews/foodie.webm'
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
    title: { it: 'Incidenti stradali in Italia', en: 'Road accidents in Italy' },
    summary: {
      it: 'Dati ISTAT del 2025, indicatori per abitante e per km², K-Means: 1.202 comuni in tre profili, con un punteggio di priorità.',
      en: 'ISTAT data from 2025, indicators per inhabitant and per km², K-Means: 1,202 municipalities in three profiles, with a priority score.',
    },
    stack: ['Python', 'pandas', 'K-Means', 'Power BI'],
    when: { it: 'agosto 2026', en: 'August 2026' },
    tone: 'night',
    preview: {
      src: incidenti,
      alt: {
        it: 'La dashboard Power BI del progetto: i primi dieci comuni per punteggio di priorità e il grafico dei tre profili',
        en: 'The Power BI dashboard of the project: the top ten municipalities by priority score and the chart of the three profiles',
      },
      video: { webm: incidentiWebm, mp4: incidentiMp4 },
    },
  },
  {
    repo: '01_07_2026_myLoginTest',
    title: { it: 'Autenticazione in React', en: 'Authentication in React' },
    summary: {
      it: 'Login, registrazione e recupero password in una single page app.',
      en: 'Login, sign-up and password recovery in a single-page app.',
    },
    stack: ['React', 'TypeScript', 'CSS Modules'],
    tone: 'blue',
    preview: {
      src: login,
      alt: {
        it: 'La pagina di accesso: email, password, il bottone «Continua con Google» e il link per registrarsi',
        en: 'The login page: email, password, the "Continua con Google" button and the link to sign up',
      },
    },
  },
  {
    repo: 'proj-html-vuejs',
    title: { it: 'Foodie Journal', en: 'Foodie Journal' },
    summary: {
      it: 'Replica di un tema food in Vue, progetto di gruppo: header, icone social, pagina Chi siamo.',
      en: 'A food theme replica in Vue, a group project: header, social icons, About Us page.',
    },
    stack: ['Vue.js', 'HTML', 'CSS'],
    when: { it: 'maggio 2024', en: 'May 2024' },
    demo: 'https://francesco-mauro.github.io/proj-html-vuejs/',
    tone: 'pink',
    preview: {
      src: foodie,
      alt: {
        it: 'La home con il logo Avada Food: il menu, le icone social e l’articolo in evidenza sopra la foto di una ciotola con uovo e verdure',
        en: 'The home page with the Avada Food logo: the menu, the social icons and the featured article above the photo of a bowl with egg and vegetables',
      },
      video: { webm: foodieWebm, mp4: foodieMp4 },
    },
  },
  {
    repo: 'vue-boolzapp',
    title: { it: 'Boolzapp', en: 'Boolzapp' },
    summary: { it: 'Replica di WhatsApp Web in Vue 3.', en: 'A WhatsApp Web replica in Vue 3.' },
    stack: ['Vue 3', 'JavaScript'],
    when: { it: 'aprile 2024', en: 'April 2024' },
    demo: 'https://francesco-mauro.github.io/vue-boolzapp/',
    tone: 'green',
    preview: {
      src: boolzapp,
      alt: {
        it: 'Boolzapp: l’elenco delle chat a sinistra e una conversazione aperta a destra',
        en: 'Boolzapp: the list of chats on the left and an open conversation on the right',
      },
      video: { webm: boolzappWebm, mp4: boolzappMp4 },
    },
  },
  {
    repo: 'Memory-Game',
    title: { it: 'Gioco del Memory', en: 'Memory game' },
    summary: {
      it: 'Il Memory in JavaScript senza librerie: tre livelli, figure a tratto, timer, record e tastiera. Logica testata con Node.',
      en: 'Memory in JavaScript with no libraries: three levels, line-drawn figures, timer, best scores and keyboard controls. Logic tested with Node.',
    },
    stack: ['HTML', 'CSS', 'JavaScript'],
    when: { it: 'ottobre 2024', en: 'October 2024' },
    demo: 'https://francesco-mauro.github.io/Memory-Game/',
    tone: 'light',
    preview: {
      src: memory,
      alt: {
        it: 'Il Memory durante una partita al livello Normale: venti carte scure, due coppie trovate con il bordo lime e una carta girata con un arco',
        en: 'Memory during a game on the "Normale" level: twenty dark cards, two matched pairs with a lime border and one flipped card showing an arc',
      },
      video: { webm: memoryWebm, mp4: memoryMp4 },
    },
  },
  {
    repo: 'portfolio-animato',
    title: { it: 'Portfolio animato', en: 'Animated portfolio' },
    summary: {
      it: 'Questo sito: forme 3D in CSS, cursore che insegue, testo che si accende allo scroll, vista X-ray. Test con Playwright.',
      en: 'This site: 3D shapes in CSS, a cursor that follows you, text that lights up on scroll, X-ray view. Tested with Playwright.',
    },
    stack: ['React', 'TypeScript', 'Vite', 'Playwright'],
    when: { it: 'novembre 2026', en: 'November 2026' },
    demo: 'https://francesco-mauro.github.io/portfolio-animato/',
    tone: 'coral',
    preview: {
      src: portfolio,
      alt: {
        it: 'La prima schermata di questo sito: il titolo corallo tra forme 3D e schede che fluttuano',
        en: 'The first screen of this site: the coral title among 3D shapes and floating cards',
      },
      video: { webm: portfolioWebm, mp4: portfolioMp4 },
    },
  },
]

/** Link al repository su GitHub a partire dal nome. */
export const repoUrl = (repo: string) => `https://github.com/francesco-mauro/${repo}`
