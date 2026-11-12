# Projects/

La griglia dei progetti.

| File | Cosa fa |
|---|---|
| `Projects.tsx` | `ProjectItem` per ogni progetto di `data/projects.ts`: l'anteprima in cima (`<img>` con `width` e `height`, così lo spazio è riservato, e `loading="lazy"`), con sopra il video della demo quando c'è (`PreviewVideo` e `usePreviewVideo`, vedi sotto), poi numero, data, titolo, descrizione, stack, link a GitHub e alla demo quando c'è; a ogni scheda passa `--stagger` (0, 1, 2), il suo posto nella riga quando le colonne sono tre. Tiene `useReveal` come riserva per i browser senza timeline di scroll |
| `Projects.module.css` | griglia a colonne automatiche (minimo 300 px), schede della stessa altezza con i link sempre in fondo, freccia che scatta al passaggio del mouse, il riquadro dell'anteprima che si ingrandisce col mouse sopra la scheda (fermo con Motion Off), il video che copre l'immagine e si vede solo mentre va (`.video`, `data-playing`), e l'entrata delle schede con lo scroll |

Le anteprime sono scatti veri dei progetti: stanno in `src/assets/previews/`, con la provenienza di ognuna nel README di quella cartella. Test: `tests/previews.spec.ts`.

## Il video dell'anteprima

Le tre schede con una demo online (Boolzapp, il Memory, questo sito) hanno sopra l'immagine un `<video>` di 5-7 secondi della demo che si usa. Test: `tests/animated-previews.spec.ts`.

- **Quando parte:** all'entrata del puntatore nella scheda (`onPointerEnter` sul `<li>`), solo se il puntatore è un mouse (`event.pointerType === 'mouse'`), con Motion On o X-ray e se il sistema non chiede meno movimento (`prefers-reduced-motion`). All'uscita si ferma e torna all'inizio; se Motion passa a Off mentre va, si ferma.
- **Perché il controllo del mouse:** con un dito l'uscita arriva subito dopo il tocco, quindi il video si fermerebbe comunque; ma intanto il telefono lo avrebbe scaricato. Sul telefono resta l'immagine.
- **Leggero:** `preload="none"`, il browser non lo scarica finché non parte; muto, in loop e `playsInline` (su iPhone non va a tutto schermo). I tre video pesano circa 250 KB in tutto, nei due formati.
- **Due formati:** prima WebM (VP9), poi MP4 (H.264): il browser prende il primo che sa leggere. Serve anche il WebM perché il Chromium dei test in Actions non legge l'H.264.
- **Si vede solo mentre va:** il video è trasparente finché non arriva l'evento `playing`, poi `data-playing="true"` lo accende con una dissolvenza di 0,3 secondi. Così non compare mai un riquadro nero mentre si carica.
- **Decorativo:** `aria-hidden="true"` e `tabIndex={-1}`, perché cosa si vede lo dice già il testo alternativo dell'immagine.

## L'entrata con lo scroll, solo CSS

Le schede non entrano a tempo: le porta dentro lo scroll, avanti e indietro. Ogni scheda ha una timeline legata a quanto è entrata nello schermo:

```css
@supports (animation-timeline: view()) {
  .grid .item {
    animation: enter linear both;
    animation-timeline: view();
    animation-range: entry calc(var(--stagger, 0) * 15%) entry calc(70% + var(--stagger, 0) * 15%);
  }
}
```

- `animation-timeline: view()`: l'avanzamento dell'animazione è la posizione della scheda nello schermo, non un orologio. Nessun ascolto dello scroll in JavaScript.
- `animation-range: entry …`: l'animazione si svolge mentre la scheda entra dal fondo dello schermo. `entry 0%` è il bordo alto sul fondo dello schermo, `entry 100%` è la scheda entrata tutta.
- `--stagger`: vale 0, 1 o 2 (`index % 3`) e sposta il tratto del 15% per volta. Con tre colonne, sul computer, è il posto nella riga: la seconda e la terza scheda arrivano un poco dopo la prima, e la terza finisce a `entry 100%`. Con due colonne (una finestra stretta, un tablet) o una (il telefono) il numero resta quello: lo sfasamento c'è, ma non segue più la riga.
- `@keyframes enter` scrive solo la partenza (trasparente, 40 px più in basso, un filo più piccola): l'arrivo è la scheda com'è.

Con Motion Off e con `prefers-reduced-motion` le animazioni sono spente da `styles/global.css` e le schede stanno già al loro posto, visibili. Nei browser che non hanno ancora `animation-timeline` il blocco `@supports` non vale: lì resta l'entrata con `useReveal` e la classe `.reveal`.

Test: `tests/projects-scroll.spec.ts`.
