/**
 * motionMode.ts
 * Il contesto React della modalità di movimento e i suoi tipi, senza componenti.
 * Sta separato dal provider (MotionModeContext.tsx) perché il ricaricamento rapido
 * di Vite vuole i file dei componenti con soli componenti dentro.
 *  - MotionMode       'on' | 'off' | 'xray'
 *  - MotionModeValue  la modalità corrente e la funzione per cambiarla
 *  - MotionModeContext il contesto, letto da src/hooks/useMotionMode.ts
 */
import { createContext } from 'react'

export type MotionMode = 'on' | 'off' | 'xray'

export interface MotionModeValue {
  mode: MotionMode
  setMode: (mode: MotionMode) => void
}

export const MotionModeContext = createContext<MotionModeValue | null>(null)
