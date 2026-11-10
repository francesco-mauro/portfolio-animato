# tests/

I test end-to-end del sito, scritti con [Playwright](https://playwright.dev). Le animazioni sono CSS, quindi si possono controllare solo in un browser vero: Playwright avvia il sito con Vite (configurazione in `playwright.config.ts` alla radice), lo apre in Chrome e guarda cosa succede davvero sulla pagina.

```bash
npm run test:e2e
```

In locale usa Chrome già installato sul PC; in GitHub Actions usa il Chromium di Playwright.

| File | Cosa controlla |
|---|---|
| `marquee.spec.ts` | la fascia dello stack (#stack): con Motion On scorre anche con il cursore sopra, con Motion Off sta ferma |
| `cursor.spec.ts` | il cursore personalizzato: con Motion On punto e anello raggiungono il puntatore in due posizioni diverse, con Motion Off spariscono e torna il cursore del sistema. Li trova con `data-testid` (`cursor-dot`, `cursor-ring`), perché le classi dei CSS Modules cambiano nome a ogni build |
| `og.spec.ts` | l'anteprima del link (Open Graph): i meta `og:` e `twitter:card` ci sono e puntano alla demo, e l'immagine esiste davvero, chiesta al server locale e letta dall'intestazione del PNG (1200×630, come dichiarato nei meta). Controlla anche il tipo `image/png`, perché per un file che non c'è Vite risponde 200 con la pagina HTML |
| `hero.spec.ts` | la prima schermata: il titolo intero, diviso nei due pezzi che entrano uno dopo l'altro, su una riga per pezzo a 1440 px e dentro lo schermo a 390 px (un telefono); il titolo a 80 px, il nome e la città in alto ben visibili; la frase sotto il titolo |
| `manifesto.spec.ts` | il Manifesto (#chi-sono), il testo che si accende allo scroll: con l'inizio della sezione a metà schermo le parole sono spente, in fondo tutte accese, con Motion Off accese subito. Lo legge dal colore delle parole |
| `projects.spec.ts` | la vetrina dei progetti: il gestionale documentale non c'è più, la scheda «Primo in vetrina» mostra il progetto che ora è primo, e il sito stesso è in vetrina con il link alla demo |
| `theme.spec.ts` | il tema chiaro e scuro: parte dal tema del sistema (emulato con `colorScheme`), il bottone lo cambia, il fondo della pagina cambia colore davvero, e la scelta resta dopo il ricaricamento anche col sistema in chiaro |
| `xray.spec.ts` | la vista X-ray: con l'interruttore su X-ray ogni pezzo con `data-xray` mostra il contorno tratteggiato e l'etichetta con il suo testo, e ce n'è almeno uno in ogni sezione e nel menu; con On non ci sono; nessun pezzo taglia la propria etichetta con il suo `overflow` (quello dei contenitori non lo guarda); il movimento resta acceso. L'etichetta è un `::after`, quindi si legge con `getComputedStyle(elemento, '::after')` |
| `mobile.spec.ts` | la prima schermata sul telefono: a 360, 390 e 430 px nessuna forma corallo tocca le lettere del titolo (stesso colore, le lettere sparirebbero), contando i 18 px di cui salgono fluttuando; a 390 px il menu non copre il titolo e la pagina non scorre di lato. Trova le forme con `data-shape` e misura le lettere nodo di testo per nodo di testo, dopo la fine delle animazioni di entrata |
