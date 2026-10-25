# Retro di Testa

Proviamo le cose. Scopriamo come funzionano. Risolviamo i problemi.

Prima versione locale di un portale italiano costruito con Astro. Nessuna pubblicazione è stata effettuata.

## Avvio sul Mac

Installa Node.js 22.12 o superiore da https://nodejs.org/ se non è già presente. Apri il Terminale nella cartella `retro-di-testa` ed esegui:

```sh
npm install
npm run dev
```

Apri l’indirizzo mostrato dal Terminale, normalmente http://localhost:4321. Per fermare il sito premi Ctrl+C. Il server ascolta solo sul computer locale.

In questo ambiente il runtime Node fornito da Codex è già stato utilizzato e le dipendenze sono installate. È incluso anche `Avvia Retro di Testa.command`: doppio clic dal Finder per avviare l’anteprima con il runtime disponibile. Se macOS chiede con quale app aprirlo, scegli Terminale.

Il progetto contiene anche `pnpm-lock.yaml`: per riprodurre esattamente le dipendenze verificate, usa pnpm 11.25.0 e `pnpm install --frozen-lockfile`. I comandi `pnpm dev`, `pnpm check`, `pnpm test` e `pnpm build` equivalgono agli script npm.

## Gestire gli articoli, senza abbonamenti

Apri http://localhost:4321/redazione/ mentre l’anteprima è avviata. L’editor locale offre titolo, descrizione, categoria, data, argomenti, immagine, stato bozza e testo. Usa **Scarica articolo .md**, poi copia il file in `src/content/articoli/`. L’anteprima si aggiorna automaticamente.

Per modificare un articolo, usa **Importa un articolo Markdown**, scegli uno dei file forniti o un file generato da questo editor, modifica e scarica. Sostituisci l’originale mantenendo il nome del file per mantenere anche l’indirizzo dell’articolo. Non lasciare entrambe le copie nella cartella.

L’editor non scrive direttamente sul disco, non salva automaticamente e non invia nulla online. Scarica prima di chiudere. Importa il formato di metadati generato dall’editor (valori JSON su singole righe, compatibili YAML); per YAML scritto con altre convenzioni usa un editor di testo.

Per le fotografie: copia il file in `public/immagini/`, indica `/immagini/nome-foto.jpg` e inserisci una descrizione dell’immagine. Le illustrazioni incluse sono SVG originali, non fotografie né documentazione di test.

Sintassi base del testo:

```md
## Titolo di sezione

Un paragrafo con **grassetto**.

- Primo punto
- Secondo punto

[Nome della fonte](https://esempio.it)
```

Puoi anche modificare direttamente i file `.md` con un editor gratuito. Le quattro categorie disponibili sono `guide`, `soluzioni`, `test`, `recensioni`; per aggiungerne altre occorre aggiornare lo schema e la mappa in `src/lib/content.ts`.

## Bozze e contenuti iniziali

- Il N40L è una bozza: `draft: true`. Include un protocollo, una tabella con risultati non disponibili e nessuna misurazione inventata.
- Le bozze appaiono in `npm run dev` con avviso e noindex, ma vengono escluse da pagine, ricerca e homepage della build pubblica.
- Tre guide introduttive forniscono contenuti reali per provare il portale. Non si presentano come prove di prodotti.
- Test e Recensioni mostrano uno stato vuoto quando non esistono articoli pubblicabili. Non sono stati aggiunti giudizi o recensioni fittizi.
- Solo dopo la revisione completa di un contenuto cambia `draft` in `false`. Questo lo rende incluso nella build, ma non lo pubblica online.

## Verifica e versione pubblicabile

```sh
npm run check
npm test
npm run build
npm run preview
```

La cartella `dist/` contiene il sito statico pronto per Cloudflare Pages. `preview` mostra esattamente la versione senza bozze. L’editor non è disponibile nella versione pubblicabile.

La ricerca funziona nel browser su titolo, descrizione, argomenti e testo; ignora maiuscole e accenti. Tutte le parole cercate devono essere presenti. La query è condivisibile nell’URL. Non utilizza API o servizi esterni. Senza JavaScript gli articoli e i collegamenti alle categorie rimangono consultabili.

## Pubblicazione su Cloudflare Pages — solo dopo la tua conferma

Il progetto usa output statico; non richiede database, server, adapter Cloudflare, dominio a pagamento o CMS esterno.

Percorso semplice, senza Git:

1. Esegui `npm run build` e controlla `npm run preview`.
2. Quando decidi di pubblicare, apri Cloudflare e crea un progetto **Pages** tramite **Direct Upload**.
3. Carica la cartella `dist/` (oppure uno ZIP del suo contenuto) e scegli un nome disponibile.
4. Il caricamento finale pubblica il sito su un sottodominio gratuito `pages.dev`. Non è stato eseguito in questa consegna.
5. Per gli aggiornamenti ricrea `dist/` e carica una nuova versione.

Nota: un progetto Direct Upload non può essere convertito in un progetto con integrazione Git; in quel caso va creato un nuovo progetto Pages.

Alternativa con repository: framework **Astro**, comando `npm run build` (oppure `pnpm build`), cartella di output **dist**, directory radice della cartella che contiene `package.json`. Usa Node 22.16 o superiore compatibile. Con l’integrazione Git, i push al ramo configurato possono pubblicare automaticamente: attivala solo quando vuoi quel comportamento.

Il piano gratuito ha limiti e condizioni che possono cambiare. Questa versione non richiede componenti a pagamento; rimani sul piano Free e sul sottodominio incluso. Non è una garanzia su offerte future.

Documentazione ufficiale consultata:
- Astro e Cloudflare Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Caricamento diretto: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Limiti piano Pages: https://developers.cloudflare.com/pages/platform/limits/
- Collezioni di contenuti Astro: https://docs.astro.build/en/guides/content-collections/

## Struttura

- `src/content/articoli/`: articoli Markdown, immagini referenziate tramite percorso.
- `src/content.config.ts`: controllo dei campi obbligatori.
- `src/layouts/`: struttura condivisa.
- `src/pages/`: homepage, archivio, categorie, articoli, metodo, editor locale e 404.
- `src/styles/global.css`: stile responsive senza font o librerie remoti.
- `public/immagini/`: immagini e illustrazioni.
- `public/_headers`: intestazioni per Cloudflare Pages.

Nessun cookie, pubblicità, analytics, form di contatto o collegamento affiliato è stato aggiunto. Non sono state inventate identità, indirizzi o pagine legali del titolare. La configurazione editoriale e i dati del titolare potranno essere completati prima del lancio.

## Identità visiva

Il logo in `public/immagini/logo-retro-di-testa.jpg` è l’immagine del profilo del canale https://www.youtube.com/@RetrodiTesta, indicato dal titolare. È riutilizzato senza modifiche nell’intestazione, nel footer e come favicon. La copia recuperata da YouTube misura 160 × 160 pixel: adatta alle dimensioni attuali; per usi grandi conviene sostituirla con l’originale ad alta risoluzione. Le illustrazioni del laboratorio e del server restano disegni editoriali separati.
