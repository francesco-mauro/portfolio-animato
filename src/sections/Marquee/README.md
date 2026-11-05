# Marquee/

La fascia con le tecnologie, sul modello dei loghi di "Ridgeline" (15:48).

| File | Cosa fa |
|---|---|
| `Marquee.tsx` | ripete l'elenco di `data/stack.ts` due volte (la seconda nascosta agli screen reader) |
| `Marquee.module.css` | la traccia si sposta di metà della sua larghezza all'infinito, così il giro si chiude senza salto; bordi sfumati con `mask-image`; continua a scorrere anche col mouse sopra (la ferma solo Motion Off); una voce su tre in corsivo con grazie |
