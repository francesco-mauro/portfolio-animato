/**
 * Marquee.tsx
 * La fascia che scorre all'infinito con le tecnologie, come i loghi dei clienti
 * nel sito "Ridgeline" (15:48). L'elenco viene ripetuto due volte: quando la prima
 * copia è uscita a sinistra, la seconda è esattamente al suo posto e l'animazione
 * riparte senza salto. La seconda copia è nascosta agli screen reader.
 * Le tecnologie sono nomi, uguali in ogni lingua; la scritta sopra e il nome della
 * sezione cambiano con la lingua (src/data/ui.ts).
 */
import { useLanguage } from '../../hooks/useLanguage.ts'
import { stack } from '../../data/stack.ts'
import { ui } from '../../data/ui.ts'
import styles from './Marquee.module.css'

export function Marquee() {
  const { t } = useLanguage()

  return (
    <section id="stack" className={styles.band} aria-label={t(ui.sections.stack)} data-xray={t(ui.xray.marquee)}>
      <p className={styles.caption}>{t(ui.marquee.caption)}</p>
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
