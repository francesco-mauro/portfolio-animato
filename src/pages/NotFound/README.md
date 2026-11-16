# NotFound/

La pagina 404 del sito. GitHub Pages la mostra per ogni indirizzo che non esiste sotto `/portfolio-animato/`, al posto della sua pagina grigia; in sviluppo la serve Vite con lo stato 404 (il plugin `notFoundPage` in `vite.config.ts`). La pagina HTML è `404.html` alla radice, l'entrata è `src/notFound.tsx`, i testi nelle due lingue stanno in `src/data/notFound.ts`.

| File | Cosa fa |
|---|---|
| `NotFound.tsx` | il nome in alto e il bottone che riportano al sito (`import.meta.env.BASE_URL`), quattro forme corallo di `Shape` con la posizione da telefono, il «404» grande con la ciambella al posto dello zero, nascosto ai lettori di schermo, la pillola «Errore 404», il titolo e una riga di spiegazione; il cursore del sito; i provider della modalità di movimento e della lingua |
| `NotFound.module.css` | schermo pieno con tutto al centro e le forme tagliate dai bordi, così la pagina non scorre di lato; le cifre entrano una dopo l'altra con la curva Out back (`digit-in`), lo zero poi galleggia (`ring-float`); pillola e bottone sul corallo scuro, 4,94 a 1 con il bianco |

Test: `tests/not-found.spec.ts` (nel browser) e `pages.test.ts` (la build costruisce `dist/404.html`, la testa della pagina ha lo stesso script di `index.html`).
