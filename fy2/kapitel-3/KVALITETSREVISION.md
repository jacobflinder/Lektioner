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