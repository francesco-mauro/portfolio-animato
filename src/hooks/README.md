# src/hooks/

La logica riusabile, senza grafica. Gli hook che muovono qualcosa scrivono variabili CSS sull'elemento invece di cambiare lo stato di React: il movimento lo fa il CSS e React non ridisegna a ogni pixel.

| File | Cosa fa | Chi lo usa |
|---|---|---|
| `useMotionMode.ts` | legge la modalità (`on`, `off`, `xray`) e la funzione per cambiarla | Cursor, FloatingCard, MotionToggle, ThemeToggle, LanguageToggle, Manifesto, Projects |
| `useLanguage.ts` | legge la lingua (`it`, `en`), la funzione per cambiarla e `t()`, che di un testo bilingue dà quello nella lingua corrente | App, tutte le sezioni, PillNav, Preferences, Shape, MotionToggle, ThemeToggle, LanguageToggle |
| `useCursorFollower.ts` | fa inseguire il mouse a un elemento con ritardo morbido (lerp a ogni fotogramma), scrive `--x` e `--y` | Cursor |
| `useReveal.ts` | aggiunge `is-visible` quando l'elemento entra nello schermo (IntersectionObserver) | Projects (il titolo; per le schede solo come riserva dove manca `animation-timeline`), Contact |
| `useScrollProgress.ts` | dà da 0 a 1 quanto una sezione è stata scorsa | Manifesto |
| `usePointerTilt.ts` | inclina una scheda verso il mouse, scrive `--tilt-x`, `--tilt-y`, `--glow-x`, `--glow-y` | FloatingCard |
