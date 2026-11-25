# Ma4 4.4 Andragradsekvationer – film → webb, 25 november 2026

## Bindande metod och källor

- Originalfilm: `230510-230511 Polynomekvationer och polynomdivision 2303 Lek1.mp4` (2023), särskilt tavelsekvenserna omkring 00–07, 10–14 och 20–31 minuter. Filmens **pq-formel** och fullständiga **ansats `z = a + bi`** är huvudmetoderna i den här lektionen.
- Tidigare film om komplexa tal i potensform, Lek2 (2023), visar lösning av komplexa potensekvationer i **polär form**. Den metoden hör till föregående del och får repeteras frivilligt, men ska inte bli huvudmetod i 4.4.
- Senare PDF för 4.4 visar ytterligare jämförelse, felanalys och extraaktivitet. Dessa är **frivilliga** i webben och styr inte metodval eller utcheckning. PDF-kompletteringen för **komplexa tal som vektorer** hör till en separat lektion och ändras inte här.

## Innehållskarta: original till den publicerbara webblektionen

| Originalets idé / metod / aktivitet | Plats i webben | Status 25/11 |
| --- | --- | --- |
| Förstagradsekvation: isolera `z`, förläng med nämnarens konjugat | Bild 2, `teacher-first-degree`, första lösningen | **Bevarat** med samtliga mellanled |
| Ekvation med `z̄`: sätt `z=a+bi`, `z̄=a−bi`, jämför real- och imaginärdel | Bild 2, andra lösningen | **Bevarat** med insättning och kontroll |
| Icke-monik andragradsekvation: dividera alla led före pq-formeln | Bild 2, `teacher-normalize` | **Bevarat**, avrundning av positiv imaginärdel visas |
| pq-formeln med komplex koefficient; `p`, `q`, uttrycket under roten och båda rötterna | Bild 3, `r3` | **Bevarat**, synligt först efter eget försök |
| Full ansats `z=a+bi` för komplex koefficient | Bild 3, `teacher-rectangular-method` | **Bevarat**: utveckla båda termerna, samla reell och imaginär del |
| Faktorisera imaginärdel och undersök **båda fallen** | Bild 3, `teacher-rect-system` och `teacher-rect-cases` | **Bevarat**, inklusive omöjligt fall för reella `a` |
| Villkor om **positiv imaginärdel**, skriv samtliga rötter och kontrollera | Bild 2 normalisering; bild 3 `teacher-rect-roots` | **Bevarat** |
| Samband mellan rötter, summa, produkt och faktorform | Bild 3, `teacher-root-relations` | **Bevarat**, kontroll mot båda rötterna |
| Konjugerade respektive motsatta rötter | Bilder 4 och 11 | **Didaktiskt förtydligat** med skalenliga talplan och egna kontroller |
| Metodval och egen lösning | Bild 9 | **Åtgärdat:** rad C förklaras med **ansatsen** och alla avgörande led, inte polär form som första metod |
| Repetition av de Moivres potensekvationer från tidigare film | Bilder 5–7 | **Omklassat till frivillig repetition**, utanför ordinär nästa/föregående-navigering; går att öppna från bild 4 |
| Jämförelse av de två representationerna på `z²=8i` | Bild 8 | **Frivillig**; inte ett metodkrav |
| Felanalys och fördjupning från senare PDF | Bilder 10 och 13 | **Frivilliga** och märkta som sådana |
| Bokarbete | Bild 12, NOKflex 4401–4420 | **Bevarat** med minst tre av fem nivåer |
| Tre kontrollerbara elevmål och slutkontroll | Bild 1 och 14 | **Åtgärdat:** mål 1 = pq/normalisering; mål 2 = full ansats; mål 3 = rotpar. Slutkontroll A = pq, B = `z=a+bi`, C = rotpar |

## Matematik och didaktisk avgränsning

Huvudflödet innehåller **8 bilder**: 1–4, 9, 11, 12 och 14. Där finns båda filmmetoderna, egen aktivitet, bokarbete och utcheckning. Därutöver finns **6 tydligt frivilliga bilder**: 5–8, 10 och 13. Totalt 14 bilder kvar eftersom den redan gjorda interaktiva repetitionen och felanalysen inte behöver raderas; frivilliga bilder tas inte i normalföljden.

Utcheckning B: `z²=18i` löses genom `z=a+bi` med `a²−b²=0` och `2ab=18`, därefter fallprövningen `b=−a` (omöjligt) och `b=a` (`a=±3`), vilket ger `3+3i` och `−3−3i`. Alla mellanled finns bakom återkopplingsknappen; inga polära argument används i det ordinarie facit. Detta motsvarar filmens metodordning, på andra tal än lärarens ursprungliga exempel.

## Slutkontroll före publicering

- [x] Filmens metodprioritet och original-till-webb-kartan kontrollerade för de tavelsekvenser som tidigare inventerats.
- [x] Matematiska kontrollräkningar av ekvationer och rotpar kontrollerade mot oberoende kvadrering/insättning.
- [x] Ingen ny konkurrerande metod i huvudflöde, metodstöd eller slutkontroll.
- [x] Bokuppgifter och nivåinstruktioner oförändrade.
- [ ] Automatisk Chromium-regression: samtliga interaktioner, återställning, mobil/platta/dator/projektor och MathML. **Fyll i med faktisk CI-körning innan merge.**
- [ ] GitHub Actions och publicerad Pages-version verifierade. **Fyll i efter godkänd publicering.**

Kvarstående gräns: filminventeringen bygger huvudsakligen på tavelsekvenser och bildkontroller; ingen fullständig ljudtranskription för lektionen har tillkommit här. Ändringar avser därför den **påvisade metodkonflikten**, inte påhittade detaljer från ljudet.
