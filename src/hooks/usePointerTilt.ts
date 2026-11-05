/**
 * usePointerTilt.ts
 * Inclina leggermente una scheda verso il mouse quando ci passi sopra, come le schede
 * che fluttuano nel sito "Kinetic" del video (14:15). Scrive le variabili CSS
 * --tilt-x e --tilt-y (in gradi) e --glow-x / --glow-y (posizione del riflesso, in %);
 * la rotazione vera la fa il CSS Module della scheda. Uscito il mouse, torna dritta.
 *
 * @param ref     la scheda
 * @param enabled false in modalità Off
 * @param max     inclinazione massima in gradi
 */
import { useEffect, type RefObject } from 'react'

export function usePointerTilt(ref: RefObject<HTMLElement | null>, enabled: boolean, max = 8) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      el.style.setProperty('--tilt-x', `${(0.5 - py) * max}deg`)
      el.style.setProperty('--tilt-y', `${(px - 0.5) * max}deg`)
      el.style.setProperty('--glow-x', `${px * 100}%`)
      el.style.setProperty('--glow-y', `${py * 100}%`)
    }
    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg')
      el.style.setProperty('--tilt-y', '0deg')
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [ref, enabled, max])
}
