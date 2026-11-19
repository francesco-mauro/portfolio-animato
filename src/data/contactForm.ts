/**
 * contactForm.ts
 * I testi del modulo contatti (sections/Contact/ContactForm.tsx), in italiano e in inglese:
 * etichette, bottone, messaggi di invio e un errore per ogni codice delle regole
 * (contactRules.ts). Stanno qui e non in ui.ts perché il modulo compare solo quando c'è
 * il server dei contatti: online non c'è, e tests/language.spec.ts, che cerca sulla pagina
 * ogni testo di ui.ts, non li troverebbe. Che ci siano le due lingue lo controlla
 * contactRules.test.ts, che sulla pagina cambino lo guarda tests/contact.spec.ts.
 */
import type { Localized } from '../types/content.ts'
import type { ContactError, ContactField } from './contactRules.ts'
import { LIMITS } from './contactRules.ts'

const text = (it: string, en: string): Localized => ({ it, en })

export const contactForm = {
  /** Il titolo piccolo sopra il modulo, che è anche il nome del modulo per i lettori di schermo. */
  title: text('Scrivimi', 'Write to me'),
  labels: {
    name: text('Nome', 'Name'),
    email: text('Email', 'Email'),
    message: text('Messaggio', 'Message'),
  } satisfies Record<ContactField, Localized>,
  send: text('Invia', 'Send'),
  sending: text('Invio...', 'Sending...'),
  sent: text('Messaggio inviato, grazie. Ti rispondo presto.', "Message sent, thank you. I'll get back to you soon."),
  failed: text(
    'Il messaggio non è partito. Riprova tra poco, o scrivimi su LinkedIn.',
    "The message didn't go through. Try again shortly, or message me on LinkedIn.",
  ),
  /** Un errore per ogni campo e ogni codice che quel campo può avere. */
  errors: {
    name: {
      required: text('Scrivi il tuo nome.', 'Write your name.'),
      tooLong: text(`Il nome supera i ${LIMITS.name.max} caratteri.`, `The name is over ${LIMITS.name.max} characters.`),
    },
    email: {
      required: text('Scrivi la tua email.', 'Write your email.'),
      invalid: text('Questa email non sembra giusta.', "This email doesn't look right."),
      tooLong: text(`L'email supera i ${LIMITS.email.max} caratteri.`, `The email is over ${LIMITS.email.max} characters.`),
    },
    message: {
      required: text('Scrivi un messaggio.', 'Write a message.'),
      tooShort: text(
        `Scrivi almeno ${LIMITS.message.min} caratteri.`,
        `Write at least ${LIMITS.message.min} characters.`,
      ),
      tooLong: text(
        `Il messaggio supera i ${LIMITS.message.max} caratteri.`,
        `The message is over ${LIMITS.message.max} characters.`,
      ),
    },
  } satisfies Record<ContactField, Partial<Record<ContactError, Localized>>>,
}
