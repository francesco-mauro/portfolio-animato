/**
 * App.tsx
 * Compone la pagina: il provider della modalità di movimento, il cursore che segue,
 * le cinque sezioni in ordine e i due controlli fissi (menu a pillola e interruttore).
 * Non contiene stile: ogni pezzo ha il suo CSS Module accanto.
 */
import { MotionModeProvider } from './context/MotionModeContext.tsx'
import { MotionToggle } from './components/MotionToggle/MotionToggle.tsx'

export default function App() {
  return (
    <MotionModeProvider>
      <main>
        <h1>Francesco Mauro</h1>
      </main>
      <MotionToggle />
    </MotionModeProvider>
  )
}
