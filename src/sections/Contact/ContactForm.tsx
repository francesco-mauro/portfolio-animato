/**
 * ContactForm.tsx
 * Il modulo contatti: nome, email, messaggio e il bottone Invia. Prima di inviare
 * controlla i campi con le regole di src/data/contactRules.ts; se qualcosa manca scrive
 * l'errore sotto il campo (aria-invalid e aria-describedby, così lo legge anche un lettore
 * di schermo) e porta il focus sul primo campo sbagliato. Poi manda il JSON al server dei
 * contatti (server/) con fetch: se risponde ok dice che il messaggio è partito e svuota i
 * campi; se rifiuta un campo mostra quell'errore; se sbaglia o non risponde lo dice e
 * tiene i campi, così non si riscrive niente.
 * Il campo «website» è una trappola per i bot: nascosto alle persone e ai lettori di
 * schermo, il server scarta i messaggi che lo hanno pieno.
 * Riceve l'indirizzo del server da Contact.tsx, che mostra il modulo solo se c'è.
 * Testi in src/data/contactForm.ts; test in tests/contact.spec.ts.
 */
import { useRef, useState, type FormEvent } from 'react'
import { useLanguage } from '../../hooks/useLanguage.ts'
import { contactForm } from '../../data/contactForm.ts'
import type { Localized } from '../../types/content.ts'
import {
  validateContact,
  type ContactError,
  type ContactErrors,
  type ContactField,
} from '../../data/contactRules.ts'
import styles from './ContactForm.module.css'

const FIELDS: ContactField[] = ['name', 'email', 'message']

type Status = 'idle' | 'sending' | 'sent' | 'failed'

export function ContactForm({ endpoint }: { endpoint: string }) {
  const { t } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  /** Mostra gli errori e porta il focus sul primo campo sbagliato, nell'ordine del modulo. */
  function showErrors(found: ContactErrors) {
    setErrors(found)
    const first = FIELDS.find((field) => found[field])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const result = validateContact(data)
    if (!result.ok) {
      setStatus('idle')
      showErrors(result.errors)
      return
    }

    setErrors({})
    setStatus('sending')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.value, website: data.website ?? '' }),
      })
      if (response.ok) {
        form.reset()
        setStatus('sent')
        return
      }
      const body = (await response.json().catch(() => null)) as { errors?: ContactErrors } | null
      if (response.status === 400 && body?.errors && Object.keys(body.errors).length) {
        setStatus('idle')
        showErrors(body.errors)
        return
      }
      setStatus('failed')
    } catch {
      setStatus('failed')
    }
  }

  /** Il testo dell'errore di un campo; un codice che il campo non prevede usa quello di campo vuoto. */
  const errorText = (field: ContactField, code: ContactError) => {
    const messages: Partial<Record<ContactError, Localized>> = contactForm.errors[field]
    return t(messages[code] ?? contactForm.errors[field].required)
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      aria-labelledby="contact-form-title"
      noValidate
      onSubmit={handleSubmit}
    >
      <h3 id="contact-form-title" className={styles.title}>
        {t(contactForm.title)}
      </h3>
      {FIELDS.map((field) => {
        const error = errors[field]
        const id = `contact-${field}`
        const Input = field === 'message' ? 'textarea' : 'input'
        return (
          <div key={field} className={styles.field}>
            <label htmlFor={id} className={styles.label}>
              {t(contactForm.labels[field])}
            </label>
            <Input
              id={id}
              name={field}
              className={styles.input}
              {...(field === 'message' ? { rows: 4 } : { type: field === 'email' ? 'email' : 'text' })}
              autoComplete={field === 'message' ? 'off' : field}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            {error && (
              <p id={`${id}-error`} className={styles.error}>
                {errorText(field, error)}
              </p>
            )}
          </div>
        )
      })}
      {/* La trappola per i bot: fuori dallo schermo, fuori dal giro del Tab, nascosta ai lettori di schermo */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className={styles.button} disabled={status === 'sending'}>
        {t(status === 'sending' ? contactForm.sending : contactForm.send)}
      </button>
      {/* Sempre nella pagina, anche vuoto: un lettore di schermo annuncia solo i cambi di una regione che c'era già */}
      <p role="status" className={styles.sent}>
        {status === 'sent' ? t(contactForm.sent) : ''}
      </p>
      {status === 'failed' && (
        <p role="alert" className={styles.failed}>
          {t(contactForm.failed)}
        </p>
      )}
    </form>
  )
}
