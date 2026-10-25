# Pannello Staff: prototipo privato offline

Il file staff.html è una dimostrazione locale, non un sistema di autenticazione per la produzione. Contiene esplicitamente dati simulati. Non pubblicarlo né copiarlo in public/ o dist/.

Accesso di prova: il profilo unico di Marco Sala come Proprietario del sito è già predisposto fuori dalla schermata di accesso. Nessun visitatore può registrarsi o diventare Proprietario. Per l’anteprima locale esiste una password temporanea da cambiare al primo accesso. La sezione Gestisci ruoli permette al Proprietario di creare account Amministratore e Moderatore, assegnare credenziali temporanee, reimpostare la password e disattivare o riattivare gli account. Ogni password è conservata in localStorage come derivazione PBKDF2, non in chiaro. La sicurezza effettiva resta quella di una simulazione client-side.

Permessi dell’anteprima: il Proprietario vede tutte le sezioni dopo un solo accesso. L’Amministratore vede panoramica, rendimento dei contenuti, commenti, commenti cancellati e il proprio account. Il Moderatore vede soltanto commenti e commenti cancellati. Solo il Proprietario può creare, modificare, disattivare, riattivare o cancellare account e assegnare nuove password. Le azioni sensibili richiedono conferma Sì/No.

Il recupero password mostrato nell’anteprima segue il flusso definitivo: l’utente inserisce nome utente o email e invia una richiesta collegata al proprio account. L’anteprima offline non invia realmente email. La versione online richiederà una funzione lato server, token monouso con scadenza e un servizio di posta. I codici condivisi di moderazione sono stati eliminati: ogni collaboratore ha un account personale con ruolo Amministratore o Moderatore. Una password già salvata non può essere visualizzata; il Proprietario può soltanto sostituirla con una nuova password.

Contiene visite giornaliere/mensili di esempio, classifiche dei contenuti, ripartizione per Paese (nessuna città o IP), commenti pubblicati automaticamente e cancellazione recuperabile. Non gestisce articoli, file, pubblicazioni o impostazioni del sito.

La copia per l’utente è output/anteprima-offline/staff.html nella cartella del progetto padre. I collegamenti Staff sono aggiunti solo alle pagine della copia offline.

Per una futura versione online: autenticazione sul server, ruoli a privilegi minimi e verifica aggiuntiva dell’account quando necessaria. Nessuna credenziale dell’area Staff può accedere a Cloudflare, al codice, ai file o alle funzioni di pubblicazione. Applicare autorizzazione su ogni operazione, registrare azioni di moderazione, prevedere sessioni a scadenza e protezione da CSRF/spam. Le statistiche devono riportare il metodo di deduplicazione e distinguere pagine viste, visite e visitatori stimati; non equiparare gli IP alle persone. Aggiornare l’informativa in base al sistema effettivamente adottato.

Non attivare servizi né pubblicare senza autorizzazione dell’utente.

## Regola di moderazione aggiornata

Tutti i nuovi commenti vengono pubblicati immediatamente. Nessuna coda di approvazione. Proprietario, Amministratori e Moderatori possono cancellarli dal pannello Staff; il ripristino riporta il commento allo stato pubblicato. I commenti migliori possono ricevere il badge “♥ Retro di testa”. Le statistiche dei contenuti distinguono visualizzazioni, visitatori stimati e percentuale media letta.
