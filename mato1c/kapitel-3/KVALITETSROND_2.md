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

## Kommande omgångar

- **Omgång 2:** lektion 3–4, andraderivatan och dess roll för grafen.
- **Omgång 3:** lektion 5–6, grafrelationer och största/minsta värde.
- **Omgång 4:** lektion 7–8, tillämpade och geometriska extremvärdesproblem.
- **Omgång 5:** lektion 9–10, blandade problem och deriverbarhet.

**Arbetsregel:** Publicera och verifiera endast det aktuella paret innan nästa omgång påbörjas. Ingen förändring av kursens ursprungliga uppgifter, läxor eller förberedda Socrative-inslag utan nytt uttryckligt beslut.
