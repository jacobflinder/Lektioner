# Kravspecifikation v2.0 – figur-, visualiserings- och interaktionsgranskning

**Projekt:** 41 interaktiva webblektioner · `jacobflinder/Lektioner`  
**Fastställd:** 16 november 2026  
**Omfattning:** Fy2, Ma4, Fy1 och Matematik – fortsättning nivå 1c (tidigare Ma3c)  
**Läge vid revision:** 3 av 41 lektioner granskade; 38 återstår. Den äldre matematikgranskningen 41/41 är ett separat arbete.

Denna version ersätter den tidigare figurinstruktionen. Den bygger på konkreta erfarenheter från **Fy2 Ström ger magnetfält**, **Ma4 Polynomdivision** och **Fy1 Serie- och parallellkoppling**. Allt nedan gäller även för omgranskning av tidigare färdigställda lektioner när en ny brist upptäcks.

**SKA** = obligatoriskt godkännandekrav. **BÖR** = stark rekommendation med motivering om den inte följs. En lektion blir inte godkänd genom antal utförda ändringar, antal tester eller att alla automatiska tester är gröna: **eleven måste faktiskt kunna se, tolka och använda den förklarande representationen**.

## 1. Överordnat kvalitetsmål

Varje lektion SKA hjälpa eleverna att förstå **vad som händer, varför det händer och hur det matematiskt eller fysikaliskt motiveras**. Eleven ska ha möjlighet att tänka själv, förutsäga, räkna på papper, pröva en modell, få återkoppling och utveckla självständighet. Figur och interaktion är stöd till matematiken och fysiken – aldrig en ersättning för dem.

En figur SKA tillföra en tydlig förståelsevinst. Fler bilder, fler knappar och mer rörelse är inte automatiskt bättre. Undvik visuella detaljer som konkurrerar med det aktuella lärandemålet.

**Godkännande kräver samtidigt:** korrekt ämnesinnehåll, begriplig figur, rätt placering/timing, korrekt interaktion, bevarade matematiska mellanled, faktisk visuell inspektion och verifierad publicering. Ett allvarligt fel i någon av dessa delar blockerar godkännande.

## 2. Arbetsordning, mandat och avgränsning

- Läs `AGENTS.md`, denna instruktion, `granskning/figurer-interaktioner.md`, aktuell lektion, lärarstöd, dess relevanta tester och nödvändiga källfiler **innan** åtgärder.
- Registret har **41 fasta, unika lektionsposter**. Registreringsnummer och antal färdiggranskade är olika saker: exempelvis är Polynomdivision post #23 men var den andra faktiskt granskade lektionen.
- Grundordningen är **Fy2 → Ma4 → Fy1 → Matematik – fortsättning nivå 1c** i kursens undervisningsordning. **Användarens uttryckligen valda lektion eller URL har alltid företräde.**
- Granska och ändra **exakt en lektion i taget**. En direkt rättelse i redan granskad lektion räknas inte som en ny granskad lektion.
- Stoppa efter färdig lektion. Nästa lektion påbörjas endast när användaren uttryckligen väljer den eller skriver **”nästa”**. Ett chattbyte är inte tillstånd att fortsätta.
- Berörs delade komponenter SKA deras effekter regressionstestas, utan att övriga lektioner börjar fullgranskas.
- Ändra inte användarens uppskjutna frågor i smyg. Notera öppna anmärkningar och vilket delområde som är godkänt.

## 3. Fullständig visuell behovsinventering – även det som saknas

För **varje bild/steg**, inte bara de bilder som redan innehåller SVG, SKA granskningen besvara:

1. Vad ska eleven lära sig eller kunna förutsäga just här?
2. Vilket objekt, vilken rörelse, relation, riktning, geometri eller beräkning måste eleven kunna föreställa sig?
3. Finns det **en faktisk relevant figur** där eleven behöver den – eller saknas den helt?
4. Är den en stillbild, två jämförda tillstånd, ett stegvis avslöjande, en animation eller en reglerbar modell? Är det rätt form?
5. Visar den **den aktuella situationen med rätt symboler, punkter och tal**, inte bara en generell illustration?
6. Ger texten eller knappen ett löfte om en figur som inte visas? Då är det **ett fel**, även om text och formel är korrekta.
7. Är figur, förklaring och aktuell matematik visuellt samlade, och får eleven tänka före facit?

Skapa den figur som behövs; använd inte en generell dekorativ illustration som ersättning. Om en figur inte tillför något SKA det också noteras i behovsbedömningen – det är inte ett krav på bild på varje sida.

## 4. Ämnesriktighet och fullständig matematik

- Varje figurs storheter, koordinater, tecken, vinklar, enheter, riktningar, axlar, noder, skala och referenspunkter SKA överensstämma med fysik och matematik.
- **Granska beräkningskedjan som eleven faktiskt ser**, även när en separat tidigare matematikgranskning har godkänt lektionen: givet → antagande/modell → relevant samband → insättning → mellanled → slutsats → rimlighetskontroll. Kontrollera konstiga hopp, missvisande omskrivningar, olämpliga avrundningar och om figuren visar något annat än mellanledet.
- Matematiska steg SKA vara tillräckligt fullständiga för elever som behöver mer stöd; det är inte godkänt att en animation visar rätt svar men hoppar över den matematik de ska lära sig. Behåll korrekt MathML och separata uttryck med läsbart mellanrum; följ `AGENTS.md` för matematiktypografi.
- Om eleven ska bestämma en tangent, fältriktning eller spänningsfördelning SKA en efterföljande lösningsfigur visa **samma punkt, samma avstånd och den rätta riktningen**.
- Påstådda likvärdigheter måste vara riktiga: till exempel `P = D·Q + R`, samma potential mellan parallellgrenarnas två gemensamma noder, eller att en ersättningsresistor ger samma totalström vid samma matningsspänning.
- Alla nya bilder SKA kontrolleras mot oberoende räknefall, inte enbart mot den aktuella programmets egna värden.
- Om läraren uttryckligen väljer att skjuta upp en avvikelse SKA den stå kvar som **öppen ämnesanmärkning**, inte döljas under ”helt perfekt”.

## 5. Visuell begriplighet – en egen blockerande kontroll

**En figur är inte godkänd bara för att den finns, har korrekta etiketter och passerar ett SVG-test.** Eleven SKA direkt kunna urskilja den form, rörelseriktning, koppling eller matematiska relation som figuren ska förklara.

Granskaren SKA faktiskt se den renderade figuren i dess **avsedda undervisningsstorlek**, inte nöja sig med programkod, DOM, en thumbnail eller automatisk testsammanfattning. Granska att:

- Förklaring, aktuellt matematiskt uttryck och den tillhörande figurdelen går att se **tillsammans**, utan onödigt hopp eller lång scrollning.
- Pilar börjar och slutar på rätt plats; färg, kontrast, textstorlek och etiketter gör betydelsen avläsbar även när figuren förminskas.
- Ingen viktig hand, pil, ledning, tangent, markering, gradkolumn eller facitfigur döljs, kapas eller kolliderar med annat innehåll.
- Färg används som förstärkning, **inte enda betydelsebärare**. Figurens relevanta geometri förblir synlig.
- Betraktelseriktning och skillnaden mellan **schematisk** och **skalriktig** representation anges när den spelar roll.
- En illustration som kräver långa verbala förklaringar för att ens känna igen dess grundform SKA göras om.

**Viktigt:** En dator-/projektorvy där en kritisk förklaringsbild hamnar under skärmens synliga nederkant är en blockerande layoutbrist, även om innehållet kan scrollas fram. På mobil får naturlig vertikal scroll förekomma, men ett centralt samband ska inte splittras över flera onödigt separerade vyer.

## 6. Rumsliga regler och verkliga referenser

När en schematisk hand eller annan rumslig form blir svårtolkad SKA en verklig, korrekt orienterad referens användas eller visualiseringen omarbetas. **Ingen spegelvändning** av högerhandsregeln.

För högerhandsregeln kring en rak ledare SKA följande vara tydligt och förenligt:

- Riktig **höger hand** runt ledaren; **tummen längs konventionell strömriktning**.
- Böjda fingrar visar magnetfältets cirkulationsriktning runt ledaren.
- Betraktelse från rätt ände kopplas stegvis till ledarens tvärsnitt, `⊙` respektive `⊗` och fältets tangentriktning i en given punkt.
- **Själva greppet visas när regeln introduceras**, innan eleven ska tillämpa den. **Elevuppgiftens specifika fältpil** och svar visas först efter eget försök.
- Användarens foto av höger hand runt en sladd är referens för Fy2-piloten; dess orientering bevaras.

Skilj denna regel från trefingerregeln för magnetisk kraft, och från högerhandsregeln för spolar. Kontrollera dem utifrån sitt eget sammanhang.

## 7. Fysikaliskt och geometriskt hela kopplingsscheman

Varje kretsschema SKA vara **topologiskt och visuellt korrekt**:

- Ledningar når komponenternas **faktiska anslutningar**. För batteri når de den långa respektive korta plattan. Det får varken finnas synliga glapp, dold övermålning eller extra linjer som kortsluter plattorna.
- Resistorernas, instrumentens och batteriernas kopplingar måste motsvara den krets som text och beräkning avser. Dekorativa markeringar får inte bilda oavsiktliga ledningsvägar.
- Parallellgrenar SKA ansluta till samma två noder. Nodpunkter, ledaranslutningar och grenströmmar ska synas där de hör hemma, utan att färg ensamt definierar en nod.
- I serie SKA spänningsfall märkas vid **rätt resistor**, och totalström/spänningssumma representeras begripligt.
- En ersättningskrets SKA tydligt jämföras med **ursprungskretsen**. Den får inte se ut som att en extra resistor monteras till originalkretsen.
- Kontrollera såväl statiska bilder som modeller, före- och efterbilder, parallella exempel, instrument- och battericellskisser – **alla förekomster**, inte bara den bild där felet först upptäcktes.

Inspektera inte bara SVG-värden; granska **synliga linjeändar och komponentformer i bildpunkter**. En vit bakgrundsrektangel som täcker ledningen är en verklig felritning även om bakomliggande matematiska samband är korrekta.

## 8. Visuella strukturer i matematik

För polynomdivision och andra uppställningar SKA **termer med samma grad ligga i samma visuella kolumn**. Visa vilken kolumn som är aktuell utan att avslöja elevens nästa steg. En nollkoefficient, exempelvis `0x²`, SKA behålla sin gradplats.

Låt elevens arbetsgång och lösningsfigur följa samma steg: **välj aktuell term → multiplicera korrekt → subtrahera hela produkten → kontrollera ny rest → fortsätt eller stanna**. Teckenfel ska vid återkoppling kunna visas i en korrigerad uppställning eller en relevant före–efter-figur, inte bara beskrivas i ord.

En figurs plats intill MathML SKA kontrolleras **efter att sidans matematik- och renderingsskript har körts**. Om ett skript bygger om facit får det varken skriva över, duplicera eller flytta figuren till ett ologiskt ställe. Kontrollera avstånd i faktiska bildpunkter.

## 9. Elevaktivitet, stegvis avslöjande och fullständig återkoppling

Standardrytmen är **fråga → eget försök (ofta på papper) → återkoppling → ny fråga eller tillämpning**.

- Ett visuellt hjälpmedel som eleven **behöver för att förstå uppgiftens instruktion eller använda en regel** visas från början.
- Den specifika **lösningen, slutpilen, resultatet eller korrigeringen** hålls dold till återkopplingen.
- En knapp med text som ”Visa figurens riktning”, ”Visa lösning” eller ”Visa samband” SKA visa **det som utlovas**. Enbart text/formel när en figur utlovas är blockerande.
- Vid **”Hitta felet”** SKA det felaktiga tillståndet följas av en **korrekt figur**, tydligt märkt exempelvis ”Före – felaktig” och ”Efter – korrekt”. En felaktig pil får aldrig stå kvar som enda visualisering efter facit.
- Lösningsbilden placeras intill **det mellanled den förklarar**, med en kort anvisning som pekar ut det avgörande.
- Efter navigering, byte av visningsläge och reset SKA facit vara dolt eller återställt på ett förutsägbart sätt. Inga gamla värden eller felaktiga avslöjanden får läcka.

## 10. Interaktioner = synkroniserad fysikalisk/matematisk modell

För varje reglage, växling, animation och knapp SKA en separat kontrollmatris definieras:

**Ingångsvärde och enhet | vad som ändras | vad som ska vara konstant | formel/fysik | numeriskt facit | ritad geometri | visad återkoppling | reset.**

- Reglage, resultattext, formel, riktning, färgmarkering, graf, punkt, radie, nod och figur SKA beskriva **samma tillstånd**.
- Testa min/max, relevanta mellanvärden, dubblering/halvering, noll när relevant, tecken- och riktningsbyte, mode-byte, upprepade snabba ändringar och reset.
- Testa även **kombinationer** av reglage: `B ∝ I/r`, `I = U/R`, `U = U₁ + U₂` i serie, `I = I₁ + I₂` parallellt, `P = D·Q + R` vid polynomdivision.
- **Mät faktiskt renderad SVG-geometri och visade pixlar.** Att texten visar rätt värde eller att ett SVG-attribut uppdateras räcker inte om elementet inte syns, ligger under något annat eller ritas på fel plats.
- Om en pil avsiktligt endast anger **riktning** SKA det framgå och dess längd inte feltolkas som storlek. För storleksjämförelse används förklarad, konsekvent och helst fast skala; automatisk omskalning får inte dölja en förändring.
- Kontrollera `hidden`, `display`, CSS, överlappning, lager och att dynamiskt återskapade DOM-delar fortfarande syns.

Animationer SKA testas vid flera verkliga mellanlägen, inte enbart start och slut. Paus, stegning, återspelning och återställning testas när sådana funktioner finns.

## 11. Visningsstorlekar och tillgänglighet

Granska faktiska tillstånd med **webbläsarskärmbilder**, åtminstone:

- **Mobil:** 390 × 844 px.
- **Mindre skärm/smal dator:** ca 768 px bredd; notera vertikala höjdproblem.
- **Dator/klassrum:** 1280 × 800 px.
- **Projektor:** 1920 × 1080 px.

För varje relevant storlek: öppna första tillståndet, ett mellanläge och den kompletta återkopplingen. Kontrollera verkligt innehåll **i synligt fönster**, inte bara full-page-skärmbild. Ingen horisontell sidbeskärning; text och matematiksymboler ska gå att läsa; kontroller ska vara tillräckligt stora och möjliga att använda.

Interaktioner SKA gå att använda med mus/touch och relevanta tangentbordsfunktioner. Färg, ikon eller riktning SKA inte vara den enda förklaringen; använd begripliga texter, lämplig kontrast, fokusmarkering och meningsfulla bildbeskrivningar när möjligt. Inga personuppgifter eller elevinloggningar tillförs.

## 12. Innehåll som SKA bevaras

Bevara korrekta matematiska mellanled, lektionsmål, elevuppgifter, läroboksuppgifter/sidor, läxor, klassrumsdemonstrationer, PhET där den finns, lärarstödet, frivilliga utmaningar, elevens arbete på papper och **Socrative endast när det faktiskt finns i originalmaterialet**. Skapa inte en ny Socrative-aktivitet utan stöd i originalet. Flytta bara moment när det ökar lärandet och motivera flytten.

Ta bort **intern elevirrelevant metadata** som ”Original: [presentationsfil].pdf, s. X”, tekniska filnamn, utvecklarkommentarer och andra detaljer som hör hemma i kod eller granskningslogg. Ta **inte** bort relevanta lärobokshänvisningar och uppgiftsnummer för att de liknar en källangivelse.

## 13. Obligatorisk verifiering – fyra oberoende nivåer

**A. Ämnes- och didaktikgranskning:** Läs hela elevflödet och identifiera förutsättningar, feluppfattningar, saknade figurer och missvisande beräkningssteg. Kontrollera att varje viktig relation har rätt visuellt stöd och att elevens tänkande föregår facit.

**B. Oberoende teknisk testning:** Skriv förväntade värden, riktningar, placeringar och topologier **innan** koden ändras. Testa hela tillståndsmatrisen, rätt/ fel återkoppling, navigation/reset, numerik, SVG-ändpunkter, faktiska bildpixlar, icke synliga facit och JS-fel. Kör befintliga kursregressioner. Ändra inte meningsfulla tester bara för att få grönt.

**C. Mänsklig inspektion av riktiga renderingar:** Öppna och granska faktiska skärmbilder eller sidan i webbläsare vid mobil, dator och projektor. Titta **både på figurens fysik och på om eleven kan tolka den**. Bekräfta att figuren finns där den behövs, är rätt orienterad och visas vid rätt steg. Markera kvarvarande layoutvarningar uttryckligen; en generell grön testsvit får inte gömma dem.

**D. Publicering och regression:** Gör alla relaterade ändringar med tillhörande tester på en separat gren, enligt `AGENTS.md`. Kontrollera senaste `main` och bevara parallellt arbete; aldrig force-push. Slå samman en sammanhållen, godkänd ändring. Verifiera **full kurs-QA och GitHub Pages på samma publicerade lektionskod-SHA**. Skilj tydligt på pågående, misslyckad och godkänd CI.

En ändring av enbart dokumentation behöver inte få alla kurslektioner nygranskade, men dokumentet och publiceringen måste verifieras. En ändring i lektionskod kräver alltid relevant regression.

## 14. Blockerande fel – får inte godkännas

Markera **ÅTGÄRD KRÄVS** om något av följande kvarstår:

- En nödvändig figur saknas, eller en knapp lovar en figur men visar bara text/formel.
- Förklaringsbilden visar fel riktning, fel referenspunkt, fel skala, fel geometri, fel koppling eller felaktigt matematiskt steg.
- Handgrepp, batterikontakt, gradkolumn eller annan avgörande form är svår att urskilja i faktisk undervisningsstorlek.
- Facit visas för tidigt eller en felaktig figur står kvar som enda bild efter återkopplingen.
- En reglageändring ger rätt tal men fel, statisk, dold, osynkron eller felaktigt omskalad bild.
- Ny eller befintlig matematik försvinner, skrivs över, förkortas felaktigt eller hamnar långt från sin figur.
- Lösningsbilden skrivs över av en senare renderare, försvinner vid omstart eller visar ett äldre tillstånd.
- Figuren kräver oacceptabel scrollning eller beskärs i dator-/projektorvyn.
- Originaluppgifter, Socrative eller demonstrationer försvinner utan uttryckligt godkännande.
- Obligatoriska testfall saknas, riktiga skärmbilder är ogranskade, tester fallerar eller publicerad kod inte har verifierats.

**Mindre dokumenterade begränsningar** (till exempel normal vertikal mobilscroll, ej tillgång till fysisk skolprojektor, avgränsade Safari-test) kan redovisas separat; de får inte beskrivas som utförda eller godkända tester.

## 15. Arbetsgång för exakt en lektion

1. Läs senaste kod, `AGENTS.md`, denna specifikation och permanenta loggen.
2. Fastställ lärandemål och gör en **bild-för-bild-inventering**, inklusive det som saknas.
3. Skriv en konkret fellista, risken för elevens förståelse och vad som ska vara synligt **före/efter** återkoppling.
4. Definiera förväntade ämnessamband, grafisk geometri och oberoende testfall.
5. Ändra lektionskod och komplettera test/ lärarstöd **utan att radera matematiken**.
6. Testa funktioner, reglage, möjliga kombinationer, reset, navigering och facitdöljning.
7. Granska den faktiska renderingen i alla föreskrivna storlekar; vid behov justera och testa igen.
8. Kör riktad QA och full relevant kursregression på arbetsgrenen.
9. Inspektera skärmbilderna och verifiera att resultaten **är begripliga**, inte bara programtekniskt riktiga.
10. Publicera genom sammanhållen PR/commit, och verifiera `main`, hela QA-sviten och Pages på rätt SHA.
11. Uppdatera `granskning/figurer-interaktioner.md` med före/efter, fynd, fix, testbevis, öppna begränsningar och slutstatus.
12. Redovisa **endast denna lektion** i chatten och **stanna** tills användaren väljer nästa.

## 16. Permanent register och rapportmall

Loggen `granskning/figurer-interaktioner.md` SKA överst visa:

- **Genomfört antal av 41** och **senast behandlad lektions titel/registreringsnummer**, utan att blanda ihop dessa.
- Aktuell status: `ej påbörjad`, `analyseras`, `åtgärdas`, `verifieras`, `åtgärd krävs`, `klar` eller `blockerad`.
- **Vad som saknades eller var fel**, hur elevförståelsen påverkades, vad som ändrades och vilka ursprungliga moment som bevarades.
- **Vad som faktiskt är verifierat**: egna kontrollfall, kod/ämnescheck, Chromium-/pixelresultat, manuellt granskade bilder, tillstånd före/efter, skärmstorlekar, full regression, commit och Pages. Redovisa uttryckligen det som ännu inte testats.
- **Öppna anmärkningar**, inklusive problem läraren uttryckligen skjutit upp; skilj visuellt godkännande från full ämnesgranskning.
- **Nästa handling** och om användarens `nästa` inväntas. Ange föreslagen nästa post men påbörja den aldrig automatiskt.

Avsluta rapporten med:

> **Figur- och interaktionsgranskning: X/41 färdiga – [kurs, lektion, registerpost].**  
> **Status:** …  
> **Fynd och förändringar:** …  
> **Verifierat:** …  
> **Kvarstående begränsningar:** …  
> **Lektionslänk och kodversion:** …  
> **Nästa handling:** Stannar och inväntar användarens beslut.

## 17. Lärdomar från de tre första lektionerna

**Fy2 – Ström ger magnetfält:** Rätt fysikord och ett ritat tvärsnitt räckte inte när handen var svårtolkad, greppet dök upp för sent eller lösningsfiguren uteblev. Rätt ordning: **visa greppet → låt eleven förutsäga → avslöja rätt fältpil**, med foto/hand, tvärsnitt och förklaring nära varandra. ”Hitta felet” kräver en korrigerad efterbild. En dold SVG kan ha rätt attribut och tal men ändå vara osynlig.

**Ma4 – Polynomdivision:** Matematiskt korrekt uppställning räckte inte när gradkolumner och aktivt steg var otydliga. Lösningsfigurer måste ligga efter rätt MathML-steg **också efter** att dynamiska matematikskript byggt om DOM. Teckenfel och `0x²` kräver konkret visuell återkoppling, inte enbart text.

**Fy1 – Serie- och parallellkoppling:** Korrekt beräkning räckte inte när spänningsfall och strömmar saknade synlig koppling till rätt resistor/nod, och när ersättningskretsens relation till originalet inte framgick. Ett tekniskt test kunde dessutom missa att vita batteribakgrunder dolde de faktiska ledningsanslutningarna. Därför granskas **topologi, verklig synlighet, varje förekomst och elevirrelevanta källfilnamn**.

**Samlad slutsats:** **Förekomst ≠ begriplighet. Korrekt tal ≠ korrekt bild. Grön CI ≠ färdig lektion.** En lektion får status `klar` först när alla relevanta krav ovan är uppfyllda och publiceringen är verifierad.
