/**
 * Manifesto.tsx
 * Il testo grande che si accende parola per parola mentre scorri, come "We build
 * websites that feel like places you walk into" nel sito "Ridgeline" (15:48-15:50).
 * La sezione è alta il doppio dello schermo e il testo resta fermo al centro
 * (position: sticky): così lo scroll serve solo ad accendere le parole.
 * useScrollProgress dà l'avanzamento da 0 a 1; ogni parola si accende quando
 * l'avanzamento supera la sua posizione nella frase.
 */
import { useRef, type CSSProperties } from 'react'
import { useScrollProgress } from '../../hooks/useScrollProgress.ts'
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { profile } from '../../data/profile.ts'
import { ui } from '../../data/ui.ts'
import styles from './Manifesto.module.css'

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const progress = useScrollProgress(ref)
  const { mode } = useMotionMode()
  const { t } = useLanguage()
  // Il testo cambia con la lingua, e con lui il numero delle parole: l'avanzamento è una
  // frazione della frase, quindi resta giusto in tutte e due.
  const words = t(profile.manifesto).split(' ')

  return (
    <section ref={ref} id="chi-sono" className={styles.section} aria-label={t(ui.sections.about)}>
      <div className={styles.sticky}>
        <p className={styles.text} data-xray={t(ui.xray.manifesto)}>
          {words.map((word, i) => {
            const lit = mode === 'off' || progress > i / words.length
            return (
              <span
                key={`${word}-${i}`}
                className={`${styles.word} ${lit ? styles.lit : ''}`}
                style={{ '--i': i } as CSSProperties}
              >
                {word}{' '}
              </span>
            )
          })}
        </p>
      </div>
    </section>
  )
}
