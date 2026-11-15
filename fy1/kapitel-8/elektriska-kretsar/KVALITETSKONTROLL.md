# Kvalitetskontroll – 8.2 Elektriska kretsar

**Revision:** 2026-11-12. **Källa:** `261104 8.2 Elektriska kretsar.pdf`, samtliga 9 originalsidor. **Separat labb:** `261109 Kopplingslabb PhET.pdf` (inte konverterad).

## Originalinventering och bevarande

| Originalbild | Innehåll | Webbsida | Status |
|---|---|---|---|
| 1 | Startfråga: förbrukas ström? mål | 1 | Bevarad, kretsschema och lärarstyrt facit |
| 2 | I=Q/t, U=E/Q, U=RI, 6 V / 30 Ω | 2 | Bevarad, MathML och kretsschema, stegvis lösning |
| 3 | Q, E, elektronantal under tid | 3 | Bevarad, modell som räknar I, Q, E och N tillsammans |
| 4 | Knutpunkten, 0,50 A in och 0,20 A ut | 4 | Bevarad med tydligt schema och teckenriktning |
| 5 | Resistansens beroende av längd och diameter, Physics at School VI försök 6 | 5 | Bevarad verklig demonstration, utbyggd jämförbar modell A/B/C |
| 6 | 10 m koppartråd med d=0,50 mm och ρ=0,018 Ω·mm²/m | 6 | Bevarad, figur med tvärsnitt, fem matematiska mellanled |
| 7 | Eget bokarbete, 812–828 s.279–280, prioritet 814/819/822/824 | 7 | Samma hänvisningar, prioriterat och tidsskyddat |
| 8 | Avslutningskontroll av tre mål | 8 | Tre frågor med stegvis facit och självbedömning |
| 9 | Referensstöd inför laboration | 9 | Behållet som extrastöd, korrekt A/V-schema, PhET-länk |

**Bok och läsning:** uppgifter 812–828 på s. 279–280; de prioriterade uppgifterna 814, 819, 822, 824 och övriga från originalet. Läsning s. 270–278, särskilt gröna rutorna inför labben. **Socrative:** finns inte i originalet; därför ingen Socrative i webblektionen. Fyra nya *webbfrågor* är egna korta formativa självkontroller, inte Socrative.

## Didaktisk granskning

- Eleverna gör egna förutsägelser före facit, med enskilt → par → gemensam som flexibel arbetsform.
- Aktivering och återkoppling på start, tid–ström, förgrening och diameter, inte bara fler reglage.
- Den verkliga demonstrationen Physics at School VI, försök 6, har inte ersatts av simulering.
- Lösningarna använder MathML där bråk är viktiga; figur, fråga och mellanled ligger på samma lektionsbild.
- Tidsramen i lärarstödet summerar till 70 minuter: 5 + 7 + 7 + 5 + 8 + 8 + 25 + 5. Bild 9 är valfritt stöd, inte ytterligare gemensam genomgång.
- Lektionens slut kontrollerar begrepp, beräkning och proportionellt resonemang.

## Fysikaliska kontroller

- Stationär oförgrenad krets: samma ström före och efter resistorn; laddningen bevaras.
- I = U/R, Q = It, E = UQ, N = Q/e – konsekventa enheter och ändring av parametrar. N bygger på *laddningsbeloppet* per elektron.
- Förgrening: 0,50 A = 0,20 A + 0,30 A ut; ingen laddningsansamling i stationärt tillstånd.
- Tvärsnittet är A = π(d/2)²; R = ρl/A. Fall A 0,9167 Ω, B 1,8335 Ω, C 0,2292 Ω för lika ρ.
- Gränsfall U=0, t=0, U=24 V/R=5 Ω/t=60 s, kort/lång tråd, tunn/tjock tråd, återställning.
- Trådens längd och diameter visas på *två skilda, men internt exakt linjära skalor* och detta upplyses uttryckligen.
- Ideala ledningar, ideal spänningskälla och konstant resistivitet är pedagogiska modeller, inte allmängiltiga påståenden.

## Teknik och tester

- **62/62 automatiserade kontroller godkända** i lokal Chromium via in-memory HTML/CSS/JS-injektion (webbläsarmotorn kör faktisk JavaScript och renderar SVG).
- Omfattning: navigation och piltangent efter knappfokus; klassrum kontra repetition; steg och återställning; fyra webbfrågor; två modeller, startvärden och ytterlägen; inga JS-exceptions.
- Layout kontrollerad vid **1440×900, 1280×720, 768×1024, 390×844 och 320×640**, utan horisontellt sidöverspill i någon av nio bilder.
- Lokala skärmbilder har granskats för start, tids-/laddningsmodell, förgrening, trådmodell, räkneexempel, bokarbete, exit, inklusive mobil.
- Ingen inloggning, lokal lagring eller nätverksöverföring av elevsvar i webblektionens kod. Externa PhET-simuleringen öppnas bara när användaren väljer länken.

## Återstår (ingen överdriven verifikation)

- Verifiering att GitHub Pages efter publicering serverar alla lokala `.css` och `.js` med korrekta `200`-svar – lokala tester har använt injicerade resurser, inte HTTP-servern i produktionsmiljön.
- Faktisk Safari-testning på iPhone/iPad, fysisk projektor och klassrumsrespons.
- Mätning av faktiskt lektionsflöde och om 25 min bokarbete ryms för elevgruppen.

**Slutsats:** Fysik, innehåll, lokala funktioner och visualiseringsprinciper granskade och korrigerade. Tekniskt klar för produktionskontroll; *inte* klassrumsverifierad.

## Avgränsad förbättring: resonemangskontroll (2026-11-12)

- 8.2:s frivilliga självtest kräver efter rätt numeriskt svar en motivering av laddningens bevarande respektive R ∝ l/d². Specifika felslut får återkoppling. Fullständig lösning är valfri och tillgänglig efter rätt resonemang; fritext bedöms inte automatiskt.
- Förutsägelser finns redan i lektionsbilderna och används utan digitala dubbelfrågor. Den verkliga demonstrationen, originalets bokuppgifter och separat PhET-labb påverkas inte.
- Tidsram och skyddad boktid är oförändrade. En avgränsad lokal Chromium-kontroll av förklaringsflödet passerade tillsammans med 8.1 (36 av 36 testpunkter totalt i revisionsunderlaget), men Pages/Safari och elevprövning återstår.


## Didaktisk uppdatering – penna och papper först (2026-11-12)

I avsnitt 8.2 används nu ett separat frivilligt självtest: två nya beräkningsproblem löses på **papper** utan numeriska inmatningsfält på webben. Den första uppgiften ger ett startsteg, den andra ska lösas mer självständigt. Eleven kan visa ledtråd och beräkningslösning stegvis. Efter papperslösningen väljer eleven en fysikalisk begreppsförklaring bland tre alternativ och får specificerad återkoppling på vanliga missuppfattningar.

Originalets bokhänvisningar, verkliga demonstrationer, Socrative där sådan finns och den skyddade boktiden påverkas inte. Den digitala frågan bedömer ett **valt resonemang**, inte alla elevens mellanled. Ingen elevinloggning, numerisk svarslagring eller överföring införs.

**Verifiering:** JavaScript-granskning, data-/sökvägskontroll och begränsad lokalt genomförd webbläsartestning; inga nya påståenden om faktiskt prövad GitHub Pages-visning eller elevresultat. Kontroll i Safari, på projektor och i klassrum återstår.

## Fördjupad granskning av lektion #39/41 – elektriska kretsar

- **Original:** 9 publicerade webbilder (äldre metadata namnger `261104 8.2 Elektriska kretsar.pdf` med nio originalsidor). PDF kunde inte nås för direkt visuell källjämförelse; granskningen avser alla 9 befintliga webbilder och dolda steg. Den fristående PhET-labben `261109 Kopplingslabb PhET.pdf` ändras inte. Bevara **Physics at School VI, försök 6**, samtliga bokuppgifter **812–828 s.279–280**, prioriteringen **814, 819, 822, 824**, lässtöd **s.270–278 gröna rutorna**, den riktiga separata PhET-länken och den skyddade **25 min boktid**. Ingen Socrative har funnits i originalet, ingen tillförs.
- **Ett väsentligt diagramfel har rättats:** trådens bildlängd var tidigare `95+275·l/20`, diameterns tjocklek `7+13d`, ändytans radie `20+25d`. Dessa har additivt offset och **dubbelt l/d såg inte dubbelt långt/tjockt ut**. Nytt exakt `L_svg=18·l_m`, `thickness=30·d_mm`, `cross_radius=30·d_mm`. Den **ritade cirkelarean** blir därför verkligen **4 gånger större vid dubbelt d**, vilket överensstämmer med **R=ρl/A och R ∝ l/d²**. Separat absolut 0–12Ω-mätstapel med bredd `345·R/12` visar faktisk resistans och korrekta A/B/C-kvoter.
- **Strömmodellens visuella amplitud:** De gamla kvalitativa strömpilarna hade samma längd oavsett U/R, och Q/E ändrade bara text. Nu förklaras strömpilar som **riktningssymboler**, samtidigt som tre helt fasta gemensamma mätstaplar **I:0–5 A (340·I/5)**, **Q:0–300 C (340·Q/300)** och **E:0–7000 J (340·E/7000)** är kvantitativa. Extremreglagena `U=24V,R=5Ω,t=60s` ger I=4,8A, Q=288C, E=6912J utan överstyrning eller förstörd proportion. Vid `U=0` är I,Q,E,N noll; vid `t=0` är I ändlig, men Q,E,N noll.
- **Fullständigare matematik:** oberoende numeriskt `I=6,0V/30Ω=0,20A`, `Q=I·10s=2,0C`, `E=UQ=12J`, `N=Q/e≈1,25·10¹⁹≈1,2·10¹⁹`. Knutpunkt `0,50A=0,20A+0,30A`. Tråd `d=0,50mm`, `r=0,25mm`, `A≈0,196mm²`, `R≈0,917Ω≈0,92Ω`. För dubbelt l blir R×2, för dubbelt d blir A×4 och R/4. Exit `I=0,10A,U=4,0V,t=20s⇒Q=2,0C,E=8,0J`. Alla beräkningsled uppdelade i självständiga semantiska MathML-rader med mätta mellanrum ≥16px på 390/1440/1920px.
- **QA före publicering:** systematisk riktad Chromium/Playwright för alla 9 bilder och alla dolda steg, fyra originalwebbfrågor, verkliga `<rect>`/`circle`-koordinater, absoluta linjära mätstaplar, SI- och numerikgränsfall, två frivilliga pappersövningar, klassrum/repetition, reset, screenshots vid mobil/dator/projektor, samt oförändrad tidigare regression. Safari på fysisk Mac/iPad, OBS/AirServer, riktig projektor och faktisk elevinlärning kan inte påstås testad.
