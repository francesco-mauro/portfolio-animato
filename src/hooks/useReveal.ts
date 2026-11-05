/**
 * useReveal.ts
 * Aggiunge la classe "is-visible" a un elemento quando entra nello schermo.
 * L'elemento deve avere la classe "reveal" (definita in styles/global.css), che
 * lo tiene abbassato e trasparente finché non arriva. Usa IntersectionObserver,
 * quindi non ascolta lo scroll a ogni pixel. Una volta entrato resta visibile.
 *
 * @param ref       l'elemento da far entrare
 * @param threshold quanta parte dell'elemento deve essere visibile, da 0 a 1
 */
import { useEffect, type RefObject } from 'react'

export function useReveal(ref: RefObject<HTMLElement | null>, threshold = 0.2) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
}
