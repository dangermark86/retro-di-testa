# Copie del progetto

Destinazione concordata: `/Volumes/SALASERVER/SITO INTERNET` (cartella indicata dal titolare sul server 192.168.2.167).

Ogni completamento di `npm run build` crea automaticamente uno ZIP con data e ora, prima sul Mac in `../output/backups`, poi sul server. Vengono conservate tutte le versioni; nessuna copia precedente viene cancellata automaticamente. La verifica confronta l'impronta SHA-256 della copia locale e della copia sul server. Se il server è scollegato o la scrittura non è consentita, viene mostrato un errore e la copia locale rimane disponibile. Non procedere alla pubblicazione senza verificare il backup.

Per salvare anche senza costruire il sito: doppio clic su `Salva-backup.command`, oppure `npm run backup`. La condivisione SALASERVER deve essere collegata nel Finder. Le modifiche salvate senza questi passaggi non vengono copiate automaticamente; non è attivo un servizio che sorveglia ogni salvataggio.

Gli ZIP includono articoli, immagini, codice, configurazione, file delle dipendenze, documentazione e materiale redazionale privato. Non caricare questi archivi sul sito pubblico. Le dipendenze installate, la cache e `dist` sono escluse perché ricostruibili. Gli account Cloudflare, PayPal e le email non sono salvati da questo backup.

Per recuperare: estrarre uno ZIP in una nuova cartella, installare le dipendenze seguendo il README e avviare l'anteprima. Verificare periodicamente un ripristino. Il solo controllo dello ZIP non equivale a una prova completa di ripristino.

RAID 1 non sostituisce un backup: replica anche cancellazioni ed errori. Conservare periodicamente una versione sul disco esterno, scollegato dopo la copia. Le copie sullo stesso server non proteggono dal guasto dell'intero server, dal furto o da un attacco che raggiunge anche la cartella dei backup.
