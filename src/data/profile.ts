/**
 * profile.ts
 * I testi su Francesco: nome, ruolo, frase di presentazione, la frase grande del Manifesto,
 * i testi della sezione «Chi sono» (paragrafo, Percorso, Esperienze, Lingue, Cosa cerco), link.
 * Fonti: il CV, il profilo LinkedIn e il README del profilo GitHub.
 * Per cambiare un testo del sito si cambia qui, non nei componenti.
 * I testi che cambiano con la lingua hanno l'italiano e l'inglese ({ it, en }); nome,
 * ruolo ed etichette dei link sono uguali nelle due.
 * In inglese i master di Boolean sono «Master program», con il nome della scuola: sono
 * corsi, non una laurea magistrale, e «master's degree» lo farebbe credere. Per chi non la
 * conosce, il paragrafo dice anche cos'è Boolean.
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
    it: 'Costruisco app web in React e TypeScript e analizzo dati con Python e Power BI.',
    en: 'I build web apps in React and TypeScript and analyse data with Python and Power BI.',
  },
  about: {
    text: {
      it: 'Ho dato dieci esami di Ingegneria Gestionale a Tor Vergata. Nel 2023, alla Schulz Italia, seguivo i gestionali aziendali e l’introduzione di nuovi software di produzione e facevo da tramite con il team di sviluppo, per esempio per l’inventario dei pallet in entrata e in uscita. Allora non programmavo: nel 2024 ho fatto il master full stack di Boolean.',
      en: "I passed ten exams in Management Engineering at the University of Rome Tor Vergata. In 2023, at Schulz Italia, I looked after the company's management software and the rollout of new production software, and I was the go-between with the development team, for example on an inventory system for incoming and outgoing pallets. I wasn't programming then: in 2024 I took the Full Stack Web Developer Master program at Boolean, an Italian tech training school.",
    },
    path: [
      {
        it: 'Master Full Stack Web Developer, Boolean, 2024, 700 ore',
        en: 'Full Stack Web Developer Master program, Boolean, 2024, 700 hours',
      },
      {
        it: 'Master in Data Analytics, Boolean, 2026, 200 ore',
        en: 'Data Analytics Master program, Boolean, 2026, 200 hours',
      },
      {
        it: 'Ingegneria Informatica, Universitas Mercatorum, in corso',
        en: 'Computer Engineering, Universitas Mercatorum, in progress',
      },
    ],
    experience: [
      {
        it: 'Specialista in processi e sistemi gestionali, Schulz Italia, 2023',
        en: 'Business process and systems specialist, Schulz Italia, 2023',
      },
      {
        it: 'Tutor di Matematica e Fisica per studenti di Ingegneria, 2017-2026',
        en: 'Maths and Physics tutor for engineering students, 2017-2026',
      },
      {
        it: 'Servizio civile, Ufficio Anagrafe del Comune di Zagarolo, 2022-2023',
        en: 'Voluntary civil service, Population Registry Office, Municipality of Zagarolo, 2022-2023',
      },
    ],
    languages: { it: 'Italiano madrelingua, inglese C1', en: 'Italian (native), English C1' },
    lookingFor: {
      it: 'Un ruolo da junior frontend o full stack developer, a Roma in sede o in ibrido, oppure full remote in Italia.',
      en: 'A junior frontend or full stack developer role: on-site or hybrid in Rome, or fully remote within Italy.',
    },
  },
  links: [
    { label: 'GitHub', href: 'https://github.com/francesco-mauro' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/francesco-mauro-6556042b4/' },
  ],
}
