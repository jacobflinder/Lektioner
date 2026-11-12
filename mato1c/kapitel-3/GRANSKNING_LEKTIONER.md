# Kvalitetsgranskning – Matematik fortsättning, nivå 1c · Kapitel 3

**Status 2026-11-12:** En webblektion är byggd och filerna publicerade på GitHubs `main`. Följande är kod- och matematikgranskning; det är **inte** ett påstående om fullständig visuell verifiering eller bevisad elevnytta.

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
