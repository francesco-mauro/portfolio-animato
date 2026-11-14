# LanguageToggle/

L'interruttore della lingua, IT · EN, in basso a destra accanto al bottone del tema.

| File | Cosa fa |
|---|---|
| `LanguageToggle.tsx` | due bottoni `role="radio"` dentro un `radiogroup`; al clic cambia la lingua nel contesto (`useLanguage`) e anima il passaggio con `document.startViewTransition` e `flushSync`, tranne con Motion Off. Il nome di ogni bottone è la lingua scritta in quella lingua («Italiano», «English»), con l'attributo `lang` |
| `LanguageToggle.module.css` | pillola scura come l'interruttore Motion, il bottone attivo sul corallo scuro; sulla riga del bottone del tema, alla sua sinistra, e sul telefono sale con lui sopra il menu |

La lingua di partenza non la sceglie il componente ma lo script in `index.html`, prima che la pagina si disegni: la scelta salvata se c'è, altrimenti la lingua del browser (italiano se il browser è in italiano, inglese per tutti gli altri). Chi tiene la lingua e la salva è `src/context/LanguageContext.tsx`; i testi nelle due lingue stanno in `src/data/`. Test: `tests/language.spec.ts`.
