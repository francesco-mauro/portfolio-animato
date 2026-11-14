/**
 * Projects.tsx
 * I sei progetti della vetrina GitHub, in due liste. In testa le due schede in evidenza,
 * più grandi e affiancate sul computer: invece della descrizione corta raccontano il
 * progetto in tre parti (story in projects.ts: il punto di partenza, cosa ho fatto, cosa
 * ne è uscito). Sotto le altre quattro, corte: su una riga sul computer, due per riga sul
 * tablet, una sotto l'altra sul telefono (test in tests/projects.spec.ts). Il numero delle
 * schede continua da una lista all'altra, da 01 a 06.
 * Ogni progetto è una FloatingCard che entra con lo scroll e si inclina verso il mouse.
 * L'entrata è solo CSS (animation-timeline: view() in Projects.module.css, test in
 * tests/projects-scroll.spec.ts): da qui passa soltanto --stagger, il posto della scheda
 * nella sua riga sul computer (0-1 in evidenza, 0-3 sotto), che le fa arrivare una dopo
 * l'altra. Nei browser che non hanno ancora le timeline di scroll resta l'entrata
 * di prima: useReveal e la classe reveal, sfasata di 90 ms dalla scheda precedente.
 * In cima a ogni scheda c'è l'anteprima, uno scatto vero del progetto (src/assets/previews/,
 * test in tests/previews.spec.ts): col mouse sopra la scheda si ingrandisce un poco.
 * I progetti con una demo online, e quello con la dashboard Power BI, hanno anche un breve video, sopra l'immagine
 * (PreviewVideo, test in tests/animated-previews.spec.ts): parte quando il mouse entra nella
 * scheda e si ferma, torna all'inizio e sparisce quando esce. Non parte con un tocco (sul
 * telefono resta l'immagine), con Motion Off né se il sistema chiede meno movimento, e il
 * browser non lo scarica finché non parte (preload="none").
 * I dati arrivano da src/data/projects.ts: qui c'è solo la forma.
 * Se il progetto ha una demo online compare anche il link "Prova la demo".
 * Titolo, descrizione o racconto, data e testo alternativo arrivano nelle due lingue: t() di
 * useLanguage sceglie quella corrente. I testi dei link, le tre etichette del racconto e il
 * titolo della sezione stanno in src/data/ui.ts.
 */
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from 'react'
import { FloatingCard } from '../../components/FloatingCard/FloatingCard.tsx'
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import { useReveal } from '../../hooks/useReveal.ts'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { projects, repoUrl } from '../../data/projects.ts'
import { ui } from '../../data/ui.ts'
import type { PreviewVideo as PreviewVideoSources, Project, ProjectStory } from '../../types/content.ts'
import styles from './Projects.module.css'

/**
 * Il video della demo sopra l'immagine ferma. È decorativo (aria-hidden): cosa si vede lo
 * dice già il testo alternativo dell'immagine. data-playing lo rende visibile solo mentre
 * va davvero: si accende con l'evento playing, non con la richiesta di farlo partire, e si
 * spegne con l'evento pause, da qualunque parte arrivi la pausa.
 */
function PreviewVideo({ sources, videoRef, playing, onPlaying, onPause }: {
  sources: PreviewVideoSources
  videoRef: RefObject<HTMLVideoElement | null>
  playing: boolean
  onPlaying: () => void
  onPause: () => void
}) {
  return (
    <video
      ref={videoRef}
      className={styles.video}
      data-playing={playing}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={onPlaying}
      onPause={onPause}
    >
      <source src={sources.webm} type="video/webm" />
      <source src={sources.mp4} type="video/mp4" />
    </video>
  )
}

/**
 * Accende e spegne il video di una scheda: start va sull'entrata del puntatore, stop sull'uscita.
 * Parte solo col mouse (pointerType 'mouse': un tocco sul telefono no), con Motion On o X-ray,
 * e se il sistema non chiede meno movimento. Se Motion passa a Off mentre va, si ferma.
 */
function usePreviewVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const { mode } = useMotionMode()

  // La pausa fa scattare l'evento pause, che spegne playing: qui si tocca solo il video.
  const stop = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  const start = (event: PointerEvent) => {
    const video = videoRef.current
    if (!video || event.pointerType !== 'mouse' || mode === 'off') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // play() fallisce se il mouse esce prima che il video sia pronto (pause() lo interrompe): va bene così.
    video.play().catch(() => {})
  }

  useEffect(() => {
    if (mode !== 'off') return
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }, [mode])

  return { videoRef, playing, onPlaying: () => setPlaying(true), onPause: () => setPlaying(false), start, stop }
}

/** Il racconto di una scheda in evidenza: tre etichette, ognuna con la sua frase. */
function Story({ story }: { story: ProjectStory }) {
  const { t } = useLanguage()
  const parts = [
    [ui.projects.story.start, story.start],
    [ui.projects.story.did, story.did],
    [ui.projects.story.result, story.result],
  ] as const

  return (
    <dl className={styles.story}>
      {parts.map(([label, sentence]) => (
        <div key={label.it}>
          <dt>{t(label)}</dt>
          <dd>{t(sentence)}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Una scheda. index è il suo posto in tutta la vetrina (dà il numero, da 01 a 06);
 * column il suo posto nella riga sul computer, per --stagger.
 */
function ProjectItem({ project, index, column }: { project: Project; index: number; column: number }) {
  const ref = useRef<HTMLLIElement>(null)
  // Riserva per i browser senza animation-timeline: dove c'è, il CSS non guarda questa classe.
  useReveal(ref)
  const { t } = useLanguage()
  const video = usePreviewVideo()
  const sources = project.preview.video

  // --stagger: il posto nella riga del computer, da sinistra a destra.
  const style = { '--reveal-delay': `${index * 90}ms`, '--stagger': column } as CSSProperties

  return (
    <li
      ref={ref}
      className={`reveal ${styles.item}`}
      style={style}
      onPointerEnter={sources ? video.start : undefined}
      onPointerLeave={sources ? video.stop : undefined}
    >
      <FloatingCard
        tone={project.tone}
        className={styles.cardFrame}
        bodyClassName={styles.card}
        xray={index === 0 ? 'CSS · animation-timeline: view() · usePointerTilt' : undefined}
      >
        {/* width e height riservano lo spazio in 16:10 prima che l'immagine arrivi: la pagina non salta */}
        <div className={styles.preview}>
          <img src={project.preview.src} alt={t(project.preview.alt)} width={720} height={450} loading="lazy" decoding="async" />
          {sources && (
            <PreviewVideo
              sources={sources}
              videoRef={video.videoRef}
              playing={video.playing}
              onPlaying={video.onPlaying}
              onPause={video.onPause}
            />
          )}
        </div>
        <div className={styles.top}>
          <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
          {project.when && <span className={styles.when}>{t(project.when)}</span>}
        </div>
        <h3 className={styles.title}>{t(project.title)}</h3>
        {project.story ? <Story story={project.story} /> : <p className={styles.summary}>{t(project.summary)}</p>}
        <ul className={styles.stack}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className={styles.links}>
          <a className={styles.link} href={repoUrl(project.repo)} target="_blank" rel="noreferrer">
            {t(ui.projects.viewOnGitHub)} <span aria-hidden="true">→</span>
          </a>
          {project.demo && (
            <a className={styles.link} href={project.demo} target="_blank" rel="noreferrer">
              {t(ui.projects.tryDemo)} <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </FloatingCard>
    </li>
  )
}

export function Projects() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useReveal(headingRef)
  const { t } = useLanguage()
  // In projects.ts quelle in evidenza vengono prima (lo controlla data.test.ts): il numero
  // delle altre riparte da dove finiscono.
  const featured = projects.filter((project) => project.story)
  const others = projects.filter((project) => !project.story)

  return (
    <section id="progetti" className={styles.section}>
      <h2 ref={headingRef} className={`reveal ${styles.heading}`}>
        {t(ui.sections.projects)}
      </h2>
      <ul className={`${styles.grid} ${styles.featured}`}>
        {featured.map((project, index) => (
          <ProjectItem key={project.repo} project={project} index={index} column={index % 2} />
        ))}
      </ul>
      <ul className={`${styles.grid} ${styles.others}`}>
        {others.map((project, index) => (
          <ProjectItem key={project.repo} project={project} index={featured.length + index} column={index % 4} />
        ))}
      </ul>
    </section>
  )
}
