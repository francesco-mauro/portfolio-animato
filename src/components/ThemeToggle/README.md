# ThemeToggle/

Il bottone del tema chiaro e scuro, in basso a destra sopra l'interruttore Motion.

| File | Cosa fa |
|---|---|
| `ThemeToggle.tsx` | bottone con `aria-pressed` (premuto = tema scuro); al clic scrive `data-theme` su `<html>`, salva la scelta in `localStorage` e anima il passaggio con `document.startViewTransition`, tranne con Motion Off |
| `ThemeToggle.module.css` | tondo scuro come l'interruttore Motion, corallo al passaggio del mouse; sul telefono sale sopra il menu |

Il tema di partenza non lo sceglie il componente ma lo script in `index.html`, prima che la pagina si disegni: la scelta salvata se c'è, altrimenti il tema del sistema. I colori scuri stanno in `src/styles/tokens.css`. Test: `tests/theme.spec.ts`.
