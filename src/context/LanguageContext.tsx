/**
 * LanguageContext.tsx
 * La lingua del sito, italiano o inglese, condivisa da tutti i componenti.
 * La lingua di partenza non la sceglie questo file ma lo script in index.html, prima che
 * la pagina si disegni: la scelta salvata se c'è, altrimenti la lingua del browser
 * (italiano se il browser è in italiano, inglese per tutti gli altri). Lo script la scrive
 * su <html lang="...">, e da lì parte lo stato.
 * Cambiando lingua si aggiorna <html lang>, che dice ai lettori di schermo con che
 * pronuncia leggere, e la scelta si salva in localStorage.
 * Contesto e tipi stanno in ./language.ts; nei componenti la lingua si legge con
 * l'hook src/hooks/useLanguage.ts. Test: tests/language.spec.ts.
 */
import { useState, type ReactNode } from 'react'
import { LanguageContext } from './language.ts'
import type { Lang, Localized } from '../types/content.ts'

const startingLang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'it')

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(startingLang)

  const setLang = (next: Lang) => {
    document.documentElement.lang = next
    try {
      localStorage.setItem('lang', next)
    } catch {
      // Senza localStorage (navigazione privata bloccata) la lingua cambia lo stesso.
    }
    setLangState(next)
  }

  const t = (text: Localized) => text[lang]

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}
