/**
 * useMotionMode.ts
 * Legge la modalità di movimento ('on', 'off', 'xray') e la funzione per cambiarla
 * dal contesto di src/context/motionMode.ts, che MotionModeProvider riempie.
 * Va usato dentro <MotionModeProvider>, altrimenti lancia un errore chiaro.
 */
import { useContext } from 'react'
import { MotionModeContext, type MotionModeValue } from '../context/motionMode.ts'

export function useMotionMode(): MotionModeValue {
  const value = useContext(MotionModeContext)
  if (!value) throw new Error('useMotionMode va usato dentro <MotionModeProvider>')
  return value
}
