/**
 * contactRules.test.ts
 * Test delle regole del modulo contatti (contactRules.ts) con Vitest: le stesse regole le
 * usa il modulo nella pagina, prima di inviare, e il server in server/, prima di salvare.
 * Qui si prova che un messaggio buono passi, che ogni campo sbagliato dia il suo errore e
 * che il modulo compaia solo quando c'è l'indirizzo del server (online non c'è).
 * L'ultimo gruppo guarda i testi del modulo (contactForm.ts): ogni campo ha un errore per
 * ogni codice che può ricevere, e ogni testo c'è in italiano e in inglese, diversi.
 */
import { describe, expect, it } from 'vitest'
import { contactEndpoint, LIMITS, validateContact } from './contactRules.ts'
import { contactForm } from './contactForm.ts'
import type { Localized } from '../types/content.ts'

const good = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Ciao, mi piace il tuo sito.' }

describe('validateContact', () => {
  it('accetta un messaggio buono e toglie gli spazi ai bordi', () => {
    const result = validateContact({ ...good, name: '  Ada Lovelace  ' })
    expect(result).toEqual({ ok: true, value: good })
  })

  it('dà un errore per ogni campo vuoto', () => {
    const result = validateContact({ name: ' ', email: '', message: '' })
    expect(result).toEqual({ ok: false, errors: { name: 'required', email: 'required', message: 'required' } })
  })

  it("rifiuta un'email senza chiocciola o senza dominio", () => {
    for (const email of ['ada', 'ada@', '@example.com', 'ada@example', 'ada lovelace@example.com']) {
      expect(validateContact({ ...good, email })).toEqual({ ok: false, errors: { email: 'invalid' } })
    }
  })

  it('rifiuta un messaggio troppo corto o troppo lungo', () => {
    expect(validateContact({ ...good, message: 'Ciao' })).toEqual({ ok: false, errors: { message: 'tooShort' } })
    const long = 'a'.repeat(LIMITS.message.max + 1)
    expect(validateContact({ ...good, message: long })).toEqual({ ok: false, errors: { message: 'tooLong' } })
  })

  it('rifiuta un nome o una email troppo lunghi', () => {
    const name = 'a'.repeat(LIMITS.name.max + 1)
    const email = `${'a'.repeat(LIMITS.email.max)}@example.com`
    expect(validateContact({ ...good, name, email })).toEqual({
      ok: false,
      errors: { name: 'tooLong', email: 'tooLong' },
    })
  })

  it('tratta come vuoto un campo che non è testo', () => {
    expect(validateContact({ name: 42, email: null, message: undefined })).toEqual({
      ok: false,
      errors: { name: 'required', email: 'required', message: 'required' },
    })
    expect(validateContact(null)).toEqual({
      ok: false,
      errors: { name: 'required', email: 'required', message: 'required' },
    })
  })
})

describe('contactEndpoint', () => {
  it("restituisce l'indirizzo del server quando c'è", () => {
    expect(contactEndpoint({ VITE_CONTACT_URL: 'http://localhost:5198/api/contact' })).toBe(
      'http://localhost:5198/api/contact',
    )
  })

  it('restituisce null senza indirizzo, o con uno vuoto: online il modulo resta spento', () => {
    expect(contactEndpoint({})).toBeNull()
    expect(contactEndpoint({ VITE_CONTACT_URL: '  ' })).toBeNull()
  })
})

describe('i testi del modulo', () => {
  /** Tutti i testi bilingui dentro un oggetto, a qualunque profondità. */
  const texts = (node: unknown): Localized[] =>
    typeof node === 'object' && node !== null
      ? 'it' in node && 'en' in node
        ? [node as Localized]
        : Object.values(node).flatMap(texts)
      : []

  it('ogni testo c’è nelle due lingue, e l’inglese è tradotto', () => {
    const all = texts(contactForm)
    expect(all.length).toBeGreaterThan(10)
    for (const text of all) {
      expect(text.it.trim()).not.toBe('')
      expect(text.en.trim()).not.toBe('')
      // «Email» è uguale nelle due lingue: è l'unica eccezione
      if (text.it !== 'Email') expect(text.en).not.toBe(text.it)
    }
  })

  it('ogni errore che le regole possono dare a un campo ha il suo testo', () => {
    const cases: [unknown, keyof typeof contactForm.errors, string][] = [
      [{ name: '' }, 'name', 'required'],
      [{ name: 'a'.repeat(LIMITS.name.max + 1) }, 'name', 'tooLong'],
      [{ email: '' }, 'email', 'required'],
      [{ email: 'ada' }, 'email', 'invalid'],
      [{ email: `${'a'.repeat(LIMITS.email.max)}@x.it` }, 'email', 'tooLong'],
      [{ message: '' }, 'message', 'required'],
      [{ message: 'Ciao' }, 'message', 'tooShort'],
      [{ message: 'a'.repeat(LIMITS.message.max + 1) }, 'message', 'tooLong'],
    ]
    for (const [input, field, code] of cases) {
      const result = validateContact({ ...good, ...(input as object) })
      expect(result.ok ? undefined : result.errors[field]).toBe(code)
      expect(contactForm.errors[field]).toHaveProperty(code)
    }
  })
})
