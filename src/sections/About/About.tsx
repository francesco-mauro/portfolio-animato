/**
 * About.tsx
 * La sezione «Chi sono». In cima la frase grande che si accende allo scroll (Manifesto),
 * poi il titolo vero della sezione, un paragrafo su da dove arrivo e quattro blocchi:
 * Percorso, Esperienze, Lingue, Cosa cerco. Test: tests/about.spec.ts.
 * La regione prende il nome dal titolo (aria-labelledby): il menu porta all'ancora
 * #chi-sono, cioè all'inizio della frase grande.
 * Percorso ed Esperienze sono elenchi, una voce per riga; Lingue e Cosa cerco una riga sola.
 * I testi arrivano da src/data/profile.ts, i titoli dei blocchi da src/data/ui.ts.
 */
import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal.ts'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { profile } from '../../data/profile.ts'
import { ui } from '../../data/ui.ts'
import type { Localized } from '../../types/content.ts'
import { Manifesto } from '../Manifesto/Manifesto.tsx'
import styles from './About.module.css'

/** Un blocco: il titolo piccolo e, sotto, un elenco o una riga sola. */
function Block({ title, items }: { title: Localized; items: Localized | Localized[] }) {
  const { t } = useLanguage()

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>{t(title)}</h3>
      {Array.isArray(items) ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.it}>{t(item)}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.line}>{t(items)}</p>
      )}
    </div>
  )
}

export function About() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useReveal(headingRef)
  const { t } = useLanguage()
  const { about } = profile

  return (
    <section id="chi-sono" className={styles.section} aria-labelledby="chi-sono-titolo">
      <Manifesto />
      <div className={styles.content}>
        <h2 ref={headingRef} id="chi-sono-titolo" className={`reveal ${styles.heading}`}>
          {t(ui.sections.about)}
        </h2>
        <p className={styles.text}>{t(about.text)}</p>
        <div className={styles.blocks} data-xray={t(ui.xray.about)}>
          <Block title={ui.about.path} items={about.path} />
          <Block title={ui.about.experience} items={about.experience} />
          <Block title={ui.about.languages} items={about.languages} />
          <Block title={ui.about.lookingFor} items={about.lookingFor} />
        </div>
      </div>
    </section>
  )
}
