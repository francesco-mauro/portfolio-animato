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
 *  - phoneTop, phoneLeft  posizione sotto i 760px, per una forma che sul telefono
 *    finirebbe sopra il titolo (tests/mobile.spec.ts); senza, resta top e left
 */
import type { CSSProperties } from 'react'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { ui } from '../../data/ui.ts'
import styles from './Shape.module.css'

export type ShapeKind = 'sphere' | 'pill' | 'torus' | 'disc'

interface ShapeProps {
  kind: ShapeKind
  size: number
  top: string
  left: string
  delay?: number
  rotate?: number
  phoneTop?: string
  phoneLeft?: string
}

export function Shape({ kind, size, top, left, delay = 0, rotate = 0, phoneTop, phoneLeft }: ShapeProps) {
  // L'etichetta della vista X-ray, nella lingua corrente: una per tipo di forma, in src/data/ui.ts.
  const { t } = useLanguage()
  // La posizione passa da variabili CSS e non da top e left in linea, perché uno stile
  // in linea vincerebbe sulla media query del telefono in Shape.module.css.
  const style = {
    '--size': `${size}px`,
    '--delay': `${delay}s`,
    '--rotate': `${rotate}deg`,
    '--top': top,
    '--left': left,
    '--phone-top': phoneTop ?? top,
    '--phone-left': phoneLeft ?? left,
  } as CSSProperties

  return (
    <div
      className={`${styles.shape} ${styles[kind]}`}
      style={style}
      data-shape={kind}
      data-xray={t(ui.xray.shapes[kind])}
      aria-hidden="true"
    />
  )
}
