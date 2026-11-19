# Contact/

La chiusura, a tutto corallo.

| File | Cosa fa |
|---|---|
| `Contact.tsx` | titolo "Parliamo del prossimo progetto", una riga su di te, i link di `profile.links`, il copyright con l'anno; niente email in pagina |
| `Contact.module.css` | fondo corallo con luce chiara in alto, disco che ruota in prospettiva (`@keyframes spin`, su `.discBody`, dentro il contenitore `.disc` che porta l'etichetta X-ray), titolo a sinistra e link a destra, in colonna sul telefono |
| `ContactForm.tsx` | il modulo contatti (nome, email, messaggio): controlla i campi con `src/data/contactRules.ts`, scrive gli errori sotto i campi e porta il focus sul primo sbagliato, invia al server dei contatti (`server/`) e dice se il messaggio è partito. Compare solo quando c'è `VITE_CONTACT_URL`: online no |
| `ContactForm.module.css` | campi in vetro chiaro col bordo bianco, bottone bianco, errori bianchi in grassetto con un segno davanti (il rosso sul corallo non si legge), trappola per i bot fuori dallo schermo |
