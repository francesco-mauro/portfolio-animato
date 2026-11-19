/**
 * index.ts
 * Accende il server dei contatti (contactServer.ts): npm run server.
 * Node 24 legge TypeScript da solo, togliendo i tipi: niente build per il server.
 * Si regola con tre variabili d'ambiente, tutte facoltative:
 * - CONTACT_PORT: la porta, 5198 se non c'è;
 * - CONTACT_MESSAGES_FILE: il file dei messaggi, server/messages.jsonl se non c'è (git lo ignora);
 * - CONTACT_ALLOWED_ORIGINS: le origini ammesse separate da virgole; se non c'è, quelle
 *   di npm run dev (5173) e dei test end-to-end (5200).
 */
import { fileURLToPath } from 'node:url'
import { createContactServer } from './contactServer.ts'

const port = Number(process.env.CONTACT_PORT ?? 5198)
const file = process.env.CONTACT_MESSAGES_FILE ?? fileURLToPath(new URL('./messages.jsonl', import.meta.url))
const allowedOrigins = (process.env.CONTACT_ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:5200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

createContactServer({ file, allowedOrigins }).listen(port, () => {
  console.log(`Server dei contatti su http://localhost:${port}/api/contact, messaggi in ${file}`)
})
