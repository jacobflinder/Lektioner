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
- Trådens längd och diameter visas på *olika skalor* och detta upplyses uttryckligen.
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
