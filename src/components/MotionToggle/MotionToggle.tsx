/**
 * MotionToggle.tsx
 * L'interruttore "Motion · Off · On · X-ray", nella terza riga del pannello delle preferenze
 * (components/Preferences, che scrive anche la parola «Motion» accanto), lo stesso
 * dei siti mostrati nel video (14:15 e 15:48). Cambia la modalità nel contesto
 * MotionModeContext: Off ferma tutto, X-ray mostra com'è fatto ogni pezzo.
 * Le scritte che si vedono (Motion, Off, On, X-ray) sono inglesi anche nel sito italiano,
 * come nel video: con la lingua cambia solo il nome del gruppo per i lettori di schermo.
 */
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { ui } from '../../data/ui.ts'
import type { MotionMode } from '../../context/motionMode.ts'
import styles from './MotionToggle.module.css'

const options: { value: MotionMode; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
  { value: 'xray', label: 'X-ray' },
]

export function MotionToggle() {
  const { mode, setMode } = useMotionMode()
  const { t } = useLanguage()

  return (
    <div className={styles.toggle} role="radiogroup" aria-label={t(ui.motion.label)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={mode === option.value}
          className={`${styles.option} ${mode === option.value ? styles.active : ''}`}
          onClick={() => setMode(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
