# Kvalitetskontroll – 8.3 Serie- och parallellkoppling

Datum: 2026-11-12. Originalkälla: `261116 8.3 Seriekoppling och parallellkoppling.pdf`, 11 sidor.

## Status

**Reviderad och lokalt Chromium-testad, inte klassrumsverifierad.**

- 11/11 originalbilder inventerade och motsvarande 11 webbilder finns kvar.
- Sju separata SVG-kretsscheman med läsbara riktningar, mätpunkter och enheter, samt en interaktiv modell för serie/parallell.
- Fyra nya lokala webbfrågor skiljs från befintlig **Socrative 903 / SOC-37285032**.
- Bokhänvisningar från originalet bevarade: s. 281–293, uppgifter 829–838, prioritera 834–835 s. 293, sedan 833 och 829, vidare 830–832 och 836–838.
- Nästa läsning: Effekt s. 294–299 och **gröna rutorna**.
- Verklig instrumentkoppling och PhET-kopplingslabben är separata lärmoment, inte ersatta av webbmodellen.
- Individuell exit finns. Bild 11 är frivilligt stöd under bokarbete, inte ytterligare obligatorisk genomgång.
- Lärarstöd har riktmärke 70 min inklusive 21 min skyddad boktid och 5 min exit.

## Fysik och matematik

- Serie 12 V, 100 Ω, 200 Ω: R_ers = 300 Ω, I = 0,040 A, U1 = 4,0 V, U2 = 8,0 V.
- Parallellt: R_ers = 66,7 Ω, I1 = 0,120 A, I2 = 0,060 A, I_total = 0,180 A, U1 = U2 = 12 V.
- Blandad krets (60 Ω i serie med 120 Ω // 240 Ω, 14 V): R_par = 80 Ω, R_ers = 140 Ω, I = 0,10 A, U_par = 8,0 V, I_120 = 0,0667 A, I_240 = 0,0333 A.
- Instrument: amperemeter i serie, voltmeter parallellt över komponentens två anslutningar.
- Två identiska 1,5 V-celler: serie 3,0 V, parallellt 1,5 V; lika strömdelning (0,050 A av totalt 0,10 A per cell) förutsätter lika ems, lika inre resistans och symmetriska anslutningar; ideala parallellkopplade spänningskällor bestämmer inte individuell cellström.
- Källa och ledare antas ideala, resistorer ohmska vid konstant temperatur. Sådana antaganden anges i lärarstödet och modellen.
- **Viktigt rättat under QA:** borttaget shunt-/kortslutningsledningar i de två parallellschemana och den interaktiva modellen. Kretstopologi har särskilda regressionskontroller.

## Teknik – vad som faktiskt testades

`test_serie.py` kördes på Chromium med inlästa lokala HTML-, CSS- och JavaScript-filer via `page.set_content`, eftersom denna miljö blockerade lokal HTTP-navigering.

**116/116 automatiserade kontroller godkända**, bland annat:

- De 11 bilderna, sju statiska SVG-figurer och den interaktiva modellen.
- Resurssökvägar på disk, scriptinitiering och inga JavaScript-undantag.
- Lärarstyrt avslöjande, ny webbfråga med rätt/fel-återkoppling, återgång från repetitionsläge till klassrumsläge, återställning.
- Modell: två kopplingar, spänning och resistansvärden i gränsfall, korrekt ström/spänning/resistans, fortsatt uppdatering efter avslöjandet och återställning.
- Fastställda figur- och kodmönster utan kortslutande bypass-grenar.
- Stegvis lösning nära beräkningsuppgifterna.
- Bokhänvisningar, Socrative-ID och läsning av gröna rutor.
- Horisontell overflow på samtliga 11 bilder vid 1440, 1280, 768, 390 och 320 px: **0 px**.
- Visuellt granskade PNG-skärmbilder i desktop- och mobilformat.

Ingen elevinloggning, inga formulär som skickar elevdata och ingen lokal lagring i den granskade lektionskoden.

## Verifiering som återstår

- Kontrollera att GitHub Pages har byggt och publicerat den aktuella versionen; en GitHub-commit räcker inte som live-verifiering.
- Safari på iPhone/iPad, särskilt fullskärmskontrollen och MathML-renderingen.
- Projektorsynlighet, styrning och återkopplingsrytm i verkligt klassrum.
- Följ upp hur mycket eget bokarbete som faktiskt hinns med och om elevernas förklaringar förbättras.
- Fullständig skärmläsargranskning/WCAG-audit har inte utförts; SVG har title/desc och kontrollerna textetiketter, men det är inte ett fullständigt tillgänglighetstest.

## Ändringsavgränsning

Djupgranskning #41 ändrar endast `fy1/kapitel-8/serie-parallell/`, en **ny riktad Playwright-svit** under `fy1/kapitel-8/qa/` och dess anrop i `.github/workflows/fy1-browser-qa.yml`. De fem äldre Fy1-testsviterna, andra webblektioner och gemensamma CSS-/JS-filer är oförändrade.

## Didaktisk uppdatering – penna och papper först (2026-11-12)

I avsnitt 8.3 används nu ett separat frivilligt självtest: två nya beräkningsproblem löses på **papper** utan numeriska inmatningsfält på webben. Den första uppgiften ger ett startsteg, den andra ska lösas mer självständigt. Eleven kan visa ledtråd och beräkningslösning stegvis. Efter papperslösningen väljer eleven en fysikalisk begreppsförklaring bland tre alternativ och får specificerad återkoppling på vanliga missuppfattningar.

Originalets bokhänvisningar, verkliga demonstrationer, Socrative där sådan finns och den skyddade boktiden påverkas inte. Den digitala frågan bedömer ett **valt resonemang**, inte alla elevens mellanled. Ingen elevinloggning, numerisk svarslagring eller överföring införs.

**Verifiering:** JavaScript-granskning, data-/sökvägskontroll och begränsad lokalt genomförd webbläsartestning; inga nya påståenden om faktiskt prövad GitHub Pages-visning eller elevresultat. Kontroll i Safari, på projektor och i klassrum återstår.


## Systematisk djupgranskning 41/41 – 15 november 2026

Den tidigare avgränsade lokala 116-kontrollsgranskningen ovan ersätts **inte** av ett antagande om fullständighet: ny [kod-PR #61](https://github.com/jacobflinder/Lektioner/pull/61) har genomfört full systematisk 11-bilders granskning, rättat både fysik och elevaktivering och är **MERGED** som `7bc9924af71f9b9583a8620156e6aad742176039`. Fullständig bild-för-bild-rapport finns i [permanenta granskning/README.md](../../../granskning/README.md) under **41/41**.

- **Ämnesprecision:** Laddningens bevarande för strömmar, energins bevarande och gemensamma noder för spänningar. Det tidigare felaktiga påståendet att båda 100Ω/200Ω-grenresistanserna var större än 100Ω har korrigerats. Elevfrågan om parallellkopplade 1,5 V-celler innehåller nu tillräckliga symmetriantaganden.
- **Elevaktivering:** Instrumentets *både* korrekta kretsschema *och* direktförklarande text är dolda innan eleven ritat. Batteriförklaringen visas först efter egen förutsägelse. Fler fullständiga metodsteg utan onödig interaktivitet. Dubbel ”Nästa bild”-knapp efter sista steg borttagen.
- **Matematik:** 47 självständiga statiska semantiska MathML-rader, 6 dynamiska mätresultat, riktiga bråk/index/enheter och minst 16px uppmätt luft i faktiskt synligt facit; 11/11 webbilder och alla dolda steg. Kontrollräknat serieresistans, parallellgrenar, celler, exit och den frivilliga 60+(120∥240)Ω-uppgiften.
- **Proportionella figurer:** De sex dynamiska måtten redovisas med *fasta, absoluta* SVG-skalor **0–1 A**, **0–24 V** och **0–1000 Ω**; beräknad stapelbredd är `320·värde/max` och växer/minskar i samma proportion som det fysikaliska värdet i hela reglageintervallet. Samma skalor i serie och parallell, inga vilseledande omnormaliseringar. Före förutsägelse är staplar och resultat dolda.
- **Slutlig granskning:** [GitHub Actions #43735332160](https://github.com/jacobflinder/Lektioner/actions/runs/43735332160) **SUCCESS på exakt kod-PR-SHA**: Fy1_41 **1467 PASS, 75 skärmbilder** (390px mobil, 1440px dator, 1920px projektor; dolda och avslöjade tillstånd; 96 kombinationer av läge/U/R1/R2). Samma körning Fy1_36 **333 PASS**, #37 **422**, #38 **425**, #39 **418**, #40 **604**, sammanlagt **3669 PASS/453 skärmbilder**, 0 JS-fel och 0 externa anrop. Manuellt granskade Chromium-skärmbilder visade faktiska svarsläckor, som åtgärdades och testades igen.
- **Main och publicering:** [main Fy1-QA #43735697709](https://github.com/jacobflinder/Lektioner/actions/runs/43735697709) **MAIN_CI_STATUS_PENDING** och [Pages #43735697246](https://github.com/jacobflinder/Lektioner/actions/runs/43735697246) **PAGES_STATUS_PENDING** för kod-SHA `7bc9924af71f9b9583a8620156e6aad742176039`.
- **Oförändrat:** den riktiga instrumentaktiviteten, PhET-labb som separat aktivitet, Socrative 903, 829–838 s.281–293, bokläsning till Effekt s.294–299 och de gröna rutorna, 70min-lektionsram, 21min bokarbete, frivilligt papperssjälvtest och skydd av elevdata.

**Begränsningar:** De 11 webbilderna har djupgranskats och Chromium-fångsterna inspekterats. Original-PDF:en kunde inte öppnas på nytt för strikt sidjämförelse; faktisk fysisk projektor, Safari/iPhone/iPad, OBS/AirServer, elevresultat och fullständig WCAG-audit är inte kontrollerade. Godkänd kod betyder inte automatiskt bevisad undervisningseffekt.
