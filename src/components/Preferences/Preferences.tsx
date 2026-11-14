/**
 * Preferences.tsx
 * Il bottone delle preferenze, ultimo elemento del menu a pillola, e il pannello che apre:
 * lingua, tema e Motion, uno per riga. Prima erano tre blocchi fissi in basso a destra,
 * che sul telefono coprivano il contenuto insieme al menu: ora in basso c'è un oggetto solo.
 * Il pannello parte chiuso e non è nel DOM finché non si apre. Si chiude con Esc (il focus
 * torna al bottone), con un click fuori e quando il focus esce con Tab; scegliere una
 * lingua, il tema o una modalità non lo chiude, perché chi lo apre spesso cambia più cose.
 * Nel DOM il pannello viene subito dopo il bottone, così con Tab si entra nei controlli
 * nell'ordine in cui si vedono. Test: tests/preferences.spec.ts.
 */
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { ui } from '../../data/ui.ts'
import { LanguageToggle } from '../LanguageToggle/LanguageToggle.tsx'
import { MotionToggle } from '../MotionToggle/MotionToggle.tsx'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle.tsx'
import styles from './Preferences.module.css'

const PANEL_ID = 'preferenze'

export function Preferences() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      // Il focus che esce dal pannello con Tab lo chiude. Un click su un punto vuoto del
      // pannello non ha un elemento di arrivo (relatedTarget è null) e non lo chiude.
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null
        if (next && !event.currentTarget.contains(next)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-label={t(ui.preferences)}
        title={t(ui.preferences)}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
          <circle cx="15" cy="7" r="2.2" />
          <circle cx="9" cy="17" r="2.2" />
        </svg>
      </button>
      {open && (
        <div id={PANEL_ID} className={styles.panel} role="group" aria-label={t(ui.preferences)}>
          <div className={styles.row}>
            <span className={styles.caption}>{t(ui.language.label)}</span>
            <LanguageToggle />
          </div>
          <div className={styles.row}>
            <span className={styles.caption}>{t(ui.theme.caption)}</span>
            <ThemeToggle />
          </div>
          <div className={styles.row}>
            <span className={styles.caption}>Motion</span>
            <MotionToggle />
          </div>
        </div>
      )}
    </div>
  )
}
