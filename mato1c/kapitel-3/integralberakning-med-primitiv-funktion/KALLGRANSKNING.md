# Lektion 45: original → webb

Granskad 2026-11-21 mot lärarens nio-sidiga PDF **240109 Integralberäkning med primitiv funktion NaTe22** och transkriptionen **240109 Integralberäkning med primitiv funktion Ma3c 2308**. Någon fullständig filmfil har inte funnits tillgänglig; osäkra ord i transkriptionen har jämförts mot lärarens handskrivna PDF-lösningar.

## Bindande innehållskarta

| Ursprung | Plats i webblektionen | Bedömning |
| --- | --- | --- |
| Återkallning av förra lektionens bestämda integral och primitiv funktion | 1, 3 | Bevarad metod; tal från publicerad lektion 44 används i stället för direktkopierat bokexempel 3403. |
| Integralkalkylens fundamentalsats `∫_a^b f(x) dx = [F(x)]_a^b = F(b) − F(a)`, där `F′=f`, före beräkning | 2 | Bevarad sats och räkneordning. |
| Därför tar integrationskonstanten `+C` ut sig | 2 och 7 | Bevarat muntligt mellanled. |
| Muntlig återkoppling till den tidigare låtraden om konstanten `C` | 2 | Bevarad som kort minneskrok, inte ny matematik. |
| Föregående areauppgift med primitiv funktion, övre minus undre insättning i samma beräkning, samt areakontroll | 3–4 | Bevarad metod, bytta tal och ordnad algebra först; geometrin är en kort kontroll, inte ny huvudmetod. |
| Skuggat område mellan nedåtvänd parabel och stigande rät linje, begränsat av y-axeln och kurvornas skärning vid `x=2` | 5 | Bevarad exempeltyp och gränsstruktur, nya koefficienter. Figuren måste följa exakt samma nya funktioner. |
| Övre `f(x)` minus undre `g(x)`, stor area minus liten; både `∫f−∫g` och `∫(f−g)` | 5–6 | Bevarad primärmetod och elevfråga. |
| Skriv in de faktiska uttrycken, förenkla integranden i fulla led | 6 | Bevarad ordning, nytt sifferexempel. |
| Integrera termvis till en primitiv funktion, fullständig bracket-notation, `F(2)−F(0)`, båda insättningarna i en beräkning, förenkla till area | 7 | Bevarat med alla matematiskt avgörande led och nya tal. |
| Eleverna arbetar med uppgifterna 3408–3415; PDF:s bokarbetesbild nämner dessutom 3411–3418 | 9 | Befintliga uppgiftsnummer i Gy25-webbprojektet 3350–3367 behålls oförändrade, med samtliga deluppgifter på minst två hela nivåer. Den äldre bokens motsägande nummer förs inte in i elevsidan. Aktuell bokutgåva finns inte i tillgängliga originalfiler för ny oberoende kontroll. |
| Slutför dagens uppgifter, se nästa genomgång i NOKflex 3.4 **Integraler – Tillämpningar och problemlösning** | 9 | Bevarad anvisning, uppdaterad till aktuell bok. |
| Socrative, whiteboards eller fysisk laboration | – | **Förekommer inte i originalets PDF/transkription** och läggs därför inte till som obligatoriska inslag. |

## Tillåtna didaktiska förbättringar

- Tre kontrollerbara mål och slutkontroll, elevförsök före facit, tryckbar återkoppling.
- Dynamisk parabelgraf där höjdskillnaden kan undersökas inom samma intervall; den förklarar enbart originalets `f−g`.
- Ett nytt självständigt räkneexempel av samma typ. Inga konkurrerande metodval, nya integralteckenfall eller negativa areor.

**Kontroll av de avsiktligt ändrade talen:** Repetitionens `f(x)=x+2` på `[0,3]` ger `10,5` både med fundamentalsatsen och med rektangel + triangel, i överensstämmelse med den nu publicerade lektion 44. Tvåkurvsexemplet använder `f(x)=6x−3x²+4`, `g(x)=2x`, skärningspunkt `(2,4)` och positiv skillnad `4x−3x²+4` på `[0,2]`. En primitiv funktion är `2x²−x³+4x` och `F(2)−F(0)=8−0=8` areaenheter. Den nya figuren, reglaget och den avslutande lösningskedjan ska alla visa dessa värden.

## Godkännandegrind

1. Jämför alla rader med publicerat HTML och testfall; ingen oönskad avvikelse får återstå.
2. Kontrollera algebra, primitivfunktionens derivata, skärningspunkt, area och grafens faktiska SVG-koordinater numeriskt.
3. Kör statisk QA och webbläsar-QA på 390×844, 768×900, 1280×800 och 1920×1080; se särskilt att MathML och grafetiketter inte kapas. Inspektera skärmbilder.
4. Mergas/publiceras först efter grön CI och visuell kontroll. Kolla GitHub Pages efter publicering.
