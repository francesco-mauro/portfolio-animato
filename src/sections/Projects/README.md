# Projects/

La griglia dei progetti.

| File | Cosa fa |
|---|---|
| `Projects.tsx` | `ProjectItem` per ogni progetto di `data/projects.ts`: numero, data, titolo, descrizione, stack, link a GitHub e alla demo quando c'è; ogni scheda entra con `useReveal`, 90 ms dopo la precedente |
| `Projects.module.css` | griglia a colonne automatiche (minimo 300 px), schede della stessa altezza con i link sempre in fondo, freccia che scatta al passaggio del mouse |
