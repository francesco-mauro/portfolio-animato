/**
 * Shape.tsx
 * Le forme "3D" corallo che galleggiano nel sito "Kinetic" del video (14:15):
 * sfera, capsula, ciambella e disco. Nel video sono generate; qui sono solo CSS,
 * gradienti radiali e ombre che danno il volume, senza immagini né WebGL.
 * Ogni forma fluttua su e giù con la stessa durata ma un ritardo suo, così non si
 * muovono tutte insieme.
 *
 * Props:
 *  - kind   quale forma
 *  - size   larghezza in px (l'altezza la decide il tipo di forma)
 *  - top, left  posizione dentro il contenitore, in percentuale
 *  - delay  ritardo dell'animazione in secondi, per non farle muovere tutte insieme
 *  - rotate rotazione di partenza in gradi
 */
import type { CSSProperties } from 'react'
import styles from './Shape.module.css'

export type ShapeKind = 'sphere' | 'pill' | 'torus' | 'disc'

interface ShapeProps {
  kind: ShapeKind
  size: number
  top: string
  left: string
  delay?: number
  rotate?: number
}

const xrayLabel: Record<ShapeKind, string> = {
  sphere: 'CSS · sfera · gradiente radiale',
  pill: 'CSS · capsula · border-radius + gradiente',
  torus: 'CSS · ciambella · anello di gradiente radiale',
  disc: 'CSS · disco · rotateX in 3D',
}

export function Shape({ kind, size, top, left, delay = 0, rotate = 0 }: ShapeProps) {
  const style = {
    '--size': `${size}px`,
    '--delay': `${delay}s`,
    '--rotate': `${rotate}deg`,
    top,
    left,
  } as CSSProperties

  return (
    <div className={`${styles.shape} ${styles[kind]}`} style={style} data-xray={xrayLabel[kind]} aria-hidden="true" />
  )
}
