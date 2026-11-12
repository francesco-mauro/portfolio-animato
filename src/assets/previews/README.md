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

Tutte del 10 novembre 2026, tranne `incidenti.webp`: rifatta il 12 novembre 2026 dal grafico nuovo, dopo la revisione del progetto.

## I video

I tre progetti con una demo online hanno anche un breve video, che parte col mouse sopra la scheda (`tests/animated-previews.spec.ts`). Ognuno c'è in due formati, WebM (VP9) e MP4 (H.264), 720×450, 24 fotogrammi al secondo, senza audio.

| File | Progetto | Cosa si vede | Durata |
|---|---|---|---|
| `boolzapp.webm`, `boolzapp.mp4` | Boolzapp | si apre la chat con Fabio, si scrive «Ciao! Stasera ci sei?», si invia e arriva la risposta «Ok» | 7 s |
| `memory.webm`, `memory.mp4` | Gioco del Memory | sei carte girate una dopo l'altra, con una coppia trovata; ritagliato come `memory.webp` | 7 s |
| `portfolio.webm`, `portfolio.mp4` | Portfolio animato | la prima schermata: il titolo entra, le forme fluttuano, il cursore gira per la pagina | 5,5 s |

Registrati il 12 novembre 2026 dalle demo online, con la registrazione video di Playwright (Chrome a 1280×800, tema chiaro), poi tagliati e ridotti con ffmpeg:

```bash
# VP9: -crf 40, qualità buona e file piccoli. H.264: -crf 28, con faststart per partire subito.
ffmpeg -ss INIZIO -t DURATA -i registrazione.webm -an -vf "scale=720:450:flags=lanczos,fps=24,format=yuv420p" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 nome.webm
ffmpeg -ss INIZIO -t DURATA -i registrazione.webm -an -vf "scale=720:450:flags=lanczos,fps=24,format=yuv420p" -c:v libx264 -crf 28 -preset slow -movflags +faststart nome.mp4
```

`INIZIO` è il momento in cui la demo è già disegnata, non l'apertura della pagina: la registrazione comincia col foglio bianco mentre il sito si carica (Boolzapp ci ha messo 4,4 secondi, il portfolio 1,5). Il 12 novembre 2026 i primi tagli partivano troppo presto e Boolzapp cominciava con più di due secondi di bianco: ora lo controlla `tests/animated-previews.spec.ts` («nessun video comincia con la pagina bianca»).

Per il Memory prima di `scale` c'è `crop=1088:680:96:0`, lo stesso taglio dell'immagine ferma, così passando dall'immagine al video il tavolo non si sposta. Un progetto senza demo online non ha il video: lo controlla `src/data/data.test.ts`.

## Come sono fatte

- Cinque sono scatti di pagina presi con Chrome a 1280×800, tema chiaro, poi ridotti a **720×450** (16:10) e salvati in **WebP**; quelli del login e del Memory sono stati prima ritagliati a 1088×680, sempre 16:10, per avvicinare il soggetto. La sesta, `incidenti.webp`, non è uno scatto: è il grafico originale (1200×720), rimpicciolito senza deformarlo e centrato su un fondo bianco di 720×450.
- Nella scheda l'immagine è larga circa 310 px sul computer: 720 è più del doppio, quindi resta nitida sugli schermi densi.
- In tutto pesano circa 128 KB, e il browser le scarica solo quando la sezione Progetti si avvicina (`loading="lazy"`).
- Due progetti non hanno una pagina online: per fotografarli sono stati avviati sul PC dal loro repository.

## Per rifarne una

Stesse misure e stesso formato: `tests/previews.spec.ts` controlla che ogni immagine sia larga 720 px e che la scheda le riservi lo spazio in 16:10. Se cambia cosa si vede, va cambiato anche il testo alternativo in `src/data/projects.ts`.
