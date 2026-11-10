# Projects/

La griglia dei progetti.

| File | Cosa fa |
|---|---|
| `Projects.tsx` | `ProjectItem` per ogni progetto di `data/projects.ts`: numero, data, titolo, descrizione, stack, link a GitHub e alla demo quando c'è; a ogni scheda passa `--stagger` (0, 1, 2), il suo posto nella riga quando le colonne sono tre. Tiene `useReveal` come riserva per i browser senza timeline di scroll |
| `Projects.module.css` | griglia a colonne automatiche (minimo 300 px), schede della stessa altezza con i link sempre in fondo, freccia che scatta al passaggio del mouse, e l'entrata delle schede con lo scroll |

## L'entrata con lo scroll, solo CSS

Le schede non entrano a tempo: le porta dentro lo scroll, avanti e indietro. Ogni scheda ha una timeline legata a quanto è entrata nello schermo:

```css
@supports (animation-timeline: view()) {
  .grid .item {
    animation: enter linear both;
    animation-timeline: view();
    animation-range: entry calc(var(--stagger, 0) * 15%) entry calc(70% + var(--stagger, 0) * 15%);
  }
}
```

- `animation-timeline: view()`: l'avanzamento dell'animazione è la posizione della scheda nello schermo, non un orologio. Nessun ascolto dello scroll in JavaScript.
- `animation-range: entry …`: l'animazione si svolge mentre la scheda entra dal fondo dello schermo. `entry 0%` è il bordo alto sul fondo dello schermo, `entry 100%` è la scheda entrata tutta.
- `--stagger`: vale 0, 1 o 2 (`index % 3`) e sposta il tratto del 15% per volta. Con tre colonne, sul computer, è il posto nella riga: la seconda e la terza scheda arrivano un poco dopo la prima, e la terza finisce a `entry 100%`. Con due colonne (una finestra stretta, un tablet) o una (il telefono) il numero resta quello: lo sfasamento c'è, ma non segue più la riga.
- `@keyframes enter` scrive solo la partenza (trasparente, 40 px più in basso, un filo più piccola): l'arrivo è la scheda com'è.

Con Motion Off e con `prefers-reduced-motion` le animazioni sono spente da `styles/global.css` e le schede stanno già al loro posto, visibili. Nei browser che non hanno ancora `animation-timeline` il blocco `@supports` non vale: lì resta l'entrata con `useReveal` e la classe `.reveal`.

Test: `tests/projects-scroll.spec.ts`.
