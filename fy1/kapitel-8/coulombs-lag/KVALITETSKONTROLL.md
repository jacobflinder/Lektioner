# Kvalitetskontroll – 8.1 Coulombs lag

Revision: 2026-11-12. Källfil: `261102 Coulombs lag Fy1.pdf`, nio uppladdade sidor.

## Källtrohet

- Bild 1: elektroner flyttas, neutral/positiv/negativ laddning, laddningsbevarande. Förbättrad förutsägelse från A till B och efterbild.
- Bild 2: elektroskop – **verklig demonstration** och före/under/efter, inte digitalt utbyte.
- Bild 3–4: r, 2r, 3r, kvadratlag, laddningstecken, två lika stora motriktade krafter. Interaktiv avståndsmodell.
- Bild 5–7: båda originalexemplen och givna storheter bevarade (+2,5 nC; 0,051 nm); omvandling, full insättning, enhet och svar.
- Bild 8: ursprunglig Socrative `SOC-36980496`, rum `LRJ`, samt bokuppgifter 801–811.
- Bild 9: de två ursprungliga exitfrågorna, läxa 801–811 och läsanvisning s. 270–280 inklusive **gröna rutorna**.
- Ingen ny Socrative introducerad.

## Fysikgranskning

- Punktladdningar, kvadratlag, attraktion/repulsion, kraftpar, nolladdning kontrollerade.
- Originalets `F = kQ1Q2/r²` är en särskild *samspelskonvention*: plus = repulsion, minus = attraktion. Inte samma sak som en x-komponent. Kraftpilar visar separat riktningar.
- Exempel 1: N = 2,5e−9 / 1,602e−19 ≈ 1,6e10 elektroner; elektroner tillförs.
- Exempel 2: k·(+e)·(−e)/(5,1e−11)² ≈ −8,9e−8 N; attraktion, kraftens storlek 8,9e−8 N på vardera partikeln.
- Figuren för proton och elektron är en förenklad *klassisk* punktladdningsmodell vid givet avstånd, ingen kvantmekanisk atommodell.
- Ingen synbar pil används för kraftens storlek. Kraftstapeln har konstant 0–6 µN-skala och modellens högsta tillåtna kraft ≈ 5,619 µN.

## Didaktik och estetik

- Förutsägelser före avslöjande, enskilt–par–gemensamt.
- Framräknade mellanled ligger nära figuren för de två exemplen.
- Förklarande feedback för två flervalsfrågor; övriga svar och fullständiga lösningar stegvis.
- Modellparametrar kan justeras efter visat facit; resultat uppdateras konsekvent; återställning återgår till förutsägelse.
- Separat lärarstöd med missuppfattningar, tidsprioritering och reservplan.
- Bokarbete avsätts särskilt; ingen separat räknestuga antas.

## Verifierad teknik

- Lokal Playwright/Chromium med projektets verkliga HTML, CSS och JavaScript injicerade på sidan (browsermiljön blockerar lokal `file://`).
- 28 automatiserade kontroller passerade vid 390, 768 och 1440 pixlars bredd: 9 sidor, navigering/visning, ingen horisontell överrullning, ingen JavaScript-exception, modell, nollfall, attraktion, repulsion, gränsfall, reset, lägesbyte och förklarande återkoppling.
- Beräknat max (−5 nC, +5 nC, 0,2 m): 5,619 µN. Standard (2 nC, 3 nC, 0,5 m): +0,216 µN.
- SVG med titel/beskrivning och namngivna reglage.

## Återstår

- Körpublicering och **faktisk** GitHub Pages-kontroll på den distribuerade versionen.
- Test i Safari på iPhone/iPad och på klassrumsprojektor, inklusive MathML/visuell läsbarhet i 16:9.
- Elevprövning: får eleverna verklig återkoppling i rätt ögonblick och minst 20 minuter för eget bokarbete?
- Full WCAG-/skärmläsargranskning har inte genomförts. Statusen är inte ”perfekt/färdigtestad”.

## Avgränsad förbättring: resonemangskontroll (2026-11-12)

- 8.1:s frivilliga självtest får ett andra led efter korrekt numeriskt svar: eleven måste välja ett fysikaliskt resonemang, får diagnosspecifik återkoppling vid felslut och kan först därefter öppna full beräkningslösning. Egen muntlig/skriftlig motivering rekommenderas, men bedöms **inte automatiskt**.
- Originalets demonstration, Socrative 901, bokuppgifter 801–811 och figurer påverkas inte.
- Modellens förutsägelsefråga på befintlig bild används i stället för en duplicerad digital fråga. Ingen extra obligatorisk lektionstid tillkommer.
- En avgränsad lokal Chromium-kontroll av förklaringsflödet passerade tillsammans med 8.2 (36 av 36 testpunkter totalt i revisionsunderlaget). Detta ersätter inte kontroll på publicerad GitHub Pages eller elevprövning.


## Didaktisk uppdatering – penna och papper först (2026-11-12)

I avsnitt 8.1 används nu ett separat frivilligt självtest: två nya beräkningsproblem löses på **papper** utan numeriska inmatningsfält på webben. Den första uppgiften ger ett startsteg, den andra ska lösas mer självständigt. Eleven kan visa ledtråd och beräkningslösning stegvis. Efter papperslösningen väljer eleven en fysikalisk begreppsförklaring bland tre alternativ och får specificerad återkoppling på vanliga missuppfattningar.

Originalets bokhänvisningar, verkliga demonstrationer, Socrative där sådan finns och den skyddade boktiden påverkas inte. Den digitala frågan bedömer ett **valt resonemang**, inte alla elevens mellanled. Ingen elevinloggning, numerisk svarslagring eller överföring införs.

**Verifiering:** JavaScript-granskning, data-/sökvägskontroll och begränsad lokalt genomförd webbläsartestning; inga nya påståenden om faktiskt prövad GitHub Pages-visning eller elevresultat. Kontroll i Safari, på projektor och i klassrum återstår.

## Fördjupad granskning av lektion 36/41

- Originalets 9 webbilder, elektroskopdemonstration, Socrative Fy1 901 / SOC-36980496 (rum LRJ), bokuppgifter och läxa 801–811, grön-rute-läsning s. 270–280 samt frivilliga två papperssjälvtester bevaras.
- Identifierad **geometrisk proportionsbrist** i laddningsmodellen: ursprungligt ritavstånd hade konstant offset och stämde inte proportionellt med r-reglaget. Korrigerad till exakt **420 SVG-enheter per meter** (inom hela reglageintervallet 0,2–1,5 m). Verkliga SVG-centra ska verifieras vid minst tre r-värden, samtidigt med oberoende kontroll av F∝1/r².
- Laddningsvärdenas visuella placering åtskild för korta avstånd. Kraftstapeln behåller fast numeriskt intervall 0–6 µN och blir exakt linjärt proportionell mot |kQ₁Q₂/r²|. Kraftpilarna får **inte** tolkas som mätstaplar. Noll laddning ska ge noll kraft och inga kraftpilar.
- Matematik: separata MathML-rader, minst 16 px faktisk distans mellan fristående uttryck; fullständig beräkning N≈1,56·10¹⁰→1,6·10¹⁰ elektroner och F≈−8,87·10⁻⁸→−8,9·10⁻⁸ N; fysisk kraftstorlek på vardera laddningen 8,9·10⁻⁸ N och riktad attraktion.
- Nya riktade Chromiumtester och visuell jämförelse av 390 px mobil, dator och projektor krävs före godkännande. Safari på fysisk iPad/Mac, fysisk projektor och elevinlärning omfattas inte av de automatiserade proven. Original-PDF:n har inte varit tillgänglig för direkt källjämförelse i denna granskning.

## Figur- och interaktionsgranskning v2.3 – unik lektion 27/41, registerpost #26

Denna del **ersätter äldre beskrivningar av tecknad Coulombkraft** ovan; tidigare slutsatser med negativt `F` är dokumenterad versionshistorik, inte lektionsversionens gällande notation.

- **Bild 1:** Ursprunglig före-/eftermodell för elektronöverföring, korrekt total laddning och dolda svar behållna; två val och uppföljning.
- **Bild 2:** Den riktiga elektroskopdemonstrationen, elevens förutsägelse och korrekt laddningsförklaring behållna. Ingen ytterligare figur behövs utöver före-/efterschemat.
- **Bild 3:** Interaktiv modell: `q₁,q₂` för punktladdningar; verkliga SVG-centra följer `420r` på platta/dator/projektor och `220r` i en separat, större mobilritning vid högst 575 px. Båda är exakt proportionella och har läsbara etiketter som följer respektive partikel även vid minsta avståndet. Dolda svar tills eleven förutsagt; synliga kraftpilar är riktning, separat 0–6 µN-stapel är **storlek**. Vid noll laddning visas inga kraftpilar. Dynamisk MathML använder enbart `F=k|q₁q₂|/r²≥0`, medan attraktions-/repulsionsriktning avgörs av tecknen.
- **Bild 4:** Coulombs lag presenteras som ett beloppssamband; det tidigare extra teckenkonventions-`F` har tagits bort. Den geometriska jämförelsen r, 2r, 3r behålls med proportionaliteten `F∝1/r²` och fördröjd återkoppling.
- **Bild 5:** Två självständiga uppgiftsstarter och proton–elektron-schemat med ännu inga facitpilar bevarade.
- **Bild 6:** `Q` används legitimt för klotets **totala nettoladdning**, och `e` enbart för den positiva elementarladdningens belopp vid elektronräkning. Alla ursprungliga insättnings- och avrundningssteg kvarstår.
- **Bild 7:** Individuella partikelvärden `q₁>0, q₂<0` och negativ **produkt** skiljs från den positiva kraftstorleken `|q₁q₂|`. Samtliga ursprungliga SI-omvandlingar, multiplikation, division och avrundningar kvarstår; avståndet skrivs uttryckligen `(5,1·10⁻¹¹ m)²` så att kvadreringen av hela storheten syns. Slutet ger `F≈8,9·10⁻⁸ N` med två motsatt riktade attraktionspilar. Detta undviker att tolka negativt `F` som storlek eller x-komponent.
- **Bild 8:** Den befintliga Socrative-aktiviteten **Fy1 901, SOC-36980496, LRJ** och **NOKflex/bokuppgifter 801–811** står kvar. Ett **från början stängt, valbart och tangentbords-/touchöppningsbart** metodstöd ligger **direkt vid bokarbetet**: laddningsbevarande, kraftstorlek, riktningar, elektronantal. Inga bokfacit visas. Stödet återställs stängt när man navigerar tillbaka eller väljer återställ.
- **Bild 9:** De två ursprungliga utcheckningsfrågorna och läxan 801–811, läsanvisningen 270–280 och de gröna rutorna bevaras. Lösningar visas först efter eget försök.

**Obligatorisk ny verifiering:** oberoende positiva/negativa/nollfall, kvarterad kraft vid dubbla avståndet, laddningsdubblering, två korrekta motriktade SVG-pilar, placering av båda laddningsetiketterna, exakt kraftstapel, MathML och explicit positiv kraft, dold före-/visad efter-återkoppling, återställning, rätt Socrative-/bok-/läxuppgift, alla nio bilder, metodstödets tangentbord/touch och fyra vyer 390×844, 768×900, 1280×800, 1920×1080. Denna granskning räknas **en gång**, som 27:e unika lektion, trots den äldre separata matematikgranskningens nummer 36.

**Kvarstående avgränsning:** Ursprungligt PDF-innehåll har jämförts via dokumenterad källtrohet, inte genom tillgång till själva käll-PDF. Inte fysiskt testad i Safari på iPad, skolprojektor/OBS eller i klassrummet, och inget formellt elevutfalls- eller WCAG-test är utfört.
