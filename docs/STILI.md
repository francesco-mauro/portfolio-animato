# La guida agli stili

Colori, font, forme, curve e movimenti del sito, ognuno con il file del codice dove sta. Le variabili sono in `src/styles/tokens.css`: cambiare un valore lì lo cambia in tutto il sito. Sotto `[data-theme='dark']`, nello stesso file, ci sono i colori del tema scuro.

## Contenuti
- Colori
- Forme, font e curve
- Movimenti

## Colori

| Variabile | Valore | Dove si usa |
|---|---|---|
| `--color-bg` | `#fbfaf8` | il fondo della pagina |
| `--color-ink` | `#1d1d1f` | il testo |
| `--color-ink-soft` | `#6b6b70` | il testo secondario della prima schermata |
| `--color-coral` | `#e8553d` | il titolo, le forme e il fondo dei Contatti |
| `--color-coral-light` | `#f39a7c` | il lato in luce delle forme |
| `--color-coral-deep` | `#c9402b` | il lato in ombra delle forme e del disco, e il fondo sotto il testo bianco piccolo (menu a pillola, pillola della città, bottone attivo di Motion, schede di tono corallo): il bianco sul corallo del titolo ha un contrasto di 3,62 a 1, sotto il 4,5 a 1 di WCAG AA; qui è 4,94 a 1 |
| `--color-card-green` | `#4caf6a` | la scheda verde della prima schermata |
| `--color-card-blue` | `#3d6fe0` | il bordo della scheda bianca con la curva |
| `--color-card-pink` | `#fbe7ef` | la scheda rosa |
| `--color-night` | `#191b27` | il blu notte della fascia e del Manifesto, il pannello delle preferenze, le etichette della vista X-ray |
| `--color-night-soft` | `#2a2d3d` | un blu notte più chiaro, per ora non usato fuori da `tokens.css` |
| `--color-dim` | `#4a4d5e` | le parole del Manifesto non ancora accese |
| `--color-light` | `#f4f4f6` | il testo chiaro sul blu notte |
| `--color-indigo` | `#5b5cf0` | la barra di lettura in cima e il contorno della vista X-ray |

## Forme, font e curve

- **La curva delle animazioni** `cubic-bezier(0.34, 1.56, 0.64, 1)` è la variabile `--ease-out-back`: fa superare un po' l'arrivo e tornare indietro, l'effetto "elastico" di quasi ogni entrata. Per le dissolvenze c'è `--ease-soft`, più morbida.
- **Le forme** (sfera, capsula, ciambella, disco) sono gradienti radiali e ombre CSS, senza immagini né 3D vero (`src/components/Shape/`).
- **Le schede** hanno raggio 18 px e ombra morbida (`src/components/FloatingCard/`).
- **Il font** è un grottesco con lettere strette (`letter-spacing: -0.045em`). Non si scarica nessun font: si usa Inter se c'è, altrimenti Segoe UI o il font di sistema.
- **La fascia delle tecnologie** alterna un font dritto e un corsivo con grazie (`src/sections/Marquee/`).

## Movimenti

| Movimento | Dove sta |
|---|---|
| Cursore che insegue, a colori invertiti (`mix-blend-mode: difference`) | `src/components/Cursor/`, `src/hooks/useCursorFollower.ts` |
| Forme che galleggiano | `@keyframes float` in `Shape.module.css` |
| Schede sparse che fluttuano | `@keyframes drift` in `FloatingCard.module.css` |
| Schede che si inclinano verso il mouse | `src/hooks/usePointerTilt.ts` |
| Vista X-ray con etichette | `src/styles/xray.css` |
| Interruttore Motion · Off · On · X-ray | `src/components/MotionToggle/` |
| Fascia delle tecnologie che scorre | `src/sections/Marquee/` |
| Testo che si accende allo scroll | `src/sections/Manifesto/`, `src/hooks/useScrollProgress.ts` |
| Disco che ruota | `@keyframes spin` in `Contact.module.css` |
