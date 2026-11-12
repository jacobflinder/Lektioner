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
- Två identiska 1,5 V-celler: serie 3,0 V, parallellt 1,5 V; lika ideala celler delar lika på strömmen.
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

Endast `fy1/kapitel-8/serie-parallell/` ändras. Andra Fysik 1-lektioner, Fysik 2, Ma4 och bibliotekets gemensamma CSS/JS är orörda.

## Didaktisk uppdatering – penna och papper först (2026-11-12)

I avsnitt 8.3 används nu ett separat frivilligt självtest: två nya beräkningsproblem löses på **papper** utan numeriska inmatningsfält på webben. Den första uppgiften ger ett startsteg, den andra ska lösas mer självständigt. Eleven kan visa ledtråd och beräkningslösning stegvis. Efter papperslösningen väljer eleven en fysikalisk begreppsförklaring bland tre alternativ och får specificerad återkoppling på vanliga missuppfattningar.

Originalets bokhänvisningar, verkliga demonstrationer, Socrative där sådan finns och den skyddade boktiden påverkas inte. Den digitala frågan bedömer ett **valt resonemang**, inte alla elevens mellanled. Ingen elevinloggning, numerisk svarslagring eller överföring införs.

**Verifiering:** JavaScript-granskning, data-/sökvägskontroll och begränsad lokalt genomförd webbläsartestning; inga nya påståenden om faktiskt prövad GitHub Pages-visning eller elevresultat. Kontroll i Safari, på projektor och i klassrum återstår.
