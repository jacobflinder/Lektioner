# Ma4 4.3 – Ekvationen zⁿ=a: filmbaserad metodkontroll

## Källa

Originalfilm `230503–230508 Komplexa tal i potensform Ma4 2303 Lek2.mp4`, särskilt ca 15:45–33:45. Läraren arbetar med en femtegradsekvation `z⁵=−32` och skriver **båda led på polär form i radianer**. Metoden är: de Moivre, likställ absolutbelopp och argument, hela varv `2πk` **före** division med 5, räkna alla fem heltalsvalen, rita rötter med samma längd. Lärarens film är metodkälla; aktuella NOKflex-intervall i webbens ämnesunderlag styr bokarbetet.

| Originalets moment | Webb | Status |
| --- | --- | --- |
| Kort återkoppling till `z³=8i` och de Moivres formel | Bilder 01–06, fullständiga polära beräkningar och exakt återomvandling | Bevarat |
| Varför exakt n olika riktningar när högerledets belopp är positivt | Bild 06: `v=(θ+2πk)/n`, k=0,…,n−1, steget `2π/n` | Bevarat och förklarat |
| Femtegradsekvation med negativ real högerled | Bild 07: `z⁵=−243` i stället för originalets `−32`, men samma metod och fem rötter | Egen talvariant |
| Skriv VL och HL på polär form i **radianer** | Bild 07: `z⁵=r⁵(cos(5v)+i sin(5v))`, `−243=243(cos π+i sin π)` | Metodtroget återställt |
| Likställ belopp `r⁵=243` och välj positiv femterot `r=3` | Bild 07 steg 2 | Bevarat |
| Likställ argument `5v=π+2πk`, dela allt med 5 | Bild 07: `v=(π+2πk)/5=π/5+2πk/5` | Återställt i samma radianenhet som filmen |
| Pröva fem konsekutiva heltal och skriv varje polär rot | Bild 07: `π/5,3π/5,π,7π/5,9π/5`, med var och en som `z_j=3(cos v_j+i sin v_j)` | Fullständig kedja |
| Förklara varför nästa k ger samma riktning | Bild 07: `11π/5=π/5+2π` | Bevarat |
| Talplansfigur, lika radie och regelbundet vinkelavstånd | Bild 07: fem exakta koordinatriktningar på en likskalad cirkel; 2π/5 radianer | Bevarat och visuellt förstärkt |
| Eget arbete och utcheckning | Bilder 08–10, 4315–4328 i aktuell bokversion | Bevarat med eget elevförsök |

## Viktig rättning efter videoavstämning

En tidigare arbetsversion uttryckte femtegradsexemplets vinklar som 36°, 108°, 180°, 252° och 324°. Dessa vinklar är ekvivalenta, men **är inte filmens beräkningskonvention**. Standarduträkningen är därför ändrad till `π`-notation från HL till varje rot. SVG-grafikens interna koordinatvärden för samma punkter kan fortsatt anges i grader som implementeringsdata; graderna förekommer inte i elevernas beräkningskedja.

## Slutkontroll

Tre kontrollbara mål, fullständiga steg, filmens positiva femterot och fem olika vinklar, aktuell uppgiftsserie, dolda kontrollsvar och matematiskt likskalad figur måste bestå browser-QA på 390, 768, 1280 och 1920 px. Testet har skärpts så att den publicerbara kedjan måste använda radianer. **Status: inväntar ny QA på exakt senaste revision innan godkännande och sammanslagning.**
