# Käll- och metodgranskning – Mer om integraler

## Underlag och undervisningsnorm

- **Aktuell bok:** fotografier av sidorna 196–197 och 198–199, avsnitt 3.3 *Mer om integraler*.
- **Matematisk metod:** Jacobs nyligen godkända, publicerade föregående lektion *Integralberäkning med primitiv funktion*. Den introducerar integralkalkylens fundamentalsats före användningen och räknar `∫ = [F(x)]_a^b = F(b) − F(a)` med sammanhängande mellanled.
- **Originallektion för just detta stoff:** Jacob beslutade den 20 november 2026: **”Endast boken denna lektion”**, med repetition, negativ integral, positiv geometrisk area och utan Socrative. Ingen separat lektions-PDF, film eller transkription finns i arbetsunderlaget. De tidigare lästa bokfotografierna ligger bakom denna karta men finns inte som återöppningsbara filer i den aktuella arbetsytan. Detta är en begränsning för en ny jämförelse rad för rad mot boken, inte ett påstående om att en separat originalgenomgång har verifierats.

## Bok → webb

| Bokinnehåll | Ny lektion | Bedömning |
| --- | --- | --- |
| Bestämd integral räknas med primitiv funktion och ändpunkter | Bilder 2–3, 5–7, 9 | Bevarad och befäst metod; varje full lösning visar gränsnotation och `F(b) − F(a)` före insättningen. |
| Negativt integralvärde under x-axeln, s. 196 | Bilder 4–5 | Bevarat; egen graf och andra tal än bokens exempel. |
| Integral över både positivt och negativt område, s. 196–197 | Bilder 6–7, extra 11 | Bevarat; synlig kontrast mellan signed integral och geometrisk area. |
| Arean är positiv även när en del av integralen är negativ, s. 197 | Bilder 5–7, 10 | Bevarat och förtydligat med två beräkningar av samma figur. |
| Area mellan två kurvor: övre minus undre, s. 196 och 198 | Bilder 8–9, extra 12 | Bevarat; annan egen parabel och linje än bokens. Precis som Jacobs lektion 45 visas först `∫f−∫g`, sedan `∫(f−g)`, innan algebraisk beräkning. Höjdreglaget och skuggningen räknas från samma uttryck. |
| Bokens uppgifter på tre nivåer | Bild 10 | Nivå 1: 3370–3373 (s. 198); nivå 2: 3374–3376 (s. 199); nivå 3: 3377–3380 (s. 199). Alla uppgifter på minst två hela nivåer. |
| Elevaktivitet och återkoppling | Fråga före avslöjande, skrivyta, slutkontroll | Didaktiskt förbättrat. Huvudbana 10 bilder, två extrasidor. Summan 2,5 a.e. avslöjas inte längre innan eleverna räknat de två delarna. |

## Gränser och kontroll

- Inga originalexempel eller formuleringar från boken är kopierade; det matematiska innehållet, sid- och uppgiftsnumren är bevarade.
- Utcheckning C ber om **vilken integral** som beskriver arean. Facit visar därför den exakta uppställningen med övre minus undre i två läsbara matematiska rader; det hoppar inte till ett numeriskt svar utan fundamentalsatsens mellanled.
- Ingen Socrative, ingen påhittad laboration och inga uppgifter med en annan algebraisk metod.
- Grafen `x − 1` har underintervallet `[0,1]` med integral `−1/2`, hela `[0,3]` med integral `3/2` och geometrisk area `5/2`.
- För `f(x)=4+2x−x²` och `g(x)=4` på `[0,2]` är arean `4/3`.
- Extra: för `2x−4` på `[0,4]` är integralen `0` och arean `8`; för `3+x−x²` och `3` är arean `1/6`.
- Den oberoende matematik-/strukturkontrollen ligger i `../qa/mer-om-integraler-original-math.cjs` (34 kontroller vid utvecklingstillfället). Webbläsartestet `../qa/mer-om-integraler-browser.cjs` omfattar fem bredder, samtliga slides både före och efter facit, grafens exakta koordinater, felaktigt överhängande formler och mobilt navigeringsfält. Båda ingår i kursens GitHub Actions-arbetsflöde. Godkännande och ny skärmbildsgranskning ska kontrolleras före sammanfogning till `main`.
- **Tillgänglig original→webb-status:** alla innehållspunkter i ovanstående bokkarta och Jacobs tidigare godkända metod finns kvar. Ändringarna gäller svarstidpunkt, formeltypografi, mobilnavigation på en rad **med direkt bildval kvar**, och kontrollomfång, inte nya matematiska fall. Fysisk projektor/iPad och elevlösningar i klassrummet återstår efter teknisk publicering.
