/**
 * Projects.tsx
 * La griglia dei sei progetti della vetrina GitHub. Ogni progetto è una FloatingCard
 * che entra con lo scroll e si inclina verso il mouse. L'entrata è solo CSS
 * (animation-timeline: view() in Projects.module.css, test in tests/projects-scroll.spec.ts):
 * da qui passa soltanto --stagger, il posto della scheda nella riga quando le colonne
 * sono tre, che le fa arrivare una dopo l'altra. Nei browser che non hanno ancora le timeline di scroll resta l'entrata
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
 */
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from 'react'
import { FloatingCard } from '../../components/FloatingCard/FloatingCard.tsx'
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import { useReveal } from '../../hooks/useReveal.ts'
import { projects, repoUrl } from '../../data/projects.ts'
import type { PreviewVideo as PreviewVideoSources, Project } from '../../types/content.ts'
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

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  // Riserva per i browser senza animation-timeline: dove c'è, il CSS non guarda questa classe.
  useReveal(ref)
  const video = usePreviewVideo()
  const sources = project.preview.video

  // --stagger: 0, 1, 2 da sinistra a destra nella griglia a tre colonne del computer.
  const style = { '--reveal-delay': `${index * 90}ms`, '--stagger': index % 3 } as CSSProperties

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
        className={styles.card}
        xray={index === 0 ? 'CSS · animation-timeline: view() · usePointerTilt' : undefined}
      >
        {/* width e height riservano lo spazio in 16:10 prima che l'immagine arrivi: la pagina non salta */}
        <div className={styles.preview}>
          <img src={project.preview.src} alt={project.preview.alt} width={720} height={450} loading="lazy" decoding="async" />
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
          {project.when && <span className={styles.when}>{project.when}</span>}
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.stack}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className={styles.links}>
          <a className={styles.link} href={repoUrl(project.repo)} target="_blank" rel="noreferrer">
            Vedi su GitHub <span aria-hidden="true">→</span>
          </a>
          {project.demo && (
            <a className={styles.link} href={project.demo} target="_blank" rel="noreferrer">
              Prova la demo <span aria-hidden="true">→</span>
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

  return (
    <section id="progetti" className={styles.section}>
      <h2 ref={headingRef} className={`reveal ${styles.heading}`}>
        Progetti
      </h2>
      <ul className={styles.grid}>
        {projects.map((project, index) => (
          <ProjectItem key={project.repo} project={project} index={index} />
        ))}
      </ul>
    </section>
  )
}
