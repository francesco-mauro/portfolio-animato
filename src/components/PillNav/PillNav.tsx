/**
 * PillNav.tsx
 * Il menu a pillola corallo fisso in basso al centro, come "Product · Studio · Company"
 * del sito "Kinetic" (14:15). Porta alle sezioni con le ancore (#progetti, #contatti),
 * lo scroll morbido lo fa html { scroll-behavior: smooth } in global.css.
 * Le voci cambiano con la lingua (src/data/ui.ts); le ancore no, sono indirizzi.
 */
import { useLanguage } from '../../hooks/useLanguage.ts'
import { ui } from '../../data/ui.ts'
import styles from './PillNav.module.css'

const items = [
  { label: ui.sections.about, href: '#chi-sono' },
  { label: ui.sections.projects, href: '#progetti' },
  { label: ui.sections.contact, href: '#contatti' },
]

export function PillNav() {
  const { t } = useLanguage()

  return (
    <nav className={styles.nav} aria-label={t(ui.nav.label)} data-xray={t(ui.xray.nav)}>
      <a href="#top" className={styles.home} aria-label={t(ui.nav.home)}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor" />
        </svg>
      </a>
      {items.map((item) => (
        <a key={item.href} href={item.href} className={styles.link}>
          {t(item.label)}
        </a>
      ))}
    </nav>
  )
}
