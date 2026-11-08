# src/styles/

I CSS globali, importati una volta da `main.tsx`. Lo stile dei singoli pezzi sta invece nei `*.module.css` accanto ai componenti.

| File | Cosa fa |
|---|---|
| `tokens.css` | le variabili del design: colori presi dai fotogrammi del video, font, raggi, ombre, le due curve di animazione (`--ease-out-back` letta sulla scheda "Ease" a 14:15); sotto `[data-theme='dark']` i colori del tema scuro e la durata del passaggio con le View Transitions |
| `global.css` | reset leggero, font del body, cursore nascosto dove c'è un mouse, la classe `.reveal` per le entrate allo scroll, lo stop di tutte le animazioni in modalità Off e con `prefers-reduced-motion` |
| `xray.css` | la vista X-ray: contorno tratteggiato ed etichetta (`::after` con `attr(data-xray)`) su ogni elemento che ha `data-xray` |
