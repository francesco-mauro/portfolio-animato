# Gli stili presi dal video

Da dove vengono colori, forme e movimenti del sito. La fonte è il video di Jack Roberts "Anthropic Just Shipped Claude Office (Master it in 24 Minutes)", uscito il 4 novembre 2026, guardato il 5 novembre 2026 nei minuti 14:07-16:26 ("Motion Websites" e "Build a Website from a Style"): https://www.youtube.com/watch?v=7kbDosV5qaU&t=847s

I colori sono **stimati a occhio** dagli screenshot dei fotogrammi, non letti dal codice dei siti: sono vicini, non identici. Logo, testi e immagini dei siti del video non sono stati copiati.

## Contenuti
- I siti che si vedono nel video
- Colori
- Forme, font e curve
- Movimenti
- Cosa non è stato preso

## I siti che si vedono nel video

| Minuto | Sito (dall'indirizzo nella barra) | Com'è fatto |
|---|---|---|
| 14:07 | una galleria di stili dentro il suo "Agentic OS" | griglia scura di anteprime (VHS, synthwave, neon): non usata |
| 14:15 | "Kinetic", `claude-motion-sites.vercel.app/v2/kinetic` | fondo bianco, titolo corallo "Unify your motion", forme 3D corallo, schede sparse (Render verde, Ease con bordo blu, Shared rosa), menu a pillola corallo in basso, interruttore Motion · Off · On · X-ray |
| 14:26 | "Kinetic", seconda schermata | tutto corallo con luce chiara in alto, disco che ruota, "One app for all your motion" in basso a sinistra |
| 14:30-14:39 | "Claude Design", `claude-motion-sites.vercel.app/v2/claude-design` | titolo nero condensato, un portatile disegnato in CSS; con X-ray le etichette "Code · Glow ring · conic gradient…", "Code · Laptop · CSS device…" |
| 15:22 | la chat di Claude con l'URL di uno stile di styles.refero.design e il prompt | il punto di partenza del sito dopo |
| 15:46-15:48 | "Ridgeline", `spline-3d-sites.vercel.app/ridgeline` | blu notte, bottone indaco "Start a project", fascia di loghi che scorre, testo grande grigio che si accende allo scroll |

## Colori

Le variabili sono in `src/styles/tokens.css`.

| Variabile | Valore | Da dove |
|---|---|---|
| `--color-bg` | `#fbfaf8` | fondo di "Kinetic", 14:15 |
| `--color-coral` | `#e8553d` | titolo "Unify your motion" e menu a pillola, 14:15 |
| `--color-coral-light` | `#f39a7c` | lato in luce delle forme, 14:15 |
| `--color-coral-deep` | `#c9402b` | lato in ombra delle forme e del disco, 14:15 e 14:26 |
| `--color-card-green` | `#4caf6a` | scheda "Render · 12 s left", 14:15 |
| `--color-card-blue` | `#3d6fe0` | bordo della scheda "Ease · Out back", 14:15 |
| `--color-card-pink` | `#fbe7ef` | scheda "Mia Torres · Shared a scene", 14:15 |
| `--color-night` | `#191b27` | fondo di "Ridgeline", 15:48 |
| `--color-dim` | `#4a4d5e` | testo non ancora acceso di "Ridgeline", 15:48 |
| `--color-indigo` | `#5b5cf0` | bottone "Start a project", 15:46 |

Non presi dai fotogrammi, scelti per la leggibilità del testo: `--color-ink` (#1d1d1f), `--color-ink-soft` (#6b6b70), `--color-night-soft` (#2a2d3d), `--color-light` (#f4f4f6) e la curva `--ease-soft` per le dissolvenze.

## Forme, font e curve

- **La curva delle animazioni** `cubic-bezier(0.34, 1.56, 0.64, 1)` è letta sulla scheda "Ease · Out back" del fotogramma 14:15, che la scrive proprio così. È la variabile `--ease-out-back`: fa superare un po' l'arrivo e tornare indietro, l'effetto "elastico" di quasi ogni entrata.
- **Le forme** (sfera, capsula, ciambella, disco) sono le stesse di "Kinetic". Nel video sono oggetti 3D; qui sono gradienti radiali e ombre CSS (`src/components/Shape/`).
- **Le schede** hanno raggio 18 px e ombra morbida, come quelle di "Kinetic" (`src/components/FloatingCard/`).
- **Il font** è un grottesco con lettere strette (`letter-spacing: -0.045em`), vicino a quello dei titoli di "Kinetic" e "Ridgeline". Non si scarica nessun font: si usa Inter se c'è, altrimenti Segoe UI o il font di sistema.
- **La fascia di loghi** alterna un font dritto e un corsivo con grazie, come "Lumen & Co." e "Quiet Studio" nella fascia di "Ridgeline" a 15:48.

## Movimenti

| Movimento | Nel video | Nel sito |
|---|---|---|
| Cursore che insegue | 14:32, "even this cursor thing following us around" | `src/components/Cursor/`, `src/hooks/useCursorFollower.ts` |
| Forme che galleggiano | 14:15 | `@keyframes float` in `Shape.module.css` |
| Schede sparse che fluttuano | 14:15 | `@keyframes drift` in `FloatingCard.module.css` |
| Vista X-ray con etichette | 14:38-14:39 | `src/styles/xray.css` |
| Interruttore Motion · Off · On · X-ray | 14:15 e 15:48 | `src/components/MotionToggle/` |
| Fascia di loghi che scorre | 15:48 | `src/sections/Marquee/` |
| Testo che si accende allo scroll | 15:48-15:50, "the website illuminates a little bit" | `src/sections/Manifesto/`, `src/hooks/useScrollProgress.ts` |
| Disco che ruota | 14:26 | `@keyframes spin` in `Contact.module.css` |

## Cosa non è stato preso

- **I video generati con Higgsfield** (il paesaggio di "Ridgeline", le immagini nelle schede): nel video costano crediti (il contatore a 14:39 segna "6 Higgsfield assets · 169.5 credits"); qui solo CSS.
- **Testi, loghi e nomi** dei siti del video: il sito parla di Francesco.
- **Il titolo condensato nero di "Claude Design"**: due stili di titolo insieme avrebbero fatto confusione.
