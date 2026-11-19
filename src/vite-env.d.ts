/**
 * vite-env.d.ts
 * Le variabili d'ambiente che il sito legge da import.meta.env, con il loro tipo: Vite
 * passa al codice solo quelle che cominciano con VITE_.
 * - VITE_CONTACT_URL: l'indirizzo del server dei contatti (server/). Se c'è, la sezione
 *   Contatti mostra il modulo; online non c'è (src/data/contactRules.ts).
 * Documentazione: https://vite.dev/guide/env-and-mode#intellisense-for-typescript
 */
interface ImportMetaEnv {
  readonly VITE_CONTACT_URL?: string
}
