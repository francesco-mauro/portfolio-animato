# Shape/

Le forme corallo che galleggiano nel Hero, come quelle del sito "Kinetic" del video.

| File | Cosa fa |
|---|---|
| `Shape.tsx` | props `kind` (sphere, pill, torus, disc), `size`, `top`, `left`, `delay`, `rotate`, e `phoneTop`, `phoneLeft` per spostare sul telefono una forma che finirebbe sopra il titolo; passa i valori al CSS come variabili, mette `data-shape` con il tipo (lo usano i test) e l'etichetta X-ray |
| `Shape.module.css` | il volume con gradienti radiali, ombre interne e ombre sotto; la ciambella è un anello di gradiente con il buco trasparente inclinato in prospettiva; `@keyframes float` le fa salire e scendere; sul telefono sono grandi la metà e prendono la posizione da telefono |
