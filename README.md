# Sito animato · portfolio di Francesco Mauro

Una pagina portfolio animata, costruita con **React + TypeScript + Vite**. Lo stile ricalca i siti mostrati nel video di Jack Roberts "Anthropic Just Shipped Claude Office" (minuti 14:07-16:26): le forme 3D corallo e le schede che fluttuano del sito "Kinetic", il testo che si accende allo scroll e la fascia di loghi del sito "Ridgeline", l'interruttore Motion · Off · On · X-ray. Le animazioni sono quasi tutte CSS, come dice il video; TypeScript serve solo per il cursore, lo scroll e l'inclinazione delle schede.

I testi (progetti, stack, formazione) vengono dal mio CV e dai README dei miei repository: le fonti sono scritte in testa a ogni file di `src/data/`.

## Contenuti
- Avviarlo
- Cosa si vede: le cinque sezioni
- Le tre modalità di movimento
- La struttura: ogni cartella e ogni file
- Regole del progetto
- Documenti

## Avviarlo

Serve Node.js 20 o più recente (provato con Node 24).

```bash
npm install        # una volta sola, scarica le dipendenze
npm run dev        # server di sviluppo su http://localhost:5173, si aggiorna da solo
npm run build      # controllo dei tipi (tsc -b) e build di produzione in dist/
npm run preview    # serve la build di dist/ su http://localhost:4173
npm run lint       # controlla il codice con oxlint
```

## Cosa si vede

| # | Sezione | Ispirata a | Cosa si muove |
|---|---|---|---|
| 1 | **Hero** | sito "Kinetic", 14:15 | il titolo entra parola per parola, cinque forme corallo galleggiano, tre schede fluttuano e si inclinano verso il mouse |
| 2 | **Marquee** | sito "Ridgeline", 15:48 | la fascia con le tecnologie scorre all'infinito, si ferma al passaggio del mouse |
| 3 | **Manifesto** | sito "Ridgeline", 15:48-15:50 | il testo resta fermo al centro e si accende parola per parola mentre scorri |
| 4 | **Progetti** | schede di "Kinetic", 14:15 | sei schede entrano una dopo l'altra e si inclinano verso il mouse |
| 5 | **Contatti** | schermata "One app for all your motion", 14:26 | fondo corallo, un disco ruota in prospettiva |

Sempre presenti: il **cursore** (punto più anello che lo insegue, 14:32), il **menu a pillola** in basso al centro e l'**interruttore Motion** in basso a destra.

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
├── vite.config.ts             configurazione di Vite con il plugin React
├── tsconfig.json              rimanda ai due tsconfig sotto
├── tsconfig.app.json          regole TypeScript per il codice in src/
├── tsconfig.node.json         regole TypeScript per vite.config.ts
├── .gitignore                 cosa git non salva (node_modules, dist, log)
├── .oxlintrc.json             regole del linter oxlint (npm run lint)
├── public/                    file serviti così come sono (la favicon)
├── docs/                      documenti: gli stili presi dal video
└── src/
    ├── main.tsx               punto di ingresso: stili globali e <App />
    ├── App.tsx                compone la pagina: sezioni e controlli fissi
    ├── styles/                CSS globali: variabili, regole comuni, vista X-ray
    ├── types/                 i tipi TypeScript dei contenuti
    ├── data/                  i testi del sito: profilo, progetti, stack
    ├── context/               la modalità di movimento condivisa (On, Off, X-ray)
    ├── hooks/                 la logica riusabile: cursore, scroll, entrate, inclinazione
    ├── components/            i pezzi riusabili: cursore, forme, schede, menu, interruttore
    └── sections/              le cinque sezioni della pagina, in ordine
```

Ogni cartella ha il suo `README.md` con l'elenco dei file e cosa fa ciascuno. Ogni file ha in testa un commento che dice cosa fa e da dove viene.

## Regole del progetto

- **Un componente, una cartella:** `Nome.tsx` più `Nome.module.css` accanto. Lo stile non esce dalla cartella (CSS Modules).
- **I testi stanno in `src/data/`**, mai scritti dentro i componenti.
- **I colori stanno in `src/styles/tokens.css`**, mai scritti a mano altrove se esiste la variabile.
- **Le animazioni rispettano Off e `prefers-reduced-motion`:** chi aggiunge un'animazione non deve fare niente, le regole in `global.css` le fermano tutte.
- **Ogni nuovo `data-xray`** va su un elemento che ha già una `position` nel suo CSS (l'etichetta si appoggia lì).
- **Nessuna libreria di animazione:** solo CSS e un po' di TypeScript, come nel video.

## Documenti

- [docs/STILI.md](docs/STILI.md): colori, font, curve e movimenti, ognuno con il fotogramma del video da cui viene.
