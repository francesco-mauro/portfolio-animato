/**
 * Cursor.tsx
 * Il cursore personalizzato: un punto pieno che sta sul mouse e un anello
 * che lo insegue in ritardo, tutti e due bianchi in difference (colori invertiti) (14:32 del video). Sopra un link o un bottone l'anello
 * si allarga: lo decide il CSS con :has(), senza JavaScript in più.
 * Non compare sugli schermi touch né in modalità Off.
 */
import { useRef } from 'react'
import { useCursorFollower } from '../../hooks/useCursorFollower.ts'
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import styles from './Cursor.module.css'

const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function Cursor() {
  const { mode } = useMotionMode()
  const enabled = mode !== 'off' && hasFinePointer()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useCursorFollower(dotRef, enabled, 0.6)
  useCursorFollower(ringRef, enabled, 0.14)

  if (!enabled) return null
  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  )
}
