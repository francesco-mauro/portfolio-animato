# tests/

I test end-to-end del sito, scritti con [Playwright](https://playwright.dev). Le animazioni sono CSS, quindi si possono controllare solo in un browser vero: Playwright avvia il sito con Vite (configurazione in `playwright.config.ts` alla radice), lo apre in Chrome e guarda cosa succede davvero sulla pagina.

```bash
npm run test:e2e
```

In locale usa Chrome già installato sul PC; in GitHub Actions usa il Chromium di Playwright.

| File | Cosa controlla |
|---|---|
| `marquee.spec.ts` | la fascia dello stack (#stack): con Motion On scorre anche con il cursore sopra, con Motion Off sta ferma |
