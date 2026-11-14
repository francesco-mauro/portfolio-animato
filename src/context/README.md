# src/context/

Quello che tutta la pagina condivide: la modalità di movimento (`on`, `off`, `xray`) e la lingua (`it`, `en`).

| File | Cosa fa |
|---|---|
| `motionMode.ts` | il contesto React e i tipi `MotionMode` e `MotionModeValue`; nessun componente |
| `MotionModeContext.tsx` | `MotionModeProvider`: tiene la modalità nello stato, parte da `off` se il sistema chiede meno movimento, la scrive su `<html data-motion>` |
| `language.ts` | il contesto React della lingua e il tipo `LanguageValue` (la lingua, la funzione per cambiarla e `t()`, che di un testo bilingue dà quello nella lingua corrente); nessun componente |
| `LanguageContext.tsx` | `LanguageProvider`: tiene la lingua nello stato, parte da quella che lo script di `index.html` ha scritto su `<html lang>` (la scelta salvata, altrimenti la lingua del browser), e a ogni cambio aggiorna `<html lang>` e salva la scelta in `localStorage` |

Sono due file per ciascuno perché il ricaricamento rapido di Vite vuole i file dei componenti con soli componenti dentro. Per leggerli si usano `src/hooks/useMotionMode.ts` e `src/hooks/useLanguage.ts`. In `App.tsx` il provider della lingua sta dentro quello del movimento.
