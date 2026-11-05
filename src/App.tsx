/**
 * App.tsx
 * Compone la pagina: il provider della modalità di movimento, il cursore che segue,
 * le cinque sezioni in ordine e i due controlli fissi (menu a pillola e interruttore).
 * Non contiene stile: ogni pezzo ha il suo CSS Module accanto.
 */
import { MotionModeProvider } from './context/MotionModeContext.tsx'
import { Cursor } from './components/Cursor/Cursor.tsx'
import { PillNav } from './components/PillNav/PillNav.tsx'
import { MotionToggle } from './components/MotionToggle/MotionToggle.tsx'
import { Hero } from './sections/Hero/Hero.tsx'
import { Marquee } from './sections/Marquee/Marquee.tsx'
import { Manifesto } from './sections/Manifesto/Manifesto.tsx'
import { Projects } from './sections/Projects/Projects.tsx'
import { Contact } from './sections/Contact/Contact.tsx'

export default function App() {
  return (
    <MotionModeProvider>
      <Cursor />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Projects />
        <Contact />
      </main>
      <PillNav />
      <MotionToggle />
    </MotionModeProvider>
  )
}
