# public/

File serviti così come sono, senza passare da Vite: finiscono nella radice di `dist/` con lo stesso nome.

| File | Cosa fa |
|---|---|
| `favicon.svg` | l'icona nella scheda del browser, richiamata da `index.html` |
| `og-image.png` | l'anteprima del link (1200×630) che LinkedIn, WhatsApp e gli altri mostrano quando si condivide il sito, richiamata dai meta `og:image` di `index.html` con l'indirizzo assoluto della demo. È una scheda HTML nei colori di `src/styles/tokens.css` (sfere corallo, anello del cursore, nome e stack), fotografata con Chrome a 1200×630. Se cambia, le misure in `index.html` devono restare quelle vere: lo controlla `tests/og.spec.ts` |
