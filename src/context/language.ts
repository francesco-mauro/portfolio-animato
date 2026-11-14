/**
 * language.ts
 * Il contesto React della lingua del sito e i suoi tipi, senza componenti.
 * Sta separato dal provider (LanguageContext.tsx) per lo stesso motivo di motionMode.ts:
 * il ricaricamento rapido di Vite vuole i file dei componenti con soli componenti dentro.
 *  - LanguageValue    la lingua corrente, la funzione per cambiarla e t(), che di un
 *                     testo bilingue ({ it, en }) dà quello nella lingua corrente
 *  - LanguageContext  il contesto, letto da src/hooks/useLanguage.ts
 * I tipi Lang e Localized stanno con gli altri tipi dei contenuti, in src/types/content.ts.
 */
import { createContext } from 'react'
import type { Lang, Localized } from '../types/content.ts'

export interface LanguageValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (text: Localized) => string
}

export const LanguageContext = createContext<LanguageValue | null>(null)
