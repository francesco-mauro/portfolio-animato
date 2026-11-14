# Preferences/

Il bottone delle preferenze, ultimo elemento del menu a pillola, e il pannello che apre: lingua, tema e Motion, uno per riga. Prima erano tre blocchi fissi in basso a destra, che sul telefono coprivano il contenuto insieme al menu.

| File | Cosa fa |
|---|---|
| `Preferences.tsx` | il bottone (`aria-expanded`, `aria-controls`) e il pannello, che non è nel DOM finché è chiuso; si chiude con Esc (il focus torna al bottone), con un click fuori e quando il focus esce con Tab; dentro ci sono `LanguageToggle`, `ThemeToggle` e `MotionToggle` |
| `Preferences.module.css` | il bottone tondo dentro la pillola e il pannello scuro, agganciato al bordo destro del menu e mai più largo dello schermo; una sola animazione breve all'apertura |

Test: `tests/preferences.spec.ts`. Gli altri test aprono il pannello con gli aiuti di `tests/preferences.ts`.
