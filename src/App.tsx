/**
 * App.tsx
 * Compone la pagina: il provider della modalità di movimento, il cursore che segue,
 * la barra di lettura in cima, le cinque sezioni in ordine e i tre controlli fissi
 * (menu a pillola, interruttore del movimento e bottone del tema chiaro e scuro).
 * Ogni pezzo non decorativo sta dentro un landmark (main, nav, aside); il cursore e la
 * barra di lettura sono decorazione, nascosti ai lettori di schermo. Test: tests/a11y.spec.ts.
 * Non contiene stile: ogni pezzo ha il suo CSS Module accanto.
 */
import { MotionModeProvider } from './context/MotionModeContext.tsx'
import { Cursor } from './components/Cursor/Cursor.tsx'
import { PillNav } from './components/PillNav/PillNav.tsx'
import { MotionToggle } from './components/MotionToggle/MotionToggle.tsx'
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle.tsx'
import { ReadingBar } from './components/ReadingBar/ReadingBar.tsx'
import { Hero } from './sections/Hero/Hero.tsx'
import { Marquee } from './sections/Marquee/Marquee.tsx'
import { Manifesto } from './sections/Manifesto/Manifesto.tsx'
import { Projects } from './sections/Projects/Projects.tsx'
import { Contact } from './sections/Contact/Contact.tsx'

export default function App() {
  return (
    <MotionModeProvider>
      <Cursor />
      <ReadingBar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Projects />
        <Contact />
      </main>
      <PillNav />
      {/* I due controlli fissi stanno in un landmark, come il resto della pagina: chi usa
          un lettore di schermo li trova nell'elenco delle regioni (regola "region" di axe) */}
      <aside aria-label="Preferenze di visualizzazione">
        <MotionToggle />
        <ThemeToggle />
      </aside>
    </MotionModeProvider>
  )
}
