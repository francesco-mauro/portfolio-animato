# server/

Il server che riceve i messaggi del modulo contatti: **Node puro** (`node:http`), senza librerie e senza build, perché Node 24 legge TypeScript da solo togliendo i tipi.

```bash
npm run server     # http://localhost:5198/api/contact
```

Per vedere il modulo nella pagina, in un altro terminale:

```bash
VITE_CONTACT_URL=http://localhost:5198/api/contact npm run dev
```

Il modulo compare solo quando Vite conosce `VITE_CONTACT_URL`. Online il sito sta su GitHub Pages, che pubblica solo file fissi e non fa girare un server: lì la variabile non c'è e la sezione Contatti resta com'era. Per accenderlo online serve un posto dove far girare questo server (per esempio Render), poi il suo indirizzo in `VITE_CONTACT_URL` nella build.

| File | Cosa fa |
|---|---|
| `contactServer.ts` | il server: `POST /api/contact` con `{ name, email, message }`. Ricontrolla i campi con le regole del modulo (`src/data/contactRules.ts`), salva ogni messaggio buono come una riga JSON con l'ora di arrivo (201), risponde 400 con i codici degli errori, 413 a un corpo troppo grande, 403 a un'origine non ammessa (CORS). Il campo trappola `website` pieno vuol dire bot: risponde 201 e non salva |
| `index.ts` | lo accende: porta, file dei messaggi e origini ammesse dalle variabili d'ambiente, scritte nel commento in testa |
| `contactServer.test.ts` | i test con Vitest (`npm run test:unit`): un server vero su una porta libera, richieste con `fetch`, il file dei messaggi in una cartella temporanea |
| `messages.jsonl` | i messaggi ricevuti in locale, uno per riga. Nasce col primo messaggio e git lo ignora: sono di chi scrive, non del codice |

Per ora i messaggi si leggono nel file: il server non manda email.
