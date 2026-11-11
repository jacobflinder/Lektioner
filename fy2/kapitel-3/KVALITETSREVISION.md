# Fy2 · kvalitetsrevision av interaktiva webblektioner

**Arbetsstatus:** systematisk kod- och källgranskning pågår. **Ingen lektion är certifierad som perfekt.**  
**Underlag:** projektets undervisningsstruktur v1.3, elevönskemål, åtta ursprungliga lektions-PDF:er och den kompletterade induktions-PDF:en.  
**Senast:** 2026-11-11.

## Kvalitetskriterier som varje lektion ska uppfylla

1. **Fysik:** varje riktning, diagram, gränsfall, modellantagande och uträkning måste tåla granskning.
2. **Matematik:** formel → insättning med SI-enheter → resultat → rimlighet och tolkning; visa stegen när de tjänar förståelsen.
3. **Didaktik:** konkret mål → individuell förutsägelse/egen förklaring → prövning eller modellering → användbar återkoppling → ny tillämpning → målanknuten utcheckning.
4. **Metodik:** läraren styr tempo, verkliga demonstrationer och arbete i fysisk bok. Webbplatsen ersätter inte Notability eller Socrative.
5. **Kognitiv design:** begränsa samtidig information, håll figurer på samma plats mellan steg och låt alla elever tänka innan facit.
6. **Interaktivitet:** efter en första återkoppling ska ett reglage ändra både relevant **geometri, fält/vektor och beräkning**, utan att återkopplingen försvinner. **Återställ** ger tillbaka förutsägelseläget.
7. **Tillgänglighet:** projektor, Mac och surfplatta måste ha läsbar och avklippt-fri presentation. Inga personuppgifter ska krävas eller sparas.

## Inventering

| Lektionsdel | PDF-underlag / webblästa delar | Läsning och bokarbete | Särskilt granskningstema |
| --- | --- | --- | --- |
| Elektriska fält | 9 / 18 | s. 126–131; 301–309 (s. 132) | elektrons bana, protonens energi, kollisionsgränsfall, matematiska steg |
| Permanentmagneter | 10 / 10 | s. 144–148; 323, 324, 326, 330, 331 | kompassens röda N/vita S, domäner, flöde kontra B |
| Räknestuga 1 | 8 PDF-sidor inkl. stöd / 7 webbsidor | veckans två läxor | två målstyrda arbetspass, mindmap och stöd vid behov |
| Ström ger magnetfält | 18 / 19 | s. 149–153; 324–334, läxa 325–334 | cirkelfält, högerhandsregel, B som funktion av I och r |
| Spolar och solenoider | 15 / 15 | s. 154–161; 335–342 | korrekt 3D-lindning, L, N, I, radie, hel fältutbredning, järnkärna |
| Laddade partiklar | 18 / 18 | s. 162 och 164–166; 343–350 | tecken, partikelbana, F vinkelrätt mot v, kraft på ledare |
| Jordens magnetfält | 15 / 15 | s. 167–170; 351–357 | inklination / missvisning / α och vektorsumma |
| Induktion | 24 / 24 | s. 171–182; 358–366 (denna och nästa lektion) | laddningsseparation, U=BLv, Φ, Lenz, graflutning |
| Räknestuga 2 | kompletterande / 4 | 343–350 och 351–357 | begrepp, riktning, SI-insättning och korrekt utcheckning |
| Demonstrationssamling | från innehålls-PDF:erna / 6 | ordinarie innehållslektioner | förutsäg → faktisk observation → fysikalisk förklaring |

> Antalet webbdelar är inte antalet schemalagda lektioner. Exempelvis är induktionsmaterialet omfattande och bör delas pedagogiskt när eleverna behöver tid för prövning, demonstration och bokarbete. Räkneuppgifter/sidhänvisningar ska inte hittas på.

## Akut publiceringsfel upptäckt 2026-11-11

En mobil skärmbild av **Induktion** visade rå HTML, standardtypsnitt och alla 24 sidor staplade i samma dokument. Orsaken i källkoden var att CSS och gemensamma JavaScript-filer låg under `_gemensamt/`. Vid normal GitHub Pages/Jekyll-publicering exkluderas mappar som börjar med understreck. HTML-sidan kunde därför visas, men inte dess formgivning och beteende. Felet gällde potentiellt fem delade lektionsskal.

**Åtgärd:** tre gemensamma filer kopierades till `gemensamt/`, samtliga fem lektioners CSS/JS-referenser uppdaterades och fristående HTML-export i `base.js` pekar nu också på den publicerbara mappen. Källkodskontroll bekräftar att ingen av de fem sidornas länkar längre hänvisar till `_gemensamt/`. Browser-testscriptet kontrollerar nu också Jekyll-uteslutna kataloger, faktiskt tillämpade CSS-regler, att inaktiva bilder är dolda samt misslyckade resursanrop. **Den verkliga publicerade sidan är ännu inte nätverksverifierad i denna granskning.**

## Kritisk uppföljning: 1/1 och tomma bilder (2026-11-11)

Efter att formgivningen återställts visade användarens skärmbild av Induktion fortfarande **1/1** och en tom diagramyta. De 24 bilderna fanns kvar i `content.js`, men den gemensamma navigeringen avbröts av ett **bekräftat JavaScript-fel**: hjälpfunktionen `document.getElementById(id)` anropades med bland annat `'#prev'`, trots att `getElementById` kräver `'prev'`. Då lämnades ursprungliga HTML-texten `1 / 1` och den tomma bildväljaren kvar; fysikmodellen startade inte.

Åtgärder:
- Navigeringshjälpen normaliserar nu ID:n genom att ta bort inledande `#`.
- Alla fem berörda sidor är sammanbyggda till **självständiga HTML-sidor** med inbäddad CSS, bilddata, navigering, fysikfunktioner och lektionsinteraktioner. Det minskar risken att delade JS-resurser tappas bort i publiceringen.
- Ett simuleringstest av uppstarten visar **1/24 → 2/24** för Induktion och motsvarande korrekt bildbyte för alla fem sidor. Bilddata, scriptsyntax och interaktiva mål-ID:n har kontrollerats.
- Webbtestet har utökats så att det kräver att aktuell bild faktiskt byts vid varje klick på Nästa. Det räcker inte längre att endast en bild är synlig.
- Fullständig rendering i Safari/iOS och publicerad GitHub Pages-version har ännu inte bekräftats i realtid. De tillagda testerna är inte likvärdiga med en genomförd iOS-testning.

## Klickbara magnetiska kraftmodeller (2026-11-11)

**Laddade partiklar i magnetiska fält, bilder 5, 6, 12 och 17** har byggts om till styrda undersökningar:
- Två klickbara förutsägelser för positiv/negativ laddning; i klassrumsläge avvaktar återkopplingen lärarens knapp, i repetitionsläge är den omedelbar.
- Partikelbana med **Starta, Pausa, Börja om och stegning** samt oberoende val av laddningstecken och magnetfältets riktning. Hastighets- och kraftvektorer kan visas/döljas var för sig.
- Rörelsemodellen har normaliserad tid: för lika m och |q| gäller **r∝v/B**, **ω∝B** och **|F|∝vB**. Det är inte en jämförelse av faktiska proton- och elektronmassor; pilskalorna är schematiska.
- Ledarmodell med klickbar vändning av I och B, fördröjd visning av F och separat kontroll av att två samtidiga vändningar lämnar F oförändrad.
- PDF:ens 18 bilder, bokhänvisningar 162 samt 164–166, uppgifter 343–350 och de två riktiga klassrumsdemonstrationerna är kvar.

**Kontroller utförda:** båda kodkällorna är synkroniserade med den publicerbara, självständiga HTML-sidan; 18 bilder och inga dubbla ID:n; 180 kombinationer av v, B, tecken, riktning och tidsläge har kontrollerats matematiskt för att F·v=0 samt att kraft- och hastighetspilar ryms i bildområdet. JavaScript-test visar också att Starta/Pausa fungerar, att kraften inledningsvis döljs, att B/v förändrar grafik och återkoppling, att enbart I eller B vänder kraften och att båda tillsammans lämnar kraften oförändrad. Separata tester visar att klassrumsläget inte avslöjar svaret före lärarens återkoppling och att repetition ger direkt återkoppling. Chromium-testscriptet har fått nya tester för dessa funktioner. **Verklig rendering i publicerad Safari/iPad kvarstår.**

## Rättningar genomförda under revisionen

- **Gemensam regel för undersökningar:** beräknat resultat förblir synligt och uppdateras efter att användaren har visat det första gången. Ett nytt reglagevärde ska inte tvinga fram ett nytt facitklick. Gäller induktionens fem undersökningar, jordfältets två och magnetismens flödesmodell. Återställ går tillbaka till en obesvarad fråga.
- **Induktionens ledarstav:** stavens ritade längd följer L; hastighetspil följer v, fältmarkeringarna B, kraftpilarna de relevanta kraftstorheterna. U=BLv räknas om med samma data. Laddningsseparationen är *schematisk*, inte en uppmätt transient.
- **Laddade partiklar:** banans radie beror på v/B, fältmarkeringar följer B kvalitativt, hastighetspilens längd v och kraftpilens längd vB i den givna idealiserade modellen. Laddningstecknet eller fältvändning byter korrekt kraftens riktning.
- **Spolar:** fältet visas genom kärnan i stället för att döljas av den. Mjukjärnets förstärkning är kvalitativt markerad, **utan påhittad μ-faktor**. Fortsatt tydlig skillnad mellan lång solenoid och platt spole, och deras giltighetsområden.
- **Räknestuga 2:** mål konkretiserade och utcheckning kompletterad med både riktning, samband och komponentberäkning.
- **Demonstrationer:** uttryckligt mål att jämföra sin förutsägelse med *verklig* observation och förklara med en modell; avslutningen kräver ett dokumenterat resonemang från det försök som faktiskt genomförts.
- **Lärarstöd:** tydligare didaktiska prioriteringar, valbara moment och delning av det stora induktionsunderlaget för rimlig kognitiv belastning.

## Kontroll av modellernas centrala talvärden

- Elektriskt flöde: Φ = BA = (0,40 T)(0,0024 m²) = 0,96 mWb.
- Lång rak ledare: B = μ₀I/(2πr), I = 6,0 A och r = 0,040 m → 30 μT.
- Luftsolenoid: N=300, I=0,80 A, L=0,30 m → B≈1,005 mT. Dubbel I eller N ger dubbelt B; dubbel L ger halva B (inom modellens giltighet).
- Platt luftspole: N=5, I=0,80 A, r=0,040 m → B≈62,8 μT i centrum. Dubbel r ger halva B.
- Proton i B: F=e·(3,0·10⁵ m/s)·(0,20 T)≈9,6·10⁻¹⁵ N.
- Elektron i B: F=e·(2,0·10⁶ m/s)·(0,040 T)≈1,28·10⁻¹⁴ N.
- Ledare: B=0,25 T, I=3,0 A, L=0,080 m → 0,060 N.
- Jordfält: B=42 μT och i=73° → Bₕ≈12,3 μT; spole med N=3, I=1,5 A, r=0,060 m → Bsp≈47,1 μT, α≈75°.
- Induktionsstav: B=0,40 T, L=0,20 m, v=3,0 m/s → U=0,24 V.
- Medelinduktion: N=300, ΔΦ=0,033 Wb, Δt=1,7 s → U≈−5,8 V i vald teckenkonvention.
- Styckvis induktion för N=200: stigande / konstant / fallande flöde → −2 V / 0 V / +3 V. Exakt i grafens idealiserade skarpa hörn saknas entydig momentan derivata.

## Automatiserad kvalitetsgranskning

- **Webbläsartestscript:** [qa/browser-smoke.cjs](qa/browser-smoke.cjs), som navigerar varje bild i samtliga tio lektionspass och tar skärmbilder.
- **GitHub Actions:** [.github/workflows/fy2-browser-qa.yml](../../.github/workflows/fy2-browser-qa.yml) (relativ sökväg från denna fil), avsett att köra Chromium på projektorliknande desktop-storlek och surfplatteliknande fönster.
- Scriptet kontrollerar antal bilder, aktiv bild, JavaScript-fel, sidornas överflöd och att utvalda reglage faktiskt ändrar både figur och resultat. Bevismaterial sparas som skärmbildsartefakter om workflow körs med framgång.
- **Status:** testscript och workflow är skapade och syntaxgranskade; något framgångsrikt genomfört CI-webbläsartest har **inte verifierats** här. Skärmbilderna från en sådan körning har alltså ännu inte granskats manuellt.

## Kvarstående blockerare innan lektionerna kan kallas färdiggranskade

1. **Verklig rendering:** granska samtliga bilder i Chromium och på Safari/iPad, inklusive varje viktig mellanposition i modellerna. Kontrollera att text, bråk och bilddelar inte är klippta eller överlappar.
2. **Alla tillstånd:** inte bara standardvärden, utan extremvärden, strömvändningar, fältvändningar, återställning, förutsägelseläge och repetitionsläge. Dokumentera upptäckta fel och rätta dem.
3. **Projektor och arbetssätt:** kontrollera att en hel bild verkligen är läsbar längst bak, att sidbyte och frihand i Notability fungerar utan onödiga teknikskiften.
4. **Didaktisk klassrumspilot:** dokumentera två-tre typiska elevresonemang och vanliga missuppfattningar per prioriterad lektion; undersök om eleverna kan använda modellen på en ny fråga utan reglagen.
5. **Forskningsanknytning:** pröva interaktiviteten mot principer om koherens, segmentering och vägledande återkoppling. Forskningsstöd för en designprincip garanterar inte att den specifika webbsidan har visat bättre lärande.

## Källor för fysik och interaktionsdesign

- [OpenStax – Magnetic Field of a Current Loop](https://openstax.org/books/university-physics-volume-2/pages/12-4-magnetic-field-of-a-current-loop)
- [OpenStax – Solenoids and Toroids](https://openstax.org/books/university-physics-volume-2/pages/12-6-solenoids-and-toroids)
- [PhET – designprinciper](https://phet.colorado.edu/en/about)
- Mayer & Fiorella (2021): [Principles for Managing Essential Processing in Multimedia Learning](https://doi.org/10.1017/9781108894333.025)

**Slutprincip:** publicera inte en framställning bara för att den ser rimlig ut, fungerar tekniskt eller råkar ge rätt numeriskt svar. Eleven måste se samma fysik i figur, vektor, formel, resultat och förklaring.