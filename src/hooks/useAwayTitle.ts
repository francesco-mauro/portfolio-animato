/**
 * useAwayTitle.ts
 * Cambia il titolo della scheda quando l'utente va su un'altra scheda: con la pagina
 * nascosta il titolo diventa `away` (per esempio «Torna qui 👋»), tornando visibile si
 * rimette quello di prima. Il titolo vero si legge al momento dell'uscita, non si copia
 * qui, così resta uno solo: quello di index.html.
 * Ascolta visibilitychange, l'evento che il browser lancia quando la scheda si nasconde
 * o torna in primo piano. Smontando il componente rimette il titolo, se era via.
 * Non dipende da Motion: è un testo, non un movimento. Test: tests/tab-title.spec.ts.
 */
import { useEffect } from 'react'

export function useAwayTitle(away: string) {
  useEffect(() => {
    let original: string | null = null

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (original === null) original = document.title
        document.title = away
      } else if (original !== null) {
        document.title = original
        original = null
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    // Se l'effetto riparte con la pagina già nascosta (il testo è cambiato), il richiamo va messo subito.
    onVisibilityChange()
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (original !== null) document.title = original
    }
  }, [away])
}
