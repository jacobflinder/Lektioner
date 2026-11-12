# Ma – fortsättning nivå 1c · kvalitetsrond 2

**Påbörjad:** 2026-11-12. **Omfattning:** de tio ursprungspublicerade webblektionerna, **två lektioner per omgång**. Denna rond ersätter inte original-PDF:er, lärobokens uppgifter eller den redan gjorda matematiska granskningen.

## Bedömningsprinciper

Målet är **självständigt matematiskt lärande**, inte maximalt antal reglage eller slides. Granska efter didaktiken i `Ma3c_2627_Didaktisk_grund_och_lektionsstruktur_v1.4`:

1. **Matematiskt mål och kontroll:** varje gemensam aktivitet ska bidra till ett avgränsat mål, och utcheckningen ska göras utan det digitala stödet.
2. **Förutsäg före facit:** graf, siffra eller rätt alternativ får inte automatiskt avslöja precis det eleven skulle resonera fram. Återkoppling ska komma efter eget beslut.
3. **Stöd som avtar:** genomarbetat exempel → egen tillämpning utan föreskriven steglista → hjälp som öppnas vid behov. Efterfråga både beräkning och motivering.
4. **Lektionslängd och metodik:** skilj kärnväg från valfri fördjupning. Skydda sammanhängande bokarbete och lärarens frihet. Tidsramarna är riktmärken för en hypotetisk 70-minuterslektion – inte ett påstående om faktiskt schema.
5. **Lärarens beslut:** beskriv *vad i elevsvaret* som bör leda till extra stöd eller direkt fortsatt eget arbete. Observationer görs på klassnivå, utan insamling av personuppgifter.
6. **Återkallning och överföring:** planera en kort fråga senare där samma idé används med nya tal eller en ny form, utan tidigare graf eller lösningsmall.
7. **Matematisk precision:** skilj derivatans tecken från funktionsvärdet; stationär punkt från extrema; terrasspunkt från bara samma derivatatecken.
8. **Teknik som miniminivå, inte bevis:** Chromium-tester av reglage, matematik, tillgänglig navigation, klassrums-/repetitionsläge och mobilvy. Förbättrad lärandeeffekt kan först bedömas med elevlösningar och klassrumsobservation.

## Omgång 1 · lektion 1–2

### Lektion 1: Växande och avtagande

**Bevarat:** originalens graf, tangentundersökning, teckentabell och `f(x)=6x−x²` med fem genomarbetade led, egen uppgift `f(x)=3x²−12x`, motexemplet `g(x)=x³`, bok s.142–144 och alla uppgifter/tre nivåer, läxa samt individuell utcheckning `f′(x)=4−2x`. Ingen Socrative skapad.

**Förbättrat:**
- Det numeriska svaret `f(0)=0,5` och `f′(0)=−1,5` i tangentmodellen är **dolt tills det aktivt visas**. Det avslöjar inte längre svaret på förutsägelsefrågan direkt.
- Egna uppgiften kräver en självständig motivering; fyra stegs stöd finns kvar, men bara när eleven öppnar det.
- Motexemplet `x³` är ett **valbart steg**, nåbart via en tydlig länk och avsnittsmenyn. Standardnavigationen går direkt från eget försök till det bevarade bokarbetet.
- Lärarstöd visar en kärnväg, möjlig tidsprioritering, tydliga diagnosbeslut (höjd/lutning respektive tecken/motivering) och en kort återkallning till nästa lektion.

**Observera i klass:** Vilka elever kan ange *varför* derivatan är positiv/negativ utan att avläsa grafmodellen? När behövs motexemplet? Hur mycket sammanhängande boktid blev kvar?

### Lektion 2: Extrempunkter och terrasspunkter

**Bevarat:** tre ursprungsgrafer i origo, derivatans teckentabell, `f(x)=x³−3x+2` som genomarbetat exempel, terrasskontrasten `x³+2`, elevuppgift `h(x)=−x³+3x`, bok s.145–148, originalens två uppgiftsspår, läxa som valt spår samt individuell utcheckning. Ingen Socrative skapad.

**Förbättrat:**
- Sifferavläsningen i reglagemodellen är **dold före elevens förutsägelse**.
- Efter det genomarbetade exemplet måste eleven ange **fyra egna koordinattal** (max/min, x/y), inte identifiera rätt punkter bland alternativ som redan visar facit. Lokalt stöd skiljer förväxlat max/min, fel y från `f′` och fel stationärt x.
- Elevernas eget försök ger inte en förutbestämd arbetslista, men valfritt stöd finns kvar.
- En valfri minut återkallning av derivatans tecken från föregående lektion är inbyggd med separat dolt facit.
- Lärarstöd anger kärnväg, förslag på tidsprioritering, konkreta undervisningsbeslut och ytterligare återkallning.

**Viktig matematisk korrigering:** Tecknen `+ 0 +` eller `− 0 −` garanterar frånvaro av extrempunkt men **garanterar inte ensamma en terrasspunkt för en godtycklig funktion**. I polynomexemplen är terrasspunkten säker därför att grafen också byter böjning. Utcheckningens ursprungliga `g′: − 0 −` med `g(−1)=4` är kvar, men elev och facit skiljer nu på den säkra slutsatsen *stationär punkt (−1,4), ingen extrempunkt* och den extra information som behövs för att säkert säga terrasspunkt.

**Observera i klass:** Kan eleverna beräkna `f(a)` och inte förväxla med `f′(a)` utan synliga svarsalternativ? Kan de motivera punkttyp med derivatans tecken, och notera vad som inte följer utan böjningsinformation?

### QA och genomförande

- `qa/browser-smoke.cjs` verifierar lektionsvägen som hoppar över valbar fördjupning, aktiv återgång till motexemplet, lärarstöd, dold sifferavläsning, egna svar, bokuppgifter och alla tio mobilavsnitten.
- `qa/extrempunkter-browser.cjs` verifierar valfri återkallning och dolt facit, input av egna koordinater med riktad felåterkoppling, matematisk korrigering i utcheckningen, originalläxa och alla nio mobilavsnitten.
- `mato1c-browser-qa.yml` kör dessutom regressionstest för resterande åtta lektioner. För full spårbarhet: använd senaste godkända GitHub Actions-körning och skärmbilderna därifrån. Automatisk godkänd kontroll är **inte** detsamma som observerad klassrumseffekt.
- Fullständig projektor-/iPad-prövning, faktisk tidsmätning och anonyma elevlösningar kräver användning i klassrummet.


## Omgång 2 · lektion 3–4

### Lektion 3: Andraderivatan

**Original och ramverk bevarat:** 8 lektionssteg med förutsägelse utifrån f(x)=x² och g(x)=2x, synkroniserade tangentgrafer och två genomarbetade exempel (polynom och exponentialfunktion), elevens egen h(x)=x³−6x², återkoppling, bok s.149 med båda originalspåren och 3128–3129 som merträning, läxa som valt spår och individuell utcheckning om f avtar när f″>0. Ingen Socrative fanns i källan.

**Ändringar efter kritisk didaktisk granskning:**
- De numeriska tangentlutningarna f′(x) och g′(x) visas **först när eleven aktivt väljer återkopplingen**; graferna och reglerbar tangentrörelse finns kvar för undersökningen. Eleverna måste själva jämföra vad som händer när x ökar.
- I eget försök skrivs **h″(x) som ett fritt uttryck** i stället för att välja bland fyra svarsalternativ, som tidigare råkade visa rätt uttryck. Kontrollen accepterar ax+b och ekvivalent omvänd termordning och skiljer på att ha stannat vid h′, tappat konstantterm, felpotens, fel värde vid 0 och fel nollställe.
- Lärarstöd anger en kärnväg med tidsramar som *riktmärke* vid cirka 70 minuter, bevarar båda genomarbetade exemplen, skyddar **minst 20 minuters sammanhängande bokarbete** och kopplar konkreta elevfel till vägval. Kort återkallning av begreppet f″ planeras till nästa lektion.

**Ännu att pröva i klass:** Räknar eleverna h″ korrekt utan svarsalternativen? Kan de skilja h″(x), h″(0) och h″(x)=0? Hur ofta behöver de se båda modelleringsexemplen i helklass?

### Lektion 4: Andraderivatans roll för grafen

**Original och ramverk bevarat:** samtliga 12 steg med mål och kognitiv aktivering, tangentundersökning av x²/−x², nödvändigt villkor f′(a)=0 före andraderivatatestet, arbetat exempel f=x³−3x+2, eget h=x²−4x+7, kontrasten x³/x⁴ då andraderivatatestet är obestämt, inflexionens kurva och teckenbevis, bok s.152 med alla tre nivåer och originaluppgiftsspår, tre snabba kontrollfrågor, individuell utcheckning och **läxa 3138 och 3141 a–b**. Ingen Socrative skapad.

**Ändringar efter kritisk didaktisk granskning:**
- **Kärnvägen** prioriterar f′(a)=0 → andraderivatatest → egen tillämpning → inflexion med matematiskt teckenbevis → bok → individuell utcheckning. Kontraststeget x³/x⁴ (steg 7) och extra kontrollfrågor (steg 11) är **valbara via synliga knappar och kapitelmenyn** och hoppas annars över i den vanliga navigeringen. Inget originalinnehåll har tagits bort.
- En kort, **valfri återkallning från lektion 3** av H′(x), H″(x) för H=x²−4x+7 ligger på startsidan med dolt facit.
- Siffror för tangentlutning och andraderivata är **dolda tills eleven efterfrågar dem**. Vid inflexionen ritas hela kurvan först utan färgfacit om krökningen; färgerna och teckenmarkeringarna visas först när slutsatsen öppnas.
- Den egna uppgiften ber nu om en **självständigt motiverad lösning utan punktlista**. Kontrollen av x-värde, klassificering och y-koordinat finns kvar.
- Lärarstödet innehåller realistisk tidsprioritering, **minst 20 minuters bokarbete**, diagnosvägar för missuppfattningarna f′(a)=0, f″(a)=0 och inflexion kontra horisontell tangent, samt plan för senare återkallning.

**Matematiska skyddsräcken:** f″(a)>0/<0 ger klassificering *för stationär punkt* f′(a)=0. f″(a)=0 ger inget besked om max/min, och ett ensamt nollställe för f″ bevisar inte inflexion utan teckenbyte. Inflexionspunkten (0,2) hos x³−3x+2 har f′(0)=−3 och därmed sned tangent.

**Visuell andragranskning:** Sparade Chromium-skärmbilder av båda lektionerna har granskats i dator- och mobilvy. Den grafiska genomgången var läsbar utan horisontell rullning. I lektion 4 upptäcktes ett svarsläckage: jämförelserubriken berättade redan före förutsägelsen vilken kurva som hade växande respektive avtagande lutning, och inflexionsgrafen markerade x=0 i förväg. Rubriken gjordes neutral och inflexionspunkten visas nu först när elevens återkoppling öppnas. Automatiskt test kontrollerar detta.

**QA:** `qa/andraderivatan-browser.cjs` och `qa/andraderivatans-roll-browser.cjs` utökades för dolda svar före förutsägelse, fria uttryck och felkategorier, lärarstöd/tidsprioritering, valbar återkallning, valbara steg som nås med klick och hoppas över i kärnvägen, numerisk inflexion och matematiska facit. Alla tio lektionsskripten körs tillsammans med Chromium-regression. Godkänt tekniskt test är ännu inte bevis på förbättrad faktisk inlärning; följ upp boktid och individuella elevlösningar.


## Omgång 3 · lektion 5–6

### Lektion 5: Funktionens graf och derivatornas grafer

**Källa:** `Ma3c_Funktionens_graf_och_derivatornas_grafer.pdf` (6 sidor, varav sista är lärarstöd). **Bevarat:** startfrågan f<0 men f′>0, jämförelse av tre grafer med samma x, minimum x=2, inflexion x=4 med f′(4)>0, maximum x=6; två möjliga g utifrån g′=−1; elevens egen f′=2x−4 med två parabler och f″=2; alla boknivåer s.154–155 (3146–3149, 3150–3152, 3153–3154), instruktionen att 3148 ska ritas digitalt, läxa 3149 och 3150 (extra 3153), samt individuell utcheckning h′=(x−1)(x−3) med extra p′=(x−2)². PDF:ens lärarstöd föreslår att frågorna *kan* användas i Socrative, men det finns inget färdigt Socrative – inget sådant har lagts till.

**Didaktisk omarbetning:**
- Undersökningen med tre grafer börjar med **förutsägelse och grafanalys**. De direktavlästa talen för f, f′ och f″ visas först när eleven/läraren aktivt begär dem; därmed ger inte gränssnittet facit före resonemanget.
- Teckentabellens klassificering av punkterna vid x=2,4,6 hålls dold under frågan *varför är x=4 inte en terrasspunkt?*. Samma princip gäller det arbetade exemplet g′=−1: figuren med två parallella linjer visas först efter att eleverna gissat hur två funktioner med samma derivata kan se ut.
- Elevens eget problem f′=2x−4 kräver **två egna skisser och motivering utan föreskriven arbetsgång**. Originalets steglista har inte tagits bort utan är valbar hjälp. Den styrbara vertikalförskjutningen C fanns redan och ligger kvar efter eget försök.
- En kort valbar återkallning från lektion 4 använder p(x)=x³ och testet p′(0)=p″(0)=0, med dolt facit.
- Lärarstöd: kärnväg för 8 befintliga steg, tidsprioritering om cirka 70 minuter som *riktmärke*, minst 20 minuter sammanhängande bokarbete, beslut utifrån om elever blandar höjd/lutning eller inflexion/terrass samt en senare fråga om g′(x)=2x−6 och flera möjliga g.

**Prövbar fråga:** Kan eleverna utan siffrorna från modellen dra slutsatser om f′ och f″ från graferna, och självständigt ange minst två funktioner med samma derivata? Hur stor del av boken hinner de arbeta med på två nivåer?

### Lektion 6: Största och minsta värde

**Källa:** `Ma3c_Storsta_och_minsta_varde.pdf` (8 sidor). **Bevarat:** startfunktionen g=x² på [−1,2], mål om *största/minsta värde* på slutet intervall, polynomexempel 3156 s.159 för f=x³−4,5x²+5 på [−2,5], egen uppgift h=−x²+4x på [0,5], grafik där bara högra intervallgränsen ändras mellan 3 och 5, bok s.159–160 (3157–3163, 3164–3166, 3167–3168), läxa 3161 a och 3164 a–b (extra 3168), individuell exit p=x³−3x på [0,3] och separat, dolt utcheckningsfacit.

**Didaktisk omarbetning:**
- Lektionskärna för 9 befintliga steg; grafreglaget ingår som en **kort hypotesprövning**, inte som ersättning för hela kandidaten-/värdejämförelsen. Lärarstöd anger beslutsregler om eleverna glömmer ändpunkter eller blandar funktionsvärden med x-värden.
- Siffran för högra ändpunktens höjd **f(b)** är dold tills eleven väljer att se beräkningen. Den ursprungliga ledtråden om exakt b=4,5 och två x med samma maximala värde är valbar, och snabbknappen b=4,5 visas först efter att eleven aktivt begärt gränsfallet. De korrekta matematiska kontrollvärdena och specialfallet finns kvar.
- Elevuppgiften h=−x²+4x kräver egen metod och motivering av jämförelsen utan färdig steglista; originalets tre steg visas som hjälp vid behov. Den befintliga **fria inmatningen av värde och x-position**, med riktad återkoppling, behålls.
- Lärarens tidsriktmärke skyddar minst 20 minuter ostört bokarbete. Fördröjd återkallning kan ske utan graf med k(x)=−x²+6x på 0≤x≤5: ändpunkter, stationärt x=3, största värdet 9 vid x=3, minsta värdet 0 vid x=0.

**Matematisk precision:** På [−2,3] är största f-värdet 5 vid x=0, minsta −21 vid x=−2. Vid b=4,5 är f(4,5)=5, så samma största värde antas vid både x=0 och x=4,5; vid b=5 blir största f-värdet 17,5 vid x=5. Skalan hålls fast, och diagrammet visar vad som faktiskt hör till intervallet. I egen uppgift är största 4 vid x=2 och minsta −5 vid x=5.

### QA och fortsatt observation

- Webbläsartesterna `qa/funktionens-graf-browser.cjs` och `qa/storsta-minsta-browser.cjs` täcker aktiv visning av dolda grafvärden/teckentabell/arbetsgång, valbar återkallning och gränsfallet b=4,5, alla ursprungliga matematiska värden och bokens spår, lärarstöd samt mobilvyer. Övriga åtta lektioner ingår i automatiska regressionstester.
- **Begränsning:** Det vi kan bekräfta digitalt är matematisk konsekvens, funktion och design. Om elevernas förståelse, självständighet eller långtidsminne faktiskt förbättras kräver klassrumsobservation, arbete i boken och senare återkallning.



## Omgång 4 · lektion 7–8

### Lektion 7: Extremvärdesproblem med polynomfunktioner

**Originalkälla:** `Ma3c_Extremvardesproblem_polynom.pdf` (9 sidor). **Bibehållet:** Exempel 3201 om datorskärmar `K=x³−9x²+15x+50`, x heltal ≥0 och kostnad i tusentals kronor; biljettmodellen `I(x)=1000x−5x²` för 0≤x≤200 i uppgift 3202; raketen `h(t)=40+10t−5t²` i uppgift 3204 (s.163); läroboken s.163–164 nivå 1 **3202–3207**, nivå 2 **3208–3210**, nivå 3 **3211–3214**, med utvalda starter 3203/3205/3209; läxa **3205 och 3209**, extra **3212**; individuell utcheckning `V(x)=−x²+6x−5`, x i tusental enheter och V i tusentals kr/dag, samt separat stegvis återkoppling. Ingen Socrative fanns i originalet och ingen har införts.

**Förbättringar:**
- Lärarstöd beskriver **kärnväg med tidsprioritering**, diagnosbeslut utifrån enhetsfel/otillåtna x/kontinuerlig modell kontra diskret produktion, samt minst 20 min sammanhängande bokarbete. Riktmärket är för en *hypotetisk* 70-minuterslektion, inte fast lektionstid.
- I biljettanimationen finns samma styrbara pris, grafmarkör, sålda biljetter och intäkt kvar, men de **numeriska svaren för antalet sålda och intäkten** syns först efter aktiva förutsägelsen. Grafen används till hypotesprövning, inte som enda bevis.
- Lösningens rubrik avslöjar inte längre optimum 100 kr redan innan algebran synliggörs. Exakt matematisk återkoppling består: `I′=1000−10x`, maximalt 50 000 kr vid 100 kr och 500 sålda biljetter, ändpunktsvärden 0.
- Raketuppgiftens **förskrivna steglista** visas bara som valbart stöd. Alla ursprungsfrågor och facit finns kvar. Eleven måste själv visa varför optimum t=1 s, höjd 45 m, tid till havsytan 4 s och hur domänen påverkar svaret.
- En valbar 1-minutsåterkallning från lektion 6 använder `k(x)=−x²+6x` på [0,5]. Korrekt maximum 9 vid 3, minimum 0 vid 0, efter jämförelse av alla kandidater.

**Följ upp i klass:** Kan eleverna skilja mellan antal, kronor och tusental i originalmodellen och ange tillåtna heltal? Kan de bevisa ett optimum med derivatan efter grafutforskning? Hur många behöver öppna stegen för raketlösningen och påverkar det boktiden?

### Lektion 8: Modellering och fler extremvärdesproblem

**Originalkälla:** `Ma3c_Modellering_och_fler_extremvardesproblem.pdf` (10 sidor). **Bibehållet:** Öppen låda av 50×30 cm-papper, `V=x(50−2x)(30−2x)` för 0<x<15 och maximum cirka 4 100 cm³ vid x≈6,07 cm (ex.3215 s.166). Symmetrisk rektangel under `y=3−x²`, `A=2x(3−x²)` för 0<x<√3, maximum 4 areaenheter vid x=1 (ex.3216 s.167); bråkmodellen `V=15−0,1x−40/x` för x≥4, maximum 11 000 kr vid 20 lampor/dag (ex.3233 s.171); bokarbete i **två separata avsnitt**: s.168–170 nivå 1 **3217–3221**, nivå 2 **3222–3228**, nivå 3 **3229–3232** och s.172 nivå 1 **3234–3238**, nivå 2 **3239–3241**, nivå 3 **3242–3244**. Minst två nivåer, uppgiftsspåren 3217→3222→3234→3239 respektive 3225→3230→3241→3242; läxa **3221 och 3236**, extra **3241**. Båda individuella exitproblemen och deras två oberoende återkopplingssekvenser finns kvar. Ingen Socrative har tillagts.

**Förbättringar:**
- **Kärnvägen prioriterar tre slags modellering** och minst 20 minuter självständigt bokarbete. Låd- och rektangelundersökningens animerade extrasteg (3 och 6) finns kvar men är valbara och nås via synliga knappar. Läraren väljer helst den animation som direkt svarar mot ett faktiskt elevproblem, i stället för att automatiskt göra två omfattande uppvisningar. Originalets samtliga exempel och deras deriverade lösningar tillhör kärnvägen.
- Båda animationsreglagens **numeriska mått, volymer och areor** är dolda tills elevens förutsägelse är gjord. Samma dynamiska figurer och kurvor används för att följa sambandet mellan mått och värde.
- Vid rektangeln avslöjas inte basen 2x förrän eleven bett om hjälp: ursprungstexten om sträckan −x till x finns kvar i en valbar ledtråd. Här ska eleven först bygga modellen.
- Bråkfunktionen ger eleven **eget matematiskt val före stegen**; originalets fyra frågor finns kvar som valbar hjälp. Flervalsalternativen för derivatans tecken visas först efter eget försök, och vinstgrafen med optimum visas först efter att matematiskt bevis diskuterats.
- Valbar 1-minutsåterkallning från lektion 7 tränar enhetstolkningen: `V(3)=4` betyder produktion av **3 000 enheter/dag** och vinst **4 000 kr/dag**, inte 3 kr eller 4 enheter.
- Lärarstödet pekar ut de vanligaste formelfelen `50−x` mot `50−2x`, rektangelns `x` mot `2x`, och den felaktigt negativa derivatan av `−40/x`, med olika svar på dessa fel.

**Kognitivt att pröva:** Antalet nya modeller under ett pass kan fortfarande bli högt. Använd de valbara visualiseringarna selektivt och undersök om eleverna hinner formulera funktion och tillåten domän självständigt. Utcheckningen prövar både geometri och bråktal, inte antalet klick.

### Kvalitetskontroll och kvarstående osäkerhet

Automatiska Chromium-fall för lektion 7–8 är utökade med kärnväg, lärarval, valbara/hjälpsamma steg, skriftlig återkallning med dolt facit, osynliga siffervärden före elevens förutsägelse, originalets exakta modellvärden, facit, bokhänvisningar och mobila vyer. Sviten körs tillsammans med alla övriga åtta lektioner. Testutfallet ska noteras med en länk till den **senaste godkända** GitHub Actions-körningen innan rond 4 betraktas som godkänd.

Det är fortfarande **inte visat** att dessa designval ökar elevernas faktiska lärande; uppföljning av elevsvar, tidsåtgång, projektor/iPad och fördröjd problemlösning behövs i klassrummet.



## Omgång 5 · lektion 9–10

### Lektion 9: Blandade problem

**Grundkälla:** `Ma3c_Blandade_problem.pdf` (11 sidor). **Allt originalinnehåll bevarat:** start med `V(t)=120(1−e^(−0,2t))`, rätt val av V(5), V′(5), V″(5) och enheter; vattenmodellens derivator, gränsvärde 120 liter, inget antaget största vattenvärde och V′(0)=24 liter/min; robot `s(t)=12√(t+1)−12`, hastighet, acceleration, största hastighet och tangent; villkorsproblemen `f=x³+ax` och `g′=(x−1)(x−3)²`; boken s.174–176 och alla tre nivåer; individuella exituppgifterna om `M(t)=50(1−e^(−0,1t))` och `h(x)=x²+bx` med separata lösningar. Nivå 1 **3247–3253**, nivå 2 **3254–3265**, nivå 3 **3266–3271**; grundspår **3247→3249→3252→3254→3261**, säkert spår **3258→3262→3266→3268→3271**. Läxa **3248 och 3260**, extra **3264**. Ingen Socrative i originalet och ingen har lagts till.

**Kvalitetsändringar:**
- Lärarstödet innehåller kärnväg (1–2, 4–11), beslutsregler utifrån elevfel, riktmärke för cirka 70-minuterslektion, minst **20 min sammanhängande bokarbete** och senare återkallning med ny exponentialmodell. Den manuellt styrbara vattenanimationen (3) är **valbar via en knapp från målsteget**; den matematiska återkopplingen (4) är fortfarande obligatorisk.
- Grafens exakta V-, V′- och V″-värden samt den färdiga teckentolkningen är **dolda före förutsägelsen** och öppnas individuellt på begäran. Graf och tangent förblir synliga så att eleverna kan resonera från representationen.
- Robotproblemet uppmanar till ett **eget metodval** med samtliga fyra ursprungliga krav uttryckligen i huvudtexten. Originalets punktlista och matematiskt stöd ligger kvar som valbara hjälpnivåer.
- Grafen över g′ i villkorsproblemet är **valbar återkoppling** först efter teckentabellen och de två klickstyrda matematiska faciten. Därmed kan eleverna inte ersätta egen teckenmotivering med ett förhandsvisat diagram.
- En frivillig 1-minutsåterkallning från lektion 8 prövar `C(x)=x+9/x` för x>0, där minimum 6 antas vid x=3, med facit dolt under elevförsöket.

**Matematiska skyddsräcken:** V′>0 och V″<0 samtidigt betyder ökande vattenmängd med avtagande inflöde. Eftersom V(t)<120 för varje ändlig tid kan 120 inte kallas maximum på t≥0. För `g′=(x−1)(x−3)²` är x1 minimum, x3 **inte** extrempunkt; terrass klassificeras med ytterligare böjningsbyte via `g″=(x−3)(3x−5)`. Inga y-koordinater för g kan bestämmas från g′ ensam.

### Lektion 10: Deriverbarhet

**Grundkälla:** `Ma3c_Deriverbarhet.pdf` (12 sidor). **Allt originalinnehåll bevarat:** startens A-mjuk/B-hörn/C-hopp, ensidiga differenskvoter med h>0 och h→0⁺ enligt originalets uttryck, `p=(x−1)²+2` jämfört med `q=2|x−1|+2`, hoppfunktionen med r(2)=3 och vänsterkvot 2/h, skarv med `ax+b` för x<1 och `x²+1` för x≥1, bok s.178 och två självständiga exitkontroller med `F=cx+d` vid x<2. Nivå 1 **3272–3274**, nivå 2 **3275 a–b**, nivå 3 **3276–3277**; grundspår **3272→3273→3275 a–b**, säkert spår **3275 a–b→3277→3276**. Läxa **3274 och 3275**, extra **3277**. Ingen Socrative.

**Kvalitetsändringar:**
- Lärarstödet skiljer kärnväg (1–3, 5–12) från **valbar sekantanimation** (4), som öppnas från förutsägelsesteget. Därmed kan en grupp som redan motiverar ensidiga differenskvoter komma vidare utan ett extra reglagepass, medan den grafiska jämförelsen finns fullt tillgänglig för andra. Riktmärke för lektionstid, minst 20 min eget bokarbete och konkreta undervisningsbeslut finns i lärarstödet.
- I de två reglerbara sekantgraferna är **numeriska vänster- och högerlutningar dolda tills eleverna själva har räknat eller formulerat en gränslutning**. h är alltid strikt positivt; att sätta h=0 i kvoten förekommer inte.
- I hoppfunktionen med r(2)=3 finns fortfarande graf, sekantlinjer och reglervärden; däremot är de exakta kvotvärdena 2/h och 0 dolda till egen beräkning. Det matematiska facitsteget finns kvar.
- I skarvmodellen får eleverna först skriva sina två villkor och styra a och b själva. **Snabbvalen med färdiga etiketter** (hörn, hopp, mjuk skarv), de numeriska höjd-/lutningsavläsningarna och den direkta statusbedömningen är dolda tills eleven väljer återkoppling. Modellen visar fortfarande två funktionsgrenar och öppna/fyllda punkter under eget försök. Facit om a=2,b=0 och fördjupningen om att lika *grenlutningar* inte räcker vid hopp behålls.
- En valfri 1-minutsåterkallning från lektion 9 prövar skillnaden mellan gränsvärde och antaget maximum för vattenmängden, med eget försök och separat facit.

**Matematiska skyddsräcken:** Enbart lika derivator för grenuttrycken bevisar inte deriverbarhet om funktionen inte är kontinuerlig. För a=2,b=1 är verklig vänsterkvot vid skarven `2−1/h→−∞` även om grenarna formellt har samma lutning. För q vid x1 är vänster- och högerkvot −2 respektive +2. Enbart att två delar är horisontella gör inte hoppfunktionen deriverbar.

### Teknisk kontroll och återstående didaktisk prövning

Webbläsartesterna `qa/blandade-problem-browser.cjs` och `qa/deriverbarhet-browser.cjs` har utökats för valbar kärnväg, dolda resultat före elevbeslut, oberoende återkallning med dolt facit, styrbar matematik, oförändrade uppgifter och läxor, samt samtliga mobilavsnitt. Alla tio lektioner körs i den gemensamma Chromium-regressionen. Dokumentation och godkänd slutkörning ska stämmas av mot den publicerade GitHub Pages-versionen.

**Rond 2 är en teknisk och didaktiskt motiverad kvalitetshöjning – inte ett bevis på maximal lärandeeffekt.** Nästa fas är klassrumsprövning: vad kan eleverna lösa utan stöd, hur mycket boktid återstår i praktiken, vad minns de efter några dagar, och vilka interaktioner behövs faktiskt? Följ upp på klassnivå och justera utifrån elevlösningar.


## Genomförda omgångar

- **Omgång 2 avslutad:** lektion 3–4, andraderivatan och dess roll för grafen.
- **Omgång 3 avslutad:** lektion 5–6, grafrelationer och största/minsta värde.
- **Omgång 4 avslutad:** lektion 7–8, tillämpade och geometriska extremvärdesproblem.
- **Omgång 5 avslutad:** lektion 9–10, blandade problem och deriverbarhet.

**Arbetsregel:** Publicera och verifiera endast det aktuella paret innan nästa omgång påbörjas. Ingen förändring av kursens ursprungliga uppgifter, läxor eller förberedda Socrative-inslag utan nytt uttryckligt beslut.
