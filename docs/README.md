# docs/

Documenti del progetto che non sono codice.

| File | Cosa contiene |
|---|---|
| `STILI.md` | la guida agli stili: colori, font, forme, curve e movimenti, ognuno con il file del codice dove sta |
| `screenshot.png` | la prima schermata della demo (1440×900, in inglese, tema chiaro, Motion On, senza il cursore del sito), mostrata in cima al README principale. Fotografata con Chrome dalla demo online: se la prima schermata cambia, va rifatta |

## La cartella public/

I file di `public/` sono serviti così come sono, senza passare da Vite: finiscono nella radice di `dist/` con lo stesso nome, e quindi online. Per questo la cartella non ha un README suo, che verrebbe pubblicato come pagina: la descrizione sta qui.

| File | Cosa fa |
|---|---|
| `favicon.svg` | l'icona nella scheda del browser, richiamata da `index.html` |
| `og-image.png` | l'anteprima del link (1200×630) che LinkedIn, WhatsApp e gli altri mostrano quando si condivide il sito, richiamata dai meta `og:image` di `index.html` con l'indirizzo assoluto della demo. È una scheda HTML nei colori di `src/styles/tokens.css` (sfere corallo, anello del cursore, nome e stack), fotografata con Chrome a 1200×630. Se cambia, le misure in `index.html` devono restare quelle vere: lo controlla `tests/og.spec.ts` |
