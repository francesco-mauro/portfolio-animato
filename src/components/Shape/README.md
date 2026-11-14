# Shape/

Le forme corallo che galleggiano nel Hero, come quelle del sito "Kinetic" del video.

| File | Cosa fa |
|---|---|
| `Shape.tsx` | props `kind` (sphere, pill, torus, disc), `size`, `top`, `left`, `delay`, `rotate`, e `phoneTop`, `phoneLeft` per spostare sul telefono una forma che finirebbe sopra il titolo; passa i valori al CSS come variabili; due elementi, fuori il contenitore piatto con l'etichetta X-ray, dentro la forma vera con `data-shape` (il tipo, lo usano i test) e `data-xray-outline`, così l'etichetta non eredita la rotazione |
| `Shape.module.css` | `.shape` il contenitore (posto, larghezza, galleggiare), `.body` la forma con la rotazione di partenza; il volume con gradienti radiali, ombre interne e ombre sotto; la ciambella è un anello di gradiente con il buco trasparente inclinato in prospettiva; `@keyframes float` le fa salire e scendere; sul telefono sono grandi la metà e prendono la posizione da telefono |
