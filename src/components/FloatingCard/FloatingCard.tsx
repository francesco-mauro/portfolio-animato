/**
 * FloatingCard.tsx
 * La scheda arrotondata che fluttua e si inclina verso il mouse, come le schede
 * "Render", "Ease" e "Shared a scene" del sito "Kinetic" (14:15). Serve sia nel Hero
 * (schede piccole sparse intorno al titolo) sia nella sezione Progetti (schede grandi).
 *
 * Props:
 *  - tone      colore della scheda (gli stessi toni di Project.tone)
 *  - floating  true per farla galleggiare su e giù (nel Hero)
 *  - xray      etichetta mostrata nella vista X-ray
 *  - className classi in più dal genitore, per la posizione
 *  - style     variabili o posizione passate dal genitore
 *  - children  il contenuto della scheda
 */
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { usePointerTilt } from '../../hooks/usePointerTilt.ts'
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import type { Project } from '../../types/content.ts'
import styles from './FloatingCard.module.css'

interface FloatingCardProps {
  tone: Project['tone']
  floating?: boolean
  xray?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function FloatingCard({ tone, floating = false, xray, className = '', style, children }: FloatingCardProps) {
  const { mode } = useMotionMode()
  const ref = useRef<HTMLDivElement>(null)
  usePointerTilt(ref, mode !== 'off')

  return (
    <div
      ref={ref}
      className={`${styles.card} ${styles[tone]} ${floating ? styles.floating : ''} ${className}`}
      style={style}
      data-xray={xray}
    >
      {children}
    </div>
  )
}
