/**
 * contactRules.ts
 * Le regole del modulo contatti, scritte una volta sola: le usa il modulo nella pagina
 * (sections/Contact/ContactForm.tsx), per dire subito cosa manca, e il server in server/,
 * che non si fida del browser e ricontrolla tutto prima di salvare.
 * Gli errori sono codici ('required', 'invalid', 'tooShort', 'tooLong'): il server li manda
 * così, e il modulo li traduce nella lingua scelta con i testi di ui.ts.
 * Qui c'è anche contactEndpoint: il modulo compare solo se Vite conosce l'indirizzo del
 * server (VITE_CONTACT_URL). Online, su GitHub Pages, il server non c'è e il modulo resta
 * spento. Test: contactRules.test.ts.
 */

/** I campi del modulo, già puliti dagli spazi ai bordi. */
export interface ContactMessage {
  name: string
  email: string
  message: string
}

export type ContactField = keyof ContactMessage
export type ContactError = 'required' | 'invalid' | 'tooShort' | 'tooLong'
export type ContactErrors = Partial<Record<ContactField, ContactError>>

export type ContactResult = { ok: true; value: ContactMessage } | { ok: false; errors: ContactErrors }

/** Le lunghezze ammesse, in caratteri. Il messaggio ha un minimo, perché «ciao» da solo non dice niente. */
export const LIMITS = {
  name: { max: 100 },
  email: { max: 200 },
  message: { min: 10, max: 2000 },
} as const

/** Un'email plausibile: qualcosa, una chiocciola, un dominio con almeno un punto, niente spazi. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Il testo di un campo, senza spazi ai bordi; quello che non è testo conta come vuoto. */
const clean = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

/** Controlla i campi arrivati dal modulo o dal corpo di una richiesta, che può essere qualunque cosa. */
export function validateContact(input: unknown): ContactResult {
  const fields = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>
  const value: ContactMessage = {
    name: clean(fields.name),
    email: clean(fields.email),
    message: clean(fields.message),
  }
  const errors: ContactErrors = {}

  if (!value.name) errors.name = 'required'
  else if (value.name.length > LIMITS.name.max) errors.name = 'tooLong'

  if (!value.email) errors.email = 'required'
  else if (value.email.length > LIMITS.email.max) errors.email = 'tooLong'
  else if (!EMAIL.test(value.email)) errors.email = 'invalid'

  if (!value.message) errors.message = 'required'
  else if (value.message.length < LIMITS.message.min) errors.message = 'tooShort'
  else if (value.message.length > LIMITS.message.max) errors.message = 'tooLong'

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}

/** L'indirizzo del server dei contatti, letto dalle variabili di Vite; null quando non c'è. */
export function contactEndpoint(env: { VITE_CONTACT_URL?: string }): string | null {
  return env.VITE_CONTACT_URL?.trim() || null
}
