# src/pages/

Le pagine che non sono il sito. Il sito vero è una pagina sola, `index.html` con `App.tsx`; qui stanno le altre pagine HTML, ognuna con il suo punto di ingresso in `src/` e la sua riga negli input della build in `vite.config.ts`.

| Cartella | Cosa fa |
|---|---|
| `NotFound/` | la pagina 404 (`404.html`, entrata `src/notFound.tsx`): GitHub Pages la mostra per ogni indirizzo che non esiste |
