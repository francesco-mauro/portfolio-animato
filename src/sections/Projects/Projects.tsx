/**
 * Projects.tsx
 * La griglia dei sei progetti della vetrina GitHub. Ogni progetto è una FloatingCard
 * che entra allo scroll (useReveal, sfasata di 90 ms dalla precedente) e si inclina
 * verso il mouse. I dati arrivano da src/data/projects.ts: qui c'è solo la forma.
 * Se il progetto ha una demo online compare anche il link "Prova la demo".
 */
import { useRef, type CSSProperties } from 'react'
import { FloatingCard } from '../../components/FloatingCard/FloatingCard.tsx'
import { useReveal } from '../../hooks/useReveal.ts'
import { projects, repoUrl } from '../../data/projects.ts'
import type { Project } from '../../types/content.ts'
import styles from './Projects.module.css'

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  useReveal(ref)

  return (
    <li ref={ref} className={`reveal ${styles.item}`} style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}>
      <FloatingCard tone={project.tone} className={styles.card} xray={index === 0 ? 'React · useReveal + usePointerTilt' : undefined}>
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
