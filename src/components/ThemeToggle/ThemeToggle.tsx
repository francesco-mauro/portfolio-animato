/**
 * ThemeToggle.tsx
 * Il bottone tondo che passa dal tema chiaro a quello scuro, nella seconda riga del pannello
 * delle preferenze (components/Preferences).
 * Il tema di partenza lo sceglie lo script in index.html (scelta salvata o tema del
 * sistema) e lo scrive su <html data-theme="...">: da lì lo leggono le variabili di
 * src/styles/tokens.css. Il bottone cambia quell'attributo, salva la scelta in
 * localStorage e, dove il browser le supporta, anima il passaggio con le View
 * Transitions (document.startViewTransition). Con Motion Off il cambio è secco.
 * Il nome del bottone e il titolo al passaggio del mouse cambiano con la lingua (src/data/ui.ts).
 * Test: tests/theme.spec.ts.
 */
import { useState } from 'react'
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { ui } from '../../data/ui.ts'
import styles from './ThemeToggle.module.css'

type Theme = 'light' | 'dark'

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

export function ThemeToggle() {
  const { mode } = useMotionMode()
  const { t } = useLanguage()
  const [theme, setTheme] = useState<Theme>(currentTheme)
  const isDark = theme === 'dark'

  const toggle = () => {
    const next: Theme = isDark ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      setTheme(next)
    }
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Senza localStorage (navigazione privata bloccata) il tema cambia lo stesso.
    }
    if (mode !== 'off' && document.startViewTransition) {
      document.startViewTransition(apply)
    } else {
      apply()
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={t(ui.theme.label)}
      aria-pressed={isDark}
      title={t(isDark ? ui.theme.toLight : ui.theme.toDark)}
      onClick={toggle}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  )
}
