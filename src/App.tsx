/**
 * App.tsx
 * Compone la pagina: i provider della modalità di movimento e della lingua, il cursore
 * che segue, la barra di lettura in cima, le cinque sezioni in ordine e il menu a pillola,
 * l'unico controllo fisso: lingua, tema e Motion stanno nel pannello che si apre dal suo
 * ultimo bottone (components/Preferences).
 * La pagina sta in un componente suo, Page, dentro i provider: il link per saltare cambia
 * con la lingua, e la lingua si legge solo da dentro LanguageProvider.
 * Ogni pezzo non decorativo sta dentro un landmark (main, nav); il cursore e la
 * barra di lettura sono decorazione, nascosti ai lettori di schermo. Test: tests/a11y.spec.ts.
 * L'ordine nel DOM è l'ordine del Tab: il link «Salta al contenuto», il menu (che sullo
 * schermo sta in basso, ma viene prima, così il link per saltare ha qualcosa da saltare),
 * poi il contenuto. Test: tests/keyboard.spec.ts.
 * Non contiene stile: ogni pezzo ha il suo CSS Module accanto.
 */
import { MotionModeProvider } from './context/MotionModeContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { useLanguage } from './hooks/useLanguage.ts'
import { ui } from './data/ui.ts'
import { Cursor } from './components/Cursor/Cursor.tsx'
import { PillNav } from './components/PillNav/PillNav.tsx'
import { ReadingBar } from './components/ReadingBar/ReadingBar.tsx'
import { Hero } from './sections/Hero/Hero.tsx'
import { Marquee } from './sections/Marquee/Marquee.tsx'
import { Manifesto } from './sections/Manifesto/Manifesto.tsx'
import { Projects } from './sections/Projects/Projects.tsx'
import { Contact } from './sections/Contact/Contact.tsx'

function Page() {
  const { t } = useLanguage()

  return (
    <>
      <Cursor />
      <ReadingBar />
      {/* Nascosto finché non ha il focus (.skip-link in global.css). tabIndex -1 su <main>
          serve perché il salto sposti davvero il focus, non solo lo scroll */}
      <a className="skip-link" href="#contenuto">
        {t(ui.skipLink)}
      </a>
      <PillNav />
      <main id="contenuto" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Manifesto />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <MotionModeProvider>
      <LanguageProvider>
        <Page />
      </LanguageProvider>
    </MotionModeProvider>
  )
}
