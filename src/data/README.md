# src/data/

I testi del sito. Per cambiare cosa dice la pagina si tocca solo qui. In testa a ogni file c'è la fonte (CV, LinkedIn, README dei repository).

Il sito è in italiano e in inglese. Un testo che cambia con la lingua è scritto nelle due, `{ it: '…', en: '…' }` (il tipo `Localized` di `src/types/content.ts`): se manca una lingua il progetto non compila. Nomi e tecnologie, uguali in ogni lingua, restano stringhe semplici. Nei componenti il testo giusto lo dà `t()` di `src/hooks/useLanguage.ts`.

| File | Cosa contiene |
|---|---|
| `profile.ts` | nome, ruolo, città, la frase sotto il titolo, la frase grande del Manifesto, i testi di «Chi sono» (paragrafo, Percorso, Esperienze, Lingue, Cosa cerco), i link a GitHub e LinkedIn |
| `projects.ts` | i sei progetti: in testa i due in evidenza (gli incidenti stradali e questo sito, con il racconto in tre frasi), poi gli altri quattro nell'ordine del profilo GitHub, con le demo online di Foodie Journal, Boolzapp, Memory e di questo sito e l'anteprima di ognuno (l'immagine importata da `src/assets/previews/` e il suo testo alternativo), più `repoUrl()` che fa il link al repository |
| `stack.ts` | le tecnologie della fascia che scorre |
| `ui.ts` | i testi dell'interfaccia nelle due lingue: il titolo della prima schermata, il menu, i bottoni, i titoli delle sezioni, i nomi per i lettori di schermo (`aria-label`), le etichette della vista X-ray; più `fill()`, che riempie i segnaposto `{nome}` di un testo |
| `notFound.ts` | i testi della pagina 404 nelle due lingue: la pillola, il titolo, la riga di spiegazione, il bottone. Stanno qui e non in `ui.ts` perché `tests/language.spec.ts` cerca ogni testo di `ui.ts` sulla prima pagina |
| `data.test.ts` | i test di questi cinque file, con [Vitest](https://vitest.dev): `npm run test:unit` |

## Aggiungere o cambiare un testo

- Un testo su Francesco o su un progetto: in `profile.ts` o `projects.ts`, nelle due lingue.
- Una scritta dell'interfaccia: in `ui.ts`, mai dentro il componente. Se è uguale nelle due lingue (una parola già inglese come «Motion», un pezzo di codice) resta nel componente e va aggiunta all'elenco `NO_LANGUAGE` in testa a `tests/language.spec.ts`, che altrimenti la segnala come non tradotta.
- Numeri e date devono dire la stessa cosa nelle due lingue: lo controlla `data.test.ts` (in inglese le migliaia hanno la virgola, «1,202»).

## I test dei dati

Girano in Node, senza browser, in meno di un secondo, e in GitHub Actions prima della build: un dato sbagliato ferma la pubblicazione.

| Cosa | Cosa controlla |
|---|---|
| i progetti | i due in evidenza (quelli con il racconto, `story`) sono gli incidenti stradali e questo sito e vengono per primi; gli altri sono un multiplo di quattro, così la riga da quattro non ha un posto vuoto in fondo; repository e titoli tutti diversi (il nome del repository fa da chiave in React); ognuno ha titolo, stack senza doppioni e una descrizione corta o un racconto in tre frasi, mai tutti e due, con ogni frase che finisce con il punto; ognuno ha la sua anteprima in WebP con un testo alternativo, e non ce ne sono due uguali |
| i link | `repoUrl()` dà `https://github.com/francesco-mauro/<repo>`; una demo, quando c'è, è `https://francesco-mauro.github.io/<repo>/`; la data, quando c'è, è scritta «mese anno», e in inglese è lo stesso mese dello stesso anno |
| il profilo | nome, ruolo, città, frase e Manifesto non vuoti; i testi di «Chi sono» ci sono tutti, con almeno una voce in Percorso e in Esperienze; almeno un link; i link in https, senza due etichette o due indirizzi uguali |
| lo stack | almeno una voce, nessuna vuota, nessuna ripetuta |
| le due lingue | ogni testo bilingue di profilo, progetti, interfaccia e pagina 404 c'è in italiano e in inglese, e solo in quelle; i testi dell'interfaccia, le descrizioni e i testi alternativi sono davvero diversi nelle due lingue; i numeri e i segnaposto sono gli stessi; `fill()` riempie i segnaposto |

Controllano la forma, non la rete: non aprono gli indirizzi. Nemmeno dicono se una traduzione è buona. Vitest legge `vite.config.ts` e prende i file `src/**/*.test.ts`, `.github/**/*.test.ts` e `pages.test.ts`; i `.spec.ts` in `tests/` sono di Playwright.
