# src/

Tutto il codice del sito. Vite parte da `main.tsx`, e per la pagina 404 da `notFound.tsx`.

| Cosa | Cosa fa |
|---|---|
| `main.tsx` | punto di ingresso: importa i tre CSS globali (in ordine: token, regole, X-ray) e monta `<App />` in `#root` |
| `notFound.tsx` | punto di ingresso della pagina 404 (`404.html`): token e regole globali, poi `<NotFound />` |
| `App.tsx` | compone la pagina: provider della modalità, cursore, barra di lettura, le cinque sezioni, menu a pillola, interruttore del movimento e bottone del tema |
| `styles/` | CSS globali, non legati a un componente |
| `types/` | i tipi TypeScript dei contenuti |
| `data/` | i testi del sito |
| `assets/` | le immagini importate dal codice: le anteprime dei progetti |
| `context/` | la modalità di movimento condivisa |
| `hooks/` | la logica riusabile, senza grafica |
| `components/` | i pezzi grafici riusabili |
| `sections/` | le cinque sezioni della pagina |
| `pages/` | le pagine che non sono il sito: la 404 |

Il flusso: `data/` dà i testi, `sections/` li dispone usando i `components/`, gli `hooks/` muovono le cose, `context/` dice se muoverle.
