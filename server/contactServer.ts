/**
 * contactServer.ts
 * Il server che riceve i messaggi del modulo contatti: Node puro (node:http), senza
 * librerie. Un solo indirizzo, POST /api/contact, con un corpo JSON { name, email, message }.
 * - Ricontrolla i campi con le stesse regole del modulo (src/data/contactRules.ts): il
 *   browser si può aggirare, il server no. Campi sbagliati: 400 con i codici degli errori.
 * - Salva ogni messaggio buono come una riga JSON in fondo a un file (.jsonl), con l'ora
 *   di arrivo: 201. Per ora non manda email, i messaggi si leggono nel file.
 * - Il campo trappola «website» è nascosto alle persone: se è pieno l'ha riempito un bot,
 *   e il server risponde 201 senza salvare, così il bot non impara niente.
 * - Accetta solo le origini ammesse (CORS): il sito gira su un'altra porta, quindi il
 *   browser chiede prima il permesso con una richiesta OPTIONS.
 * - Un corpo oltre MAX_BODY_BYTES riceve 413, un corpo che non è JSON 400.
 * Si accende con server/index.ts; test in contactServer.test.ts.
 */
import { appendFile, mkdir } from 'node:fs/promises'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { dirname } from 'node:path'
import { validateContact } from '../src/data/contactRules.ts'

/** Il corpo più grande accettato: un messaggio di 2000 caratteri con i suoi campi ci sta largo. */
export const MAX_BODY_BYTES = 10_000

export interface ContactServerOptions {
  /** Il file .jsonl dove finiscono i messaggi, una riga ciascuno. */
  file: string
  /** Le origini da cui il browser può inviare, per esempio http://localhost:5173. */
  allowedOrigins: string[]
}

/** Il corpo di una richiesta troppo grande: lo distingue dagli altri errori di lettura. */
class TooLarge extends Error {}

/** Legge il corpo della richiesta come testo, fermandosi oltre il limite. */
async function readBody(req: IncomingMessage): Promise<string> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req as AsyncIterable<Buffer>) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new TooLarge()
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function send(res: ServerResponse, status: number, body?: unknown) {
  if (body === undefined) {
    res.writeHead(status).end()
    return
  }
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(body))
}

export function createContactServer({ file, allowedOrigins }: ContactServerOptions): Server {
  return createServer(async (req, res) => {
    const origin = req.headers.origin
    const allowed = origin !== undefined && allowedOrigins.includes(origin)
    if (allowed) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }

    const path = new URL(req.url ?? '/', 'http://localhost').pathname
    if (path !== '/api/contact') return send(res, 404, { ok: false, error: 'notFound' })

    if (req.method === 'OPTIONS') {
      if (allowed) {
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      }
      return send(res, 204)
    }
    if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'methodNotAllowed' })
    if (!allowed) return send(res, 403, { ok: false, error: 'forbiddenOrigin' })

    let body: unknown
    try {
      body = JSON.parse(await readBody(req))
    } catch (error) {
      if (error instanceof TooLarge) return send(res, 413, { ok: false, error: 'tooLarge' })
      return send(res, 400, { ok: false, error: 'badJson' })
    }

    const trap = (body as { website?: unknown } | null)?.website
    if (typeof trap === 'string' && trap.trim()) return send(res, 201, { ok: true })

    const result = validateContact(body)
    if (!result.ok) return send(res, 400, { ok: false, errors: result.errors })

    try {
      await mkdir(dirname(file), { recursive: true })
      await appendFile(file, JSON.stringify({ ...result.value, receivedAt: new Date().toISOString() }) + '\n')
    } catch {
      return send(res, 500, { ok: false, error: 'saveFailed' })
    }
    return send(res, 201, { ok: true })
  })
}
