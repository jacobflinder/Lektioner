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


## Kommande omgångar

- **Omgång 2 avslutad:** lektion 3–4, andraderivatan och dess roll för grafen.
- **Omgång 3 avslutad:** lektion 5–6, grafrelationer och största/minsta värde.
- **Omgång 4:** lektion 7–8, tillämpade och geometriska extremvärdesproblem.
- **Omgång 5:** lektion 9–10, blandade problem och deriverbarhet.

**Arbetsregel:** Publicera och verifiera endast det aktuella paret innan nästa omgång påbörjas. Ingen förändring av kursens ursprungliga uppgifter, läxor eller förberedda Socrative-inslag utan nytt uttryckligt beslut.
