# FloatingCard/

La scheda usata nel Hero (piccola, sparsa, che fluttua) e nei Progetti (grande, in griglia).

| File | Cosa fa |
|---|---|
| `FloatingCard.tsx` | props `tone`, `floating`, `xray`, `className`, `style`, `children`; collega `usePointerTilt` (spento in modalità Off) |
| `FloatingCard.module.css` | rotazione 3D dalle variabili di inclinazione, riflesso chiaro che segue il mouse (`::before`), `@keyframes drift` per le schede che fluttuano, i sei toni (coral, green, blue, pink, night, light) |
