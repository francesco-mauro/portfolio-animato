# ReadingBar/

La barra di lettura: una riga indaco in cima allo schermo che si riempie mentre la pagina scorre.

| File | Cosa fa |
|---|---|
| `ReadingBar.tsx` | un `div` vuoto, nascosto agli screen reader, con `data-testid="reading-bar"` per i test |
| `ReadingBar.module.css` | la riga fissa in cima, alta 4 px, e il riempimento legato allo scroll |

## Com'è fatta, solo CSS

```css
.bar {
  transform: scaleX(0);
  transform-origin: 0 50%;
}

@supports (animation-timeline: scroll()) {
  .bar {
    animation: fill linear both;
    animation-timeline: scroll(root block);
  }
}

@keyframes fill {
  to { transform: scaleX(1); }
}
```

- `animation-timeline: scroll(root block)`: l'animazione avanza con lo scroll verticale della pagina intera, non con il tempo. In cima è a 0, in fondo a 1.
- `scaleX` e non `width`: la trasformazione non ricalcola il layout a ogni pixel di scroll.
- Nessun ascolto dello scroll in JavaScript e nessuno stato in React.

Con Motion Off e con `prefers-reduced-motion` le animazioni sono spente da `styles/global.css`, quindi la barra resta vuota e non si vede. Lo stesso nei browser che non hanno ancora `animation-timeline`.

Non ha un'etichetta X-ray: l'etichetta sta 30 px sopra il suo pezzo, e sopra la barra c'è solo il bordo dello schermo.

Test: `tests/reading-bar.spec.ts`.
