/**
 * ReadingBar.tsx
 * La barra di lettura: una riga sottile fissa in cima allo schermo che si riempie da
 * sinistra a destra man mano che la pagina scorre, e dice a colpo d'occhio quanto manca
 * alla fine. Qui non c'è logica: è un elemento vuoto, il riempimento lo fa il CSS con una
 * timeline legata allo scroll (ReadingBar.module.css). È un segno solo visivo, quindi è
 * nascosta agli screen reader.
 * Test: tests/reading-bar.spec.ts, che la trova con data-testid perché le classi dei
 * CSS Modules cambiano nome a ogni build.
 */
import styles from './ReadingBar.module.css'

export function ReadingBar() {
  return <div className={styles.bar} data-testid="reading-bar" aria-hidden="true" />
}
