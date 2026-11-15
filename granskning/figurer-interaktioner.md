# Figur- och interaktionsgranskning – 41 webblektioner

> **Aktuell figurgranskning: användarvald andra lektion, Ma4 – Polynomdivision (#23 i den fasta 41-listan).**  
> **Färdiggranskade enligt nya figurkraven:** **Fy2 Ström ger magnetfält (#1)** – användaren har uttryckligen godkänt figurernas kvalitetsnivå. Matematiksteg i Fy2 som användaren fann märkliga har uttryckligen lämnats för senare arbete, inte påståtts rättade.  
> **Granskade lektionsnummer:** #1 och pågående #23. Det finns **39 ännu ej figurgranskade lektionsposter**, och inga mellanliggande lektioner markeras som färdiga.  
> **Lektionsstatus:** **Polynomdivision – färdig kod och visuell QA på arbetsgren; publicering återstår.**  
> **Genomfört:** Alla 11 originalbilder och 7 divisionsuppställningar bevarade; aktuella gradkolumner och metodsteg görs synliga och följer beräkningen; extra figurer placerade intill relevant MathML på bilderna 5, 6 och 8. **75 riktade Chromiumkontroller PASS, 14 riktade skärmbilder; hela Ma4-QA PASS** på kodcommit `f4869ae8c19a087fcbaa614b5e9f33db40590134`, [Actions 43754870975](https://github.com/jacobflinder/Lektioner/actions/runs/43754870975).  
> **Visuell bedömning:** Skärmbilder av huvuduppställningen, elimineringen, koefficientkontrollen, teckenfelet, nollkolumnen och 390 px mobil samt projektor har inspekterats; mobilens metodfaser visas i 2×2 i stället för oläslig 1×4-rad.  
> **Återstår:** Kontroll av senaste parallella `main`, squash-merge [PR #65](https://github.com/jacobflinder/Lektioner/pull/65) samt **Ma4-workflow och Pages på exakt publicerad kodversion**. Ingen sådan slutlig verifiering påstås ännu.  
> **Nästa handling:** Färdigställ enbart Polynomdivision, dokumentera slutresultatet och **stanna**. Nästa lektionsval gör användaren uttryckligen; börja inte automatiskt med Fy2 Elektriska fält eller någon annan lektionspost.  
> **Kursordning:** Användaren valde uttryckligen polynomdivision som nästa efter Fy2-piloten, vilket åsidosätter den tidigare standardordningen för just detta steg. Registrets #23 är originalplatsen bland de 41 – inte påstående att 22 lektioner är klara.  
> **Publicerad lektion (före denna ändring):** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/polynomdivision/. Ny version ännu inte publicerad.

## Varaktiga granskningsinstruktioner

Läs [figurer-interaktioner-instruktion.md](figurer-interaktioner-instruktion.md) och `AGENTS.md` vid varje ny chatt. Separera detta arbete från [matematikgranskningen](README.md). Varje lektion ska inventeras från behov, inte bara befintliga figurer. Prioritera fysikalisk riktighet och saknade förklaringssteg över kosmetik. Bevara fullständig matematisk lösning, Socrative enbart där det redan finns, bokuppgifter, läxor och demonstrationer. Låt eleverna förutsäga före återkoppling. Koppla figurer, formler och reglage till samma tillstånd. Verifiera faktiskt ritad geometri oberoende av programmets egna tal. Dokumentera både utförda och ej utförda kontroller. **Godkänn inte en lektion med enbart gröna knappar eller med kvarstående obligatorisk verifiering.**

## Reviderat godkännandekrav 2026-11-15 – visuell begriplighet

Användaren har infört ett **obligatoriskt kvalitetskrav på faktisk visuell begriplighet**, nu sparat i [figurer-interaktioner-instruktion.md](figurer-interaktioner-instruktion.md). En rätt beräknad och korrekt etiketterad illustration räcker inte om eleven inte kan urskilja former, riktningar och relationer. Högerhandsregeln i pilot 1/41 måste utgå från användarens **riktvända originalfoto av höger hand runt en sladd**, visa `I` längs tummen och hur de böjda fingrarna visar `B` runt ledaren. Fotografi → betraktelseriktning → tvärsnitt → punktens tangent ska visas **stegvis**, med elevens svar dolt tills efter egen förutsägelse. Kontrollera och bedöm faktiskt upplevd tydlighet på realistisk bildstorlek, inklusive att förklaring och markeringar syns tillsammans. Den tidigare schematiska handen har inte slutgodkänts mot detta kriterium.

**Statusändring:** Tidigare godkänt arbete enligt äldre kriterier behålls i historiken, men pilot **1/41 återöppnas** inför fortsatt visuell revidering. **Ingen ny lektionskod eller bild har ändrats i denna instruktionstilläggsuppdatering.** Det nya fotografibaserade stödet är ännu inte implementerat eller visuellt verifierat, och referensfotot måste först lokaliseras/verifieras. **Ingen tillåtelse att börja lektion 2** följer av detta krav.

## Fast granskningsregister

**Inventerat: 41/41** unika publicerade lektionskataloger, Fysik 2 = 10, Matematik 4 = 15, Fysik 1 = 6, Matematik fortsättning nivå 1c = 10. Undervisningsordning hämtad från respektive kapitels index. Undantag: **Ström ger magnetfält**, normalt Fy2-lektion 04, ligger uttryckligen först som pilot och förekommer inte igen. Räknestugor och demonstrationspass följer det läge där de står i Fy2-indexet. Enhetscirkeln behandlas som förberedande Ma4-repetition eftersom den visas före 4.1 i indexet. `mato1c` betyder Ma3c/Gy25 fortsättning nivå 1c.

| Nr | Kurs | Titel | Sökväg | Figur-/interaktionsstatus |
|---:|---|---|---|---|
| 1 | Fysik 2 | Ström ger magnetfält | `fy2/kapitel-3/strom-ger-magnetfalt/` | **Figurer visuellt accepterade av användaren; Fy2-mellanled lämnade för senare** |
| 2 | Fysik 2 | Elektriska fält | `fy2/kapitel-3/elektriska-falt/` | Ej påbörjad |
| 3 | Fysik 2 | Permanentmagneter, material och flöde | `fy2/kapitel-3/magnetism/` | Ej påbörjad |
| 4 | Fysik 2 | Räknestuga | `fy2/kapitel-3/raknestuga/` | Ej påbörjad |
| 5 | Fysik 2 | Spolar och solenoider | `fy2/kapitel-3/spolar-och-solenoider/` | Ej påbörjad |
| 6 | Fysik 2 | Laddade partiklar i magnetiska fält | `fy2/kapitel-3/laddade-partiklar/` | Ej påbörjad |
| 7 | Fysik 2 | Jordens magnetfält | `fy2/kapitel-3/jordens-magnetfalt/` | Ej påbörjad |
| 8 | Fysik 2 | Induktion | `fy2/kapitel-3/induktion/` | Ej påbörjad |
| 9 | Fysik 2 | Magnetisk kraft och jordens magnetfält – räknestuga | `fy2/kapitel-3/raknestuga-kraft-jordfalt/` | Ej påbörjad |
| 10 | Fysik 2 | Demonstrationer – elektromagnetism | `fy2/kapitel-3/demonstrationer-elektromagnetism/` | Ej påbörjad |
| 11 | Matematik 4 | Enhetscirkeln – repetition | `ma4/kapitel-4/enhetscirkeln/` | Ej påbörjad |
| 12 | Matematik 4 | Komplexa tal och imaginära enheten i | `ma4/kapitel-4/komplexa-tal-och-i/` | Ej påbörjad |
| 13 | Matematik 4 | Konjugat och absolutbelopp | `ma4/kapitel-4/konjugat-och-absolutbelopp/` | Ej påbörjad |
| 14 | Matematik 4 | Multiplikation och division av komplexa tal | `ma4/kapitel-4/multiplikation-division-komplexa/` | Ej påbörjad |
| 15 | Matematik 4 | Komplexa tal som vektorer | `ma4/kapitel-4/komplexa-tal-som-vektorer/` | Ej påbörjad |
| 16 | Matematik 4 | Polär form | `ma4/kapitel-4/polar-form/` | Ej påbörjad |
| 17 | Matematik 4 | Multiplicera och dividera med i | `ma4/kapitel-4/multiplicera-dividera-med-i/` | Ej påbörjad |
| 18 | Matematik 4 | Multiplikation och division i polär form | `ma4/kapitel-4/polar-multiplikation-division/` | Ej påbörjad |
| 19 | Matematik 4 | de Moivres formel | `ma4/kapitel-4/de-moivre/` | Ej påbörjad |
| 20 | Matematik 4 | Ekvationen zⁿ = a | `ma4/kapitel-4/ekvationen-zn-a/` | Ej påbörjad |
| 21 | Matematik 4 | Eulers formel | `ma4/kapitel-4/eulers-formel/` | Ej påbörjad |
| 22 | Matematik 4 | Andragradsekvationer i komplexa tal | `ma4/kapitel-4/andragradsekvationer/` | Ej påbörjad |
| 23 | Matematik 4 | Polynomdivision | `ma4/kapitel-4/polynomdivision/` | **Ma4-figurgranskning och full CI PASS på gren; publicering återstår** |
| 24 | Matematik 4 | Faktorsatsen | `ma4/kapitel-4/faktorsatsen/` | Ej påbörjad |
| 25 | Matematik 4 | Polynomekvationer av högre grad | `ma4/kapitel-4/hogre-grad/` | Ej påbörjad |
| 26 | Fysik 1 | Coulombs lag | `fy1/kapitel-8/coulombs-lag/` | Ej påbörjad |
| 27 | Fysik 1 | Elektriska kretsar | `fy1/kapitel-8/elektriska-kretsar/` | Ej påbörjad |
| 28 | Fysik 1 | Serie- och parallellkoppling | `fy1/kapitel-8/serie-parallell/` | Ej påbörjad |
| 29 | Fysik 1 | Elektrisk effekt | `fy1/kapitel-8/effekt/` | Ej påbörjad |
| 30 | Fysik 1 | Elektriska fält | `fy1/kapitel-8/elektriska-falt/` | Ej påbörjad |
| 31 | Fysik 1 | Potential | `fy1/kapitel-8/potential/` | Ej påbörjad |
| 32 | Matematik fortsättning nivå 1c (Ma3c) | Växande och avtagande | `mato1c/kapitel-3/vaxande-och-avtagande/` | Ej påbörjad |
| 33 | Matematik fortsättning nivå 1c (Ma3c) | Extrempunkter och terrasspunkter | `mato1c/kapitel-3/extrempunkter-och-terrasspunkter/` | Ej påbörjad |
| 34 | Matematik fortsättning nivå 1c (Ma3c) | Andraderivatan | `mato1c/kapitel-3/andraderivatan/` | Ej påbörjad |
| 35 | Matematik fortsättning nivå 1c (Ma3c) | Andraderivatan och funktionens graf | `mato1c/kapitel-3/andraderivatans-roll-for-grafen/` | Ej påbörjad |
| 36 | Matematik fortsättning nivå 1c (Ma3c) | Funktionens graf och derivatornas grafer | `mato1c/kapitel-3/funktionens-graf-och-derivatornas-grafer/` | Ej påbörjad |
| 37 | Matematik fortsättning nivå 1c (Ma3c) | Största och minsta värde | `mato1c/kapitel-3/storsta-och-minsta-varde/` | Ej påbörjad |
| 38 | Matematik fortsättning nivå 1c (Ma3c) | Extremvärdesproblem med polynomfunktioner | `mato1c/kapitel-3/extremvardesproblem-polynomfunktioner/` | Ej påbörjad |
| 39 | Matematik fortsättning nivå 1c (Ma3c) | Modellering och fler extremvärdesproblem | `mato1c/kapitel-3/modellering-och-fler-extremvardesproblem/` | Ej påbörjad |
| 40 | Matematik fortsättning nivå 1c (Ma3c) | Blandade problem | `mato1c/kapitel-3/blandade-problem/` | Ej påbörjad |
| 41 | Matematik fortsättning nivå 1c (Ma3c) | Deriverbarhet | `mato1c/kapitel-3/deriverbarhet/` | Ej påbörjad |

## Historik – pilot 1/41

**2026-11-15 · inledande kodgranskning** av `content.js`, `logic.js`, `index.html`, `practice.js`, `lararstod.html`, befintliga `deep-review-fy2-35.cjs` och kursens QA-workflow. 18 ordinarie lektionsbilder och en frivillig Ampère-bild; originalets pappersarbete, demonstrationslänk, Socrative och bok/läxa ska bevaras. Tidigare matematikgranskning verifierade aritmetik och vissa SVG-fall; detta granskningsspår kräver ytterligare faktiskt visuellt stöd och varierande reglagetillstånd.

**Konkreta brister:** (1) Högerhandens orientering och fingrarnas relation till tvärsnittets `⊙`/moturs-fält framgick bara i ord; ingen fysisk handillustration i elevbilden. (2) I beräkningsmodellen flyttades P när r-reglaget ändrades medan ritade cirklar låg kvar på tre konstanta, godtyckliga radier. (3) B-talet ändrades, men beräkningsbilden saknade avläsbar, oföränderligt skalad storleksrepresentation. Detta är ett visuellt glapp, inte ett belägg för att ursprungsformeln beräknade fel. (4) Nytt tydligare automatprov behövs för faktisk SVG-geometri och skala över flera tillstånd.

**Åtgärder på arbetsgren (inte publicerade):** Inlagd egen schematisk högerhand + tvärsnitt med B-tangent i P, inuti fördröjd återkoppling på bild 4. På bild 10 följer fältcirkeln nu punktens valda r med konstant `12 SVG-enheter/cm`; tidigare tre hjälpcirklar försvinner ur just beräkningsmodellen. Separat B-stapel visas endast efter elevens försök, på fixerad `0–120 μT`-skala där 360 SVG-enheter motsvarar 120 μT. Högerhandsregel och modellgränser förklarade i `lararstod.html`. Nytt `qa/figure-interaction-pilot-strom.cjs` är kopplat till Fy2:s CI-workflow.

**Definierade oberoende kontrollfall:** `B = 2·10⁻⁷ I/r` i tesla (I i A, r i meter). Vid 6 A, 4 cm: `B=30 μT`, ritad stapel 90/360, P 48 SVG-enheter från centrum. Vid 12 A och 4 cm: `60 μT`, stapel 180/360, samma P. Vid 12 A och 8 cm: `30 μT`, stapel 90/360 och P 96 SVG-enheter från centrum. Strömvändning vänder tangenten upp↔ned i P till höger, inte B:s storlek. Gränsvärden 1 A/12 cm ger 1,667 μT och 5 SVG-enheter; 12 A/2 cm ger 120 μT och 360 SVG-enheter. Strömfaktor 2 och 3 ska ge pilar i förhållandet 1:2:3; avstånd 2r och 3r ger B₀/2 och B₀/3 samt dubbelt/tredubbelt P-avstånd.

**Verifiering:** Kodändringarna och testfallen finns på arbetsgren och har genomgått webbläsarkontroll. Första CI-körningen upptäckte **sex verkliga synlighetsfel** eftersom ett `<svg>`-elements `hidden`-egenskap inte uppdaterade dess `hidden`-attribut; korrigerat till explicit `setAttribute/removeAttribute`. Nästa fulla Fy2-körning gav PASS för den tidigare pilotens **468 kontroller** samt nya **41 fysik- och SVG-kontroller**, inklusive faktisk pixelbredd, mobil och projektor ([Actions 43740002948](https://github.com/jacobflinder/Lektioner/actions/runs/43740002948)). En ytterligare körning för skärmbildsinspektion passerade ([Actions 43740394076](https://github.com/jacobflinder/Lektioner/actions/runs/43740394076)). **Faktiska renderade JPEG-bilder från Chromium inspekterades:** griphand/tvärsnitt (B uppåt i P) och B-modell (30 μT = 90/360 av fast skala, P på samma fältcirkel). Inspektionen upptäckte tvetydigt perspektivuttryck ”se längs tummen”; rättat till att betrakta ledaren från änden som tummen pekar mot (strömmen kommer då mot dig, `⊙`). Testet verifierar nu också detta elevsynliga begrepp. **Slutligt verifierat 2026-11-15:** [grenens slutkörning 43740957068](https://github.com/jacobflinder/Lektioner/actions/runs/43740957068) **PASS**, nya **42/42** kontroller inklusive korrekt betraktningsperspektiv; [main-Fy2 43741322613](https://github.com/jacobflinder/Lektioner/actions/runs/43741322613) **SUCCESS** och [Pages 43741322267](https://github.com/jacobflinder/Lektioner/actions/runs/43741322267) **SUCCESS** på kod-SHA `ae991bb321b55b357f59cbf826c81acfc7cc38df`. Skärmbilder av huvudsakliga visuella stöd inspekterade. Metodlärdom: verklig synlighet/pixelgeometri behövs utöver riktiga numeriska värden. Fysiska demonstrationsutfall, skolprojektor och Safari på iPad kan inte fastställas via Chromium.

**Parallellt arbete:** Basens senaste main kontrollerades före squash-merge av PR #63. `practice.js`, Socrative, bokreferenser, läxa och annan kurskod har bevarats. Kod + nya webbläsartester + logg sammanfördes; CI och Pages verifierade med samma SHA. Ingen ny lektion påbörjad.

**Öppna layoutanmärkningar (inte blockerande för denna pilots verifierade samband):** Kursens äldre generella `browser-smoke.cjs` rapporterar **68 varningar och 0 fel** över Fy2-biblioteket. För pilotlektionen vid 768 px bredd gäller tre av dessa vertikala skärmhöjdsanmärkningar: **bild 4 = 17 px**, **bild 7 = 94 px**, **bild 9 = 148 px** nedanför aktuell viewport. Elever kan scrolla på denna smalare vy; de faktiska kopplingarna mellan rätt matematik och renderad SVG har verifierats, och pilotens nya tester kontrollerar horisontellt överspill vid 390 px och 1920 px. Redovisa detta öppet och förbättra layouten separat vid framtida behov utan att dölja testvarningar. Ingen garanti lämnas om att all återkoppling alltid ryms vertikalt på små skärmar.

**Fortsatt arbete efter användarens fyra konkreta synpunkter (bilder 4, 11 och 13), 2026-11-15:** På arbetsgrenen `docs/visual-begriplighet-20261115` har den tidigare svårtolkade schematiska handen på bild 4 ersatts av en fotobaserad, rättvänd högerhandsillustration i `assets/handgrepp-hoger.webp` med I längs tummen och B:s böjda cirkulation. Handgreppet visas **direkt när bild 4 öppnas**, fältpilen i P först efter elevens försök. Sidans layout är omdisponerad i två balanserade kolumner med bild och tvärsnitt på samma skärmyta. Bild 11 har fått felaktig **före**-figur och facitdold, korrigerad **efter**-figur med riktig tangent uppåt. Bild 13 visar efter första lösningsklick en ny figurskiss med P ovanför ledaren, r = 4,0 cm och B åt vänster, nära den tidigare korrekta matematiken. Lärarstöd och offline-HTML-export har uppdaterats för fotot. Ett utvidgat Playwrighttest kontrollerar laddad bild, att facit är dolt före eleven försöker, verkliga pilvägar och skärmlayout. **Teknisk/visuell kontroll på arbetsgren och lärarens visuella godkännande återstår**; piloten är fortfarande **återöppnad**, inte slutgodkänd. Efter färdig verifiering avsedd för [PR #64](https://github.com/jacobflinder/Lektioner/pull/64). Inget arbete på lektion 2.

**Pilotens reviderade tre bilder, PR #64 – slutlig teknisk kontroll (2026-11-15):** Bild 4 visar direkt högerhandsgreppet (fotoillustration på rätt orienterad hand), I längs tummen och B runt ledaren. Tvärsnittet syns vid sidan; tangentpil i P förblir dold till efter pappersförsöket. Bild 11 innehåller tydliga märkningar **Före – Elevskiss** och **Efter – korrekt tangent**. Bild 13 visar först efter eget försök ett verkligt diagram med P ovanför, r = 4,0 cm, B åt vänster och oförändrad MathML-lösning. Fotot har lagts som WebbP-asset i samma lektion och bäddas in vid fristående HTML-export; fotoreferensen är en bearbetning, inte en exakt originalkopia. Användarens fyra konkreta synpunkter ligger till grund för ändringarna.

**Verifierat:** **56 nya Playwright-assertioner, 468 äldre pilottester och full Fy2-kursregression passerar**. Testet kontrollerar fotots faktiska laddning och synliga storlek, inga förtida B-svar, rätt synliga SVG-pilar, korrigerad före/efter-riktning och pappersexemplets B åt vänster. De tre faktiskt renderade skärmbilderna för 1280×800 har granskats via CI-loggen; en sista layoutjustering använder handfotots kort bättre och har efterföljande grön CI. Det kvarstår 68 äldre icke-blockerande layoutvarningar i generell Fy2-smoke, inklusive tidigare dokumenterade 768px-situationer. [PR #64](https://github.com/jacobflinder/Lektioner/pull/64) är sammanförd och slutgiltig Pages/QA på samma kod-SHA är gröna. **Elevförståelse och användarens estetiska godkännande kan inte bevisas med enbart automation; invänta lärarens synpunkter.**

**Status 2026-11-15 efter PR #64:** **Pilotlektion 1/41 publicerad och automatiskt verifierad enligt de nya kontrollerna, men inväntar användarens visuella godkännande.** Kod och tidigare verifiering är dokumenterade. **Börja inte lektion 2.** Nästa arbete är eventuella synpunkter på handbild, layout och de nya facitfigurerna.

## Ma4 · Polynomdivision · vald nästföljande lektion (#23/41 i inventeringen)

**Utgångspunkt:** Eleven ska inte bara räkna rätt utan tydligt kunna se **varför högsta termen försvinner**, vilken grad som behandlas och varför övriga termer inte får flytta kolumn. Lektionssidan har 11 bilder (10 i huvudvägen och frivillig extrabild) och sju stegvisa divisioner. Innehåller redan fullständiga divisionsrader och pappersaktivitet; dessa ska inte ersättas av figurer.

**Nya brister identifierade:** (1) Gradkolumner i interaktiva uppställningen saknade uttryckliga gradetiketter och aktuell grad markerades inte visuellt, trots att texten krävde att eleverna skulle hålla ordning på gradplatser. (2) Multiplikationskontrollen på bild 5 saknade samlad koefficientrepresentation som gör att elev ser hur ursprungspolynomet återkommer utan nya symboliska hopp. (3) Bild 6 hade endast text för dubbelnegationen, ingen bild som tydligt skiljer fel subtraktionsriktning från korrekt addition av 2. (4) Bild 8 beskrev platsen för 0x² men visade ingen visuell 4-kolumnsuppställning.

**Åtgärder på arbetsgren (ännu ej publicerade):** Fyra visuellt separata metodfaser 1–4 och markerad aktiv gradkolumn med kontinuerlig rad-/rubriklinjering; tydlig etikett för aktuellt uppgiftsskede utan att nästa resultat avslöjas. Separat dold koefficientmatris x·Q, 2·Q, R, P på bild 5; färg-/textmärkt tallinje för subtraktion `-5-(-2)` på bild 6 efter eget försök; dold gradkarta x³, 0x², −4x, +3 på bild 8. Samma polynom, samma steg, samma ursprungliga frågor och facit. NOKflex 4421–4430 och undervisningsrytmen bevarade.

**Oberoende kontrollfall före publicering:** För `P=2x³+3x²−5x+6`, `D=x+2`, `Q=2x²−x−3`, `R=12` ska koefficientvektorerna vara `xQ=[2,-1,-3,0]`, `2Q=[0,4,-2,-6]`, `R=[0,0,0,12]`; summa `[2,3,-5,6]`. Efter första subtraktionen ska x³-kolumnen elimineras, nästa aktiva grad vara x², inte föregående x³. Vid dubbelnegation ska koefficienten −5 flyttas **+2** till −3, inte **−2** till −7. På bild 8 ska `x³+0x²−4x+3` återges med x²-positionen reserverad. Riktat Chromium-test `ma4/kapitel-4/qa/figure-interaction-polynomdivision.cjs` kontrollerar bland annat faktisk pixelcentrering av gradkolumner och att figur/facit hålls dolt till rätt steg.

**Slutligt QA på arbetsgren (2026-11-15):** Efter att matematikskriptet först hade skrivit över löpande HTML-figurer flyttades figurkopplingen till den genererade MathML-lösningen. Figurerna står nu **omedelbart efter sina relevanta matematikkedjor**, så att begripligheten inte beror på att eleven scrollar tillbaka. I egen faktisk Chromium-körning visar testet **75/75 riktade PASS**, **14 skärmbilder**, **0 JS-fel** samt full original-Ma4-regression i [Actions 43754870975](https://github.com/jacobflinder/Lektioner/actions/runs/43754870975), på kod-SHA `f4869ae8c19a087fcbaa614b5e9f33db40590134`. De ursprungliga 11 sidorna, 7 motorerna och alla facit behölls. Screenshot-granskning av 1280/1920 px och 390 px visar korrekt gradkolumnsjustering, läsbar 2×2-metod på mobil, koefficientvektorer, korrigerad dubbelnegation och 0x²-kolumn. **Uppföljning på publicerad `main` och Pages återstår.** Inga andra lektioner ändrade.

