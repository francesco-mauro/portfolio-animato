# Sito animato · portfolio di Francesco Mauro

Una pagina portfolio animata, costruita con **React + TypeScript + Vite**. Lo stile ricalca i siti mostrati nel video di Jack Roberts "Anthropic Just Shipped Claude Office" (minuti 14:07-16:26): le forme 3D corallo e le schede che fluttuano del sito "Kinetic", il testo che si accende allo scroll e la fascia di loghi del sito "Ridgeline", l'interruttore Motion · Off · On · X-ray. Le animazioni sono quasi tutte CSS, come dice il video; TypeScript serve solo per il cursore, lo scroll e l'inclinazione delle schede.

**Demo:** https://francesco-mauro.github.io/portfolio-animato/

I testi (progetti, stack, formazione) vengono dal mio CV e dai README dei miei repository: le fonti sono scritte in testa a ogni file di `src/data/`.

## Contenuti
- Avviarlo
- Cosa si vede: le cinque sezioni
- Le tre modalità di movimento
- La struttura: ogni cartella e ogni file
- Regole del progetto
- Pubblicazione: GitHub Pages
- La storia dei commit
- Documenti

## Avviarlo

Serve Node.js 20 o più recente (provato con Node 24).

```bash
npm install        # una volta sola, scarica le dipendenze
npm run dev        # server di sviluppo su http://localhost:5173, si aggiorna da solo
npm run build      # controllo dei tipi (tsc -b) e build di produzione in dist/
npm run preview    # serve la build di dist/ su http://localhost:4173
npm run lint       # controlla il codice con oxlint
npm run test:unit  # test dei dati e del workflow con Vitest, senza browser (src/data/data.test.ts, .github/workflows.test.ts)
npm run test:e2e   # test end-to-end con Playwright in un browser vero (tests/)
```

## Cosa si vede

| # | Sezione | Ispirata a | Cosa si muove |
|---|---|---|---|
| 1 | **Hero** | sito "Kinetic", 14:15 | il titolo entra parola per parola, cinque forme corallo galleggiano, tre schede fluttuano e si inclinano verso il mouse |
| 2 | **Marquee** | sito "Ridgeline", 15:48 | la fascia con le tecnologie scorre all'infinito, anche con il mouse sopra |
| 3 | **Manifesto** | sito "Ridgeline", 15:48-15:50 | il testo resta fermo al centro e si accende parola per parola mentre scorri |
| 4 | **Progetti** | schede di "Kinetic", 14:15 | sei schede, ognuna con l'anteprima vera del progetto che si ingrandisce col mouse sopra (e, nelle tre con la demo online, un breve video della demo che parte col mouse sopra), entrano una dopo l'altra seguendo lo scroll, solo in CSS (`animation-timeline: view()`), e si inclinano verso il mouse |
| 5 | **Contatti** | schermata "One app for all your motion", 14:26 | fondo corallo, un disco ruota in prospettiva |

Sempre presenti: il **cursore** (punto più anello che lo insegue, 14:32), il **menu a pillola** in basso al centro, che è l'unico oggetto fisso in basso: il suo ultimo bottone apre il **pannello delle preferenze**, con lingua, tema e Motion (prima erano tre blocchi in basso a destra, che sul telefono coprivano il contenuto). Il **tema chiaro e scuro** parte dal tema del sistema, ricorda la scelta e anima il passaggio con le View Transitions. In cima, la **barra di lettura**: una riga indaco che si riempie mentre la pagina scorre, solo in CSS (`animation-timeline: scroll()`).

Il sito è in **italiano e in inglese**: nel pannello delle preferenze c'è l'interruttore **IT · EN**. Parte nella lingua del browser (italiano se il browser è in italiano, inglese per tutti gli altri), ricorda la scelta e cambia ogni testo della pagina, anche quelli per i lettori di schermo e le etichette della vista X-ray. La descrizione della pagina e l'anteprima del link (Open Graph) restano in italiano: chi prepara l'anteprima di un link (LinkedIn, WhatsApp, Telegram) non esegue JavaScript.

## Le tre modalità di movimento

- **On**: tutto acceso, è la partenza.
- **Off**: tutto fermo e già al suo posto. Si parte da Off anche se il sistema chiede meno movimento (`prefers-reduced-motion`).
- **X-ray**: come nel video (14:38), ogni pezzo mostra un contorno e un'etichetta che dice com'è fatto, per esempio "CSS · sfera · gradiente radiale".

La modalità sta su `<html data-motion="...">`: i CSS la leggono da lì (`src/styles/global.css`, `src/styles/xray.css`).

## La struttura

```
sito-animato/
├── index.html                 la pagina che Vite serve, carica src/main.tsx
├── package.json               dipendenze e comandi npm
├── package-lock.json          versioni esatte delle dipendenze (generato da npm)
├── vite.config.ts             configurazione di Vite con il plugin React, e di Vitest (npm run test:unit)
├── tsconfig.json              rimanda ai due tsconfig sotto
├── tsconfig.app.json          regole TypeScript per il codice in src/
├── tsconfig.node.json         regole TypeScript per i file di configurazione e i test
├── playwright.config.ts       configurazione dei test end-to-end (npm run test:e2e)
├── .gitignore                 cosa git non salva (node_modules, dist, log)
├── .oxlintrc.json             regole del linter oxlint (npm run lint)
├── .github/workflows/deploy.yml  test e pubblicazione su GitHub Pages a ogni push su main
├── .github/workflows.test.ts     le azioni del workflow sono a versioni che girano su Node 24
├── public/                    file serviti così come sono (la favicon, l'immagine di anteprima del link)
├── docs/                      documenti: gli stili presi dal video
├── tests/                     test end-to-end: le animazioni controllate nel browser
└── src/
    ├── main.tsx               punto di ingresso: stili globali e <App />
    ├── App.tsx                compone la pagina: sezioni e menu fisso
    ├── styles/                CSS globali: variabili, regole comuni, vista X-ray
    ├── types/                 i tipi TypeScript dei contenuti
    ├── data/                  i testi del sito in italiano e in inglese: profilo, progetti, stack, interfaccia, con i loro test
    ├── assets/                le immagini importate dal codice: le anteprime dei progetti
    ├── context/               la modalità di movimento (On, Off, X-ray) e la lingua (IT, EN), condivise da tutta la pagina
    ├── hooks/                 la logica riusabile: cursore, scroll, entrate, inclinazione, lingua
    ├── components/            i pezzi riusabili: cursore, forme, schede, menu, preferenze (lingua, tema, Motion), barra di lettura
    └── sections/              le cinque sezioni della pagina, in ordine
```

Ogni cartella ha il suo `README.md` con l'elenco dei file e cosa fa ciascuno. Ogni file ha in testa un commento che dice cosa fa e da dove viene.

## Regole del progetto

- **Un componente, una cartella:** `Nome.tsx` più `Nome.module.css` accanto. Lo stile non esce dalla cartella (CSS Modules).
- **I testi stanno in `src/data/`**, mai scritti dentro i componenti, **in italiano e in inglese** (`{ it, en }`): quelli dell'interfaccia in `ui.ts`. Una scritta lasciata in una lingua sola la trova `tests/language.spec.ts`. Chi aggiunge o cambia un progetto lancia `npm run test:unit`: controlla link, demo, date e doppioni, e che i progetti restino un multiplo di tre (un settimo progetto da solo lascerebbe due posti vuoti nella griglia).
- **I colori stanno in `src/styles/tokens.css`**, mai scritti a mano altrove se esiste la variabile.
- **Il sito si usa da tastiera** (`tests/keyboard.spec.ts`): il primo Tab mostra «Salta al contenuto», poi il menu, che finisce con il bottone delle preferenze, e il contenuto, ognuno con un anello a due colori che si vede su ogni fondo. Il menu sta in basso sullo schermo ma prima nel DOM: l'ordine del DOM è l'ordine del Tab, quindi un pezzo nuovo va messo nel punto giusto di `App.tsx`.
- **L'accessibilità la controlla axe** (`tests/a11y.spec.ts`, dentro `npm run test:e2e`): la pagina deve passare senza violazioni in ogni tema e in ogni modalità di Motion. Il caso più facile da rompere è il contrasto: il testo bianco piccolo va sul corallo scuro (`--color-coral-deep`, 4,94 a 1), non sul corallo dei titoli (3,62 a 1, sotto il 4,5 a 1 di WCAG AA).
- **Le animazioni rispettano Off e `prefers-reduced-motion`:** chi aggiunge un'animazione non deve fare niente, le regole in `global.css` le fermano tutte.
- **Ogni nuovo `data-xray`** va su un elemento che ha già una `position` nel suo CSS (l'etichetta si appoggia lì) e che non ruota, non si inclina e non scala, né lui né i suoi genitori: l'etichetta ne erediterebbe la rotazione. Un pezzo che si muove così si divide in due, un contenitore piatto con `data-xray` e dentro la parte che si muove con `data-xray-outline`, che prende il contorno (come le forme, il disco dei Contatti e le schede).
- **Nessuna libreria di animazione:** solo CSS e un po' di TypeScript, come nel video.

## Pubblicazione: GitHub Pages

Il sito è online su https://francesco-mauro.github.io/portfolio-animato/ e si aggiorna da solo: a ogni push su `main` il workflow `.github/workflows/deploy.yml` installa le dipendenze, passa il linter, lancia i test dei dati e del workflow, fa la build, lancia i test di `tests/` e pubblica `dist/` su GitHub Pages. Le azioni del workflow girano su Node 24: un'azione nuova va aggiunta anche alla tabella di `.github/workflows.test.ts`, dopo aver controllato nel suo `action.yml` su che Node gira. Nella build Vite usa il percorso base `/portfolio-animato/` (in `vite.config.ts`); in sviluppo resta `/`.

## La storia dei commit

I primi dodici commit, fino a `ci: deploy to GitHub Pages with GitHub Actions`, sono stati riordinati in passaggi prima della pubblicazione, il 5 novembre 2026: ognuno compila e passa il linter, ma portano tutti l'orario di quel giorno, a pochi secondi l'uno dall'altro. Da lì in avanti ogni commit è una modifica vera, con la data del giorno in cui è stata fatta.

## Documenti

- [docs/STILI.md](docs/STILI.md): colori, font, curve e movimenti, ognuno con il fotogramma del video da cui viene.
