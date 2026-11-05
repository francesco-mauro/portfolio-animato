/**
 * Contact.tsx
 * La chiusura a tutto corallo, come la schermata "One app for all your motion" del
 * sito "Kinetic" (14:26): fondo corallo con una luce chiara in alto, un disco che
 * gira lento e il titolo grande in basso a sinistra, con i link a destra.
 * I link vengono da src/data/profile.ts. Niente email in pagina, per privacy.
 */
import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal.ts'
import { profile } from '../../data/profile.ts'
import styles from './Contact.module.css'

/** L'anno del copyright, calcolato una volta al caricamento della pagina. */
const YEAR = new Date().getFullYear()

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, 0.3)

  return (
    <section id="contatti" className={styles.section}>
      <div className={styles.disc} aria-hidden="true" data-xray="CSS · disco · @keyframes spin" />
      <div ref={ref} className={`reveal ${styles.content}`}>
        <h2 className={styles.title}>
          Parliamo del
          <br />
          prossimo progetto
        </h2>
        <div className={styles.side}>
          <p className={styles.note}>
            {profile.role} a {profile.city}. Il codice di ogni progetto è su GitHub.
          </p>
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
