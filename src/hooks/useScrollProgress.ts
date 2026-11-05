/**
 * useScrollProgress.ts
 * Dice quanto di una sezione è già passato sotto gli occhi, da 0 a 1:
 * 0 quando il suo inizio arriva a metà schermo, 1 quando la sua fine tocca il
 * fondo dello schermo. Serve al Manifesto per accendere le parole una dopo l'altra,
 * come il testo del sito "Ridgeline" che si illumina mentre scorri (15:50).
 * Ascolta lo scroll una volta per fotogramma (requestAnimationFrame), non di più.
 *
 * @param ref l'elemento di cui misurare l'avanzamento
 * @returns   un numero tra 0 e 1
 */
import { useEffect, useState, type RefObject } from 'react'

export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const raf = { id: 0 }

    const measure = () => {
      raf.id = 0
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight
      // 0 quando l'inizio della sezione è a metà schermo,
      // 1 quando la sua fine tocca il fondo dello schermo (lì il testo sticky si stacca)
      const raw = (viewport / 2 - rect.top) / (rect.height - viewport / 2)
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    const onScroll = () => {
      if (!raf.id) raf.id = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf.id) cancelAnimationFrame(raf.id)
    }
  }, [ref])

  return progress
}
