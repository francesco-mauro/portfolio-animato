# src/context/

La modalità di movimento (`on`, `off`, `xray`) condivisa da tutta la pagina.

| File | Cosa fa |
|---|---|
| `motionMode.ts` | il contesto React e i tipi `MotionMode` e `MotionModeValue`; nessun componente |
| `MotionModeContext.tsx` | `MotionModeProvider`: tiene la modalità nello stato, parte da `off` se il sistema chiede meno movimento, la scrive su `<html data-motion>` |

Sono due file perché il ricaricamento rapido di Vite vuole i file dei componenti con soli componenti dentro. Per leggere la modalità si usa `src/hooks/useMotionMode.ts`.
