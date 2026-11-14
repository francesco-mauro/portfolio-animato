/**
 * FloatingCard.tsx
 * La scheda arrotondata che fluttua e si inclina verso il mouse, come le schede
 * "Render", "Ease" e "Shared a scene" del sito "Kinetic" (14:15). Serve sia nel Hero
 * (schede piccole sparse intorno al titolo) sia nella sezione Progetti (schede grandi).
 *
 * Due elementi: fuori una cornice piatta, che sta al suo posto, galleggia e porta
 * l'etichetta X-ray; dentro la scheda vera, che si inclina verso il mouse e porta il
 * contorno X-ray (data-xray-outline). Così l'etichetta resta dritta (styles/xray.css).
 *
 * Props:
 *  - tone          colore della scheda (gli stessi toni di Project.tone)
 *  - floating      true per farla galleggiare su e giù (nel Hero)
 *  - xray          etichetta mostrata nella vista X-ray
 *  - className     classi in più dal genitore per la cornice: dove sta e quanto è larga
 *  - bodyClassName classi in più dal genitore per la scheda: come dispone il contenuto
 *  - style         variabili o posizione passate dal genitore, sulla cornice
 *  - children      il contenuto della scheda
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
  bodyClassName?: string
  style?: CSSProperties
  children: ReactNode
}

export function FloatingCard({ tone, floating = false, xray, className = '', bodyClassName = '', style, children }: FloatingCardProps) {
  const { mode } = useMotionMode()
  const ref = useRef<HTMLDivElement>(null)
  usePointerTilt(ref, mode !== 'off')

  return (
    <div className={`${styles.frame} ${floating ? styles.floating : ''} ${className}`} style={style} data-xray={xray}>
      <div ref={ref} className={`${styles.card} ${styles[tone]} ${bodyClassName}`} data-xray-outline={xray === undefined ? undefined : ''}>
        {children}
      </div>
    </div>
  )
}
