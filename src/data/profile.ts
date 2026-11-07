/**
 * profile.ts
 * I testi su Francesco: nome, ruolo, frase di presentazione, testo del Manifesto, link.
 * Fonti: il CV, il profilo LinkedIn e il README del profilo GitHub.
 * Per cambiare un testo del sito si cambia qui, non nei componenti.
 */
import type { Profile } from '../types/content.ts'

export const profile: Profile = {
  name: 'Francesco Mauro',
  role: 'Junior Full Stack Developer',
  city: 'Roma',
  intro:
    'Interfacce in React e TypeScript, server in Node.js, dati con SQL e Python.',
  manifesto:
    'Due master con Boolean, uno full stack e uno in data analytics. Oggi studio Ingegneria Informatica e costruisco interfacce con React, TypeScript e Node.js.',
  links: [
    { label: 'GitHub', href: 'https://github.com/francesco-mauro' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/francesco-mauro-6556042b4/' },
  ],
}
