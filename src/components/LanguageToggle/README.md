# LanguageToggle/

L'interruttore della lingua, IT · EN, nel pannello delle preferenze, che si apre dall'ultimo bottone del menu a pillola (`../Preferences/`).

| File | Cosa fa |
|---|---|
| `LanguageToggle.tsx` | due bottoni `role="radio"` dentro un `radiogroup`; al clic cambia la lingua nel contesto (`useLanguage`) e anima il passaggio con `document.startViewTransition` e `flushSync`, tranne con Motion Off. Il nome di ogni bottone è la lingua scritta in quella lingua («Italiano», «English»), con l'attributo `lang` |
| `LanguageToggle.module.css` | pillola scura come l'interruttore Motion, il bottone attivo sul corallo scuro; nessuna posizione sua, il posto glielo dà la riga del pannello delle preferenze |

La lingua di partenza non la sceglie il componente ma lo script in `index.html`, prima che la pagina si disegni: la scelta salvata se c'è, altrimenti la lingua del browser (italiano se il browser è in italiano, inglese per tutti gli altri). Chi tiene la lingua e la salva è `src/context/LanguageContext.tsx`; i testi nelle due lingue stanno in `src/data/`. Test: `tests/language.spec.ts`.
