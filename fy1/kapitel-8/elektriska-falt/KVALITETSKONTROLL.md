# Kvalitetskontroll – 8.5 Elektriska fält

**Revision:** 2026-11-12 · **Omfattning:** Fysik nivå 1b, avsnitt 8.5.  
**Original:** `Fy1_Elektriska_falt.pdf` (18 sidor) · **Webb:** 14 bilder.  
**Avgränsning:** Endast `/fy1/kapitel-8/elektriska-falt/`, övriga kapitel och lektioner lämnas oförändrade.

## Innehåll bevarat från originalet

- Startfråga och mål; elektriska fältlinjer; samma fält med +q₀, −q₀ och +2q₀.
- Riktade fält och krafter, beräkning av F = qE, fältsuperposition med +Q och −2Q samt byte till +2Q.
- Homogent plattfält, rörelse/acceleration för en elektron och energisambandet W = eU.
- Faradays bur och elektrostatisk jämvikt. Tre öppna diagnosfrågor och korrigerande återkoppling.
- **Bok:** uppgifter 851–860, s. 307–308; stöd 8.5 s. 300–307. Inför 8.6: s. 309–314, särskilt **gröna rutorna**.
- **PhET:** [Charges and Fields](https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_all.html) enligt originalet.
- **Ingen Socrative i originalet** – ingen Socrative tillagd. Nya webbfrågor hålls uttryckligen åtskilda från Socrative.

## Förändringar och didaktisk motivering

- **10 statiska fysikfigurbilder**, 3 dynamiska modeller. Figuren ligger bredvid motsvarande resonemang och lösningssteg, till skillnad från den första webbversionens många textbilder.
- Modellen med tre testladdningar visar kraftvektorernas riktningar och numeriska värden med samma E och med q₀ som reglage. Nollfält och teckenbyte fungerar.
- Superpositionsmodellen kan ändra höger laddning från −2Q till +2Q; källornas pilar, skalära tecken och summa följer en gemensam matematisk beräkning.
- Elektronens läge, hastighet och rörelseenergi beräknas från en acceleration. Figuren visar tidsprickar med lika intervall; rörelsen upphör vid plusplattan. Ritad partikel ligger aldrig inuti plattan. E, F, a och v särredovisas.
- Separata förutsägelse- och svarsbilder för Faradays bur. Avgränsning till slutet ledande skal, tomt hålrum och elektrostatisk jämvikt.
- Stegvis matematik med riktning och SI-enheter. Nyskapade webbfrågor med förklarande återkoppling men ingen obligatorisk klickuppgift på varje bild.
- Lärarstöd med vanliga missuppfattningar och realistisk **70-minutersram som inkluderar 21 minuter bokarbete/exit**. Valbara kompletteringar kan kortas.

## Kontroller

**Lokalt testat:** Chromium kördes med inline-inläst, lokalt källkodsinnehåll eftersom testmiljön spärrar localhost-HTTP. Detta är **inte** detsamma som att Safari och publicerade Pages-resurser har testats.

- **106/106 automatiserade lokala kontroller godkända.** Resultat och metoder finns lokalt i `qa/falt85-test-result.json` i arbetsmappen (inte publicerad som elevmaterial).
- Testade båda klassrum/repetitionslägen inklusive återställning när läraren växlar tillbaka.
- Kontroll av nollfält, F=qE med positiva och negativa fält, fördubblad testladdning, E₂:s teckenbyte, små/stora avstånd och laddningar.
- Elektron kontrollerad vid t=0, före kollision och efter att tidsskalans slutvärde passerat träfftid; verifierat att E, a, x, v, energi är ändliga och konsekventa i ytterlägen.
- Kontroller av återställning, grundläggande animation, dolda förklaringar, alla 14 sidor, bok/PhET, ingen Socrative.
- Responsiv kontroll av alla sidor vid 320, 390, 768, 1280 och 1440 px utan horisontell överströmning. Skärmbilder granskade för modeller, räkneexempel, Faradays bur och mobil.
- **Fysikvisuell efterkontroll:** pilspetsar ritade direkt i SVG för att undvika konflikter mellan identiska `marker`-ID:n; fysikpilar följer teckenkonvention och elektronens cirkel klipps inte av plattorna.

## Ej verifierat

- Safari på faktisk iPhone/iPad, projektor och fullskärm via klassrummets visningskedja.
- Elevrespons och hur 70-minuterspasset fungerar i den faktiska elevgruppen.
- Publicerade GitHub Pages-resurser som webbplats (verifieras separat efter commit, om möjligt).

**Status:** Källkod reviderad och lokalt testad; inte klassrumsverifierad.
