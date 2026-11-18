# scripts/

Gli script Node che non fanno parte del sito e non sono test di Vitest o Playwright.

| File | Cosa fa |
|---|---|
| `lighthouse.mjs` | il controllo delle prestazioni: serve `dist/` sotto `/portfolio-animato/`, come GitHub Pages, la misura con Lighthouse da telefono 5 volte e confronta la mediana del punteggio Performance con la soglia (95). Sotto la soglia esce con 1, e in GitHub Actions ferma la pubblicazione. Usa Google Chrome, non il Chromium di Playwright: il perché e le opzioni (`--giri`, `--soglia`, `--dist`, `CHROME_PATH`) stanno nel commento in testa al file |

```bash
npm run build
npm run test:lighthouse
```
