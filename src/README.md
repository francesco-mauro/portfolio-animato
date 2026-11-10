# src/

Tutto il codice del sito. Vite parte da `main.tsx`.

| Cosa | Cosa fa |
|---|---|
| `main.tsx` | punto di ingresso: importa i tre CSS globali (in ordine: token, regole, X-ray) e monta `<App />` in `#root` |
| `App.tsx` | compone la pagina: provider della modalità, cursore, barra di lettura, le cinque sezioni, menu a pillola, interruttore del movimento e bottone del tema |
| `styles/` | CSS globali, non legati a un componente |
| `types/` | i tipi TypeScript dei contenuti |
| `data/` | i testi del sito |
| `context/` | la modalità di movimento condivisa |
| `hooks/` | la logica riusabile, senza grafica |
| `components/` | i pezzi grafici riusabili |
| `sections/` | le cinque sezioni della pagina |

Il flusso: `data/` dà i testi, `sections/` li dispone usando i `components/`, gli `hooks/` muovono le cose, `context/` dice se muoverle.
