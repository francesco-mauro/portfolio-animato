/**
 * useCursorFollower.ts
 * Fa seguire il mouse a un elemento con un leggero ritardo, come il cursore che
 * "ci segue" nel sito del video (14:32). Ogni fotogramma la posizione dell'elemento
 * si avvicina a quella del mouse di una frazione (lerp), così il movimento è morbido.
 * Scrive solo le variabili CSS --x e --y sull'elemento: lo spostamento vero lo fa
 * il CSS con transform, senza far ridisegnare React a ogni movimento.
 *
 * @param ref     l'elemento da muovere
 * @param enabled false per fermarlo (modalità Off o schermo touch)
 * @param ease    quanto si avvicina a ogni fotogramma, da 0 a 1 (più alto, più rapido)
 */
import { useEffect, type RefObject } from 'react'

export function useCursorFollower(ref: RefObject<HTMLElement | null>, enabled: boolean, ease = 0.18) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    const raf = { id: 0 }

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
    }

    const tick = () => {
      current.x += (target.x - current.x) * ease
      current.y += (target.y - current.y) * ease
      el.style.setProperty('--x', `${current.x}px`)
      el.style.setProperty('--y', `${current.y}px`)
      raf.id = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    raf.id = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf.id)
    }
  }, [ref, enabled, ease])
}
