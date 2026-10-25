# Risultati ricevuti — 11 ottobre 2026

Trascrizione delle tre schermate fornite dall’autore. Programma confermato dall’autore: Novabench. Versione non indicata. SilverBench non ha eseguito il benchmark sulla configurazione dell’autore.

## CPU

AMD Turion II Neo N40L, 1,5 GHz, 2 thread, x64. Scheda Multi-thread selezionata.

| Voce | Valore mostrato |
| --- | --- |
| Indicatore sintetico, scala non identificata | 44 |
| SIMD | Skipped |
| Scalar Float | Skipped |
| Scalar Integer | 3 GIOPS |
| Compression | 20 MB/s |
| Cryptography | 786 MH/s |

Skipped significa prova saltata, non risultato zero. Non dedurre il motivo dalla schermata.

## Memoria

8 GB; il programma riporta 399 MHz, CL6, Dual Channel, 1T. Non sostituire la frequenza nominale dei moduli con questo valore senza chiarire la lettura dello strumento.

| Voce | Valore mostrato |
| --- | --- |
| Indicatore sintetico, scala non identificata | 149 |
| Trasferimento single-thread | 1872 MB/s |
| Trasferimento multi-thread | 3024 MB/s |
| Latenza | 65 ns |

## SSD di sistema

Modello CT500MX500SSD1. Il programma mostra la categoria “SATA HDD”, ma il componente identificato è l’SSD Crucial: non trasformarlo in disco meccanico nel testo.

| Voce | Valore mostrato |
| --- | --- |
| Indicatore sintetico, scala non identificata | 54 |
| Scrittura sequenziale | 242 MB/s |
| Lettura sequenziale | 268 MB/s |
| Scrittura casuale | 18 MB/s |
| Lettura casuale | 19 MB/s |

La schermata segnala lettura sotto l’intervallo tipico del confronto del programma. Non attribuire la causa a guasti, controller o SATA senza ulteriori elementi. La scheda Health non è aperta: nessun esito SMART ricavabile. Questi valori riguardano l’SSD, non il mirror dei dischi da 2 TB o la velocità di rete.

## Contesto da raccogliere

- Versione di Novabench.
- Impostazioni, dimensione dei dati e durata delle prove; eventuali attività contemporanee e avvisi.
- Eventuali ripetizioni e risultati successivi, mantenendo distinta ogni esecuzione.

## Stress My GPU (beta) — test CPU ricevuto

- CPU score: 18 calculations/µs.
- Single thread score: 9.00 calculations/µs.
- Total time elapsed: 00:18:20.
- Browser: Firefox 157.0.
- Il sito indica OS Windows 10; configurazione documentata Windows Server 2019 Standard Evaluation. Non inventare spiegazioni del rilevamento.
- Schermata salvata come stress-my-gpu-cpu.png. Non è un risultato JetStream né un test GPU.
- I confronti con altre CPU sono forniti dal sito, non misurati dall’autore; non dedurne prestazioni generali o NAS.
