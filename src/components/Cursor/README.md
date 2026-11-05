# Cursor/

Il cursore personalizzato. Non compare sugli schermi touch né in modalità Off.

| File | Cosa fa |
|---|---|
| `Cursor.tsx` | due `div`: il punto segue il mouse quasi subito (ease 0.6), l'anello in ritardo (ease 0.14), tutti e due con `useCursorFollower` |
| `Cursor.module.css` | posizione con `transform` dalle variabili `--x` e `--y`; punto e anello bianchi con `mix-blend-mode: difference`, quindi sempre in contrasto con quello che hanno sotto; sopra un link o un bottone l'anello si allarga (selettore `body:has(a:hover, button:hover)`) |
