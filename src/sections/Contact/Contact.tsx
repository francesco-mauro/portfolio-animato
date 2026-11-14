/**
 * Contact.tsx
 * La chiusura a tutto corallo, come la schermata "One app for all your motion" del
 * sito "Kinetic" (14:26): fondo corallo con una luce chiara in alto, un disco che
 * gira lento e il titolo grande in basso a sinistra, con i link a destra.
 * I link vengono da src/data/profile.ts. Niente email in pagina, per privacy.
 * Titolo e frase stanno in src/data/ui.ts, nelle due lingue: nella frase il ruolo e la
 * città sono segnaposto ({role}, {city}) che fill() riempie con i dati del profilo.
 */
import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal.ts'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { profile } from '../../data/profile.ts'
import { fill, ui } from '../../data/ui.ts'
import styles from './Contact.module.css'

/** L'anno del copyright, calcolato una volta al caricamento della pagina. */
const YEAR = new Date().getFullYear()

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, 0.3)
  const { t } = useLanguage()
  const [firstLine, secondLine] = ui.contact.title

  return (
    <section id="contatti" className={styles.section}>
      {/* Il contenitore piatto porta l'etichetta X-ray, dentro il disco che gira: così
          l'etichetta resta dritta mentre il disco ruota (styles/xray.css) */}
      <div className={styles.disc} aria-hidden="true" data-xray={t(ui.xray.contactDisc)}>
        <div className={styles.discBody} data-xray-outline="" />
      </div>
      <div ref={ref} className={`reveal ${styles.content}`}>
        <h2 className={styles.title}>
          {t(firstLine)}
          <br />
          {t(secondLine)}
        </h2>
        <div className={styles.side}>
          <p className={styles.note}>{fill(t(ui.contact.note), { role: profile.role, city: t(profile.city) })}</p>
          <div className={styles.links}>
            {profile.links.map((link) => (
              <a key={link.href} href={link.href} className={styles.link} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className={styles.footer}>
        © {YEAR} {profile.name}
      </p>
    </section>
  )
}
