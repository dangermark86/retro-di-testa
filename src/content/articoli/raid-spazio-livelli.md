---
title: "RAID 0, 1, 5, 6 e 10: differenze, spazio e quale scegliere"
description: "Come organizzare dischi della stessa capacità: esempi con due e quattro unità, vantaggi e limiti dei diversi RAID."
category: "guide"
section: "domande"
parent: "hp-microserver-n40l-2026"
date: "2026-10-12"
draft: false
tags: ["Domande e curiosità", "NAS"]
image: "/immagini/nas-raid.png"
imageAlt: "Illustrazione generata con IA: una persona riflette sui RAID 0, 1, 5, 6 e 10 accanto a un NAS bianco"
imageCaption: "Illustrazione creata con IA"
---

Quando organizzo più dischi, la capacità disponibile dipende da come li uso insieme. Due dischi uguali possono sommare lo spazio oppure contenere gli stessi dati. Vale per unità da 1 TB, 2 TB o altre capacità: è il livello RAID a cambiare il risultato.

## Che cosa cambia fra i livelli RAID?

RAID indica diversi modi di organizzare più dischi. Il numero non è una classifica: RAID 6 non è sempre migliore di RAID 1. La scelta dipende da spazio, numero di dischi, prestazioni e guasti che voglio tollerare.

| Livello | Dischi minimi | Spazio nominale, dischi uguali | Guasti tollerati |
| --- | --- | --- | --- |
| RAID 0 | 2 | Somma dei dischi | Nessuno |
| RAID 1, coppia | 2 | Capacità di un disco | 1 disco |
| RAID 5 | 3 | Totale meno un disco | 1 disco |
| RAID 6 | 4 | Totale meno due dischi | 2 dischi |
| RAID 10, coppie in mirror | 4, numero pari | Metà del totale | Almeno 1; più guasti solo se in coppie diverse |

Capacità prima di formattazione e spazio riservato. Con dischi di taglia diversa il calcolo cambia e parte della capacità può restare inutilizzata. Le caratteristiche sono riassunte nella [documentazione Synology sui livelli RAID](https://kb.synology.com/en-global/DSM/tutorial/What_RAID_type_is_best_for_my_storage).

## RAID 0 e RAID 1: spazio oppure mirroring

Nel **RAID 0** i dati sono distribuiti fra i dischi. Due unità da 2 TB danno 4 TB nominali, ma il guasto di una sola può rendere inutilizzabile l’intero volume. Non lo sceglierei come archivio principale dei ricordi familiari.

Nel **RAID 1** ogni disco della coppia contiene gli stessi dati. Due unità da 2 TB danno 2 TB nominali. Con due dischi da 1 TB, invece, il risultato è 1 TB nominale. La regola è la stessa: nella coppia in mirror lo spazio utile corrisponde alla capacità di un solo disco.

## RAID 5 e RAID 6: la parità

La parità è informazione aggiuntiva che permette di ricostruire i dati quando un disco manca; non è una seconda copia completa di ogni file. È distribuita nell’insieme dei dischi.

Con **RAID 5**, quattro dischi da 2 TB offrono 6 TB nominali e tollerano un disco guasto. Con **RAID 6**, gli stessi quattro dischi offrono 4 TB e tollerano due dischi guasti. Durante la ricostruzione il sistema lavora in condizioni diverse dall’uso normale: ridondanza, backup e prestazioni vanno valutati insieme.

## RAID 10: coppie specchiate

Il **RAID 10** combina coppie in mirror e distribuzione dei dati fra le coppie. Quattro dischi da 2 TB offrono 4 TB nominali. Può tollerare due guasti se colpiscono coppie differenti; perdere entrambi i dischi della stessa coppia compromette il volume. Non ha quindi la stessa tolleranza a due guasti qualunque del RAID 6.

## E RAID 2, 3 e 4?

Sono livelli storici con differenti schemi di distribuzione e correzione/parità; non sono le opzioni su cui baserei la scelta di un NAS domestico attuale. Esistono anche RAID 50 e 60, combinazioni per sistemi con più dischi, e soluzioni specifiche di produttori o filesystem.

## Con quattro alloggiamenti, che cosa posso fare?

Quattro slot non obbligano a montare quattro dischi o a riunirli tutti nello stesso volume. Posso usare una coppia in RAID 1 e lasciare liberi gli altri slot, oppure creare due coppie indipendenti. Due mirror separati non sono un RAID 10: sono due archivi distinti.

Se monto quattro dischi della stessa capacità, ecco i risultati nominali:

| Configurazione | 4 dischi da 1 TB | 4 dischi da 2 TB | Tolleranza ai guasti |
| --- | --- | --- | --- |
| RAID 0 | 4 TB | 8 TB | Nessun disco |
| Due RAID 1 indipendenti | 2 volumi da 1 TB | 2 volumi da 2 TB | 1 per coppia; 2 nella stessa coppia fanno perdere quel volume |
| RAID 5 | 3 TB | 6 TB | 1 disco |
| RAID 6 | 2 TB | 4 TB | 2 dischi qualsiasi |
| RAID 10 | 2 TB | 4 TB | 1 garantito; 2 solo se in coppie diverse |

Un unico RAID 1 a quattro copie, se supportato, conserva invece la capacità di un solo disco e può tollerarne tre guasti: non va confuso con due coppie in mirror. Le capacità reali visualizzate saranno inferiori o espresse in unità diverse, per formattazione, spazio riservato e convenzioni TB/TiB.

## Pro e contro, senza una classifica assoluta

- **RAID 0:** massimizza lo spazio e può aumentare le prestazioni con carichi adatti. Non offre ridondanza: un solo guasto compromette il volume. Lo valuterei per dati di lavoro ricreabili, non come unica casa dei ricordi.
- **RAID 1:** semplice per una coppia di dischi, mantiene una copia specchiata e permette di partire con due unità. Usa metà della capacità fisica della coppia; il mirroring non garantisce un raddoppio delle prestazioni.
- **RAID 5:** lascia più spazio di RAID 6 e RAID 10 a parità di quattro dischi. Tollera un solo guasto; calcolo della parità, piccole scritture e ricostruzione possono pesare sulle prestazioni, secondo implementazione e carico.
- **RAID 6:** mantiene il volume disponibile anche con due dischi guasti. Con quattro dischi dedica alla ridondanza l’equivalente di metà della capacità totale; la doppia parità aggiunge lavoro alle scritture.
- **RAID 10:** combina mirroring e distribuzione dei dati, senza calcolo di parità, ed è interessante per carichi con molte scritture. Richiede almeno quattro dischi e usa metà della capacità. Due guasti nella stessa coppia restano fatali per il volume.

La velocità percepita dipende anche da CPU, software, controller, rete e tipo di file: un RAID orientato alle prestazioni non elimina automaticamente il collo di bottiglia di una rete Gigabit.

## Quale sceglierei per un NAS familiare?

**Con due dischi uguali sceglierei RAID 1 e un backup indipendente.** Che siano da 1 o 2 TB cambia lo spazio, non il principio. È una base comprensibile per un archivio di foto, video e documenti.

**Con quattro dischi, se metà della capacità mi basta e voglio tollerare due guasti qualunque, valuterei prima RAID 6.** Se la priorità sono scritture frequenti e prestazioni, considererei RAID 10, accettando la diversa tolleranza ai guasti. RAID 5 è un compromesso per avere più spazio, purché accetti il margine di un solo disco guasto e mantenga un backup adeguato.

Non esiste quindi un RAID migliore per tutti. Scelgo in base a spazio necessario, budget, carico e capacità del sistema di gestire e ripristinare il volume. Prima di decidere verifico i livelli supportati: avere quattro slot non significa che il controller o il software offrano ogni configurazione.

**Nessun RAID è un backup.** Cancellazioni, malware o danni all’intero dispositivo possono colpire tutto l’archivio. Il RAID aiuta nella continuità di servizio durante alcuni guasti; una copia separata e recuperabile protegge da problemi diversi.

## Un microserver da usare come NAS?

Se ti interessa vedere queste scelte in una macchina reale, nella [mia recensione dell’HP ProLiant MicroServer N40L nel 2026](/articoli/hp-microserver-n40l-2026/) racconto l’acquisto a 70 euro, la pulizia, la configurazione dei dischi e i risultati delle prove. Un esempio concreto di come ho costruito il mio archivio domestico.
