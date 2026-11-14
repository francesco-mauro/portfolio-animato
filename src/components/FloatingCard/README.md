# FloatingCard/

La scheda usata nel Hero (piccola, sparsa, che fluttua) e nei Progetti (grande, in griglia).

| File | Cosa fa |
|---|---|
| `FloatingCard.tsx` | props `tone`, `floating`, `xray`, `className` (la cornice: dove sta), `bodyClassName` (la scheda: come dispone il contenuto), `style`, `children`; due elementi, una cornice piatta con l'etichetta X-ray e dentro la scheda che si inclina, con `data-xray-outline`; collega `usePointerTilt` (spento in modalità Off) |
| `FloatingCard.module.css` | `.frame` la cornice; rotazione 3D dalle variabili di inclinazione, riflesso chiaro che segue il mouse (`::before`), `@keyframes drift` per le schede che fluttuano, i sei toni (coral, green, blue, pink, night, light) |
