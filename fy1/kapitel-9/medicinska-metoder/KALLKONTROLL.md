# Källkontroll – 9.9 Medicinska metoder

**Status 24 november: Samtliga bokuppgifter, originalmoment, ny bokstyrd bild om strålbehandling och interaktiva modeller slutgranskade. Klar för publicering.**

## Faktiskt kontrollerade källor
- 231009 Medicinska metoder Na22.pdf och 231009 Medicinska metoder Fy1 2208.txt.
- Planering 01. åk2 Na25 Planering Fy1.pdf: avsnitt 9.9 s. 376–381, uppgifter 988–998.
- Fem äldre Blausen-videolänkar i original-PDF: röntgen, datortomografi, magnetresonans, PET/CT, gammakamera/skintigrafi. Tidigare uppgift från läraren: länkarna är otillförlitliga/kan kräva betalning. Interaktiva illustrationer fungerar därför utan länkarna.
- För moderna begreppsavgränsningar kontrollerad extern medicinsk information, t.ex. 1177:s beskrivningar av röntgen, CT, MR och PET. Extern information är en **saklig kontroll**, inte ny valfri lektionsmetod.
- Direkt återfunna bokfoton: `IMG_6550.jpg`–`IMG_6555.jpg` (s. 376–381). Alla elva uppgifter 988–998, inklusive deluppgifter, har kontrollerats. Användaren har dessutom bifogat läsbara foton på s. 376–380 i detta arbetssteg.

## Original → elevwebb
| Originalidé / representation / aktivitet | Bild | Bedömning |
|---|---|---|
| Inledande röntgenbild av hand: vad ser vi? | 1 | Bevarat som startfråga |
| Röntgen: elektroner accelererar mot anod, bromsning ger fotoner | 3 | Bevarat med egen vektorprincipfigur |
| Röntgen ger vanlig 2D-projektion, olika vävnad dämpar olika | 3 | Bevarat och förtydligat |
| CT/DT: många projektioner från olika vinklar blir snitt och 3D | 4 | Bevarat, illustrerat med roterande käll-/detektorring |
| "Magnetröntgen" i äldre talspråk = magnetkamera MR med magnetfält och radiovågor, ej röntgenfotoner | 5 | Bevarat med terminologisk precisering |
| PET = positronemissionstomografi; positron+elektron → två nästan motsatta gammafotoner | 6 | Bevarat, rättat osäker transkription och illustrerat |
| Gammakamera med radioaktiv spårsubstans och gammafotoner; kollimator | 7 | Bevarat och tydligt åtskilt från PET |
| De fem ursprungliga videometoderna | 9 | Var sin interaktiv elevstyrd trestegsvisualisering i en sammanhängande modell |
| Mindmap, därefter grupparbete med gamla 1173–1184 | 9–10 | Originalets gemensamma mindmap på bild 9 före de interaktiva jämförelserna; ny bok 988–998 obligatorisk och individuellt målkopplad |
| Strålkniv, elektron-/protonbehandling, dos i Gy/Sv | 8 | Nödvändig bokförstärkning för uppgift 992, 996, 997 från s. 379–380; alla strålslag presenteras med egen korrekt schematisk djupdosprofil och val → feedback |
| Nästa lektion Andra chansen, gemensam avslutning | 11 | Bevarat som kort slutkontroll och planeringspåminnelse |

## Interaktiv didaktik
- Fem knappar: Röntgen / CT / MR / PET / Gammakamera.
- Varje metod kräver **val före första återkopplingen**.
- Varje val får en egen fysikalisk förklaring; tre följande steg bygger visuellt upp signalens väg till bild.
- Inga personuppgifter, ingen inloggning, inga patientbilder eller falska dosvärden, ingen ny Socrative.
- Ingen separat lärarnotis/lärarstöd i elevgränssnittet.

## Bokuppgift → mål → teorisida (verifierat mot s. 381)

| Mål | Uppgifter (stöd i teorin) |
|---|---|
| 1 Röntgen, CT och MR | 989 (376), 993 (376, repetera 9.6) |
| 2 PET och gammakamera | 988 (378), 990 (378–379), 991 (378–379), 994 (378, repetera 9.5), 995 (378–379), 998 (378) |
| 3 Strålbehandling och dos | 992 (379, repetera 9.7), 996 (380, repetera 9.7), 997 (379, repetera 9.7) |

## Publiceringskontroll

1. **Klart:** Granskat teori s. 376–380 och bokens 11 uppgifter s. 381 och kopplat var och en till mål, teorisida och relevant repetition.
2. **Klart:** Identifierat bokens strålbehandlingsdel (s. 379–380), som tidigare saknades i webbutkastet; tillagd som egen nödvändig bild utan att ersätta originalets fem metoder.
3. **Klart:** Ny webbläsarkörning 390/768/1280/1920 px inklusive behandlingsbilden, alla 15 alternativ i fem bilddiagnostiska modeller och full respons i iframe.
4. **Klart:** Visuell fysikgranskning, responsiv layoutkontroll och jämförelse med PDF/transkription inför publicering.

## Visuell originalgranskning och ny layoutkontroll (24 november 2026)

- Originalvideo: representativa bildrutor från filmen om medicinska metoder har granskats mot PDF/transkript: sekund 30, 100, 180, 260, 340, 420 och 500. Videon i sin helhet är inte omgranskad bildruta för bildruta. 
- Första gröna webbläsarkörningen på granskningsgrenen gav skärmbilder i 390/768/1280/1920 px, men **visuell granskning hittade dolda delar av återkopplingen i iframe**. På mobil var även gammakamerans slutdiagram delvis utanför iframe.
- Koden har nu fått en höjdrapporterande iframe-lösning som låter rutan växa efter elevval/feedback. Fusionens massdefekt har delats upp i flera **sammanhängande, fullt synliga matematiska led på samma bild**, med korrekta enheter. Ingen fysikalisk metod eller begreppsordning har bytts ut.
- Förnyat GitHub-test kräver nu fullt synliga matematiska uttryck, ingen dold iframe-återkoppling och samtliga 15 alternativ i de fem medicinska demonstrationerna.
- **Tidigare bokspärr borttagen:** s. 381 återfanns i `source_book/Fy N1b 2627/IMG_6555.jpg`; samtliga elva uppgifter har verifierats.

## Slutlig signoff – 24 november 2026

- Godkänd GitHub Actions-körning **45406307830** för commit `469145c2ddbbd0a3bdbfa1033b43125fdfd7d5f2`: elva bilder i 390/768/1280/1920 px, inga horisontella sidöverflöden, fem bildmetoder gånger tre svarsalternativ, återkoppling efter val samt hela iframens innehåll synligt även när sista steget visas.
- Nedladdade webbläsarskärmbilder granskade visuellt på mobil och projektor. Strålbehandlingens tre doskurvor, formler, frågor och knappar är tydliga; gammakamerans sista schematiska diagram och dess feedback är inte längre avklippta.
- Originalets fem metoder och gemensamma mindmap finns kvar; tillägget om strålkniv, elektroner och protoner följer bokens s. 379–380. Alla uppgifter **988–998** är individuellt kopplade till rätt elevmål och teorisida. Ingen ouppklarad central metodavvikelse finns.
