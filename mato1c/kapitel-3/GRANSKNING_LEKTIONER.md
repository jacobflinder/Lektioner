# Kvalitetsgranskning – Matematik fortsättning, nivå 1c · Kapitel 3

**Status 2026-11-12:** Åtta webblektioner är byggda och filerna publicerade på GitHubs `main`. Följande är kod- och matematikgranskning; det är **inte** ett påstående om fullständig visuell verifiering eller bevisad elevnytta.

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


## Lektion 6 · Största och minsta värde

**Grundkälla:** `Ma3c_Storsta_och_minsta_varde.pdf`, åtta sidor. Publicerad i `/mato1c/kapitel-3/storsta-och-minsta-varde/`. Originalets sidreferenser är 158–160, med uppgifter på s.159–160.

### Källtrohet
- Elevens originalmoment är bevarade: start med `g=x²` och intervallet [−1,2], metod för kandidater, förutsägelse med växande högergräns, originalets exempel 3156, egen uppgift `h=−x²+4x`, bokarbete med nivåer och exakt läxa samt individuell utcheckning med `p=x³−3x`.
- Bok s.159–160: nivå1 3157–3163, nivå2 3164–3166, nivå3 3167–3168, minst två nivåer. Föreslagen start 3158/3161/3164; vana elever 3164–3166 och 3167–3168. Tyst egen träning ca 20 min. Läxa **3161 a samt 3164 a–b**, extra 3168 med motivering.
- Ingen Socrative var förberedd i originalet, alltså ingen i webben. Originalets återkopplingssida används efter den individuella utcheckningen.

### Oberoende matematisk granskning
- `g(x)=x²` på [−1,2] har kandidater −1,0,2, med funktionsvärden 1,0,4. Minsta 0 vid x0, största 4 vid x2.
- `f(x)=x³−4,5x²+5`, `f′(x)=3x²−9x=3x(x−3)`. Stationära x0,x3. För [−2,3] ger −2,0,3 värden −21,5,−8,5: störst 5 vid x0 och minst −21 vid x−2. För [−2,5] tillkommer x5 med f(5)=17,5, vilket blir nytt globalt maximum. Övriga kandidatvärden oförändrade.
- **Noggrant gränsfall:** `f(0)=5` och `f(b)=5` löses för b större än 3: `b³−4,5b²=0` ⇒ b=4,5. Alltså på [−2,4,5] antas största värdet 5 vid **både 0 och 4,5**. Koden kontrollerar likvärdiga funktionsvärden med rimlig numerisk tolerans.
- `h(x)=−x²+4x` på [0,5]: `h′=−2x+4`, stationär x2; h(0)=0, h(2)=4, h(5)=−5. Största 4 vid x2, minsta −5 vid x5.
- `p(x)=x³−3x` på [0,3]: `p′=3x²−3`; −1 hör inte till intervallet, 1 gör det. Kandidater 0,1,3 har p-värden 0,−2,18. Största 18 vid x3, minsta −2 vid x1.
- **Räckvidd:** Originalmetoden är här avsedd för de deriverbara polynomen på ett slutet intervall som lektionen behandlar. Mer generellt måste även inre punkter där derivatan saknas och andra domänfrågor hanteras separat; webbversionen framställer inte metoden som generell för alla funktioner.

### Didaktisk och teknisk kontroll
- Nio lektionssteg efter samma Ma1c-ram. Fråga före facit, ett steg i taget i genomarbetade lösningar, minskat stöd i egen uppgift och separat individuell utcheckning.
- Grafen är uppbyggd direkt från `f(x)` med identisk skala för samtliga intervall, heldragen del innanför och streckad del utanför. Matematisk återkoppling jämför alla giltiga kandidater med aktuellt b och anger såväl värde som *samtliga x där det antas*.
- Lokala interaktioner utan inloggning, nätverksanrop eller lagring av elevsvar. Ma4/Fy1/Fy2-filer ändras inte.
- Statiskt verifierat: nio avsnitt; inga dubbla HTML-id; inga saknade JavaScript-element eller facitmål; bokuppgifter och läxa exakt bevarade.
- Automatiskt Chromium-test: `qa/storsta-minsta-browser.cjs` testar grafens och intervallgränsens beteende (inklusive dubbla maximiplatser), frågor och åtgärdsfeedback, stegvis exempel 3156, bokhänvisningarna, utcheckningen och samtliga nio avsnitt vid 390px mobilbredd. Det körs tillsammans med regressionstesterna för föregående fem lektioner.
- Det första testet efter registrering fann ett **för strikt textmatchningsvillkor** i testskriptet, inte något felaktigt kandidatvärde på webbsidan. Testet justerades för att kontrollera innehållet i stället för en viss ordalydelse.

**Återstår för verklig undervisning:** manuell kontroll på lärarens projektor/surfplatta, och klassrumsuppföljning av elevlösningar. Godkända tekniska tester utgör inte bevis på ökat lärande.


**Slutlig teknisk verifiering av lektion 6 (2026-11-12):** Alla sex Chromium-testskript passerade i [körning 43249420573](https://github.com/jacobflinder/Lektioner/actions/runs/43249420573), inklusive samtliga nio steg i 390px mobilbredd och båda globala maximiplatserna vid högra gränsen 4,5. Efter granskning av skärmbilderna förtydligades boksidornas placering och kandidaternas notation. [GitHub Pages-publikationen 43249418414](https://github.com/jacobflinder/Lektioner/actions/runs/43249418414) avslutades också med resultat success för samma ändring `fccce0ea0a7fa3278df8bef719b6cc814582c343`. Som tidigare kvarstår manuell klassrums- och projektorkontroll.


## Lektion 7 · Extremvärdesproblem med polynomfunktioner

**Underlag:** `Ma3c_Extremvardesproblem_polynom.pdf` (9 sidor), kapitel 3.2, s.162–164. **Lektionsadress:** `/mato1c/kapitel-3/extremvardesproblem-polynomfunktioner/`.

### Källtrohet och didaktisk struktur
- Källans tre huvudfall (kostnad/3201, biljettintäkt/3202, raket/3204) är bevarade med variabeldefinition, enhet, teckentolkning och svar i situationen; dess självständiga utcheckning är separat från facit.
- Bok s.163–164: nivå 1 3202–3207, nivå 2 3208–3210, nivå 3 3211–3214; minst två nivåer. Ursprunglig rekommendation 3203,3205,3209 samt alternativ 3208–3210 följt av nivå3. Eget bokarbete ca 20 min. Läxa 3205 och 3209, extra 3212.
- Mål efter startfråga, genomarbetade exempel i avsiktliga steg, en egen uppgift med mindre stöd, lokala kontroller med riktad återkoppling, individuellt exit-svar i rätt enheter. Ingen Socrative i originalet och ingen introducerad.

### Oberoende matematisk kontroll
- Kostnad: `K=x³−9x²+15x+50`, `K′=3x²−18x+15=3(x−1)(x−5)`, K′(0)=15, K′(2)=−9, K′(6)=15. K(0)=50, K(1)=57, K(5)=25. På x≥0 växer K från x0 till1, sjunker till5 och ökar sedan, så minimum 25 tusen kronor per dag vid x5; 5 är ett giltigt antal skärmar.
- Biljetter: `I=1000x−5x²`, `I′=1000−10x`, enda stationära x100 (maximum då I′ växlar +→−), I(100)=50 000 kr. Vid x100 är `1000−5·100=500` sålda; 100·500=50 000. I(0)=I(200)=0. Dynamikens testvärden: x50 ⇒ 750 sålda och 37 500 kr; x200 ⇒ 0 sålda och 0 kr.
- Raket: `h=40+10t−5t²`, `h′=10−10t=0` ⇒ t1. h(1)=45 m, och h(0)=40, h(4)=0. Rötterna till h=0 är t−2 och t4; modellens tillåtna tider är 0≤t≤4. Därmed globalt maximum efter 1 s på höjden 45 m.
- Vinst: `V=−x²+6x−5`, `V′=−2x+6` ⇒ x3, derivatatecken +→−, V(3)=4, ändpunkterna V(0)=V(6)=−5. Om x är tusen enheter per dag och V tusen kr per dag svarar man 3 000 enheter/dag och 4 000 kr/dag.
- Modellantaganden: I beskriver biljettintäkten endast på intervallet [0,200]. Kostnadsexemplet börjar med en kontinuerlig hjälpfunktion men slutar med giltigt icke-negativt heltal. Raketens negativa tidsrot måste sorteras bort. Inga påståenden om empiriskt uppmätt efterfrågan, verkliga kostnadskurvor eller faktisk raketfysik görs.

### Kvalitetskontroller och öppna begränsningar
- 10 lektionsavsnitt. Noll dubbla HTML-id, inga saknade JS- eller facitmål. Separata originaltrogna bok- och exit-avsnitt. Gemensam Ma1c-motor och CSS återanvänds; Ma4 och fysikfiler är orörda.
- SVG-grafen använder `I(x)` direkt, samma pris x styr antalet sålda biljetter och total intäkt; ingen autoanimering eller insamling av elevsvar. Tydliga enheter, grafaxlar, textbaserade värden och tangentsensitiv återkoppling. Raketens svarskontroll särskiljer tid/höjd och otillåten negativ tid.
- Webbläsartestet `qa/extremvardesproblem-polynom-browser.cjs` kontrollerar lektionens tio steg, start/mål, kostnadsexemplets facit, biljettmodellen vid priserna 0/50/100/200, derivatariktad återkoppling, raketens enheter, bokuppgifter, läxa, utcheckning och mobilvyer. Det körs efter alla sex tidigare regressionstester.
- Första automatiska körningen upptäckte att s.163–164 stod i avsnittsrubriken men inte i bokinstruktionens huvudtext. Sidan korrigerades så att hänvisningen även finns där och testades om med godkänt resultat.
- **Återstår:** manuell prövning på lärarens projektor, iPad och fysisk undervisning samt uppföljning av elevernas lösningar. Tekniska tester bevisar inte förbättrade läranderesultat.


**Slutlig verifiering av lektion 7, 2026-11-12:** Chromium-körning [43252467370](https://github.com/jacobflinder/Lektioner/actions/runs/43252467370) passerade alla sju lektionsskript utan fel. Den omfattade interaktionen vid biljettpriserna 0/50/100/200, raketens felsvar, källans boknivåer och utcheckning samt tio mobila vyer utan horisontellt sidöverspill. [GitHub Pages 43252466075](https://github.com/jacobflinder/Lektioner/actions/runs/43252466075) publicerade samma kodversion `02ebb7025cb9651647fad93e9e41f55d2dcd5868` med resultat success. Efter manuell skärmbildsgranskning förbättrades mobilgrafens etiketter, och en stapelrubrik som avslöjade maxintäkten för tidigt gjordes neutral. Skärmbilder från den slutgiltiga Chromium-körningen granskades. Fysisk projektorprövning och elevrespons återstår.


## Lektion 8 · Modellering och fler extremvärdesproblem

**Original:** `Ma3c_Modellering_och_fler_extremvardesproblem.pdf` (10 sidor), två innehållsavsnitt ur kapitel 3.2 på s.166–172. **URL:** `/mato1c/kapitel-3/modellering-och-fler-extremvardesproblem/`. Webbversionen innehåller 12 steg med tre matematiska problem och två utcheckningar.

### Källtrohet
- Samtliga exempel **3215** (50×30-låda), **3216** (rektangel under `y=3−x²`) och **3233** (vinsten `15−0,1x−40/x`) har behållits, inklusive uppgifts- och sidnummer, definitionsmängder, otillåtna kandidater och svar med korrekta enheter.
- Originalets animation om rektangelns bas/höjd/area har förts över till två *manuellt styrbara* exakta SVG-vyer med samma x. Lådmodellen har kompletterats med liknande förutsägelse-styrd interaktivitet. Ingen onödig autoanimation.
- Båda fullständiga bokavsnitten är med: **s.168–170** (3217–3221, 3222–3228, 3229–3232) och **s.172** (3234–3238, 3239–3241, 3242–3244). Båda rekommenderade uppgiftsspåren kvar. Minst två av tre nivåer och tjugo minuter lugnt arbete.
- Läxa **3221 och 3236**, extra **3241**. Originalets två individuella utcheckningsuppgifter finns kvar med separata dolda lösningssekvenser. Ingen Socrative fanns i originalet eller infördes i lektionen.

### Matematisk kvalitetssäkring
- **Lådan:** `V=x(50−2x)(30−2x)=4x³−160x²+1500x`, domän `0<x<15`; `V′=12x²−320x+1500`. Stationära `x=(40±5√19)/3` ≈6,06850 och20,59816. Endast den första är tillåten. Derivatan byter +→−, volymen närmar sig noll vid båda otillåtna ändlägena; globalt maximum ≈4104,41037 cm³, avrundat ≈4100 cm³ vid höjd ≈6,07 cm. Kontrollvärden: V(3)=3168, V(6)=4104, V(10)=3000. SVG-figuren följer geometrin med skala 10 px/cm.
- **Rektangeln:** `P=(x,3−x²)`, bas`2x`, höjd`3−x²`, domän `0<x<√3`. Arean `A=6x−2x³`, derivatan `6−6x²`. Kandidater ±1 och bara +1 tillåten; `A′(0,5)=4,5` och `A′(1,5)=−7,5`. `A(1)=4`, bas2/höjd2; enheter *areaenheter* och *längdenheter*, inte påhittade cm². Testpunkter A(0,5)=2,75 och A(1,5)=2,25.
- **Bråkvinsten:** `V=15−0,1x−40/x`, x≥4; `V′=−0,1+40/x²`, nollställen ±20, −20 otillåten. V′ positiv för 4≤x<20, negativ för x>20. V(4)=4,6, V(20)=11 i *tusentals kr/dag*; 20 tillåtet heltal lampor, vinst 11 000 kr/dag. Kontinuerlig modell används som analysstöd, inte som möjlighet att tillverka delar av lampor.
- **Utcheckning 1:** `A=x(6−x)`, `0<x<6`, `A′=6−2x`, x3 max, A3=9, mått3×3.
- **Utcheckning 2:** `C=x+9/x` för x>0, `C′=1−9/x²`, x3 giltig, C3=6 min. PDF-textutdraget för s.9 hade en tvetydig radbrytning av bråket; tolkningen `9/x` verifierades med s.10:s uttryck `C′=1−9/x²`, dess lösning `x=±3` och `C(3)=6`. Det är alltså inte ett obestyrkt nytt funktionsuttryck.

### Teknisk och didaktisk granskning
- 12 avsnitt i samma kurslokala komponentram, lärarstöd i klassrumsläge, repetitionsläge, grafmodeller, stegvis explicit lösning, individuell exit och kontrollåterkoppling.
- Statiskt: inga dubbletter av HTML-ID, inga saknade JavaScript-mål eller återkopplingsmål, samtliga bokreferenser och läxor; inga nätverksanrop eller lagringsfunktioner i lektionens JS. Befintliga Ma4- och fysikfiler har inte ändrats.
- Chromium-test `qa/modellering-fler-extremvardesproblem-browser.cjs`: alla 12 steg, mode-switch och lärarstöd, lådans mått/volym vid x3/6/10, samordnade rektangel- och areamarkörer x0,5/1/1,5, negativ derivatafelsvar, bråkfunktionens gräns/maximum, sex boknivåspår, två separata utcheckningsfacit, 390px mobilvyer utan horisontellt sidöverspill och inget externt anrop.
- Bildgranskning av desktop och mobil efter en godkänd testkörning upptäckte att `figure`-elementets standardmarginal minskade SVG-diagrammens bredd, och att märkningen `30 cm` i klippmallen delvis klipptes och `x` delvis doldes av överkorsning. Figuren korrigerades så att den första hörnkvadraten visar x tydligt, 30 cm placeras innanför SVG-ytan och diagramskalan utnyttjar hela tillgängliga bredden.
- **Återstår för verklig kvalitetssäkring:** genomgång på projektor och iPad samt undersökning av elevernas självständiga lösningar. Varken matematikcheck eller Chromium-godkännande garanterar en viss lärandeeffekt.
