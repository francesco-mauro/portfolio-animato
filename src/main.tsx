/**
 * main.tsx
 * Punto di ingresso dell'app: importa gli stili globali e monta <App /> dentro #root.
 * L'ordine degli import conta: prima i token, poi le regole globali.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
