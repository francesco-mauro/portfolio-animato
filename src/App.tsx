/**
 * App.tsx
 * Compone la pagina: il provider della modalità di movimento, il cursore che segue,
 * le cinque sezioni in ordine e i due controlli fissi (menu a pillola e interruttore).
 * Non contiene stile: ogni pezzo ha il suo CSS Module accanto.
 */
import { MotionModeProvider } from './context/MotionModeContext.tsx'
import { Cursor } from './components/Cursor/Cursor.tsx'
import { MotionToggle } from './components/MotionToggle/MotionToggle.tsx'
import { Shape } from './components/Shape/Shape.tsx'
import { FloatingCard } from './components/FloatingCard/FloatingCard.tsx'

export default function App() {
  return (
    <MotionModeProvider>
      <Cursor />
      <main style={{ position: 'relative', minHeight: '100svh' }}>
        <h1>Francesco Mauro</h1>
        <Shape kind="sphere" size={120} top="20%" left="60%" />
        <FloatingCard tone="green" floating style={{ top: '40%', left: '10%' }}>
          Anteprima scheda
        </FloatingCard>
      </main>
      <MotionToggle />
    </MotionModeProvider>
  )
}
