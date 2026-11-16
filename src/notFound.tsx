/**
 * notFound.tsx
 * Punto di ingresso della pagina 404 (404.html): gli stessi stili globali di main.tsx, poi
 * <NotFound /> dentro #root. La vista X-ray qui non c'è, quindi xray.css non serve.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import { NotFound } from './pages/NotFound/NotFound.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)
