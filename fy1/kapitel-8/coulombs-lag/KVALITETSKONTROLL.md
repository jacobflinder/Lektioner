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
