# src/assets/

Le immagini che passano da Vite: si importano dal codice (`import foto from '…/foto.webp'`), finiscono in `dist/assets/` con un nome che cambia quando cambia il file, e un'immagine che manca ferma la build. È la differenza con `public/`, dove i file sono serviti così come sono.

| Cartella | Cosa contiene |
|---|---|
| `previews/` | le anteprime delle schede dei progetti, una per progetto, con la provenienza di ognuna |
