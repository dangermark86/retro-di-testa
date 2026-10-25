---
title: "HP ProLiant MicroServer N40L nel 2026: può ancora fare da NAS?"
description: "Un HP ProLiant MicroServer N40L usato per i dati di famiglia: la mia esperienza con Windows Server 2019, due dischi in RAID 1 e un ostacolo con il monitor."
category: "test"
date: "2026-10-11"
draft: false
tags: ["NAS", "HP", "N40L", "riuso"]
image: "/immagini/n40l/frontale.webp"
imageAlt: "Il mio HP ProLiant MicroServer N40L, visto di fronte con lo sportello chiuso"
---

## Perché ho comprato un HP ProLiant MicroServer N40L nel 2026

Tutto nasce da una mia esigenza: salvare foto, video e documenti di famiglia in un archivio di rete, con spazio per far crescere la raccolta. Ho comprato questo HP ProLiant MicroServer N40L usato in Germania, su un sito di compravendita, circa tre giorni prima di iniziare questo articolo.

L’ho pagato **70 euro**. Erano compresi RAM, dischi meccanici e persino il cofanetto con il CD di Windows Server 2011. Per me è stato un affarone, ma c’è un dettaglio da precisare: **l’SSD da 500 GB non era incluso. Lo possedevo già e l’ho aggiunto io.** Il prezzo di 70 euro riguarda il server usato, non l’SSD e gli accessori aggiunti.

Qui racconto come l’ho rimesso in funzione, le difficoltà che ho incontrato e come si comporta nell’uso come archivio domestico.

## Un modello con circa quindici anni sulle spalle

L’HP ProLiant MicroServer N40L risale al **2011**: compare già nelle [QuickSpecs HP, versione 14 del 9 settembre 2011](https://jno.su/equipment/hp_proliant_microserver/hp-microserver.pdf), conservate in una copia d’archivio. Nel 2026 sto quindi utilizzando un modello di circa **15 anni fa**.

Questo non mi permette di stabilire l’età precisa del mio esemplare né quante ore abbia lavorato. È però il contesto giusto per valutarne le prestazioni: non posso aspettarmi la reattività di un computer moderno.

## Le condizioni all’arrivo e la pulizia

All’esterno l’ho trovato in ottime condizioni, senza graffi. Dentro, invece, c’era tanta polvere e la pasta termica era diventata dura come il cemento armato.

Ho smontato completamente il case ed estratto tutti gli hard disk. Ho pulito la scheda madre con aria compressa e un pennello a setole morbide. Ho pulito anche l’alimentatore soffiando dall’esterno attraverso la ventola, **senza aprirne l’involucro**.

Poi ho rimosso i dissipatori della CPU e del chipset. Con molta pazienza e alcol isopropilico ho eliminato la vecchia pasta termica e applicato della nuova **MX-4**.

Le fotografie mostrano il mio server smontato e i suoi componenti.

<figure class="article-photo">
  <a href="/immagini/n40l/case-smontato.webp" aria-label="Apri la fotografia del case smontato"><img src="/immagini/n40l/case-smontato.webp" alt="Il case del N40L con dischi e scheda madre rimossi, lettore DVD montato e cablaggi visibili" width="1200" height="1600" loading="lazy" decoding="async" /></a>
  <figcaption>Il mio N40L durante lo smontaggio: ho rimosso dischi e scheda madre; il lettore DVD è ancora montato nella parte superiore.</figcaption>
</figure>

<figure class="article-photo">
  <a href="/immagini/n40l/scheda-madre.webp" aria-label="Apri la fotografia: Scheda madre del N40L estratta sul suo supporto, con dissipatori e due moduli RAM"><img src="/immagini/n40l/scheda-madre.webp" alt="Scheda madre del N40L estratta sul suo supporto, con dissipatori e due moduli RAM" width="1200" height="1600" loading="lazy" decoding="async" /></a>
  <figcaption>La scheda madre del mio N40L estratta dal case, con i dissipatori montati e i due moduli RAM visibili sulla destra.</figcaption>
</figure>

## Dal sistema iniziale a Windows Server 2019

Quando l’ho comprato, sul server era già installato Windows Server 2011. Ho iniziato a provare alcuni programmi, ma mi sono trovato davanti a messaggi che ne impedivano l’utilizzo su quel sistema.

Oltre all’archivio di famiglia, mi era venuta un’altra idea: avere una libreria digitale dei miei DVD da sfogliare sul televisore, senza dover inserire ogni volta il disco nella PlayStation 5. Per questo ho provato **Jellyfin**. Era un utilizzo che volevo aggiungere all’archivio e che ho iniziato a provare sul server.

Sul sistema iniziale con **Windows Server 2011 avevo installato Jellyfin 10.8.13**. Quando provavo a collegarmi dalla TV, **l’app Jellyfin sul Samsung mi segnalava che la versione installata sul server era troppo datata e dovevo aggiornarla**.

Quindi riuscivo a installare quella vecchia versione sul server, ma l’app della TV ne richiedeva una più recente. Il tentativo di installare una versione nuova sul sistema del 2011 non andava a buon fine.

Sono quindi passato a **Ubuntu Server 26.04**. Non conoscendolo bene, mi aspettavo un ambiente grafico; dopo l’installazione mi sono invece trovato a lavorare dal terminale. Ho provato, con l’aiuto di ChatGPT, ad aggiungere un ambiente desktop, ma per la mia esperienza di quel momento la configurazione richiedeva troppi passaggi e comandi.

Con Windows mi sentivo più a mio agio: conoscevo meglio le schermate e trovavo più semplice gestire le impostazioni. Ho quindi deciso di provare **Windows Server 2019**, che è il sistema installato adesso. È stata una scelta legata alle mie abitudini e a come volevo gestire il server.

Adesso **Jellyfin funziona su Windows Server 2019 e riesco a usarlo anche dalla mia TV Samsung GQ75Q7FA del 2025**.

Durante l’utilizzo di Jellyfin dalla TV ho riscontrato alcune interruzioni. Il mio sospetto riguarda il router, ma non ho elementi sufficienti per attribuirgli con certezza il problema.

## La configurazione del mio N40L

Questa è la configurazione che sto usando. I modelli dei componenti provengono dal rapporto delle informazioni di sistema di Windows; nella tabella indico anche come ho organizzato i dischi.

| Componente | Configurazione |
| --- | --- |
| Processore | AMD Turion II Neo N40L, 1,5 GHz, 2 core e 2 processori logici |
| Memoria | 8 GB: 2 moduli identici Samsung M391B5273CH0-CH9 da 4 GB, 2Rx8, PC3-10600E; circa 7,87 GB utilizzabili riportati da Windows |
| Sistema operativo | Windows Server 2019 Standard Evaluation, build 17763 |
| BIOS | HP O41, data riportata 01/10/2013; avvio Legacy |
| Rete | Broadcom NetXtreme Gigabit Ethernet |
| Archivio principale | 2 × Hitachi HDS723020BLA642 da circa 2 TB ciascuno, configurati in RAID 1 software di Windows |
| Disco separato | WDC WD2502ABYS-18B7A0 da circa 250 GB nominali, singolo nel quarto slot |
| Disco del sistema | SSD CT500MX500SSD1 da circa 500 GB |
| Unità ottica | HP Super Multi DVD Rewriter GH60L, SATA; etichetta di produzione luglio 2011 |
| Video rilevato | ATI Mobility Radeon HD 4200 Series; risoluzione rilevata 1920 × 1080 a 60 Hz |

Ho scelto di installare il sistema sull’SSD per migliorare i tempi di avvio e l’apertura dei programmi.

Il WD viene visualizzato da Windows con circa 232,83 GB: la sua capacità nominale è di circa 250 GB. L’SSD occupa un alloggiamento che prima era usato da un altro disco da 250 GB.

La RAM è composta da **due moduli identici Samsung M391B5273CH0-CH9 da 4 GB ciascuno**, per un totale di 8 GB.

<figure class="article-photo">
  <a href="/immagini/n40l/alloggiamenti.webp" aria-label="Apri la fotografia: Il frontale del N40L aperto, con i quattro alloggiamenti dei dischi"><img src="/immagini/n40l/alloggiamenti.webp" alt="Il frontale del N40L aperto, con i quattro alloggiamenti dei dischi" width="1200" height="1600" loading="lazy" decoding="async" /></a>
  <figcaption>Il mio N40L con lo sportello aperto: qui si vedono i quattro alloggiamenti dei dischi.</figcaption>
</figure>

Windows Server 2019 è il sistema che ho installato su questo esemplare; non si tratta di una configurazione certificata da HP nelle specifiche originali del modello.

<figure class="article-photo">
  <a href="/immagini/n40l/ram.webp" aria-label="Apri la fotografia: Etichetta del modulo Samsung da 4 GB, modello M391B5273CH0-CH9"><img src="/immagini/n40l/ram.webp" alt="Etichetta del modulo Samsung da 4 GB, modello M391B5273CH0-CH9" width="1600" height="1200" loading="lazy" decoding="async" /></a>
  <figcaption>Uno dei due moduli identici Samsung M391B5273CH0-CH9 da 4 GB installati nel mio server.</figcaption>
</figure>

## Le specifiche originali del modello

Per distinguere il mio esemplare dalla configurazione prevista all’epoca, il riferimento sono le [QuickSpecs HP del 26 marzo 2012, versione 17](https://community.hpe.com/hpeb/attachments/hpeb/bsc-431/20886/1/QuickSpecs.pdf), pagine 2–4:

- CPU N40L dual-core a 1,5 GHz.
- Due slot RAM e massimo ufficiale di 8 GB DDR3 ECC unbuffered.
- Quattro alloggiamenti per dischi SATA da 3,5 pollici, non hot-plug.
- Controller SATA integrato con RAID 0 e 1, Ethernet Gigabit e uscita VGA.
- Configurazione massima documentata all’epoca di 4 × 2 TB.

La capacità di 4 × 2 TB è quella documentata all’epoca, non un limite assoluto dimostrato per ogni disco successivo.

## Come ho organizzato i dischi

Ho configurato i due dischi da 2 TB in **RAID 1 software da Gestione disco di Windows**, senza usare il RAID del controller. Ho quindi circa 2 TB nominali utilizzabili, non 4 TB, perché i dati sono replicati su entrambi i dischi. Windows mostra un volume da circa 1,82 TB.

Per preparare il RAID ho eliminato le partizioni preesistenti, creato il volume sul primo disco e aggiunto il mirroring sul secondo. **Descrivo quello che ho fatto durante la configurazione iniziale: cancellare le partizioni elimina l’accesso ai dati e non è un passaggio da ripetere sui dischi che contengono già l’archivio.**

Prima avevo anche due dischi da 250 GB in RAID 1. Ne ho rimosso uno per lasciare spazio all’SSD. Quello rimasto occupa il quarto slot ed è separato dalla coppia da 2 TB destinata all’archivio.

<figure class="article-photo">
  <a href="/immagini/n40l/dischi.webp" aria-label="Apri la fotografia: SSD Crucial e tre hard disk estratti nei rispettivi supporti"><img src="/immagini/n40l/dischi.webp" alt="SSD Crucial e tre hard disk estratti nei rispettivi supporti" width="1600" height="1200" loading="lazy" decoding="async" /></a>
  <figcaption>I dischi del mio server, da sinistra: SSD Crucial, due Hitachi da 2 TB e WD da 250 GB.</figcaption>
</figure>

## Archivio e protezione dei dati

Il mio archivio contiene circa **380 GB di foto, video e documenti**. Per ospitarlo ho scelto il mirror dei due dischi da 2 TB.

**Il RAID 1 non sostituisce un backup:** i dati vengono replicati sui due dischi, ma una cancellazione accidentale può interessare entrambe le copie. Una copia indipendente è una protezione diversa dal mirroring.

## Il primo ostacolo: lo schermo VGA

Non avevo né un cavo VGA né uno schermo con ingresso VGA. Ho quindi comprato su Amazon un adattatore **BENFEI da VGA a HDMI, alimentato tramite USB-A**. Lo alimento dalla porta USB del server e uso uno schermo **Samsung da 32 pollici**.

[Questa è la pagina dell’adattatore che ho acquistato](https://www.amazon.de/dp/B07K14NR8P), con codice B07K14NR8P.

Nei primi tentativi l’immagine compariva e scompariva. Non riuscivo a leggere le schermate di avvio e a capire come selezionare il boot dalla chiavetta USB.

Alla fine ho installato Windows Server 2019 **da DVD**. Con il lettore potevo almeno vedere la spia lampeggiare e sentire il disco girare. Erano indizi di attività del lettore, anche se da soli non mi dicevano a che punto fosse l’installazione.

Sul lettore che ho fotografato si legge **HP Super Multi DVD Rewriter GH60L**, con data di produzione **luglio 2011**. È la data del lettore: da sola non stabilisce quando sia stato assemblato il mio server.

<figure class="article-photo">
  <a href="/immagini/n40l/lettore-dvd.webp" aria-label="Apri la fotografia: Etichetta del masterizzatore HP GH60L con data di produzione luglio 2011"><img src="/immagini/n40l/lettore-dvd.webp" alt="Etichetta del masterizzatore HP GH60L con data di produzione luglio 2011" width="1600" height="1200" loading="lazy" decoding="async" /></a>
  <figcaption>Il lettore DVD del mio N40L: modello GH60L e data di produzione luglio 2011, riportati sull’etichetta.</figcaption>
</figure>

<details>
<summary>Un dettaglio dei collegamenti del lettore</summary>

<figure class="article-photo">
  <a href="/immagini/n40l/cablaggi-dvd.webp" aria-label="Apri la fotografia: Cablaggi SATA e alimentazione sul retro del lettore DVD nel case aperto"><img src="/immagini/n40l/cablaggi-dvd.webp" alt="Cablaggi SATA e alimentazione sul retro del lettore DVD nel case aperto" width="1200" height="1600" loading="lazy" decoding="async" /></a>
  <figcaption>I collegamenti del lettore DVD nel mio case aperto: cavo dati SATA e alimentazione.</figcaption>
</figure>

</details>

**Con questo collegamento il problema video si presenta durante l’avvio:** vedo la schermata del test della RAM, poi perdo l’immagine fino all’avvio del sistema operativo. Una volta entrato in Windows riesco a usare lo schermo.

Il sintomo riguarda la fase di avvio; non ho una diagnosi certa della causa.

<figure class="article-photo">
  <a href="/immagini/n40l/retro.webp" aria-label="Apri la fotografia: Il retro del N40L con ventola, alimentazione e connessioni"><img src="/immagini/n40l/retro.webp" alt="Il retro del N40L con ventola, alimentazione e connessioni" width="1200" height="1600" loading="lazy" decoding="async" /></a>
  <figcaption>Il retro del mio server: in basso a sinistra si vede l’uscita VGA che uso con l’adattatore.</figcaption>
</figure>

## Il collegamento alla rete e le copie dal Mac

Ho collegato il N40L via cavo LAN allo switch, che a sua volta è collegato al router. Il mio MacBook è connesso tramite Wi-Fi.

La scheda Gigabit del server limita quel collegamento a un massimo nominale di 1 Gbit/s, anche se lo switch è più veloce. La velocità reale dipende anche dal Wi-Fi, dai dischi e dai file trasferiti.

Dal Finder, attraverso una cartella condivisa, ho trasferito circa **350 GB**. Ho poi riaperto alcuni file dal server per controllarli. La copia e l’apertura dei file sono state il mio riscontro pratico nell’uso dell’archivio.

Nelle copie che ho osservato, via **LAN raggiungo circa 100–110 MB/s**; dal MacBook in **Wi-Fi circa 80–90 MB/s**. Sono velocità riscontrate nella mia rete, non valori garantiti per ogni installazione. Router, generazione del Wi-Fi, qualità del segnale e file trasferiti incidono sul risultato. Per collegare il MacBook via cavo serve un adattatore Ethernet compatibile con la sua porta USB-C.

## Come computer lo trovo lento; come NAS mi interessa molto di più

**Non lo consiglierei come computer da usare tutti i giorni.** Con Windows Server 2019 riesco a lavorare nelle schermate del sistema, ma la risposta ai comandi mi sembra molto lenta. L’SSD non basta a trasformare questa macchina in un PC moderno.

Nella navigazione web sento particolarmente il peso delle pagine ricche di contenuti e grafica. Anche l’esperienza con Linux non mi ha dato la sensazione di una macchina adatta all’uso quotidiano come desktop. Questa è la mia impressione nell’uso quotidiano, non un confronto numerico fra Windows e Ubuntu. Anche guardare YouTube o altre piattaforme video direttamente dal browser del N40L è un utilizzo che non consiglierei sulla mia configurazione. Servire file a un altro dispositivo e riprodurre video sul desktop del server sono due impieghi diversi.

Il Turion II Neo N40L ha **2 core e 2 thread complessivi**, senza thread aggiuntivi per core. Con un modello del 2011 non mi aspetto prestazioni da computer moderno. Già con Windows Server 2011 lo trovavo lento e passando a Server 2019 la sensazione è rimasta simile. Anche il passaggio dal disco meccanico all’SSD, nel mio uso, non ha prodotto un cambiamento radicale.

Una configurazione Linux essenziale, senza ambiente desktop e con pochi servizi, è una possibilità per contenere il carico del sistema. Non significa che qualsiasi distribuzione Linux sia automaticamente più veloce: contano servizi e ambiente installati. Io ho scelto Windows per familiarità; chi dipende da programmi o driver specifici deve tenere conto anche della loro compatibilità.

**Come archivio di rete, invece, per le mie esigenze lo considero un’opzione molto interessante.** Ho già trasferito circa 350 GB dal Mac e riaperto alcuni file dal server. Per questo impiego la mia esperienza è stata più soddisfacente che nell’utilizzo diretto del desktop.

Mi piace poter scegliere il sistema operativo, configurare le condivisioni e installare i programmi che mi servono, nei limiti dell’hardware e della compatibilità. Cerco questa libertà di gestione oltre al semplice spazio per i file. Non significa che ogni NAS dedicato sia più limitato: le possibilità dipendono dal modello e dal software che offre.

Il mio giudizio riguarda questa configurazione e l’uso che ne faccio: archivio familiare e libreria multimediale domestica.

## Le difficoltà con i benchmark

Fare un benchmark su questo **AMD Turion II Neo N40L** si è rivelato meno immediato del previsto. Con i programmi di benchmark che ho provato, all’avvio compariva un avviso relativo all’utilizzo elevato del processore. Il messaggio segnalava che quel carico poteva influenzare il risultato della prova: non si trattava di un errore che indicava un guasto della CPU.

Ho tentato anche la prova con **SilverBench nel browser**, ma sulla mia configurazione non sono riuscito a eseguire il benchmark. Ho raccolto i risultati di **Novabench** e del test CPU di **Stress My GPU**, riportati nelle sezioni seguenti. Gli avvisi incontrati sono un elemento da tenere presente nella loro lettura.

## I risultati con Novabench

Ho eseguito Novabench sulla mia configurazione con Windows Server 2019, 8 GB di RAM e SSD Crucial CT500MX500SSD1. Questi sono i valori riportati nelle schermate della prova.

| Componente | Prova | Risultato |
| --- | --- | --- |
| CPU | Scalar Integer, multi-thread | 3 GIOPS |
| CPU | Compressione | 20 MB/s |
| CPU | Crittografia | 786 MH/s |
| RAM | Trasferimento single-thread | 1872 MB/s |
| RAM | Trasferimento multi-thread | 3024 MB/s |
| RAM | Latenza | 65 ns |
| SSD | Lettura sequenziale | 268 MB/s |
| SSD | Scrittura sequenziale | 242 MB/s |
| SSD | Lettura casuale | 19 MB/s |
| SSD | Scrittura casuale | 18 MB/s |

Sul mio SSD Novabench ha misurato **268 MB/s in lettura sequenziale e 242 MB/s in scrittura sequenziale**. Questi numeri descrivono il disco nella mia configurazione; il solo benchmark non permette di attribuire il limite al chipset.

Nella schermata CPU, le prove **SIMD e Scalar Float risultano saltate** (“Skipped”): non sono punteggi pari a zero. I risultati di archiviazione riguardano **l’SSD di sistema**, non i due dischi da 2 TB in RAID 1 né il trasferimento dei file attraverso la rete.

<details>
<summary>Le schermate della mia prova con Novabench</summary>

<figure class="article-photo">
  <a href="/immagini/n40l/novabench-cpu.png"><img src="/immagini/n40l/novabench-cpu.png" alt="Risultati Novabench: CPU AMD Turion II Neo N40L" loading="lazy" decoding="async" /></a>
  <figcaption>CPU AMD Turion II Neo N40L: i risultati della mia prova con Novabench.</figcaption>
</figure>

<figure class="article-photo">
  <a href="/immagini/n40l/novabench-ram.png"><img src="/immagini/n40l/novabench-ram.png" alt="Risultati Novabench: Memoria RAM da 8 GB" loading="lazy" decoding="async" /></a>
  <figcaption>Memoria RAM da 8 GB: i risultati della mia prova con Novabench.</figcaption>
</figure>

<figure class="article-photo">
  <a href="/immagini/n40l/novabench-ssd.png"><img src="/immagini/n40l/novabench-ssd.png" alt="Risultati Novabench: SSD Crucial CT500MX500SSD1" loading="lazy" decoding="async" /></a>
  <figcaption>SSD Crucial CT500MX500SSD1: i risultati della mia prova con Novabench.</figcaption>
</figure>

</details>

## Il test CPU nel browser con Stress My GPU

Ho eseguito anche il **test CPU di Stress My GPU (beta)** nel browser. Nonostante il nome del sito, la schermata riguarda il processore. Con **Firefox 157.0** ho ottenuto questi risultati:

| Voce | Risultato riportato |
| --- | --- |
| CPU score | 18 calcoli/µs |
| Single thread score | 9,00 calcoli/µs |
| Tempo totale trascorso | 18 minuti e 20 secondi |
| Browser | Firefox 157.0 |

Sono valori di questa prova nel browser: non li confronto direttamente con i punteggi di Novabench, che usa test e scale differenti. Il tempo è quello totale mostrato nella schermata, non una misura della stabilità nel lungo periodo.

Il sito riporta “Windows 10” nel campo del sistema operativo; sul mio server è installato **Windows Server 2019 Standard Evaluation**, come indicato nella configurazione.

<details>
<summary>La schermata del test CPU di Stress My GPU</summary>

<figure class="article-photo">
  <a href="/immagini/n40l/stress-my-gpu-cpu.png"><img src="/immagini/n40l/stress-my-gpu-cpu.png" alt="Stress My GPU: CPU score 18 calcoli per microsecondo, single thread 9, Firefox 157.0 e tempo totale 18 minuti e 20 secondi" width="990" height="736" loading="lazy" decoding="async" /></a>
  <figcaption>Il risultato del mio test CPU nel browser. La tabella sottostante contiene i confronti proposti dal sito, non prove che ho eseguito sugli altri processori.</figcaption>
</figure>

</details>

## RAM e dischi: cosa significano davvero le velocità

I miei due moduli Samsung sono **DDR3 ECC PC3-10600E**, una classe nominale da circa **1.333 MT/s**. Nella schermata di Novabench, però, la memoria lavora a **399 MHz**: essendo DDR, corrisponde a circa **800 MT/s**, con CL6 e dual channel. La velocità indicata sull’etichetta del modulo e quella alla quale viene utilizzato sono quindi due cose diverse. Le velocità effettivamente misurate restano **1.872 MB/s in single thread e 3.024 MB/s in multi thread**, con latenza di **65 ns**.

Per i dischi distinguo tre livelli: collegamento, caratteristiche dell’unità e risultato del test.

| Elemento | Caratteristica o risultato | Cosa significa |
| --- | --- | --- |
| Collegamento SATA dei quattro vani | SATA II, 3 Gb/s; circa 300 MB/s teorici dopo la codifica | È il limite del collegamento, prima degli altri overhead |
| Due Hitachi HDS723020BLA642 da 2 TB | 7.200 giri/min, cache 64 MB, interfaccia del disco SATA 6 Gb/s | Il disco supporta un collegamento più veloce del controller; non significa che trasferisca file a 600 MB/s |
| SSD Crucial MX500 da 500 GB | Lettura sequenziale 268 MB/s; scrittura 242 MB/s | Risultati del mio Novabench, coerenti con un collegamento SATA II |
| SSD, accessi casuali nel test | Lettura 19 MB/s; scrittura 18 MB/s | Un carico diverso dalla copia sequenziale di un file grande |
| Coppia di HDD in RAID 1 | Circa 2 TB nominali utili | Il mirroring non raddoppia automaticamente la velocità e questi risultati dell’SSD non misurano il RAID |

Il controller è documentato nelle [QuickSpecs HP](https://community.hpe.com/hpeb/attachments/hpeb/bsc-431/20886/1/QuickSpecs.pdf), nella sezione delle specifiche tecniche. Le caratteristiche degli Hitachi provengono dalla [scheda tecnica Deskstar 7K3000](https://documents.westerndigital.com/content/dam/doc-library/en_us/assets/public/western-digital/product/hgst/deskstar-7k-series/data-sheet-deskstar-7k3000.pdf). La velocità negoziata dipende anche dalla porta utilizzata: non estendo automaticamente il valore dei quattro vani alla porta destinata al lettore ottico.

L’SSD migliora soprattutto gli accessi ai file rispetto a un disco meccanico, ma non rende giovane il processore. Nel mio utilizzo il cambiamento non è stato radicale: i programmi pesanti continuano a mettere in difficoltà il sistema. Per servire file in rete, invece, contano anche gli HDD, il RAID, il client e il collegamento: **una porta Gigabit ha un massimo teorico di 125 MB/s**, prima degli overhead. I miei trasferimenti via cavo da 100–110 MB/s si avvicinano già a quel limite.

## N36L, N40L e N54L: quale cambia davvero?

| Modello | Processore | Core / thread | Frequenza |
| --- | --- | --- | --- |
| HP ProLiant MicroServer N36L | AMD Athlon II Neo N36L | 2 / 2 | 1,3 GHz |
| HP ProLiant MicroServer N40L | AMD Turion II Neo N40L | 2 / 2 | 1,5 GHz |
| HP ProLiant MicroServer N54L | AMD Turion II Neo N54L | 2 / 2 | 2,2 GHz |

Le specifiche sono riportate nelle [QuickSpecs della prima serie](https://community.hpe.com/hpeb/attachments/hpeb/bsc-431/20886/1/QuickSpecs.pdf) e nella [scheda HPE che comprende il N54L](https://support.hpe.com/hpesc/public/docDisplay?docId=c02503511&docLocale=en_US&page=GUID-560AA969-7049-46FE-8D64-04B1F80FBCB9.html). Sono tutti dual core con due thread totali: non hanno il raddoppio dei thread tramite SMT.

Il N54L ha una frequenza circa **47% superiore** a quella del N40L. È un confronto del clock, non una promessa del 47% di prestazioni in più: software, memoria e carico cambiano il risultato. La piattaforma conserva quattro vani, SATA II e rete Gigabit; scegliere il N54L non raddoppia la velocità delle copie in rete. A parità di condizioni e prezzo preferirei il N54L per il margine sulla CPU, ma per un archivio familiare valuterei prima lo stato dei dischi, il prezzo complessivo e le copie di sicurezza.

## Come si colloca rispetto ai computer dell’epoca?

Un riferimento vicino è il **Dell Inspiron M301z del 2010**, con Turion II Neo **K625 a 1,5 GHz**: stessa frequenza e famiglia del mio processore, ma un modello e una piattaforma differenti. Nella [prova originale di Notebookcheck](https://www.notebookcheck.net/Review-Dell-Inspiron-M301z-Subnotebook.33689.0.html) ottiene **0,86 punti in Cinebench R11.5 CPU multi-core**. Nell’[archivio dei test di quel processore](https://www.notebookcheck.net/AMD-Turion-II-Neo-K625-Notebook-Processor.33675.0.html), i riferimenti nello stesso benchmark sono circa **0,78 per Core 2 Duo SU7300** e **0,24 per Atom N450**. Sono risultati di configurazioni diverse: descrivono una fascia di potenza, non un test del mio N40L.

Anche la grafica appartiene alla fascia integrata di quegli anni. L’[archivio ATI Radeon HD 4200](https://www.notebookcheck.net/ATI-Radeon-HD-4200.20493.0.html) riporta questi riferimenti **3DMark06 Standard a 1.280 × 1.024**:

| Riferimento grafico dell’epoca | Punteggio riportato |
| --- | --- |
| Radeon HD 4200, Sony Vaio con Athlon II P360 | 1.465 |
| GeForce 9400M / ION, riferimento d’archivio | 1.348 |
| Radeon HD 4250, riferimento d’archivio | 1.362 |

Le voci d’archivio derivano da computer e configurazioni differenti, non da una prova delle tre GPU sullo stesso banco. La recensione del Dell con HD 4225 riporta inoltre **2,82 fps in Cinebench R11.5 OpenGL**. Questi risultati danno il contesto della grafica economica dell’epoca; non sono misure della GPU del mio server e non dimostrano la fluidità dei codec video moderni.

Per un benchmark eseguito proprio su un **N40L**, un [risultato pubblico Geekbench 6.3 per Linux](https://browser.geekbench.com/v6/cpu/5722152) riporta **196 punti single-core e 354 multi-core**. È una prova successiva su hardware vecchio, inviata da un altro utente, non una recensione del 2011 né un risultato della mia installazione Windows. **Non confronto questi punteggi numericamente con Novabench o Stress My GPU**, perché ogni programma misura carichi diversi con scale diverse.

La conclusione pratica coincide con la mia esperienza: un piccolo server per archiviare e condividere file conserva un’utilità concreta; come computer principale, per navigazione pesante e video nel browser, sceglierei una macchina più recente.

## Stabilità nell’uso

**Non ho riscontrato crash del sistema durante l’uso descritto.** Ho riavviato il server diverse volte per gli aggiornamenti di Windows. La lentezza del desktop e le interruzioni osservate con Jellyfin dalla TV sono problemi distinti dai blocchi del sistema operativo.

## Il masterizzatore DVD e LightScribe

Il mio esemplare include un masterizzatore DVD **HP GH60L con LightScribe**, il cui logo è visibile sul frontale. Oltre a scrivere CD e DVD, questa tecnologia consente di incidere con il laser testi e immagini sul lato etichetta di supporti predisposti. Servono **dischi LightScribe e software compatibile**: non si tratta di stampare la copertina della custodia o di incidere un normale disco qualsiasi. Il funzionamento è descritto nella [guida HP a LightScribe](https://h10032.www1.hp.com/ctg/Manual/c00307145.pdf).

## Dischi e possibilità di espansione

I quattro alloggiamenti sono pensati per dischi SATA da **3,5 pollici**. Per montare un disco o un SSD da **2,5 pollici** serve un adattatore meccanico compatibile con il cassetto e con la posizione dei connettori: non basta che le misure esterne coincidano. Il prezzo del supporto va aggiunto al costo dell’unità.

Nel mio acquisto erano inclusi due dischi da 2 TB e due da circa 250 GB, organizzati in due coppie in mirror. I due dischi da 2 TB offrono **2 TB nominali utilizzabili in RAID 1**, pur avendo 4 TB di capacità fisica complessiva. Ho poi sostituito uno dei dischi piccoli con l’SSD che possedevo già.

Le specifiche storiche HP riportano quattro dischi da 2 TB. Questo non dimostra un limite universale per unità successive, ma nemmeno garantisce la compatibilità con qualsiasi disco di grande capacità. Il mio articolo documenta la configurazione da 2 TB per disco che sto usando.

## Quanto pesa sulla bolletta

Per un server acceso tutto il giorno conta anche il costo dell’elettricità. **Non ho una misurazione alla presa del mio esemplare**: i valori seguenti sono scenari di calcolo, non consumi rilevati durante le mie prove.

Con funzionamento continuo per 365 giorni e una tariffa di esempio di **0,35 €/kWh**, il costo della sola energia sarebbe:

| Potenza media ipotizzata | Energia in un anno | Costo annuo di esempio |
| --- | --- | --- |
| 30 W | 262,8 kWh | 91,98 € |
| 45 W | 394,2 kWh | 137,97 € |
| 60 W | 525,6 kWh | 183,96 € |

Il calcolo è **watt ÷ 1000 × ore di accensione × prezzo per kWh**. Una spesa di circa 90 euro l’anno corrisponde quindi allo scenario da 30 W con questa tariffa, non a tutta la fascia 30–60 W. Il consumo effettivo dipende dalla configurazione e dal carico: il prezzo basso dell’usato, da solo, non garantisce un costo di esercizio basso.

## A chi lo consiglierei

Lo prenderei in considerazione per chi ha un budget contenuto, vuole un archivio domestico con più dischi e si trova a proprio agio nel configurare un server. **Se capitasse un esemplare a 50–70 euro**, sarebbe una base da valutare: è una fascia di acquisto che considero interessante, non una quotazione garantita del mercato. Dischi inclusi, condizioni e accessori fanno la differenza. Io l’ho pagato 70 euro con i dischi, ma non è detto che ogni offerta sia altrettanto conveniente.

Se invece deve essere il computer principale di casa, dell’ufficio o del lavoro, oppure una macchina per navigare e guardare video direttamente dal browser, sceglierei qualcosa di più performante. Il suo interesse, per me, è usarlo come piccolo server di archiviazione personalizzabile.

## Il mio giudizio

Con 70 euro ho portato a casa un server che sono riuscito a rimettere in funzione con Windows Server 2019. Ho aggiunto l’SSD che possedevo già e configurato i due dischi da 2 TB in RAID 1 per l’archivio. Il collegamento allo schermo HDMI mi ha invece fatto perdere tempo e durante l’avvio l’immagine scompare fino al caricamento di Windows.

Per il mio progetto, i 70 euro spesi hanno avuto senso: ho ottenuto un archivio di rete personalizzabile, con quattro alloggiamenti per i dischi e la libertà di scegliere il sistema operativo. Il N40L mostra la sua età nell’uso come PC, mentre come NAS domestico risponde molto meglio alle mie esigenze. Le difficoltà con il video all’avvio e le interruzioni nell’uso di Jellyfin fanno parte della mia esperienza e pesano sul giudizio, insieme al prezzo e alla flessibilità di questa macchina.

*Fonti tecniche: rapporto delle informazioni di sistema del mio N40L e QuickSpecs HP citate sopra. Il rapporto integrale non è pubblicato. Le fotografie sono mie e mostrano il mio esemplare e i suoi componenti.*
