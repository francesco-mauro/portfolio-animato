/**
 * NotFound.tsx
 * La pagina 404: le forme corallo della prima schermata che galleggiano, un «404» grande
 * con la ciambella al posto dello zero, la pillola «Errore 404», il titolo, una riga di
 * spiegazione e il bottone che riporta al sito. Anche il nome in alto riporta al sito.
 * Le cifre entrano una dopo l'altra con la curva Out back, come il titolo della prima
 * schermata, e lo zero poi galleggia; con il sistema che chiede meno movimento tutto è
 * fermo (global.css). Il «404» è decorazione: ai lettori di schermo lo dicono la pillola e
 * il titolo, quindi è nascosto (aria-hidden).
 * Lingua e tema arrivano dallo script nella testa di 404.html, come sul sito; i testi
 * stanno in src/data/notFound.ts. Il cursore che segue è lo stesso del sito.
 * L'indirizzo del sito è import.meta.env.BASE_URL: /portfolio-animato/ online, / in sviluppo.
 * Test: tests/not-found.spec.ts.
 */
import type { CSSProperties } from 'react'
import { MotionModeProvider } from '../../context/MotionModeContext.tsx'
import { LanguageProvider } from '../../context/LanguageContext.tsx'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { Cursor } from '../../components/Cursor/Cursor.tsx'
import { Shape } from '../../components/Shape/Shape.tsx'
import { profile } from '../../data/profile.ts'
import { notFound } from '../../data/notFound.ts'
import styles from './NotFound.module.css'

const HOME = import.meta.env.BASE_URL

/** Il posto della cifra nella fila, per sfasare le entrate. */
const order = (i: number) => ({ '--i': i }) as CSSProperties

function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <>
      <Cursor />
      <header className={styles.brand}>
        <a className={styles.logo} href={HOME}>
          {profile.name}
        </a>
      </header>
      <main className={styles.page}>
        <Shape kind="pill" size={140} top="16%" left="6%" rotate={-28} phoneTop="12%" phoneLeft="-6%" />
        <Shape kind="sphere" size={70} top="12%" left="78%" delay={1.2} phoneTop="9%" phoneLeft="80%" />
        <Shape kind="sphere" size={190} top="62%" left="82%" delay={0.6} phoneTop="86%" phoneLeft="78%" />
        <Shape kind="disc" size={100} top="76%" left="10%" delay={1.6} rotate={-20} phoneTop="88%" phoneLeft="6%" />

        <div className={styles.center}>
          <p className={styles.code} data-testid="not-found-code" aria-hidden="true">
            <span className={styles.digit} style={order(0)}>
              4
            </span>
            <span className={`${styles.digit} ${styles.zero}`} style={order(1)} />
            <span className={styles.digit} style={order(2)}>
              4
            </span>
          </p>
          <p className={styles.badge}>{t(notFound.label)}</p>
          <h1 className={styles.title}>{t(notFound.title)}</h1>
          <p className={styles.text}>{t(notFound.text)}</p>
          <a className={styles.home} href={HOME}>
            {t(notFound.home)}
          </a>
        </div>
      </main>
    </>
  )
}

export function NotFound() {
  return (
    <MotionModeProvider>
      <LanguageProvider>
        <NotFoundPage />
      </LanguageProvider>
    </MotionModeProvider>
  )
}
