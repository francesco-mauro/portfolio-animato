/**
 * profile.ts
 * I testi su Francesco: nome, ruolo, frase di presentazione, testo del Manifesto, link.
 * Fonti: il CV, il profilo LinkedIn e il README del profilo GitHub.
 * Per cambiare un testo del sito si cambia qui, non nei componenti.
 * I testi che cambiano con la lingua hanno l'italiano e l'inglese ({ it, en }); nome,
 * ruolo ed etichette dei link sono uguali nelle due.
 * Nel Manifesto inglese i master di Boolean sono «Master programs at Boolean», con il nome
 * della scuola: sono corsi, non una laurea magistrale, e «master's degree» lo farebbe credere.
 */
import type { Profile } from '../types/content.ts'

export const profile: Profile = {
  name: 'Francesco Mauro',
  role: 'Junior Full Stack Developer',
  city: { it: 'Roma', en: 'Rome' },
  intro: {
    it: 'Interfacce in React e TypeScript, server in Node.js, dati con SQL e Python.',
    en: 'Interfaces in React and TypeScript, servers in Node.js, data with SQL and Python.',
  },
  manifesto: {
    it: 'Due master con Boolean, uno full stack e uno in data analytics. Oggi studio Ingegneria Informatica e costruisco interfacce con React, TypeScript e Node.js.',
    en: "Two Master programs at Boolean, one in full stack development and one in data analytics. Today I'm studying Computer Engineering and building interfaces with React, TypeScript and Node.js.",
  },
  links: [
    { label: 'GitHub', href: 'https://github.com/francesco-mauro' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/francesco-mauro-6556042b4/' },
  ],
}
