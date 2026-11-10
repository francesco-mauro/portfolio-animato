# src/data/

I testi del sito. Per cambiare cosa dice la pagina si tocca solo qui. In testa a ogni file c'è la fonte (CV, LinkedIn, README dei repository).

| File | Cosa contiene |
|---|---|
| `profile.ts` | nome, ruolo, città, la frase sotto il titolo, il testo del Manifesto, i link a GitHub e LinkedIn |
| `projects.ts` | i sei progetti della vetrina GitHub nello stesso ordine del profilo, con le demo online di Boolzapp, Memory e di questo sito e l'anteprima di ognuno (l'immagine importata da `src/assets/previews/` e il suo testo alternativo), più `repoUrl()` che fa il link al repository |
| `stack.ts` | le tecnologie della fascia che scorre |
| `data.test.ts` | i test di questi tre file, con [Vitest](https://vitest.dev): `npm run test:unit` |

## I test dei dati

Girano in Node, senza browser, in meno di un secondo, e in GitHub Actions prima della build: un dato sbagliato ferma la pubblicazione.

| Cosa | Cosa controlla |
|---|---|
| i progetti | sono un multiplo di tre, così la griglia a tre colonne non ha un posto vuoto in fondo; repository e titoli tutti diversi (il nome del repository fa da chiave in React); ognuno ha titolo, descrizione che finisce con il punto e stack senza doppioni; ognuno ha la sua anteprima in WebP con un testo alternativo, e non ce ne sono due uguali |
| i link | `repoUrl()` dà `https://github.com/francesco-mauro/<repo>`; una demo, quando c'è, è `https://francesco-mauro.github.io/<repo>/`; la data, quando c'è, è scritta «mese anno» |
| il profilo | nome, ruolo, città, frase e Manifesto non vuoti; almeno un link; i link in https, senza due etichette o due indirizzi uguali |
| lo stack | almeno una voce, nessuna vuota, nessuna ripetuta |

Controllano la forma, non la rete: non aprono gli indirizzi. Vitest legge `vite.config.ts` e prende solo i file `src/**/*.test.ts`; i `.spec.ts` in `tests/` sono di Playwright.
