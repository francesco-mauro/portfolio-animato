/**
 * contactServer.test.ts
 * Test del server dei contatti (contactServer.ts) con Vitest: ogni test accende un server
 * vero su una porta libera, gli manda richieste con fetch e guarda la risposta e il file
 * dei messaggi, in una cartella temporanea che alla fine viene cancellata.
 */
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createContactServer, MAX_BODY_BYTES } from './contactServer.ts'

const ORIGIN = 'http://localhost:5199'
const good = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Ciao, mi piace il tuo sito.' }

let dir: string
let file: string
let url: string
let close: () => Promise<void>

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'contact-'))
  file = join(dir, 'messages.jsonl')
  const server = createContactServer({ file, allowedOrigins: [ORIGIN] })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/contact`
  close = () => new Promise((resolve) => server.close(() => resolve()))
})

afterEach(async () => {
  await close()
  await rm(dir, { recursive: true, force: true })
})

const post = (body: unknown, headers: Record<string, string> = {}) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

/** I messaggi salvati, uno per riga; nessun file vuol dire nessun messaggio. */
async function saved(): Promise<Record<string, string>[]> {
  try {
    return (await readFile(file, 'utf8'))
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line))
  } catch {
    return []
  }
}

describe('server dei contatti', () => {
  it('salva un messaggio buono e risponde ok', async () => {
    const response = await post(good)
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ ok: true })
    const messages = await saved()
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatchObject(good)
    expect(Date.parse(messages[0].receivedAt)).not.toBeNaN()
  })

  it('aggiunge i messaggi uno sotto l’altro', async () => {
    await post(good)
    await post({ ...good, name: 'Grace Hopper' })
    expect((await saved()).map((message) => message.name)).toEqual(['Ada Lovelace', 'Grace Hopper'])
  })

  it('risponde 400 con gli errori dei campi e non salva niente', async () => {
    const response = await post({ name: '', email: 'ada', message: 'Ciao' })
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      ok: false,
      errors: { name: 'required', email: 'invalid', message: 'tooShort' },
    })
    expect(await saved()).toEqual([])
  })

  it('risponde 400 a un corpo che non è JSON', async () => {
    const response = await post('non è json')
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ ok: false, error: 'badJson' })
  })

  it('risponde 413 a un corpo troppo grande', async () => {
    const response = await post({ ...good, message: 'a'.repeat(MAX_BODY_BYTES) })
    expect(response.status).toBe(413)
    expect(await saved()).toEqual([])
  })

  it('finge di salvare quando il campo trappola è pieno: lo riempiono solo i bot', async () => {
    const response = await post({ ...good, website: 'https://spam.example' })
    expect(response.status).toBe(201)
    expect(await saved()).toEqual([])
  })

  it('risponde alla richiesta preliminare del browser (CORS) solo per le origini ammesse', async () => {
    const allowed = await fetch(url, { method: 'OPTIONS', headers: { Origin: ORIGIN } })
    expect(allowed.status).toBe(204)
    expect(allowed.headers.get('access-control-allow-origin')).toBe(ORIGIN)
    expect(allowed.headers.get('access-control-allow-methods')).toContain('POST')

    const other = await fetch(url, { method: 'OPTIONS', headers: { Origin: 'https://altro.example' } })
    expect(other.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('rifiuta con 403 un invio da un’origine non ammessa', async () => {
    const response = await post(good, { Origin: 'https://altro.example' })
    expect(response.status).toBe(403)
    expect(await saved()).toEqual([])
  })

  it('risponde 404 a ogni altro indirizzo e 405 a ogni altro metodo', async () => {
    expect((await fetch(url.replace('/api/contact', '/altro'))).status).toBe(404)
    expect((await fetch(url, { headers: { Origin: ORIGIN } })).status).toBe(405)
  })
})
