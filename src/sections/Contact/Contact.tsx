/**
 * Contact.tsx
 * La chiusura a tutto corallo: fondo corallo con una luce chiara in alto, un disco che
 * gira lento e il titolo grande in basso a sinistra, con i link a destra.
 * I link vengono da src/data/profile.ts. Niente email in pagina, per privacy.
 * Titolo e frase stanno in src/data/ui.ts, nelle due lingue: nella frase il ruolo e la
 * città sono segnaposto ({role}, {city}) che fill() riempie con i dati del profilo.
 * Sopra la frase c'è il modulo contatti (ContactForm.tsx), solo quando Vite conosce
 * l'indirizzo del server dei contatti (VITE_CONTACT_URL, src/data/contactRules.ts):
 * online il server non c'è, e la sezione resta com'era.
 */
import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal.ts'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { profile } from '../../data/profile.ts'
import { fill, ui } from '../../data/ui.ts'
import { contactEndpoint } from '../../data/contactRules.ts'
import { ContactForm } from './ContactForm.tsx'
import styles from './Contact.module.css'

/** L'anno del copyright, calcolato una volta al caricamento della pagina. */
const YEAR = new Date().getFullYear()

/** L'indirizzo del server dei contatti, letto una volta: null online, dove il modulo resta spento. */
const ENDPOINT = contactEndpoint(import.meta.env)

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
        <div className={ENDPOINT ? `${styles.side} ${styles.withForm}` : styles.side}>
          {ENDPOINT && <ContactForm endpoint={ENDPOINT} />}
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
