# Kvalitetsgranskning – Matematik fortsättning, nivå 1c · Kapitel 3

**Status 2026-11-12:** Fem webblektioner är byggda och filerna publicerade på GitHubs `main`. Följande är kod- och matematikgranskning; det är **inte** ett påstående om fullständig visuell verifiering eller bevisad elevnytta.

## Allmän kontroll för varje lektion
1. **Källtrohet:** jämför systematiskt med lektions-PDF, lärobokssidor, exakta uppgiftsnummer, läxa och eventuella Socrative-inslag. Ma1c: minst två av tre nivåer.
2. **Matematik:** lös alla exempel och utcheckningar oberoende; kontrollera tecken, intervall, grafskalor, derivator, numeriska värden och tolkningsled.
3. **Didaktik:** fråga före svar; ett verkligt elevbeslut före varje lösningssteg; gradvis minskat stöd; meningsfull felåterkoppling; bokarbete kvar i huvudflödet.
4. **Visuellt:** grafens koordinater ska vara konsekventa; läsbart på projektor och mobil; formler får inte brytas missvisande.
5. **Teknik:** unika id, befintliga återkopplingsmål, stegsekvenser, lägesväxling, navigation, återställning, tangentbord, pekskärm och skrivyta; inga elevkonton/lagringsanrop.
6. **Praktik:** verkligt webbläsartest på publicerad URL, projektor, surfplatta och mobil när tillgängligt. Dokumentera *vad som faktiskt testats*.
7. **Undervisning:** anonym observation av elevlösningar och förklaringar efter genomförandet. Justera först då påståenden om upplevd lärandeeffekt.

## Granskad lektion

### 3.1 · Växande och avtagande
**Underlag:** `261103 3.1 Växande och avtagande Na25.pdf`, s. 1–10.

**Bevarat:**
- Startens graf med stationära lägen `x=−1` och `x=1`, skillnaden mellan `f>0` och `f′<0`.
- De tre målen, teckentabellen och fullständigt exempel `f(x)=6x−x²`.
- Eget problem `f(x)=3x²−12x`, motexempel `f(x)=x³`, utcheckning `f′(x)=4−2x`.
- Bokens s. 142–144; nivå 1: 3103, 3105, 3106; nivå 2: 3107–3109; nivå 3: 3110; frivillig 3111.
- Läxa enligt originalet: färdigställ urval på minst två nivåer före nästa lektion. Ingen Socrative fanns i originalet.

**Tillkommet:** flyttbar tangent för en uttryckligen angiven modell av ursprungsgrafens form, valbar teckentabell, riktad återkoppling, stegvis exempel och elevkontroll för eget problem. Övriga delar har omstrukturerats för att börja med frågan före lärandemålen.

**Oberoende matematikgranskning:**
- Grafikmodell `f(x)=0,5x³−1,5x+0,5`: `f′(x)=1,5x²−1,5`, nollställen för derivatan `−1,1`, tecken `+ − +`. `f(0)=0,5`, `f′(0)=−1,5`.
- `6x−x²`: `f′=6−2x`, nollställe 3, `f′(1)=4`, `f′(4)=−2`; växande till 3, avtagande efter.
- `3x²−12x`: `f′=6x−12`, nollställe 2, `f′(0)=−12`, `f′(3)=6`; avtagande till 2, växande efter.
- `x³`: `f′=3x²` har samma positiva tecken på båda sidor om 0.
- `f′=4−2x`: `+ 0 −` runt x=2 ger en maximipunkt; y-värdet kan inte bestämmas från derivatan ensam.
- Numerisk kontroll av tangentens lutning mot analytisk derivata på 19 punkter gav maximal avvikelse under `10⁻⁸`.

**Kodkontroll:**
- Alla sju berörda webb- och resursfiler finns på `main`, och bibliotekets tre navigationsled är kontrollerade.
- 10 lektionssteg, unika HTML-id, alla återkopplingsmål finns, inga saknade element-id i den kurslokala interaktionskoden.
- Delade kontroller för framåt/bakåt, lägen, lärarstöd och skrivyta har motsvarande HTML-element.
- Inga anrop till nätverk, lokal lagring eller insamling av elevsvar i lektionens egen kod eller kopierade lektionsmotor.

**Verifierat i Chromium:** GitHub Actions-körningen [43230819577](https://github.com/jacobflinder/Lektioner/actions/runs/43230819577) lyckades den 12 november 2026. Playwright prövade startsida och kursnavigering, tio lektionssteg, klassrums-/repetitionsläge, lärarstöd, graf/tangent, riktad felåterkoppling, teckentabell, stegsekvens och återställning, egen uppgift, motexempel, bokhänvisningar, utcheckning och mobilbredd (390 px). Skärmbilder finns i Actions-artifakten `mato1c-browser-quality-evidence`. GitHub Pages byggde och publicerade också samma kodändring utan fel.

**Återstår att följa upp:** Faktisk undervisning på projektor, manuell visuell kontroll på lärarens enheter och elevers självständiga lösningar. En lyckad Chromium-smoketest är inte liktydig med att varje graf, formel och interaktionsdetalj är perfekt, eller att en lärandeeffekt har fastställts.

## Lektion 2 · Extrempunkter och terrasspunkter (2026-11-05)

**Källa:** `261105 Extrempunkter och terrasspunkter.pdf`, samtliga 6 sidor. Webbadress: `/mato1c/kapitel-3/extrempunkter-och-terrasspunkter/`.

### Källtrohet
- Originalets tre funktioner, mål, teckentabeller, genomarbetade exempel, terrassmotexempel, bokspår, läxa och individuella utcheckning finns kvar.
- Bok: s. 145–148 (uppgifter s.148). Spår 1+2: 3113, 3114, 3115, 3117, 3119. Spår 2+3: 3118–3119, 3120, 3122, 3123. Mer träning 3116/3121. Minst två av tre nivåer.
- Ingen Socrative har lagts till.
- En frivillig egen uppgift på ny funktion har tillkommit före bokarbetet, med minskat stöd.

### Matematisk kvalitetskontroll
- `x²`: derivata `2x`, tecken `−0+`, minimipunkt `(0,0)`.
- `−x²`: derivata `−2x`, tecken `+0−`, maximipunkt `(0,0)`.
- `x³`: derivata `3x²`, tecken `+0+`, terrasspunkt `(0,0)`.
- `x³−3x+2`: derivata `3x²−3`, nollställen `±1`, testvärden `9,−3,9`, max `(−1,4)`, min `(1,0)`.
- `x³+2`: derivata `3x²`, testvärden `3,3` runt 0, terrass `(0,2)`.
- Nytt självständigt problem `h(x)=−x³+3x`: derivata `−3x²+3`, tecken `−0+0−`, min `(−1,−2)`, max `(1,2)`.
- Utcheckning: `+0−` vid 2 med värde 5 ger maximipunkt `(2,5)`. `−0−` vid −1 med värde 4 utesluter extremum och motsvarar terrassmodellen `(−1,4)` i källan. `f′(3)=0` ger inte punkthöjd eller bestämd punktkaraktär. Den matematiska begränsningen i att härleda inflexion från enbart tecknen är uttryckligen markerad, inte dold.
- Numerisk derivatakontroll av de tre graffunktionerna mot symmetrisk differenskvot på flera punkter: maximal avvikelse under `10⁻⁸`.

### Teknik och didaktik
- Nio lektionssteg, gemensamma kurslokala CSS- och JavaScript-resurser, klassrumsläge, repetitionsläge, separat lärarstöd, skrivyta och tangentbordsnavigation.
- Alla interaktiva grafer använder respektive funktions exakta formel och derivata. Specifik återkoppling på felaktig punktkaraktär och y-koordinat.
- Statiskt kontrollerat: inga duplicerade id, alla JavaScript-mål och återkopplingsmål finns, läroboksspår och läxa finns, ingen insamling eller lagring av elevsvar.
- **Webbläsartest:** `qa/extrempunkter-browser.cjs` testar dynamiska grafer, alla tre funktioner, klassrum/repetition, lärarstöd, exempelsteg, fel och rätt svar, referens till boken, dold utcheckning och 390 px mobilbredd. GitHub Actions kör detta tillsammans med befintligt test för lektion 1.
- **Återstående verklighetskontroll:** visuell kontroll på klassrummets projektor och faktisk klassrumsuppföljning av elevers självständiga resonemang. Ingen lärandeeffekt kan påstås utifrån testkörningar.


## Lektion 3 · Andraderivatan

**Originalunderlag:** PDF `Andraderivatan`, sex sidor, läroboken s. 149. Lektionsadress `/mato1c/kapitel-3/andraderivatan/`. Bedömd och skapad 2026-11-12.

### Källtrohet
- Samtliga centrala originalmoment bevaras: start med `x²` och `2x`, målet efter starten, kedjan `f, f′, f″`, derivatorna av polynom och exponentialfunktion, uppgiften `h=x³−6x²`, facit, läroboksarbete, läxa och den individuella utcheckningsfrågan.
- Bok, s. 149: nivå 1+2 `3125, 3126–3127, 3130–3131`; nivå 2+3 `3130–3131, 3132, 3133`; mer träning `3128–3129`. **3130–3131 står i båda originalspåren, vilket bibehålls.** Minst två av tre nivåer.
- Ingen Socrative införs eftersom den inte fanns i originalet.

### Oberoende matematisk kontroll
- `(x²)′=2x`, `(2x)′=2`, `(x²)″=2`, `(2x)″=0`. Båda funktionerna växer på det illustrerade intervallet `0≤x≤2,5` men tangentens lutning ökar endast för `x²`.
- `(x³−5x²+3x)′=3x²−10x+3`; `f″(x)=6x−10`.
- `(4e^(2x))′=8e^(2x)`; `g″(x)=16e^(2x)`. Den inre derivatan 2 multipliceras in vid vardera deriveringen.
- `h(x)=x³−6x²`: `h′=3x²−12x`, `h″=6x−12`, `h″(0)=−12`, `h″(x)=0` ger `x=2`. Samtidigt är `h′(2)=−12`; alltså är `h″=0` inte detsamma som horisontell tangent.
- Utcheckningsfrågan besvaras med `f(x)=x²` vid `x=−1`: `f′(−1)=−2<0` men `f″(−1)=2>0`.
- Numeriska centrala differenskvoter för de egna grafmodellerna och testuppgiften överensstämmer med analytiska derivator inom rimlig tolerans.

### Teknisk och didaktisk kontroll
- 8 slides, samma kurslokala navigations- och visningsmotor som lektion 1 och 2. Inga gemensamma Ma4- eller fysikfiler ändrade.
- Den synkroniserade interaktionen använder funktionens uttryck och analytiska derivata för både tangent och återkopplingsvärde.
- Två oberoende sekvenser med tre matematiska steg vardera, som kan öppnas, backas och återställas; fråga före varje avslöjande.
- Eget försök med lokal svarskontroll och specifika felmeddelanden; fullständigt facit visas först efter eget försök. Originalets utcheckningsfråga är kvar och har ett extra verifierbart exempel.
- Statisk kontroll: unika element-id, befintliga JS-element- och facitmål, korrekta läroboksnummer, inga nätverksanrop eller lagringsfunktioner i lektionens egen interaktionskod.
- **Godkänt automatiskt webbläsartest:** GitHub Actions `Ma1c web lesson browser quality checks`, körning [43236076352](https://github.com/jacobflinder/Lektioner/actions/runs/43236076352), prövar samtliga tre befintliga lektioner i Chromium. Lektion 3 kontrolleras för navigation, visningslägen, grafer och faktiska tangentvärden, fel/rätt i quiz, två sekvenser, lokal kontroll, läroboksspår, dold utcheckning, mobilbredd 390 px och inga JavaScript-fel. Fem skärmbilder produceras i Actions-artifakten.
- **Godkänd Pages-publicering:** [43236076218](https://github.com/jacobflinder/Lektioner/actions/runs/43236076218) för commit `16ea776cd202ba29857959827d283f0ba7114cf7`. Testet ovan laddar siten från en lokal HTTP-server i Chromium; GitHub Pages-körningen visar att publiceringen har lyckats, men är inte samma sak som ett manuellt webbläsartest på den publika adressen.

**Återstår:** visuell kontroll på lärarens faktiska projektor och klassrumsobservationer av elevers självständiga lösningar. Lektionen betecknas inte som perfekt och ingen specifik effekt på lärandet har ännu verifierats.


## Lektion 4 · Andraderivatan och funktionens graf

**Original:** `261110 Andraderivatan och funktionens graf Na25.pdf` (18 sidor, 2026-11-10). **Adress:** `/mato1c/kapitel-3/andraderivatans-roll-for-grafen/`. Webbversionen omfattar 12 avsnitt; originalets animationsgrupper är sammanförda till två undersökningsmodeller.

### Källtrohet
- Bevarade matematikfall: `x²` / `−x²` (krökning och lokala extrempunkter), `x³−3x+2` (maximipunkt, minimipunkt och separat inflexion), `x²−4x+7` (eget försök), `x³` mot `x⁴` (andraderivatatestet ger inget besked), samt avslutande `r(x)=−x²+6x−4`.
- Läroboken s.152: nivå 1 3136–3138, fortsättning 3139; nivå 2 3140–3141; nivå 3 3142–3143. Minst två av tre nivåer. Originalets stödspår och 20 min tyst arbete kvar.
- Originalets särskilda läxa `3138` och `3141 a–b` med motivering via derivator, **inte** en generell ”gör klart valda uppgifter”-läxa.
- Samtliga tre korta originalkontroller och individuella utcheckningsfrågor finns kvar. Ingen Socrative lades till.

### Oberoende matematisk kontroll
- `f=x²`: `f′=2x`, `f″=2>0`, stationär `x=0` är minimum. `g=−x²`: `g′=−2x`, `g″=−2<0`, stationär `x=0` är maximum. Vid `x=−1,5` är lutningarna `−3` respektive `+3`; vid `x=+1,5` `+3` respektive `−3`.
- Andraderivatatestet kräver en stationär punkt `f′(a)=0`. `f″(a)=0` ger **inget** klassificerande besked från testet. Det räcker inte att enbart f″ är positiv/negativ utan att f′(a)=0 har kontrollerats.
- `f=x³−3x+2`: `f′=3x²−3`, stationära `x=±1`, `f″=6x`, `f″(−1)=−6`, `f″(1)=6`; max `(−1,4)` och min `(1,0)`.
- `h=x²−4x+7`: `h′=2x−4`, `h″=2`, minimum `x=2`, `h(2)=3` ⇒ minimipunkt `(2,3)`. `h′(2)=0` är inte höjden.
- `p=x³`: `p′=3x²` positiv före/efter 0, terrasspunkt `(0,0)`. `q=x⁴`: `q′=4x³` negativ före 0 och positiv efter, minimipunkt `(0,0)`. Båda har `f′(0)=f″(0)=0`.
- Inflexion för `x³−3x+2`: `f″=6x` byter från negativ till positiv vid 0; `f(0)=2`; `f′(0)=−3`. Alltså inflexionspunkt `(0,2)` med *icke-horisontell* tangent. `q=x⁴`: `q″=12x²` byter inte tecken vid 0, alltså ingen inflexion där.
- Utcheckning: `r′=−2x+6=0` ger x=3; `r″=−2<0` ⇒ lokalt maximum; `r(3)=−9+18−4=5` ⇒ `(3,5)`.

### Didaktik och teknik
- Fråga och eget matematiskt beslut före facit; lektionens två interaktiva grafer visar tangentlutning från exakt analytisk derivata. Inflexionsmodellen färgmarkerar f″ negativ/positiv och visar att f′(0) inte är noll.
- Två exempel med minskat stöd, ett separat motexempel när testet misslyckas, längre bokpass och individuell utcheckning utan modell.
- Inga nya ändringar i Ma4, Fy1 eller Fy2. Gemensamma resurser i Ma1c återanvänds. Testskriptet är `qa/andraderivatans-roll-browser.cjs` och körs tillsammans med de tre föregående lektionernas Chromium-kontroller.
- Statiskt verifierat: 12 avsnitt, samtliga JavaScript-mål och återkopplingsmål finns, inga dubbla HTML-ID och inga nätverks-/lagringsanrop i lektionens egen JavaScript-kod.
- Första browserkörningen upptäckte att s.152 bara fanns som avsnittsetikett, inte uttryckligen i bokarbetets huvudtext; detta korrigerades och testet kördes om. Ingen ändring gjordes i originalets uppgiftsnummer.
- [Automatiska webbläsartester](https://github.com/jacobflinder/Lektioner/actions/workflows/mato1c-browser-qa.yml) prövar klassrumsläge, lärarstöd, båda matematiska reglagen, rätt och fel feedback, exempelsteg, bok, utcheckning och samtliga 12 vyer i mobilbredd 390px. GitHub Pages hanterar själva publiceringen.

**Återstår att pröva:** manuell visuell kontroll på klassrummets projektor, tillgänglighet med verkliga tangentbord/skärmläsare samt elevlösningar i faktisk undervisning. Ett godkänt automatiskt test är inte belägg för att lektionen ger bättre läranderesultat.


## Lektion 5 · Funktionens graf och derivatornas grafer

**Grundkälla:** `Ma3c_Funktionens_graf_och_derivatornas_grafer.pdf`, 6 sidor (1–5 elevmaterial, 6 lärarstöd). Den tillhör lektionsserien 3.1 och behandlar bok s. 153–155. **Adress:** `/mato1c/kapitel-3/funktionens-graf-och-derivatornas-grafer/`.

### Källtrohet
- Innehållet på originalets s.1–5 bevarat i 8 webbsteg: startfrågan, mål, tre grafer vid samma x och tillhörande förklaring, exemplet g′=−1, elevuppgiften f′=2x−4, bokarbete och individuell utcheckning.
- Originalets lärarsida bevarad som innehåll i separat lärarstöd. Ingen färdig Socrative fanns i originalet; bara ett möjligt framtida arbetssätt nämns. Ingen Socrative har lagts till.
- Exakta bokreferenser: s.154–155; nivå 1 3146–3149, inklusive digital ritning i 3148; nivå 2 3150–3152; nivå 3 3153–3154. Eleverna arbetar med minst två av tre nivåer.
- Läxa till nästa lektion: 3149 och 3150, extra 3153. Inte ersatt av en generell läxa.
- Elevens avslut: h′(x)=(x−1)(x−3) och extra p′(x)=(x−2)². Lärarstödets facit visas först efter individuellt svar.

### Oberoende matematisk granskning
- **Start:** f(0)=−3 och f′(0)=1 för funktionerna x−3, x²+x−3 och −x²+x−3; deras andraderivator vid 0 är respektive 0, +2, −2. Så f<0 och f′>0 bestämmer inte f″.
- **Eget grafexempel:** Originalskissen anger inga funktionsuttryck för de tre graferna. Webbversionen använder den **egna exakta modellen**
  `f(x)=−x³/12+x²−3x+7/2`,
  `f′(x)=−(x−2)(x−6)/4`,
  `f″(x)=2−x/2`.
  Här är f′(2)=0, f″(2)=+1, f′(6)=0, f″(6)=−1, och vid x=4 är f′(4)=1 men f″(4)=0 med teckenbyte från positivt till negativt. Följaktligen min vid x2, max vid x6, inflexion vid x4 men **ingen terrasspunkt**. Funktionen är avtagande för x<2 och x>6, växande för 2<x<6. Funktionen är vald för att återge originalets kritiska x-värden och tecken, inte för att tillskriva skissen en ej given formel.
- **Numerisk kontroll:** Symmetriska differenskvoter jämförda med analytiska f′ och f″ vid x=0,1,2,4,6,8. Maximal avvikelse omkring 1,3×10⁻¹⁰.
- **Genomarbetat exempel:** g′(x)=−1 ⇒ g(x)=−x+C. g₁=−x och g₂=−x+2 ger samma derivata.
- **Eget försök:** f′(x)=2x−4 har nollställe x=2 och tecken − 0 +. En funktion är f=(x−2)²+C; för C=0 respektive C=3 fås originalets två grafer. f″(x)=2 är positiv och konstant.
- **Utcheckning:** h′(x)=(x−1)(x−3)=x²−4x+3, h″(x)=2x−4. h växer för x<1 samt x>3, avtar för 1<x<3. h har lokalt maximum vid x=1, lokalt minimum vid x=3. Inflexion vid x=2 eftersom h″ byter tecken, **inte** terrass eftersom h′(2)=−1. Exempel h=x³/3−2x²+3x+C där C kan varieras för att ge flera grafer. Extra p′=(x−2)² är positiv på var sida om x2, p′(2)=0 och p″=2(x−2) byter tecken: terrasspunkt vid x2.

### Didaktik och teknik
- 8 elevavsnitt. Klassrumsläge, repetitionsläge, styrbar stegvis återkoppling, separat lärarstöd, skrivyta, tangentbordsnavigation. Ma1c:s befintliga resurser används utan att Ma4- eller fysiklektionernas filer ändrats.
- En sammanlänkad tredelad SVG med ett x-reglage, tre punktkaraktärsval och situationsspecifik återkoppling. En separat visualisering av vertikal förskjutning hålls dold tills eleverna arbetat själva. Ingen extern grafmotor, ingen inloggning eller nätverksinsamling.
- Statiskt kontrollerat: unika HTML-id, inga saknade svarskontroll- och avslöjandemål, rätt matematisk precision, bokhänvisningar och läxa.
- Automatiserad Chromium-granskning via `qa/funktionens-graf-browser.cjs`: navigation genom kursdelen, klassrums- och repetitionsläge, start och dolt facit, de tre derivatavärdena vid x=2,4,6, fel/rätt återkoppling, alla tre stegen i exempel, elevkontroll av f′=2x−4, styrbar C-förskjutning, bokuppgifter, utcheckningsfacit, hela 390px mobilvyn, inga JavaScript-fel eller externa anrop.
- **Skärmbildsgranskning:** datorvyer för start, tre grafer, höjdförskjutning och utcheckning samt mobilvyer för tre grafer och bokarbete. Efter granskningen justerades SVG-etiketternas storlek för bättre läsbarhet i mobilen.
- **Återstår:** full manuell testning med lärarens egna projektor, iPad och telefon och elevlösningar under faktisk undervisning. Godkänt smoketest är inte evidens för en påvisad lärandeeffekt.
