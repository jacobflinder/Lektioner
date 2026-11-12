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

**Öppet:** En fullständig interaktiv webbläsar- och visuell kontroll av GitHub Pages samt fysisk projektor-/mobiltest har inte kunnat bekräftas i denna granskning. Koden har inte observerats tillsammans med elever. Nästa förbättring bör utgå från detta, inte från att lektionen redan skulle vara perfekt.
