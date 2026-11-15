# Beständig arbetsinstruktion – figurer, animationer och interaktioner (41 lektioner)

Denna instruktion gäller **separat från matematikgranskningen** `granskning/README.md`. Läs alltid `AGENTS.md`, `granskning/figurer-interaktioner.md` och aktuell kod vid arbetets början. Läs eventuell `Figurgranskning_41_lektioner.md` om den finns; tidigare observationer är inte slutbevis. Granskningens logg/arbetsläge ska sparas i GitHub, inte bara i chatt.

## Syfte och gräns

Eleven ska förstå **vad som händer, varför och hur matematiken härleds**. Figurer får inte ersätta korrekta mellanled, beräkningar och bevis. Nya visuella stöd placeras intill motsvarande resonemang och använder samma symboler, tal och enheter. Undvik onödigt scrollande och arbetsminnesbelastning. Behåll återkommande rytm **fråga → eget tänkande (ofta på papper) → återkoppling**, stegvis förklaring och aktivt eget arbete. Inget facit får läcka innan eget försök.

## Obligatorisk ordning och stopp

- **Pilot 1/41:** Fysik 2, Ström ger magnetfält (`fy2/kapitel-3/strom-ger-magnetfalt/`). Piloten räknas **en gång**.
- Följ sedan undervisningsordning inom **Fysik 2 → Matematik 4 → Fysik 1 → Matematik fortsättning nivå 1c (Ma3c)**, enligt det fasta 41-radersregistret i loggen.
- `mato1c` betyder Gy25 Matematik fortsättning nivå 1c (tidigare Ma3c), inte Matematik 1c.
- **Exakt en lektion i taget.** Redovisa en färdig lektion och **stanna**. Endast användarens uttryckliga **”nästa”** tillåter att följande lektion påbörjas. Om nuvarande lektion ännu inte är färdig ska den slutföras först. Synpunkter gäller samma lektion. Ny chatt medför aldrig implicit tillstånd att fortsätta till nästa.
- Nästa lektion får nämnas som kommande utan att dess innehåll granskas.

## Behovsdriven visualiseringsinventering

För varje moment: fråga vilket abstrakt förhållande eleven måste föreställa sig, vilken konkret missuppfattning en figur ska avhjälpa, om visuellt stöd saknas och om det behövs stillbild, stegvis avslöjande, animation eller elevstyrd interaktion. Fler bilder är aldrig ett självändamål. Kontrollera att stödet kommer **vid rätt matematiska steg**, förklarar utan att avslöja och är tillgängligt för elever som behöver mer vägledning.

Kontrollera särskilt **högerhandsregler**: avsedd regel (strömskapad B, magnetkraft eller spole), korrekt höger hand, tummens/fingrarnas roller, orientering, symbolerna `⊙`/`⊗`, B:s verkliga tangentriktning. En fysisk handmodell får inte vara spegelvänd eller lära ut fel regel.

## Visuell och fysikalisk kvalitet

Granska pilar, orientering, tecken, fältlinjer, vinklar, avstånd, geometri, axlar, referenspunkter, skala, proportioner, enheter, etiketter, färger, kontrast, läsbarhet, överlappning och beskärning. Använd inte enbart färg för betydelser. En schematisk figur märks som sådan när viktigt, utan att motivera fysiskt fel. Exakt geometri måste konstrueras och oberoende kunna kontrolleras.

**Elektriska kopplingsscheman:** En ledning ska synligt nå **resistorns eller batteriets faktiska anslutning**. Vid en batterisymbol måste ledningarna ansluta till den **långa respektive korta plattan**, utan dolt glapp under en vit täckrektangel och utan att plattorna kopplas samman av ledning. Kontrollera varje kretsschema, inklusive dynamiska och efter-återkoppling-figurer, i **faktiskt renderad storlek**. Granska ledningsändpunkter och kretsens topologi oberoende av att symbolen, siffrorna eller färgerna verkar korrekta. Kopplingsvägar får inte råka kortslutas av dekorativa linjer.

**Elevsynlig metadata:** En källpresentations filnamn eller intern sidnumrering (exempelvis ”Original: …pdf, s. 1”) är inte undervisningsinnehåll och ska inte visas i elevvyn. Bevara däremot relevanta **lärobokssidor, uppgiftsnummer, källreferenser med didaktiskt värde och lärarens dokumentation**.

## Visuell begriplighet – obligatoriskt godkännandekrav

**Visuell begriplighet är ett godkännandekrav.** En illustration är inte godkänd enbart för att den finns och har korrekta etiketter. Eleven ska tydligt kunna urskilja de former, riktningar och relationer som förklaringen bygger på.

För händer och rumsliga grepp ska verkliga referensbilder användas när en schematisk teckning blir svårtolkad. I pilotlektionen ska användarens foto av höger hand runt en sladd vara utgångspunkt. Bilden får inte spegelvändas. Markera konventionell strömriktning längs tummen och visa tydligt hur fingrarnas böjning motsvarar magnetfältets cirkulationsriktning.

Kopplingen mellan fotografiet och ledarens tvärsnitt ska förklaras stegvis med tydlig betraktelseriktning. Visa handgreppet när regeln introduceras. Visa därefter tillämpningen i den aktuella punkten, utan att avslöja elevuppgiftens svar i förväg.

Granska bilden i faktisk visningsstorlek. Hand, relevanta markeringar och tillhörande förklaring ska kunna ses tillsammans. Om bilden kräver långa förklaringar för att dess grundläggande form ska gå att tolka behöver den göras om.

Detta krav måste bedömas **genom mänsklig visuell inspektion av renderad lektion**, vid faktisk projektor-/dator-/mobilstorlek och i de undervisningssteg där figuren används. Korrekt SVG-geometri, grön regression och begriplig etikettering kan styrka ämnesriktighet och teknik men **ersätter inte en prövning av om eleven intuitivt kan avläsa den form och relation som ska läras**. Dokumentera konkret vad som syns, vilket steg som visas och eventuella tolkningsproblem. Vid en uppdaterad referensbild ska dess orientering kontrolleras mot originalet, utan spegelvändning.

## Reglage är en matematisk/fysikalisk modell

**Ett gemensamt tillstånd ska beskrivas av reglage, matematik, tal, text och bild.** För varje reglage dokumentera: ändrad storhet/enhet/intervall; konstanta storheter; rätt fysikaliskt samband; vad som ska ändras i bild och text; vad som ska förbli oförändrat; oberoende kontrollvärden. Kontrollera noll, min, max, olika mellanlägen och tecken-/riktningsbyte där de är fysiskt relevanta. Verifiera att **faktiskt renderade** pilar, kurvor, punkter, radier, vinklar och längder följer sambandet, inte bara att DOM-nummer/attribut ändras. Mät gärna också faktisk visad bredd och position i webbläsaren.

Exempel: lång rak ledare `B ∝ I/r`, punktladdningar `F ∝ 1/r²`, rotation av komplext tal med konstant belopp följer cirkeln vid varje animationstidpunkt. Förhindra dold automatisk omskalning; om en pil av pedagogiska skäl bara visar riktning ska detta sägas tydligt och en storleksförändring få en separat, fast skalad presentation där det behövs.

## Animation och återkoppling

Kontrollera hela tidsförloppet och mellanlägen; rörelsen ska följa riktig geometri även mellan ändpunkter. Paus, fortsättning, stegning, reset och upprepning måste fungera där de är relevanta. Bild och tal synkroniseras, gammalt tillstånd får inte läcka. Låt eleven förutsäga och förklara före demonstration när lämpligt. Förklara relevanta felsvar i återkopplingen. Testa navigering, bakåt/framåt, byte klassrum/repetition och återställda avslöjanden; återbesök får inte ofrivilligt ge svar.

## Innehåll och samarbete

Behåll aktuella korrekta genomgångar, mellanled, läroboksreferenser, bokuppgifter, läxor, klassrumsdemonstrationer, frivilliga utmaningar och Socrative **om det redan fanns i originalet**. Lägg aldrig till Socrative utan källa. Flytta endast innehåll av tydligt didaktiskt skäl. Ändra inte parallella förbättringar eller skriv över senare kod med äldre. Om gemensamma komponenter berör fler lektioner: kontrollera effekter och regression där, utan att utöka den fullständiga granskningen till nästa lektion.

## Arbetsgång per lektion – alla steg krävs

1. Läs hela lektionen och dess mål; kontrollera aktuella källor och `AGENTS.md`.
2. Inventera befintliga och saknade bilder, animeringar och interaktiva stöd.
3. Skriv konkreta didaktiska/fysikaliska brister och konsekvens för elevförståelse.
4. Definiera korrekt fysik, förväntad geometri och oberoende kontrollfall **innan ändring**.
5. Implementera små, riktiga förbättringar och bevara befintliga moment.
6. Kontrollera ämnesinnehåll och alla reglagens matematik, texter och renderade tillstånd.
7. Inspektera den **faktiska lektionen i webbläsare**, inklusive avslöjande, navigering och återställning.
8. Inspektera minst mobil (t.ex. 390px) och stor/projektorvy samt tangentbord.
9. Kör riktade tester och kursregression enligt `.github/workflows`; ta och granska relevanta skärmbilder.
10. Följ `AGENTS.md`: full logisk ändring och test i sammanhållen commit/PR, validerad gren före main, bevara parallella ändringar och **aldrig force-push**.
11. Efter eventuell publicering: verifiera GitHub Actions och Pages på rätt kodversion. Ange pending och failures korrekt; grön knapp eller enbart kodtest räcker inte.
12. Uppdatera loggen och redovisa i chatten: nummer/kurs/titel, upptäckta fel, utförda ändringar, separata kod-/automat-/visuella kontroller och konkreta resultat, kvarstående begränsningar, faktisk status/publicerad länk samt nästa lektion **utan att börja**. För piloten redovisa även lärdomar om metoden.

**Markera inte som klar vid saknade obligatoriska tester, osedda skärmbilder eller overifierad publicering.** Fysiska demos/skolans projektor kan behöva manuellt test och redovisas i så fall som begränsning.

## Permanent logg och överlämning

`granskning/figurer-interaktioner.md` ska alltid överst redovisa senast färdiga lektion, aktuell X/41 med kurs/titel/sökväg, status (ej påbörjad/analyseras/åtgärdas/verifieras/klar/blockerad), fortsättningsstatus, gjort, återstår, nästa handling, nästa lektions nummer/titel, gren/commit, publicerings- och Pages-verifiering. Behåll varje lektions historik och det 41-radiga registret. Uppdatera efter avslutad arbetsdel även om arbetet blockeras. Vid chattbyte: kort kopierbar överlämning med repo, logg, lektion, exakt fortsättningspunkt och huruvida användarens `nästa` inväntas.

Inled och avsluta varje arbetspass i chatten med:

> **Figur- och interaktionsgranskning: lektion X/41 – kurs och titel.**  
> **Status:** …  
> **Klart:** …  
> **Återstår:** …  
> **Nästa handling:** …

När loggen anger **”inväntar användarens nästa”** får en ny chatt inte påbörja nästa lektion utan uttryckligt klartecken.
