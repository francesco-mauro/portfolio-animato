/**
 * main.tsx
 * Punto di ingresso dell'app: importa gli stili globali e monta <App /> dentro #root.
 * L'ordine degli import conta: prima i token, poi le regole globali, poi la vista X-ray.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './styles/xray.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
