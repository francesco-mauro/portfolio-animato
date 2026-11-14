/**
 * LanguageToggle.tsx
 * L'interruttore della lingua, IT · EN, in basso a destra accanto al bottone del tema.
 * Cambia la lingua nel contesto LanguageContext: tutti i testi della pagina arrivano da
 * src/data/ già nelle due lingue, quindi basta questo perché la pagina si riscriva.
 * Dove il browser le supporta il passaggio è una dissolvenza, con le View Transitions
 * come per il tema: flushSync fa riscrivere la pagina a React dentro la transizione, così
 * il browser fotografa la pagina prima e dopo. Con Motion Off il cambio è secco.
 * Ogni bottone ha come nome la sua lingua scritta in quella lingua («Italiano», «English»,
 * con l'attributo lang perché il lettore di schermo la pronunci giusta), e la sigla che
 * si vede ne è l'inizio. Test: tests/language.spec.ts.
 */
import { flushSync } from 'react-dom'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { useMotionMode } from '../../hooks/useMotionMode.ts'
import { ui } from '../../data/ui.ts'
import type { Lang } from '../../types/content.ts'
import styles from './LanguageToggle.module.css'

const options: { value: Lang; short: string; name: string }[] = [
  { value: 'it', short: 'IT', name: 'Italiano' },
  { value: 'en', short: 'EN', name: 'English' },
]

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()
  const { mode } = useMotionMode()

  const choose = (next: Lang) => {
    if (next === lang) return
    if (mode !== 'off' && document.startViewTransition) {
      document.startViewTransition(() => flushSync(() => setLang(next)))
    } else {
      setLang(next)
    }
  }

  return (
    <div className={styles.toggle} role="radiogroup" aria-label={t(ui.language.label)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={lang === option.value}
          aria-label={option.name}
          lang={option.value}
          className={`${styles.option} ${lang === option.value ? styles.active : ''}`}
          onClick={() => choose(option.value)}
        >
          {option.short}
        </button>
      ))}
    </div>
  )
}
