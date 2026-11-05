# Shape/

Le forme corallo che galleggiano nel Hero, come quelle del sito "Kinetic" del video.

| File | Cosa fa |
|---|---|
| `Shape.tsx` | props `kind` (sphere, pill, torus, disc), `size`, `top`, `left`, `delay`, `rotate`; passa i valori al CSS come variabili e mette l'etichetta X-ray |
| `Shape.module.css` | il volume con gradienti radiali, ombre interne e ombre sotto; la ciambella è un anello di gradiente con il buco trasparente inclinato in prospettiva; `@keyframes float` le fa salire e scendere; sul telefono sono grandi la metà |
