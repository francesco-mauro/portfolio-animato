/**
 * Hero.tsx
 * La prima schermata, ricalcata sul sito "Kinetic" del video (14:15): fondo chiaro,
 * titolo grande corallo al centro, forme 3D che galleggiano e tre schede sparse.
 * Le schede raccontano il sito con fatti veri: la build, la curva usata per le
 * animazioni, il primo progetto della vetrina. Il titolo entra parola per parola.
 */
import { Shape } from '../../components/Shape/Shape.tsx'
import { FloatingCard } from '../../components/FloatingCard/FloatingCard.tsx'
import { profile } from '../../data/profile.ts'
import { projects, repoUrl } from '../../data/projects.ts'
import type { CSSProperties } from 'react'
import styles from './Hero.module.css'

// Il titolo parla di tutto il percorso, da quello che si vede a quello che c'è dietro:
// due pezzi che entrano uno dopo l'altro. Test: tests/hero.spec.ts.
const headline = ['Quello che vedi,', "e quello che c'è dietro."]

export function Hero() {
  const first = projects[0]

  return (
    <section id="top" className={styles.hero}>
      <header className={styles.brand}>
        <span className={styles.logo}>{profile.name}</span>
        <span className={styles.badge}>{profile.city}</span>
      </header>

      <Shape kind="pill" size={150} top="14%" left="6%" rotate={-28} />
      <Shape kind="sphere" size={70} top="10%" left="44%" delay={1.2} />
      <Shape kind="sphere" size={230} top="36%" left="80%" delay={0.6} />
      <Shape kind="torus" size={150} top="74%" left="72%" delay={2} />
      <Shape kind="disc" size={100} top="82%" left="34%" delay={1.6} rotate={-20} />

      <FloatingCard tone="green" floating className={styles.cardBuild} xray="React · FloatingCard · tono green">
        <span className={styles.cardLabel}>Build</span>
        <strong className={styles.cardBig}>tsc -b && vite build</strong>
        <span className={styles.progress} aria-hidden="true" />
      </FloatingCard>

      <FloatingCard
        tone="blue"
        floating
        className={styles.cardEase}
        style={{ '--delay': '1.4s' } as CSSProperties}
        xray="CSS · cubic-bezier(0.34, 1.56, 0.64, 1)"
      >
        <span className={styles.cardLabel}>Ease</span>
        <strong className={styles.cardTitle}>Out back</strong>
        <svg viewBox="0 0 120 50" className={styles.curve} aria-hidden="true">
          <path d="M4 46 C 45 46, 50 -6, 116 6" />
        </svg>
        <span className={styles.cardMono}>0.34, 1.56, 0.64, 1</span>
      </FloatingCard>

      <FloatingCard
        tone="pink"
        floating
        className={styles.cardRepo}
        style={{ '--delay': '0.8s' } as CSSProperties}
        xray="React · dati da src/data/projects.ts"
      >
        <span className={styles.cardLabel}>Primo in vetrina</span>
        <strong className={styles.cardTitle}>{first.title}</strong>
        <a className={styles.cardButton} href={repoUrl(first.repo)} target="_blank" rel="noreferrer">
          Apri
        </a>
      </FloatingCard>

      <div className={styles.center}>
        <h1 className={styles.title} data-xray="CSS · titolo · @keyframes word-in">
          {headline.map((word, i) => (
            <span key={word} className={styles.word} style={{ '--i': i } as CSSProperties}>
              {word}
            </span>
          ))}
        </h1>
        <p className={styles.role}>
          {profile.role} · {profile.city}
        </p>
        <p className={styles.intro}>{profile.intro}</p>
      </div>
    </section>
  )
}
