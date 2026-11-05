/**
 * MotionModeContext.tsx
 * La modalità di movimento del sito, condivisa da tutti i componenti:
 *  - 'on'   animazioni accese (partenza);
 *  - 'off'  tutto fermo, come l'interruttore "Off" del video;
 *  - 'xray' animazioni accese più le etichette che dicono com'è fatto ogni pezzo.
 * La modalità si scrive anche su <html data-motion="...">: è da lì che la leggono
 * global.css e xray.css, senza passare props a ogni componente.
 * Se il sistema chiede meno movimento (prefers-reduced-motion) si parte da 'off'.
 * Contesto e tipi stanno in ./motionMode.ts; nei componenti la modalità si legge
 * con l'hook src/hooks/useMotionMode.ts.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { MotionModeContext, type MotionMode } from './motionMode.ts'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function MotionModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<MotionMode>(() => (prefersReducedMotion() ? 'off' : 'on'))

  useEffect(() => {
    document.documentElement.dataset.motion = mode
  }, [mode])

  return <MotionModeContext.Provider value={{ mode, setMode }}>{children}</MotionModeContext.Provider>
}
