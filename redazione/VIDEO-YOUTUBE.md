# Collegare un video a un articolo

Nel blocco iniziale dell’articolo aggiungere:

```yaml
youtube:
  id: "M1wmJ-kEkdk"
  title: "Titolo del video collegato all’articolo"
```

L’ID è il valore dopo `v=` nel link YouTube. L’esempio è la sigla del canale: usare invece il video pertinente al singolo articolo. Il riquadro appare solo quando questo campo è presente. Non sono stati aggiunti video non pertinenti agli articoli esistenti.

Il player si carica solo dopo il clic del visitatore e usa youtube-nocookie.com. Il collegamento alternativo apre YouTube. Prima di pubblicare, la descrizione privacy deve riflettere anche questo servizio esterno.

Pagina del canale: src/pages/youtube.astro. Presentazione in homepage: src/pages/index.astro. I video sono selezionati manualmente, senza API, abbonamenti o sincronizzazione automatica.
