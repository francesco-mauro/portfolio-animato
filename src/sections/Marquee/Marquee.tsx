/**
 * Marquee.tsx
 * La fascia che scorre all'infinito con le tecnologie, come i loghi dei clienti
 * nel sito "Ridgeline" (15:48). L'elenco viene ripetuto due volte: quando la prima
 * copia è uscita a sinistra, la seconda è esattamente al suo posto e l'animazione
 * riparte senza salto. La seconda copia è nascosta agli screen reader.
 */
import { stack } from '../../data/stack.ts'
import styles from './Marquee.module.css'

export function Marquee() {
  return (
    <section id="stack" className={styles.band} aria-label="Stack tecnologico" data-xray="CSS · marquee · translateX(-50%) infinito">
      <p className={styles.caption}>Con cosa lavoro</p>
      <div className={styles.viewport}>
        <ul className={styles.track}>
          {[...stack, ...stack].map((item, i) => (
            <li key={`${item}-${i}`} className={styles.item} aria-hidden={i >= stack.length}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
