# 8.6 Potential – kvalitetssäkring, reviderad webblektion

Datum: 2026-11-12. Original: `Fy1_Potential.pdf` (16 sidor). Publiceringsmål: `fy1/kapitel-8/potential/`.

## Källinventering och bevarande

| Webb-bild | Original-PDF | Bevarat moment |
|---|---|---|
| 1 | 1 | Potential i en punkt mot spänning mellan två; mål och start 12 V/8 V |
| 2 | 2 | **Verklig demonstration med kateder, bänk och golv**, 12/8/0 V som analogi |
| 3 | 3 | **Voltmeter, mätordning**, U_AB och U_BA; −3/+2 V som elevuppgift |
| 4 | 4 | Plattor +100/0 V, elektriskt fält och elektronens riktning, E_p=qV |
| 5–6 | 5–6 | Byte av referens till 0/−100 V; ingen ändring av spänning, fält, kraft |
| 7 | 7–9 | Potentialvandring med 12 V, 2 Ω, 4 Ω, 2 A; originalets före/animation/efter ersatt av stegstyrd modell |
| 8 | 10 | Ohms lag, 12→8→0, Kirchhoffs spänningslag med tecken |
| 9 | 11 | Byt vald referens från A till C utan att ändra kretsen |
| 10 | 12 | Negativa potentialer och skillnaden mellan referens och fysisk jordledning |
| 11 | 13 | Motverkande/samverkande 10 V och 6 V-källor, 2 Ω, 2/8 A |
| 12 | 14 | **Befintlig Socrative 905: SOC-37397534**, enskilt → par → ompröva |
| 13 | 15 | **Boken 861–870, s. 313–314**, stöd **8.6, s. 309–312**, gröna rutorna och målanknuten exit |
| 14 | 16 | Frivillig fördjupning: två källgrenar, V=7 V och I₁+I₂=1,75 A |

Webbens tre nya frågemoment är tydligt skilda från originalets Socrative. Ingen ny Socrative har tillskrivits originalet. Den verkliga höjddemonstrationen har inte ersatts av en skärmsimulering.

## Fysik och matematik

- U_AB = V_A − V_B med definierad mätordning. 12−8=+4 V; −3−(+2)=−5 V.
- Plattornas potentiella skillnad är 100 V oavsett om potentialerna ges som +100/0 V, 0/−100 V eller annan gemensam förskjutning. Elektronens kraft pekar mot högre potential i originalets fält.
- Ideala seriekretsen har R_tot=6 Ω, I=2 A, och A/B/C/D/A = 0/12/8/0/0 V vid A=0. Vid C=0 blir A/B/C/D = −8/+4/0/−8 V. U_BC är +4 V i båda fallen. Slutna slingan ger +12−4−8=0 V.
- I tvåbatterifallet ger idealmodellens riktade ems 10−6 respektive 10+6 V, och med 2 Ω erhålls 2 respektive 8 A. Symbolernas långa streck anger pluspol, korta minuspol.
- Fördjupningsgrenar: I₁=(10−V)/2, I₂=(8−V)/4 och I=V/4 i A, med V=7 V; I₁=1,5 A, I₂=0,25 A, I=1,75 A. Även där saknas ledning som förbikopplar resistorerna.
- Visuellt kontrollerat att figurernas resistorledningar har avbrott vid komponenten, och att referensval inte ritas som en ny fysisk kabel.

## Didaktik och genomförande

- Originalets mål kontrolleras i exit: potential/spänning, tecken i potentialvandring och nollnivå.
- **14 webb-bilder, nio statiska figurer, tre styrbara modeller** (plattornas referens, potentialtrappa, två batterier), tre åtskilda självkontroller. Övriga frågor genomförs muntligt eller på papper.
- Dynamiskt avslöjande för potentialvandring visar enbart undersökta steg; resultaten fortsätter följa ändrade parametrar efter första avslöjandet. Återställ döljer resultaten.
- Matematik visas i MathML där bråk är centrala, kompletterat med stegvisa mellanled och enheter nära figurerna. Annat kort numeriskt innehåll använder tydlig typografi.
- Lärarstöd prioriterar enskilt → par → gemensam återkoppling och en möjlig 70-minutersram med 21 minuter skyddat bokarbete. Batterifördjupning och sista komplexa exemplet kan kortas vid tidsbrist.

## Genomförd teknisk test

- **119/119 automatiserade lokala Chromium-kontroller** i `qa/potential86-results.json`: bildantal, originalhänvisningar, navigation, klassrum/repetition, återställning, MathML, numerik och referensbyten, tvåbatterifall och typiska felvägar.
- Parametergränser: referensförskjutning −100, −50, 0, +75 och +100 V; potentialvandring steg 0–4 och både nollnivå A/C; batteri mot/med. Alla ger konsekventa utdata utan undantag.
- Samtliga 14 bilder vid bredd **1440, 1280, 768, 390, 320 px**: ingen horisontell sidöverströmning i testmiljön. Ett urval bilder visuellt granskat via Chromium-skärmbilder.
- Ingen egen dataöverföring, elevinloggning eller svarslagring finns i denna lektionskod. Gemensam app för andra lektioner ändras inte.

## Viktig avgränsning

Detta avser **källgranskning, kodgranskning, lokala Chromium-tester och visuell skärmbildskontroll**. Det är inte en fullständig kontroll av faktiskt publicerad GitHub Pages-URL i Safari, iPad, projektor, skärmläsare eller klassrum. Vetenskaplig grund avser undervisningsprinciperna, inte ett bevis för att just denna webbdesign förbättrat lärandet.


## Uppföljning 2026-11-12 – självtest med pappersberäkning
- Självtestet är ändrat från numerisk inmatning till **beräkning på papper**, tre frivilligt avslöjade lösningssteg och **begreppsfråga med specifik förklarande återkoppling**.
- Uppgift 1 har ett första steg och uppgift 2 saknar förhandsstöd. Ingen ny Socrative och inga ändrade bokuppgifter eller demonstrationer.
- Fysikkontroll: 9,0 V över 1,0+2,0 Ω ger 3,0 A. V_C = +6,0 V om A = 0 V; referensbyte till C = 0 V ger V_B = +3,0 V men oförändrat U_BC.
- Separat lokal interaktionsprototyp med motsvarande två uppgifter granskades i Chromium (300 kontroller sammanlagt för båda lektionerna), vid 320, 390, 768, 1280 och 1440 px. Detta verifierar **inte** live-publicerad Pages, Safari eller faktiskt elevlärande.

## Ordinarie figur- och interaktionsgranskning – register #31, arbetsordning 32/41, v2.3 (19 november 2026)

**Källmaterial och tidigare analys:** Denna revision bygger på den faktiska elevsidan med 14 bilder, lärarstödet, de tidigare 604+ modell-/formel-/figurkontrollerna och källinventeringen ovan. Den ursprungliga `Fy1_Potential.pdf` har inte varit tillgänglig för en ny visuell sida-mot-sida-jämförelse. Tidigare slutsatser behålls som historik, men är inte en ersättning för en ny visuell kontroll enligt v2.3.

### Bild-för-bild-behov, representationsform och elevens egen aktivitet

| Webb-bild | Kunskapsbehov/figur | Före och efter eget försök |
|---|---|---|
| 1 | Två mätta punktnivåer A=12 V och B=8 V; riktad differens och begreppsskillnad | Punktskissen finns initialt; U_AB framträder i tre separata MathML-steg |
| 2 | Skillnaden mellan nivå och nivåskillnad måste upplevas fysiskt | Verklig kateder–bänk–golv-demonstration behålls, inte utbytt mot virtuell figur; 4 och 8 V först i återkoppling |
| 3 | Voltmeterprobernas riktning, −3 och +2 V | Voltmeterfiguren, egen teckenförutsägelse, fulla åtta ursprungliga uträkningar och separat quiz med semantisk MathML för val och feedback |
| 4 | Fältpilar för +100/0 V, F för elektron i motsatt riktning | Plattskissen och tecknad q-energi, inte enbart ord |
| 5 | Justerbar referens utan ändrat E/F | Plattmodellen visar först förutsägelse, sedan fyra E-pilar och en elektron-kraftpil vid −100…+100 V referensskifte |
| 6 | Två jämförda nollnivåer +100/0 och 0/−100 | Fältriktning och skillnad förklaras i MathML utan att rita en ny fysisk koppling |
| 7 | Kretsvandring +12−4−8=0 och potentialernas utveckling | Stegvis graf med synlig fast voltaxel −8…+12 och vald nollnivå A/C; endast undersökta punkter avslöjas |
| 8 | Tecken för varje spänningsuppgång och resistorfall | 13 separata matematiska rader, samma kretsvärden 12 V, 2/4 Ω och 2 A |
| 9 | U_BC ändras inte när C blir noll | Den givna slingan och potentialtabellen följs av eget val och MathML-förklarad rätt/fel-återkoppling |
| 10 | Negativ potential och fysisk jordledning är skilda saker | Skissen visar jämförelse med vald referens, inte en tillagd kortslutande tråd |
| 11 | Motverkande/samverkande 10 och 6 V-källor | Verklig polorientering, fördröjt svar, 2 eller 8 A på samma fasta 0–8 A-skala; den gröna strömpilen är avsiktligt kvalitativ |
| 12 | Originalets Socrative 905 och enskilt/par/ompröva | Ingen ny skärmmodell behövs här och ingen påhittad ny Socrative införs |
| 13 | Bokarbete 861–870 och individuell exit med +5/−1 V | Arbetsuppgifter och exit står kvar; tre fördröjda MathML-steg och originalquiz. Frivillig, stängd femsambandssammanfattning finns efter exit och quiz i samma arbetsvy, inte som ny sida eller läckande facit |
| 14 | Frivillig tvåkällors Kirchhoff-koppling | Fysikaliskt helt tregrensschema, 16 beräkningsrader och självvald fördjupning; ingen ny obligatorisk elevuppgift |

### Rättade obligatoriska brister

1. `Original: Fy1_Potential.pdf, s. X` var teknisk källmetadata som appen skrev ut för elever på alla 14 bilder. Endast denna första metadataetikett tas nu bort från elevvyn; sidkoppling och relevanta undervisningstaggar finns kvar i data och granskningslogg.
2. Inget valfritt lektionsspecifikt formelstöd fanns i arbetsvyn. Ett inbyggt `<details>`-stöd efter exit/quiz innehåller **fem redan behandlade** samband: U_AB=V_A−V_B, Ohms lag U=RI för ohmsk resistor, ΣΔV=0, gemensamt referensbyte V'_i=V_i−V_ref och ΔE_p=qΔV. Tecken, antagande och q-laddning förklaras kort. Allt är dolt tills eleven själv öppnar, öppnas med tangentbord/touch och stängs vid reset, bildbyte och lägesbyte. Ingen boklösning har tillförts; 21 minuters skyddat bokarbete och uppgifternas nummer/sidor är oförändrade.
3. De tre originalquizens **renderade** frågor, svarsalternativ och återkoppling innehöll uttryck som vanlig Unicode-text. Nu visas semantisk native MathML i elevens faktiska val och i två åtskilda uträkningar först efter lärarens facitklick eller omedelbart i repetitionsläge. Ursprungliga tre svarnycklar, elevens förutsägelse och klassrummets fördröjning har behållits.
4. Vid faktisk AI-granskning av det första bildpaketet syntes ett gammalt uttryck `ΔEₚ=qΔV` som vanlig text i plattmodellens dynamiska svar trots dess tre korrekt satta matematikrader. Den synliga raden har fått **inline-MathML med tecknad laddning q**. Samma bildgranskning visade att ett nytt quizmellanled skrevs som `−1 V − +5 V`; det har fått tydliga parenteser kring den andra positiva potentialen. Båda förbättringarna testas i nästkommande fulla körning.

### Verifikationskrav för denna revision

Ny oberoende `qa/figure-interaction-potential-v23.cjs` kontrollerar alla 14 bildvyer vid 390×844, 768×900, 1280×800 och 1920×1080: synlig grafik och SVG-text, faktiskt ritade MathML-pixlar/mellanrum, horisontell sidpassning och frånvaro av PDF-raden. Dessutom provas teckenreferens −100/0/+100, A/C-nollnivå och nodprickarnas faktiska y-koordinater, 2/8 A-strömbar, tre quiz före fel/rätt/nytt val/reset/repetition, stöd öppet/dolt/reset/navigation/mode samt oförändrade originaluppgifter. Äldre `deep-review-fy1-40.cjs` och samtliga andra Fy1-regressioner körs **utan att meningsfulla testkrav sänks**. Riktiga skärmbilder för varje tillstånd ska öppnas och bedömas innan någon slutstatus eller publiceringskvalitet kan anges.

## Historik: systematisk fördjupningsgranskning 40/41 · Potential

**Källstatus:** den åtkomliga webblektionen innehåller **14 webbilder**, och tidigare lektionsdokumentation anger original-`Fy1_Potential.pdf` med 16 sidor. Ingen direkt återfinnbar original-PDF kunde öppnas i projekt-/konversationsfiler för denna granskning, så originalets tryckta sidlayout är inte direkt verifierad. Bevara den verkliga kateder-/bänk-/golv-demonstrationen, **Socrative 905 `SOC-37397534`**, **bokens 861–870 s.313–314**, lässtöd **8.6 s.309–312** och **gröna rutorna**, skyddade **21 min bokarbete**, frivilligt papperstest och ursprungliga tre webbquiz. Ingen ny Socrative ska tillföras.

**Fysikaliska kontrollpunkter (oberoende):**
- Potential är referensberoende, medan `U_AB=V_A−V_B`, fält och kraft i oförändrad geometri är referensinvarianta. 12V−8V=+4V och (-3V)−(+2V)=−5V; elektronens F är motsatt E, dess `E_p=qV` kan skifta med nollnivån men **energiändringar** gör det inte.
- Seriekrets: 12V och 2Ω+4Ω ger I=2A, nivåer A/B/C/D/A=0/12/8/0/0V eller vid C=0: −8/+4/0/−8/−8V. Fallet över resistorerna är −4/−8 V med strömmen, kontroll +12−4−8=0.
- Två idealbatterier 10V och 6V i serie över 2Ω: rätt tecken för polorientering, netto-ems 4 eller 16 V och ström 2 eller 8 A i samma valda positiva riktning.
- Avancerad frivillig förgrening: I₁=(10−V)/2, I₂=(8−V)/4 och I=V/4, Kirchhoffs första lag ger 2(10−V)+(8−V)=V ⇒ 28=4V ⇒ V=7V, I₁=1,5A, I₂=0,25A, I=1,75A. Exit +5−(−1)=+6V; vid nytt A=0 blir B=−6V, U_AB oförändrat.

**Identifierade förbättringar:**
- Modellen med de två batterierna bytte siffrorna **2 A → 8 A** när polen vändes, men visade alltid samma långa strömpil. Riktningspilen förklaras nu som **kvalitativ**; en ny helt fast, linjär **0–8A-mätstapel** med färgad SVG-längd `382·I/8` visar verklig modellström. Inget färgat mätvärde före elevens förutsägelse, nollnivå och polvändning återställs på vanligt sätt.
- Potentialvandringen hade en opåskriven graf med horisontella nivåstreck och trappsteg som kunde förväxlas med en skiftande skala. Nu markeras den **fasta lodräta voltaxeln −8…+12 V** (inklusive 0/4/8), och grafen ges större höjd för att titel och höga/negativa potentialer inte ska överlappa. Ändrad referens ändrar varje ritat y-värde med exakt **8 V × 8,4 SVG-enheter/V**, inte potentialskillnaden.
- Självständiga ekvationer separerade till semantiska MathML-rader, även i de **tre interaktiva modellernas dynamiska resultat**, i stället för ihoptryckta uttryck och två math-element i samma visningsrad på fördjupningen. Minst 16px faktisk vertikal luft och ingen horisontell klippning krävs på 390/1440/1920.

**Verifikation före publicering:** ny riktad Chromium/Playwright på samtliga 14 elevbilder, dolda steg, referens- och teckenfall, originalquiz, det frivilliga papperssjälvtestet, faktiskt ritad voltaxis och batterimätarens bredder, matematikens geometri, klassrum/repetition/reset samt oförändrade tidigare sviter #36–39. Resultat markeras inte som passerade förrän Actions och skärmbilder faktiskt verifierats. Fysiskt Safari/iPad/Mac/OBS/AirServer, projektor, katederdemonstration och elevlärande ligger utanför automatiserad testmiljö.
