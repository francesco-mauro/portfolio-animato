# src/hooks/

La logica riusabile, senza grafica. Gli hook che muovono qualcosa scrivono variabili CSS sull'elemento invece di cambiare lo stato di React: il movimento lo fa il CSS e React non ridisegna a ogni pixel.

| File | Cosa fa | Chi lo usa |
|---|---|---|
| `useMotionMode.ts` | legge la modalità (`on`, `off`, `xray`) e la funzione per cambiarla | Cursor, MotionToggle |
| `useCursorFollower.ts` | fa inseguire il mouse a un elemento con ritardo morbido (lerp a ogni fotogramma), scrive `--x` e `--y` | Cursor |
