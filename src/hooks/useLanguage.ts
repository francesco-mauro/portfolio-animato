/**
 * useLanguage.ts
 * Legge la lingua del sito ('it' o 'en'), la funzione per cambiarla e t(), che di un testo
 * bilingue dà quello nella lingua corrente: t(profile.intro), t(ui.skipLink).
 * Viene dal contesto di src/context/language.ts, che LanguageProvider riempie.
 * Va usato dentro <LanguageProvider>, altrimenti lancia un errore chiaro.
 */
import { useContext } from 'react'
import { LanguageContext, type LanguageValue } from '../context/language.ts'

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage va usato dentro <LanguageProvider>')
  return value
}
