---
title: "Aurora MTM: la cassa centrale stampata in 3D nata per capire finalmente i dialoghi"
description: "Ho progettato Aurora per sostituire il piccolo centrale full range del mio impianto 5.1: due driver da 8 ohm, un tweeter e un cabinet stampato in PETG."
category: "soluzioni"
section: "progetto"
date: "2026-10-18"
draft: false
tags: ["Audio", "Stampa 3D", "Home Theater", "Progetto DIY"]
image: "/immagini/aurora/aurora-finita-frontale.webp"
imageAlt: "Cassa centrale Aurora MTM terminata, vista frontalmente"
imageCaption: "Aurora MTM terminata: due driver laterali, tweeter centrale e cabinet stampato in PETG. Fotografia realizzata da Retro di testa."
---

Il progetto **Aurora MTM** non è nato per costruire una cassa tanto per provare la stampante 3D. È nato perché, nel mio impianto 5.1, non riuscivo ad ascoltare bene la parte più importante di un film: **le voci**.

Il diffusore centrale originale utilizzava un solo altoparlante full range da circa 3 pollici. In teoria avrebbe dovuto riprodurre da solo gran parte dello spettro sonoro. Nella pratica i dialoghi mi sembravano poveri, poco presenti e spesso difficili da seguire. Alzare il volume non risolveva davvero il problema: aumentava tutto, senza restituire alle voci il corpo e la chiarezza che cercavo.

Da questa esigenza è nata Aurora: un centrale più grande, con due altoparlanti laterali dedicati alla gamma bassa e media e un tweeter al centro per le frequenze alte. I due altoparlanti laterali sono da **8 Ω ciascuno** e sono collegati **in parallelo**, ottenendo alla fine un ramo bassi/medi da **4 Ω**.

## Perché il canale centrale è così importante

In un sistema surround il centrale non serve soltanto a “riempire” lo spazio tra la cassa sinistra e quella destra. Nei film porta gran parte dei dialoghi e mantiene le voci ancorate allo schermo.

Se il centrale è limitato, la colonna sonora può essere spettacolare ma le parole rimangono sottili, arretrate o confuse. Nel mio caso il problema era evidente: avevo effetti e musica, ma sentivo che al parlato mancava qualcosa.

Non cercavo bassi profondissimi, compito che può essere affidato al subwoofer. Volevo soprattutto una riproduzione più completa della voce umana: corpo nella gamma medio-bassa, intelligibilità nella gamma media e dettaglio sulle alte frequenze.

## La configurazione MTM

La sigla **MTM** significa *Midwoofer–Tweeter–Midwoofer*. Nel frontale di Aurora il tweeter si trova al centro, affiancato da due driver full range utilizzati come altoparlanti per la gamma bassa e media.

Questa disposizione rende il progetto simmetrico e adatto all’uso orizzontale sotto il televisore. I due driver laterali condividono il lavoro, mentre il crossover separa il segnale e invia le frequenze alte al tweeter.

<figure class="article-photo aurora-photo"><img src="/immagini/aurora/frontale-reale.webp" alt="Pannello frontale di Aurora MTM stampato in PETG, con sedi per i due driver e il tweeter" loading="lazy"/><figcaption>Il pannello frontale realmente stampato. Sono visibili le sedi dei due driver laterali, quella centrale del tweeter e gli inserti filettati. Fotografia realizzata da Retro di testa.</figcaption></figure>

## Il cabinet stampato in PETG

Il corpo è stato progettato per la stampa 3D e realizzato in **PETG**. Non è un semplice contenitore vuoto: due pareti interne suddividono il volume in **tre zone comunicanti**, una dietro ogni elemento del frontale.

Le due zone laterali danno spazio ai driver da 4 pollici. Quella centrale accoglie il tweeter, la basetta del crossover e il cablaggio, tenendo l'elettronica ordinata e separata dal movimento più diretto dei due coni. Il tweeter impiegato è del tipo **a cupola in seta**, scelto per completare la gamma alta con una resa pulita e gradevole, particolarmente utile nelle voci.

Le pareti non chiudono ermeticamente tre volumi indipendenti: lasciano dei passaggi tra le zone. Il percorso interno, però, non è completamente libero e rettilineo. In prossimità della parete posteriore e del vano del connettore presenta una geometria sfalsata, simile a un piccolo labirinto. La sua funzione è ostacolare il passaggio diretto dell'onda posteriore prodotta da un driver verso l'altro, distribuire meglio la pressione interna e attenuare alcune riflessioni prima che raggiungano il cono opposto. Senza misure acustiche non posso quantificarne l'effetto frequenza per frequenza, ma questo è il principio che ha guidato il disegno.

Il frontale è rimovibile. Per evitare di avvitare ripetutamente direttamente nella plastica ho utilizzato inserti filettati in ottone: M4 per unire il pannello al cabinet e M3 per fissare altoparlanti, tweeter e terminale posteriore.

Tra frontale e corpo passa una guarnizione ricavata da filamento **TPU da 1,75 mm**. Il filamento entra in un canale dedicato e viene compresso quando le viti vengono strette. In questo modo il pannello può essere riaperto senza rinunciare alla tenuta.

<figure class="article-photo aurora-photo"><img src="/immagini/aurora/interno-reale.webp" alt="Interno del cabinet Aurora MTM suddiviso in tre zone comunicanti, con guarnizione rossa in TPU" loading="lazy"/><figcaption>L’interno reale del cabinet: le due pareti delimitano le zone dei driver e il vano centrale destinato a tweeter, crossover e cablaggio. Le aperture mantengono comunicanti i tre volumi; la linea rossa è la guarnizione in TPU. Fotografia realizzata da Retro di testa.</figcaption></figure>

### Dal modello CAD al pezzo stampato

Prima della stampa ho disegnato il cabinet in 3D, controllando ingombri, sedi degli altoparlanti, spessori e divisione delle camere. Il video di progettazione permette di vedere la struttura in trasparenza e di capire come il frontale si accoppia al corpo.

<div class="aurora-gallery aurora-gallery-two"><figure><img src="/immagini/aurora/cad-struttura-trasparente.webp" alt="Vista CAD trasparente della struttura interna di Aurora MTM" loading="lazy"/><figcaption>La vista trasparente mostra le due pareti divisorie, i passaggi tra le tre zone e il percorso sfalsato verso il retro.</figcaption></figure><figure><img src="/immagini/aurora/cad-camere-interne.webp" alt="Vista CAD delle tre zone interne comunicanti di Aurora MTM" loading="lazy"/><figcaption>In fondo si distingue la zona in cui viene accolto il connettore posteriore. La geometria interna evita un percorso completamente diretto tra i due driver. Fotogrammi estratti dal video di progettazione di Retro di testa.</figcaption></figure></div>

<div class="aurora-gallery aurora-gallery-three"><figure><img src="/immagini/aurora/terminale-posteriore.webp" alt="Binding post rosso e nero montati sul retro di Aurora" loading="lazy"/><figcaption>I binding post montati nel terminale posteriore.</figcaption></figure><figure><img src="/immagini/aurora/inserto-driver.webp" alt="Inserto filettato in ottone nella sede di un driver" loading="lazy"/><figcaption>Uno degli inserti in ottone inserito nella plastica.</figcaption></figure><figure><img src="/immagini/aurora/camere-interne-verticale.webp" alt="Le tre zone comunicanti del cabinet Aurora prima del montaggio" loading="lazy"/><figcaption>Le tre zone interne prima del montaggio: quelle laterali sono dedicate ai driver; quella centrale ospita tweeter, crossover e cavi.</figcaption></figure></div>

## I componenti utilizzati

| Componente | Funzione nel progetto |
| --- | --- |
| 2 driver AIYIMA full range da 4 pollici, 8 Ω ciascuno | Riproduzione della gamma bassa e media |
| Tweeter a cupola in seta | Riproduzione delle frequenze alte |
| Crossover passivo YLY-2088 a 2 vie | Divide il segnale tra ramo bassi/medi e tweeter |
| Binding post rosso e nero | Collegamento all’amplificatore |
| Cabinet e frontale in PETG | Struttura del diffusore |
| Filamento TPU da 1,75 mm | Guarnizione comprimibile |
| Inserti M3 e M4 | Fissaggi smontabili nella plastica |

I driver AIYIMA sono nati come full range. In Aurora, però, il crossover li utilizza sul ramo **BASS**, mentre il tweeter completa la riproduzione delle alte frequenze. Il crossover dichiarato dal produttore accetta altoparlanti nell’intervallo 4–16 Ω, ma la frequenza e la pendenza reali dipendono anche dall’impedenza dei componenti collegati.

## Il collegamento corretto: 8 Ω più 8 Ω in parallelo

Il segnale proveniente dall’amplificatore entra nei morsetti **IN** del crossover. Da qui vengono creati due percorsi:

1. l’uscita **TREBLE** alimenta il tweeter;
2. l’uscita **BASS** alimenta i due driver laterali collegati in parallelo.

Nel parallelo i due positivi sono collegati insieme al positivo BASS e i due negativi insieme al negativo BASS. Il calcolo del ramo bassi/medi è:

> 1 / R = 1 / 8 + 1 / 8, quindi R = **4 Ω**.

<figure class="article-photo aurora-diagram"><img src="/immagini/aurora/schema-collegamento-corretto.svg" alt="Schema: amplificatore al crossover, tweeter sull’uscita treble e due driver da 8 ohm in parallelo sull’uscita bass" loading="lazy"/><figcaption>Schema corretto della configurazione usata: i due driver da 8 Ω formano un ramo da 4 Ω. Disegno tecnico realizzato da Retro di testa.</figcaption></figure>

Questo non significa che sia corretto sommare il ramo da 4 Ω e il tweeter come semplici resistenze. Il crossover fa lavorare i rami in intervalli di frequenza differenti e l’impedenza degli altoparlanti non rimane costante. Per conoscere il valore minimo reale dell’intero diffusore servirebbe misurare la curva d’impedenza.

Per prudenza considero quindi Aurora un carico che può avvicinarsi ai **4 Ω nella gamma affidata ai due driver**. Prima di collegarla è necessario controllare che il canale centrale dell’amplificatore sia compatibile con questo carico e iniziare la prova a volume basso.

## Polarità e fase: il controllo da non saltare

In una cassa con più altoparlanti basta invertire la polarità di un driver per peggiorare il risultato. I due coni possono muoversi in direzioni opposte e cancellare una parte dell’energia acustica, facendo apparire la voce vuota o priva di corpo.

Ho mantenuto una convenzione semplice:

- cavo rosso per il positivo;
- cavo nero per il negativo;
- positivi dei due driver uniti al BASS positivo;
- negativi dei due driver uniti al BASS negativo;
- tweeter collegato esclusivamente all’uscita TREBLE.

Prima di chiudere il frontale conviene controllare ogni collegamento, fissare i cavi perché non vibrino e verificare che nessun materiale interno tocchi i coni o i terminali.

## Come ho pensato la stampa

Per il corpo ho privilegiato pareti robuste e una struttura rigida. Un riempimento elevatissimo non sostituisce un buon numero di pareti, un frontale solido e una chiusura corretta.

Le impostazioni di partenza del progetto sono:

| Parte | Materiale | Indicazione di stampa |
| --- | --- | --- |
| Cabinet | PETG | Infill gyroid 20–30%, almeno 6 pareti |
| Frontale | PETG | Infill 40–60%, 8–10 pareti |
| Terminale posteriore | PETG | Infill 30–50%, 4–6 pareti |
| Guarnizione | TPU 1,75 mm | Filamento inserito nel canale perimetrale |

Gli inserti vengono scaldati e spinti nella sede mantenendoli perfettamente verticali. Sul PETG è meglio partire con una temperatura moderata e aumentarla soltanto se necessario: un inserto inclinato può rendere difficile il montaggio o danneggiare la parete.

## Il risultato che cercavo

Aurora nasce per risolvere un problema molto concreto: ascoltare i dialoghi senza dover alzare continuamente il volume generale. Il progetto non pretende di sostituire una cassa commerciale misurata in laboratorio. È una soluzione costruita intorno al mio impianto, allo spazio disponibile e ai componenti che avevo scelto.

<div class="aurora-result-grid"><figure><img src="/immagini/aurora/aurora-finita-frontale.webp" alt="Aurora MTM terminata, vista frontale" loading="lazy"/><figcaption>La cassa realmente costruita, vista frontalmente.</figcaption></figure><figure><img src="/immagini/aurora/aurora-finita-prospettiva.webp" alt="Aurora MTM terminata, vista prospettica" loading="lazy"/><figcaption>La profondità del cabinet e l’unione tra corpo e pannello frontale.</figcaption></figure><figure class="aurora-render"><img src="/immagini/aurora/aurora-rendering.webp" alt="Rendering frontale, posteriore e prospettico della cassa Aurora MTM" loading="lazy"/><figcaption>Il rendering preparato durante lo sviluppo, conservato qui per confrontarlo con il risultato reale.</figcaption></figure></div>

La parte più interessante, per me, è il percorso: partire da una voce poco comprensibile, capire quale componente dell’impianto mi limitava e costruire una risposta concreta. Il prossimo passo sarà completare il montaggio, effettuare prove d’ascolto con dialoghi conosciuti e, se possibile, misurare risposta e impedenza. Aggiornerò l’articolo con i risultati reali, compresi eventuali difetti o modifiche necessarie.

## Cosa controllare prima dell’accensione

- L’amplificatore deve poter pilotare un carico vicino a 4 Ω sul canale centrale.
- I due driver da 8 Ω devono essere realmente collegati in parallelo.
- Tutte le polarità devono essere coerenti.
- Il tweeter deve essere collegato all’uscita TREBLE, mai direttamente all’amplificatore senza filtro.
- La guarnizione deve seguire tutto il perimetro senza interruzioni.
- Le viti vanno strette gradualmente e in modo uniforme.
- La prima prova deve essere fatta a volume basso.

Aurora è ancora un progetto in evoluzione. Voglio raccontarla mentre prende forma, aggiungendo le fotografie del montaggio, le prove d’ascolto e le eventuali modifiche che nasceranno dall’uso reale.

<aside class="aurora-sources"><strong>Riferimenti tecnici consultati</strong><ul><li><a href="https://www.roboter-bausatz.de/p/aiyima-4-zoll-hifi-lautsprecher-8-ohm-50w-full-range-audio-speaker" target="_blank" rel="noreferrer">Scheda del driver AIYIMA da 4 pollici e 8 Ω</a></li><li><a href="https://ae-pic-a1.aliexpress-media.com/kf/S053f951b38b74b0aaad2447d95299ba5m.pdf" target="_blank" rel="noreferrer">Specifiche del crossover YLY-2088</a></li></ul></aside>
