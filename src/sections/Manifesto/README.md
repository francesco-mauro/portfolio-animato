# Manifesto/

La frase grande che si accende allo scroll, in cima alla sezione «Chi sono» (`About/`).

| File | Cosa fa |
|---|---|
| `Manifesto.tsx` | divide il testo di `profile.manifesto` in parole; ogni parola si accende quando `useScrollProgress` supera la sua posizione nella frase; in modalità Off sono tutte accese; `data-testid="manifesto"` per i test |
| `Manifesto.module.css` | blocco alto due schermi con il testo `sticky` al centro, parole spente grigio scuro e accese chiare (cambia il colore, con una transizione), alone indaco in fondo; il blu notte lo dà la sezione |
