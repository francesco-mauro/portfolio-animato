# src/assets/previews/

Le anteprime delle schede dei progetti: un'immagine vera per ogni progetto, mai un disegno fatto apposta. Le importa `src/data/projects.ts`, le mostra `src/sections/Projects/`.

| File | Progetto | Da dove viene |
|---|---|---|
| `incidenti.webp` | Incidenti stradali in Italia | la prima pagina della dashboard Power BI del repository `capston_project_final` (`Dashboard.pbix`), fotografata dalla finestra di Power BI Desktop: l'area del report, senza i menu |
| `login.webp` | Autenticazione in React | la pagina `/login` del progetto avviato in locale (repository `01_07_2026_myLoginTest`, cartella `myLoginTest`, `npx vite`), ritagliata attorno al modulo |
| `foodie.webp` | Foodie Journal | la demo online, https://francesco-mauro.github.io/proj-html-vuejs/: il primo fotogramma del suo video, così passando dall'immagine al video non cambia niente |
| `boolzapp.webp` | Boolzapp | la demo online, https://francesco-mauro.github.io/vue-boolzapp/: il primo fotogramma del suo video, così passando dall'immagine al video non cambia niente |
| `memory.webp` | Gioco del Memory | la demo online, https://francesco-mauro.github.io/Memory-Game/, con la grafica Notturno e la barra dei livelli, durante una partita a Normale (due coppie trovate e una carta girata): l'ultimo fotogramma del suo video |
| `portfolio.webp` | Portfolio animato | la demo online di questo sito, la prima schermata |

Tutte del 10 novembre 2026, tranne tre. `incidenti.webp` è del 12 novembre 2026, dopo la revisione del progetto: prima era il grafico a dispersione del README di quel repository. `memory.webp` è del 13 novembre 2026, rifatta con il video dopo che il Memory ha cambiato grafica (stile Notturno, figure al posto dei numeri): prima mostrava le carte grigie con i numeri. `boolzapp.webp` è del 13 novembre 2026, rifatta con il video nuovo.

## I video

I quattro progetti con una demo online, e quello con la dashboard Power BI, hanno anche un breve video, che parte col mouse sopra la scheda (`tests/animated-previews.spec.ts`). Ognuno c'è in due formati, WebM (VP9) e MP4 (H.264), 720×450, 24 fotogrammi al secondo, senza audio.

| File | Progetto | Cosa si vede | Durata |
|---|---|---|---|
| `boolzapp.webm`, `boolzapp.mp4` | Boolzapp | si apre la chat con Fabio, si scrive «Ciao! Stasera ci sei?», si invia e arriva la risposta «Ok» | 7 s |
| `foodie.webm`, `foodie.mp4` | Foodie Journal | la home già caricata (icone e foto comprese) che scorre piano fino alle ricette popolari | 7 s |
| `memory.webm`, `memory.mp4` | Gioco del Memory | una coppia sbagliata (contorno corallo, poi si richiude), due coppie trovate (bordo lime e spunta) e una carta girata, con la barra dei livelli; fotogramma intero, senza ritaglio | 7 s |
| `portfolio.webm`, `portfolio.mp4` | Portfolio animato | la prima schermata: il titolo entra, le forme fluttuano, il cursore gira per la pagina | 5,5 s |
| `incidenti.webm`, `incidenti.mp4` | Incidenti stradali in Italia | la dashboard Power BI: la panoramica, la stessa pagina con il filtro «High density» spuntato, la mappa e la pagina «Where to Invest», con una dissolvenza tra una e l'altra | 6 s |

Registrati il 12 novembre 2026 dalle demo online (il Memory e Boolzapp il 13 novembre 2026), con la registrazione video di Playwright (Chrome a 1280×800, tema chiaro), poi tagliati e ridotti con ffmpeg:

```bash
# VP9: -crf 40, qualità buona e file piccoli. H.264: -crf 28, con faststart per partire subito.
ffmpeg -ss INIZIO -t DURATA -i registrazione.webm -an -vf "scale=720:450:flags=lanczos,fps=24,format=yuv420p" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 nome.webm
ffmpeg -ss INIZIO -t DURATA -i registrazione.webm -an -vf "scale=720:450:flags=lanczos,fps=24,format=yuv420p" -c:v libx264 -crf 28 -preset slow -movflags +faststart nome.mp4
```

`INIZIO` è il momento in cui la demo è già disegnata, non l'apertura della pagina: la registrazione comincia col foglio bianco mentre il sito si carica (il portfolio ci ha messo 1,5 secondi). Il 12 novembre 2026 i primi tagli partivano troppo presto e Boolzapp cominciava con più di due secondi di bianco: ora lo controlla `tests/animated-previews.spec.ts` («nessun video comincia con la pagina bianca»).

Disegnata non basta: anche il secondo taglio di Boolzapp, per circa mezzo secondo, aveva le icone in alto come quadratini vuoti, perché il carattere delle icone (Font Awesome, da un altro server) arrivava dopo la pagina. Il 13 novembre 2026 è stato registrato di nuovo: lo script aspetta che la rete sia ferma, che `document.fonts.check('900 16px "Font Awesome 5 Free"')` dica sì e che tutte le immagini siano caricate, poi un secondo, e solo allora apre la chat; il taglio parte dal secondo 3,0 della registrazione. Lo controlla «il video di Boolzapp comincia con la pagina già caricata»: nell'intestazione a sinistra il primo fotogramma è uguale al secondo 1,5 (differenza 0,03 su 255 nel video nuovo, 5,2 in quello vecchio, soglia 2).

Per il Memory, fino al 13 novembre 2026 a mezzogiorno, prima di `scale` c'era `crop=1216:760:32:10`; con la barra dei livelli il video è a fotogramma intero, parte dal secondo 2,4 della registrazione e le mosse le fa lo script leggendo `data-value` delle carte, così la coppia sbagliata e le due trovate vengono sempre. Un progetto senza demo online non ha il video, tranne quelli elencati in `VIDEO_WITHOUT_DEMO`: lo controlla `src/data/data.test.ts`.

Il video degli incidenti stradali non è una registrazione: la dashboard non è online. È un montaggio di quattro fotografie della finestra di Power BI Desktop, ritagliate sull'area del report (1443×806), ridotte a 720×402 e centrate su un fondo bianco di 720×450. Ogni scena dura 1,8 secondi, l'ultima 1,9, con una dissolvenza di 0,4 secondi (filtro `xfade` di ffmpeg), stessi codec e stessa qualità degli altri. La prima scena è uguale a `incidenti.webp`, così passando dall'immagine al video la pagina non si sposta.

## Come sono fatte

- Cinque sono scatti di pagina presi con Chrome a 1280×800, tema chiaro, poi ridotti a **720×450** (16:10) e salvati in **WebP**; quello del login è stato prima ritagliato a 1088×680, sempre 16:10, per avvicinare il soggetto, e quello del Memory a 1216×760, per tenere intestazione e tavolo. La sesta, `incidenti.webp`, è una fotografia della finestra di Power BI Desktop: l'area del report (1443×806) ridotta a 720×402 e centrata su un fondo bianco di 720×450.
- Nella scheda l'immagine è larga circa 310 px sul computer: 720 è più del doppio, quindi resta nitida sugli schermi densi.
- In tutto pesano circa 144 KB, e il browser le scarica solo quando la sezione Progetti si avvicina (`loading="lazy"`).
- Due progetti non hanno una pagina online: per fotografarli sono stati avviati sul PC dal loro repository.

## Per rifarne una

Stesse misure e stesso formato: `tests/previews.spec.ts` controlla che ogni immagine sia larga 720 px e che la scheda le riservi lo spazio in 16:10. Se cambia cosa si vede, va cambiato anche il testo alternativo in `src/data/projects.ts`.

13 novembre 2026, primo pomeriggio: il Foodie ha la sua demo su GitHub Pages, quindi anche il video (registrato dalla demo dopo che rete, caratteri delle icone e immagini erano caricati, taglio dal secondo 3,2), e la sua immagine ora è il primo fotogramma del video. Il Memory ha i livelli: video e immagine rifatti a fotogramma intero (taglio dal secondo 2,4), perché con la barra dei livelli il vecchio ritaglio `crop=1216:760:32:10` tagliava il fondo del tavolo.
