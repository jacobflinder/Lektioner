# Figur- och interaktionsgranskning – 41 webblektioner

> **Figur- och interaktionsgranskning: lektion 1/41 – Fysik 2, Ström ger magnetfält.**  
> **Senast färdigställda lektion:** Ingen i denna separata granskning. Den äldre **matematikgranskningen** i [README.md](README.md) har 41/41 färdiga men ersätter inte figurgranskningen.  
> **Aktuell lektion:** 1/41 · Fysik 2 · Ström ger magnetfält · `fy2/kapitel-3/strom-ger-magnetfalt/`  
> **Lektionsstatus:** Verifieras, ej godkänd eller publicerad  
> **Fortsättningsstatus:** Arbete pågår inom pilotlektion 1; ingen tillåtelse att påbörja lektion 2  
> **Klart hittills:** Kodinventering, egen figur för högerhandsregeln, dynamisk cirkel genom P, fast skalenlig B-stapel, nytt Playwright-test och lärarstöd på arbetsgren  
> **Återstår:** GitHub Actions-grenens fulla Fy2-test, faktiskt skärmbilds-/mobil- och projektorgranskning, korrigering av eventuella fel, squash-merge enligt AGENTS.md, Pages och main-kontroll samt slutrapport  
> **Nästa handling:** Läs AGENTS.md och denna logg; kontrollera den aktuella grenens testresultat, granska skärmbilder, åtgärda tester och sammanslå endast när kraven uppfylls  
> **Nästa lektion i ordningen:** 2/41 · Fysik 2 · Elektriska fält, **startas först efter användarens ”nästa”**  
> **Kodversion:** Bas `main` = `85ff8ffa8e8b128f1ee7aa8a4411fcafc0b32f5f` vid start 2026-11-15. Arbetsgren `figurer-interaktioner-pilot-20261115`; ändringar ännu ej publicerade på main.  
> **Publicerad verifiering:** Inte gjord för figurgranskningens ändringar. Gammal publicerad pilot ≠ den nya arbetsgrenen.

## Varaktiga granskningsinstruktioner

Läs [figurer-interaktioner-instruktion.md](figurer-interaktioner-instruktion.md) och `AGENTS.md` vid varje ny chatt. Separera detta arbete från [matematikgranskningen](README.md). Varje lektion ska inventeras från behov, inte bara befintliga figurer. Prioritera fysikalisk riktighet och saknade förklaringssteg över kosmetik. Bevara fullständig matematisk lösning, Socrative enbart där det redan finns, bokuppgifter, läxor och demonstrationer. Låt eleverna förutsäga före återkoppling. Koppla figurer, formler och reglage till samma tillstånd. Verifiera faktiskt ritad geometri oberoende av programmets egna tal. Dokumentera både utförda och ej utförda kontroller. **Godkänn inte en lektion med enbart gröna knappar eller med kvarstående obligatorisk verifiering.**

## Fast granskningsregister

**Inventerat: 41/41** unika publicerade lektionskataloger, Fysik 2 = 10, Matematik 4 = 15, Fysik 1 = 6, Matematik fortsättning nivå 1c = 10. Undervisningsordning hämtad från respektive kapitels index. Undantag: **Ström ger magnetfält**, normalt Fy2-lektion 04, ligger uttryckligen först som pilot och förekommer inte igen. Räknestugor och demonstrationspass följer det läge där de står i Fy2-indexet. Enhetscirkeln behandlas som förberedande Ma4-repetition eftersom den visas före 4.1 i indexet. `mato1c` betyder Ma3c/Gy25 fortsättning nivå 1c.

| Nr | Kurs | Titel | Sökväg | Figur-/interaktionsstatus |
|---:|---|---|---|---|
| 1 | Fysik 2 | Ström ger magnetfält | `fy2/kapitel-3/strom-ger-magnetfalt/` | Verifieras på arbetsgren |
| 2 | Fysik 2 | Elektriska fält | `fy2/kapitel-3/elektriska-falt/` | Ej påbörjad |
| 3 | Fysik 2 | Permanentmagneter, material och flöde | `fy2/kapitel-3/magnetism/` | Ej påbörjad |
| 4 | Fysik 2 | Räknestuga | `fy2/kapitel-3/raknestuga/` | Ej påbörjad |
| 5 | Fysik 2 | Spolar och solenoider | `fy2/kapitel-3/spolar-och-solenoider/` | Ej påbörjad |
| 6 | Fysik 2 | Laddade partiklar i magnetiska fält | `fy2/kapitel-3/laddade-partiklar/` | Ej påbörjad |
| 7 | Fysik 2 | Jordens magnetfält | `fy2/kapitel-3/jordens-magnetfalt/` | Ej påbörjad |
| 8 | Fysik 2 | Induktion | `fy2/kapitel-3/induktion/` | Ej påbörjad |
| 9 | Fysik 2 | Magnetisk kraft och jordens magnetfält – räknestuga | `fy2/kapitel-3/raknestuga-kraft-jordfalt/` | Ej påbörjad |
| 10 | Fysik 2 | Demonstrationer – elektromagnetism | `fy2/kapitel-3/demonstrationer-elektromagnetism/` | Ej påbörjad |
| 11 | Matematik 4 | Enhetscirkeln – repetition | `ma4/kapitel-4/enhetscirkeln/` | Ej påbörjad |
| 12 | Matematik 4 | Komplexa tal och imaginära enheten i | `ma4/kapitel-4/komplexa-tal-och-i/` | Ej påbörjad |
| 13 | Matematik 4 | Konjugat och absolutbelopp | `ma4/kapitel-4/konjugat-och-absolutbelopp/` | Ej påbörjad |
| 14 | Matematik 4 | Multiplikation och division av komplexa tal | `ma4/kapitel-4/multiplikation-division-komplexa/` | Ej påbörjad |
| 15 | Matematik 4 | Komplexa tal som vektorer | `ma4/kapitel-4/komplexa-tal-som-vektorer/` | Ej påbörjad |
| 16 | Matematik 4 | Polär form | `ma4/kapitel-4/polar-form/` | Ej påbörjad |
| 17 | Matematik 4 | Multiplicera och dividera med i | `ma4/kapitel-4/multiplicera-dividera-med-i/` | Ej påbörjad |
| 18 | Matematik 4 | Multiplikation och division i polär form | `ma4/kapitel-4/polar-multiplikation-division/` | Ej påbörjad |
| 19 | Matematik 4 | de Moivres formel | `ma4/kapitel-4/de-moivre/` | Ej påbörjad |
| 20 | Matematik 4 | Ekvationen zⁿ = a | `ma4/kapitel-4/ekvationen-zn-a/` | Ej påbörjad |
| 21 | Matematik 4 | Eulers formel | `ma4/kapitel-4/eulers-formel/` | Ej påbörjad |
| 22 | Matematik 4 | Andragradsekvationer i komplexa tal | `ma4/kapitel-4/andragradsekvationer/` | Ej påbörjad |
| 23 | Matematik 4 | Polynomdivision | `ma4/kapitel-4/polynomdivision/` | Ej påbörjad |
| 24 | Matematik 4 | Faktorsatsen | `ma4/kapitel-4/faktorsatsen/` | Ej påbörjad |
| 25 | Matematik 4 | Polynomekvationer av högre grad | `ma4/kapitel-4/hogre-grad/` | Ej påbörjad |
| 26 | Fysik 1 | Coulombs lag | `fy1/kapitel-8/coulombs-lag/` | Ej påbörjad |
| 27 | Fysik 1 | Elektriska kretsar | `fy1/kapitel-8/elektriska-kretsar/` | Ej påbörjad |
| 28 | Fysik 1 | Serie- och parallellkoppling | `fy1/kapitel-8/serie-parallell/` | Ej påbörjad |
| 29 | Fysik 1 | Elektrisk effekt | `fy1/kapitel-8/effekt/` | Ej påbörjad |
| 30 | Fysik 1 | Elektriska fält | `fy1/kapitel-8/elektriska-falt/` | Ej påbörjad |
| 31 | Fysik 1 | Potential | `fy1/kapitel-8/potential/` | Ej påbörjad |
| 32 | Matematik fortsättning nivå 1c (Ma3c) | Växande och avtagande | `mato1c/kapitel-3/vaxande-och-avtagande/` | Ej påbörjad |
| 33 | Matematik fortsättning nivå 1c (Ma3c) | Extrempunkter och terrasspunkter | `mato1c/kapitel-3/extrempunkter-och-terrasspunkter/` | Ej påbörjad |
| 34 | Matematik fortsättning nivå 1c (Ma3c) | Andraderivatan | `mato1c/kapitel-3/andraderivatan/` | Ej påbörjad |
| 35 | Matematik fortsättning nivå 1c (Ma3c) | Andraderivatan och funktionens graf | `mato1c/kapitel-3/andraderivatans-roll-for-grafen/` | Ej påbörjad |
| 36 | Matematik fortsättning nivå 1c (Ma3c) | Funktionens graf och derivatornas grafer | `mato1c/kapitel-3/funktionens-graf-och-derivatornas-grafer/` | Ej påbörjad |
| 37 | Matematik fortsättning nivå 1c (Ma3c) | Största och minsta värde | `mato1c/kapitel-3/storsta-och-minsta-varde/` | Ej påbörjad |
| 38 | Matematik fortsättning nivå 1c (Ma3c) | Extremvärdesproblem med polynomfunktioner | `mato1c/kapitel-3/extremvardesproblem-polynomfunktioner/` | Ej påbörjad |
| 39 | Matematik fortsättning nivå 1c (Ma3c) | Modellering och fler extremvärdesproblem | `mato1c/kapitel-3/modellering-och-fler-extremvardesproblem/` | Ej påbörjad |
| 40 | Matematik fortsättning nivå 1c (Ma3c) | Blandade problem | `mato1c/kapitel-3/blandade-problem/` | Ej påbörjad |
| 41 | Matematik fortsättning nivå 1c (Ma3c) | Deriverbarhet | `mato1c/kapitel-3/deriverbarhet/` | Ej påbörjad |

## Historik – pilot 1/41

**2026-11-15 · inledande kodgranskning** av `content.js`, `logic.js`, `index.html`, `practice.js`, `lararstod.html`, befintliga `deep-review-fy2-35.cjs` och kursens QA-workflow. 18 ordinarie lektionsbilder och en frivillig Ampère-bild; originalets pappersarbete, demonstrationslänk, Socrative och bok/läxa ska bevaras. Tidigare matematikgranskning verifierade aritmetik och vissa SVG-fall; detta granskningsspår kräver ytterligare faktiskt visuellt stöd och varierande reglagetillstånd.

**Konkreta brister:** (1) Högerhandens orientering och fingrarnas relation till tvärsnittets `⊙`/moturs-fält framgick bara i ord; ingen fysisk handillustration i elevbilden. (2) I beräkningsmodellen flyttades P när r-reglaget ändrades medan ritade cirklar låg kvar på tre konstanta, godtyckliga radier. (3) B-talet ändrades, men beräkningsbilden saknade avläsbar, oföränderligt skalad storleksrepresentation. Detta är ett visuellt glapp, inte ett belägg för att ursprungsformeln beräknade fel. (4) Nytt tydligare automatprov behövs för faktisk SVG-geometri och skala över flera tillstånd.

**Åtgärder på arbetsgren (inte publicerade):** Inlagd egen schematisk högerhand + tvärsnitt med B-tangent i P, inuti fördröjd återkoppling på bild 4. På bild 10 följer fältcirkeln nu punktens valda r med konstant `12 SVG-enheter/cm`; tidigare tre hjälpcirklar försvinner ur just beräkningsmodellen. Separat B-stapel visas endast efter elevens försök, på fixerad `0–120 μT`-skala där 360 SVG-enheter motsvarar 120 μT. Högerhandsregel och modellgränser förklarade i `lararstod.html`. Nytt `qa/figure-interaction-pilot-strom.cjs` är kopplat till Fy2:s CI-workflow.

**Definierade oberoende kontrollfall:** `B = 2·10⁻⁷ I/r` i tesla (I i A, r i meter). Vid 6 A, 4 cm: `B=30 μT`, ritad stapel 90/360, P 48 SVG-enheter från centrum. Vid 12 A och 4 cm: `60 μT`, stapel 180/360, samma P. Vid 12 A och 8 cm: `30 μT`, stapel 90/360 och P 96 SVG-enheter från centrum. Strömvändning vänder tangenten upp↔ned i P till höger, inte B:s storlek. Gränsvärden 1 A/12 cm ger 1,667 μT och 5 SVG-enheter; 12 A/2 cm ger 120 μT och 360 SVG-enheter. Strömfaktor 2 och 3 ska ge pilar i förhållandet 1:2:3; avstånd 2r och 3r ger B₀/2 och B₀/3 samt dubbelt/tredubbelt P-avstånd.

**Verifiering:** Kodändringarna och testfallen är sparade på arbetsgren. **Automatiserad Chromium-körning, visuell inspektion av skärmbilder och kontroll av Pages är ännu inte rapporterade som godkända här.** Stäng inte piloten om de inte passerar. Inspektera även om den schematiska handen blir missvisande; en korrekt fysisk illustration väger tyngre än dekoration.

**Parallellt arbete:** Förändringar görs från senaste kontrollerade main på egen arbetsgren. Ändra inte nästa lektion; `practice.js` och Socrative-/bokmaterial har inte modifierats. Följ `AGENTS.md`: testa på gren, sammanför ändringar med tillhörande test i en sammanhållen PR/commit, verifiera main och Pages på samma kodversion.

**Status:** Fortsätt pilot 1/41; **ej klar**. Nästa lektion i registret finns för planering, inte som starttillstånd.
