/**
 * notFound.ts
 * I testi della pagina 404 (src/pages/NotFound/), in italiano e in inglese.
 * Stanno in un file loro e non in ui.ts perché tests/language.spec.ts cerca ogni testo
 * di ui.ts sulla prima pagina, e questi si vedono solo sulla 404. data.test.ts li
 * controlla come gli altri: ci sono tutte e due le lingue e cambiano da una all'altra.
 */
import type { Localized } from '../types/content.ts'

const text = (it: string, en: string): Localized => ({ it, en })

export const notFound = {
  /** La pillola sopra il titolo. */
  label: text('Errore 404', 'Error 404'),
  title: text('Questa pagina non c’è.', 'This page isn’t here.'),
  text: text(
    'Forse l’indirizzo è scritto male, o la pagina è stata spostata. Il resto del sito è qui.',
    'Maybe the address has a typo, or the page has moved. The rest of the site is right here.',
  ),
  /** Il bottone che riporta alla prima pagina. */
  home: text('Torna al sito', 'Back to the site'),
}
