# src/assets/previews/

Le anteprime delle schede dei progetti: un'immagine vera per ogni progetto, mai un disegno fatto apposta. Le importa `src/data/projects.ts`, le mostra `src/sections/Projects/`.

| File | Progetto | Da dove viene |
|---|---|---|
| `incidenti.webp` | Incidenti stradali in Italia | il grafico `images/cluster-rischio.png` del repository `capston_project_final`, lo stesso del suo README: intero, su fondo bianco |
| `login.webp` | Autenticazione in React | la pagina `/login` del progetto avviato in locale (repository `01_07_2026_myLoginTest`, cartella `myLoginTest`, `npx vite`), ritagliata attorno al modulo |
| `foodie.webp` | Foodie Journal | la home del progetto avviato in locale (repository `proj-html-vuejs`, `npx vite`) |
| `boolzapp.webp` | Boolzapp | la demo online, https://francesco-mauro.github.io/vue-boolzapp/ |
| `memory.webp` | Gioco del Memory | la demo online, https://francesco-mauro.github.io/Memory-Game/, durante una partita, ritagliata attorno al tavolo |
| `portfolio.webp` | Portfolio animato | la demo online di questo sito, la prima schermata |

Tutte del 10 novembre 2026.

## Come sono fatte

- Cinque sono scatti di pagina presi con Chrome a 1280×800, tema chiaro, poi ridotti a **720×450** (16:10) e salvati in **WebP**; quelli del login e del Memory sono stati prima ritagliati a 1088×680, sempre 16:10, per avvicinare il soggetto. La sesta, `incidenti.webp`, non è uno scatto: è il grafico originale (853×549), rimpicciolito senza deformarlo e centrato su un fondo bianco di 720×450.
- Nella scheda l'immagine è larga circa 310 px sul computer: 720 è più del doppio, quindi resta nitida sugli schermi densi.
- In tutto pesano circa 135 KB, e il browser le scarica solo quando la sezione Progetti si avvicina (`loading="lazy"`).
- Due progetti non hanno una pagina online: per fotografarli sono stati avviati sul PC dal loro repository.

## Per rifarne una

Stesse misure e stesso formato: `tests/previews.spec.ts` controlla che ogni immagine sia larga 720 px e che la scheda le riservi lo spazio in 16:10. Se cambia cosa si vede, va cambiato anche il testo alternativo in `src/data/projects.ts`.
