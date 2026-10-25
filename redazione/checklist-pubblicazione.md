# Checklist di pubblicazione — Retro di testa

Stato al 12 ottobre 2026: prima pubblicazione autorizzata ed eseguita su https://retroditesta.com/. Il registro verificato è in pubblicazione.md; i punti sotto rappresentano la checklist storica di preparazione, non tutti uno stato aggiornato.

## Dati da ricevere
- [x] Marco conferma gestione come residente in Germania. Verificare posizione personale/professionale; lingua ed estensione del dominio non determinano da sole la legge applicabile.
- [x] Email pubblica per lettori, correzioni e collaborazioni: retroditesta@gmx.de, confermata e inserita nei Contatti locali.
- [ ] Marco ha successivamente fornito il suo indirizzo per preparare i documenti esclusivamente offline. Dati in redazione/dati-titolare-riservati.md; confermare grafia della strada; email già confermata. Nessuna pubblicazione autorizzata.
- [ ] Scelta indirizzo gratuito pages.dev oppure dominio proprio .com a pagamento; verificarne disponibilità senza acquistarlo.

## Preparazione editoriale
- [ ] Approvare i quattro articoli, attualmente draft:true e quindi esclusi dalla build pubblica; impostare draft:false solo sui contenuti approvati.
- [ ] Verificare fonti, prezzi datati, attribuzioni e misurazioni; mantenere distinti i test propri da quelli esterni.
- [x] Marco dichiara propri i materiali, eccetto lo screenshot del masterizzatore preso da un sito. Copertina LightScribe sostituita con dettaglio della sua fotografia originale del N40L. Lo screenshot è conservato soltanto in redazione/materiali-non-pubblicare e non viene incluso nei file pubblici.
- [ ] Verificare diritti della musica, degli strumenti IA e dei materiali del video secondo i termini applicabili alla creazione.
- [ ] Conservare «Illustrazione creata con IA» sulle copertine generate.
- [ ] Controllare foto e schermate per dati personali non destinati al pubblico.

## Privacy e informazioni legali
- [ ] Redigere informativa GDPR basata sul servizio scelto: titolare, contatti, finalità, basi giuridiche, destinatari, conservazione, diritti, reclami e trasferimenti applicabili.
- [ ] Esaminare rapporto/DPA e configurazione Cloudflare; descrivere correttamente log e trattamento dei dati tecnici.
- [ ] Preparare informativa cookie/archiviazione locale: like salvato sul dispositivo, nessun conteggio condiviso.
- [ ] Thumbnail attuale caricata da i.ytimg.com: comporta richiesta a Google prima dell’avvio del video. Prima del lancio preferire una copia locale autorizzata o definire la gestione privacy del caricamento esterno.
- [ ] Verificare il player youtube-nocookie e preparare consenso informato prima del caricamento ove richiesto: il nome nocookie non elimina tutti i trattamenti. Prevedere revoca/unload quando basato su consenso.
- [ ] Banner generale solo se realmente necessario per servizi non essenziali/tracciamento; non aggiungerlo per decorazione. Controllare le richieste effettive del browser.
- [ ] Se gestito dalla Germania, valutare e predisporre Impressum e responsabile editoriale ai sensi del DDG/MStV; verificare requisiti del caso concreto.
- [x] Eliminato dai Contatti ogni invito a collaborazioni e prodotti da provare. Il progetto attuale è senza monetizzazione.
- [ ] Se in futuro vengono introdotti contenuti sponsorizzati/affiliazioni, distinguerli dalle recensioni editoriali e segnalarli chiaramente.
- [ ] Prima di monetizzare o ricevere prodotti nell’attività, verificare adempimenti fiscali/commerciali nel Paese di gestione. Nessuna soglia universale rende automaticamente esente l’attività.

## Preparazione tecnica locale
- [ ] Completare Contatti e aggiungere link alle informazioni legali nel footer.
- [ ] Escludere /redazione/ dalla build pubblica; noindex non è una protezione di accesso.
- [ ] Impostare URL definitivo in Astro, canonical, sitemap e robots; non indicizzare pagine riservate.
- [ ] Verificare mobile, leggibilità, alt delle immagini, navigazione da tastiera e collegamenti.
- [ ] Verificare thumbnail reale e riproduzione video nel browser con rete disponibile.
- [ ] Verificare che like e condivisione siano descritti secondo il funzionamento reale; i like attuali non sono statistiche globali.
- [ ] Controllare dipendenze e configurazione di sicurezza adatte al sito statico.
- [ ] Eseguire check/build della versione pronta al lancio e controllare che gli articoli approvati compaiano realmente in dist.
- [ ] Conservare sorgenti e backup; repository privato facoltativo per storico e aggiornamenti. Password/token non nei file pubblici.

## Pubblicazione — solo dopo consenso esplicito
- [ ] Presentare anteprima locale definitiva, testi legali e indirizzo previsto a Marco.
- [ ] Ricevere autorizzazione esplicita a mettere online quella versione.
- [ ] Configurare account Cloudflare dell’utente, autenticazione a due fattori e piano gratuito.
- [ ] Scegliere Git integration o caricamento diretto; build npm run build, output dist. Il caricamento di dist o una preview remota può già renderlo accessibile online: attendere il consenso.
- [ ] Pubblicare, verificare HTTPS, pagine, immagini, video e assenza di materiale riservato.
- [ ] Facoltativo dopo il lancio: Google Search Console e invio sitemap; niente garanzia di indicizzazione o crescita.
- [ ] Concordare flusso aggiornamenti: modifiche locali, anteprima e autorizzazione prima di ogni pubblicazione finché non viene concordata una diversa autorizzazione.

## Fonti verificate
- Cloudflare Pages, limiti gratuiti: https://developers.cloudflare.com/pages/platform/limits/
- Domini personalizzati: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Registrazione/rinnovo dominio: https://www.cloudflare.com/products/registrar/
- Cloudflare DPA: https://www.cloudflare.com/cloudflare-customer-dpa/
- GDPR: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679
- Garante, linee guida cookie: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- Germania, §5 DDG: https://www.gesetze-im-internet.de/ddg/__5.html
- IHK Köln, obblighi Impressum/editoriali: https://www.ihk.de/blueprint/servlet/kihk24/hauptnavigation/recht-steuern/impressum-pflichtangaben-auf-websites-5271690
- BMF, attività influencer e prodotti ricevuti: https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Steuerliche_Themengebiete/Social_Media_Akteure/2020-07-30-FAQ-Ich-bin-Influencer.pdf?__blob=publicationFile&v=5

## Aggiornamento delle pagine locali
Impressum, Privacy e Cookie e preferenze predisposti offline. Indirizzo corretto dall’utente: Senner Markt 1. Copertina YouTube locale originale; eliminata richiesta automatica della thumbnail a Google. Player con avviso di consenso e disattivazione; memorizzazione dei like solo dopo spunta facoltativa. Prima del lancio completare e verificare conservazione/log/trasferimenti Cloudflare e rapporto con il provider email. Nessuna attestazione di conformità definitiva finché la configurazione hosting non è stata verificata.

## Verifica prima della pubblicazione della Privacy
La pagina Privacy ora usa il testo destinato al sito online, senza riferimenti all’anteprima o note redazionali. La build locale non attesta che Cloudflare sia già configurato. Prima di ogni primo deploy: verificare che Cloudflare sia il provider effettivo, rapporto/DPA, log e criteri di conservazione, garanzie trasferimenti, eventuali cookie di sicurezza; adeguare il testo se la configurazione differisce. Questa verifica è condizione del lancio, non demandata ai lettori.
