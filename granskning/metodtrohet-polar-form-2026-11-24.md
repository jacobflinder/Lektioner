# Ma4 4.2 – Polär form: metod- och innehållskarta

## Källprioritet

- **Metod och ordning:** film `230424–230428 Polär form samt rita i det komplexa talplanet Ma4 2303 Lek1.mp4`, cirka 33 minuter. Relevanta filmställen har kontrollerats mot videobilden, bland annat ca 07, 13, 16–22 och 26–31 minuter. Lek2 och Lek3 i samma filmserie gäller nästa moment, multiplikation/division i polär form och avläsning/rotation, och ska inte blandas in i den här genomgångens standardmetod.
- **Stoff och uppgifter:** aktuellt undervisningsunderlag för avsnittet och webbens NOKflex 4201–4216. Filmen från 2023 hänvisar till 4218–4233. Det äldre numreringsintervallet ersätter inte det aktuella; inga uppgifter har kopierats från läroboken.
- **Avgränsning:** webben väljer egna tal i flera övningar, men bevarar filmens sätt att lösa dem. Någon PDF-metod används inte som konkurrerande standardmetod.

## Original → webb, punkt för punkt

| Ursprungligt stoff / undervisningsdrag | Webb | Bedömning |
| --- | --- | --- |
| Komplexa tal har redan rektangulär form `a + bi` och en punkt i talplanet; kort återkoppling till tidigare avsnitt | 01–02: start `3 + 4i`, skiss, koordinater | Bevarat och konkretiserat |
| Geometrisk bild med positiv real- och imaginärdel, avstånd från origo och argument från realaxeln | 02: likskaligt interaktivt talplan, koordinater, längd och vinkel i steg | Didaktiskt förbättrat, samma representation |
| Polär form `z = r(cos v + i sin v)`, där `r = |z|` och `v = arg z` | 02: regel visas i samband med figur; 03: metodkort före uträkning | Bevarat, utskriven notation |
| Filmens första givna figur: längd `5`, vinkel `45°`, polär form och omvandling tillbaka med cos och sin, ungefärliga koordinater | 04: samma första-kvadranttyp och resultat `z ≈ 3,54 + 3,54i` | Bevarat som kort modell, elever ritar punkt |
| Filmens andra figur: längd `8`, vinkel `120°`, negativ realdel och positiv imaginärdel; omvandling till rektangulär form | 04: elevens `4(cos 150° + i sin 150°)` med fullständigt facit och kvadrantkontroll | Egen talvariant, samma metod och kvadrant; ändrat exempelvärde |
| Gå från en given rektangulär punkt, rita först; Pythagoras för `r` | 02: 3+4i i talplanet; 03: `r=√((-3)²+3²)=3√2` | Bevarat med fullständiga mellanled |
| **Lärarens huvudmetod** `tan v=b/a`, där `a` och `b` behåller sina tecken; `v=arctan(b/a)+n·180°`; välj `n` enligt var punkten ligger | 03: regel före exempel, `tan v=3/(−3)=−1`, `arctan(−1)=−45°`, `n=1`, `v=135°`; 06 och 09: samma metod i elevfacit | Återställt metodtroget; tidigare positiv referensvinkel har avlägsnats från standardvägen |
| Kontroll att polära talet verkligen ger ursprunglig real- och imaginärdel | 03: `3√2(cos135°+i sin135°)=−3+3i`; 04 och 06: återomvandling | Förtydligat utan metodbyte |
| Självständigt arbete med representativa tal och olika riktningar | 05–07: identifiera samma tangentvärde men olika kvadrant, eget försök, aktuellt NOKflex | Bevarat och ökad återkoppling |
| Metodens begränsning för realdel noll; argumentet för nollkomplexa talet | 02 och 05: axeln avläses grafiskt, origo saknar argument | Förklarande stöd, inte konkurrerande metod |
| Sammanfattning och elevkontroll | 08 metodkort, 09 individuell utcheckning åt båda håll | Didaktiskt förbättrat; tre prövbara elevmål på 01 |

## Metodgranskning

1. Talplanet/koordinater ger tolkningen av argument före beräkningen.
2. `tan v = b/a` anges **före** första fullständiga metodexemplet.
3. Inga beloppstecken kring koordinatkvoten, inget referensvinkelrecept som primär metod.
4. Heltalet `n` väljs med ritad kvadrant och följs av återkontroll via cos/sin.
5. Självkontroll och utcheckning använder samma metod och visar viktiga led.
6. De två centrala filmexempeltyperna (given figur → polär → rektangulär, samt rektangulär punkt → `r`, `v` och polär form) finns i huvudvägen.

## Avsiktliga didaktiska förbättringar och kontroller

- Samma typ av figur kan manipuleras stegvis i talplanet; eleverna förutsäger före varje klick. Tydliga uppgifter och förklarande återkoppling.
- Mål 01 är tre korta, kontrollerbara mål; utcheckning 09 prövar beräkning, byte mellan former och kvadrantkontroll.
- Räknekedjorna sätts på separata matematiska rader. Inget centralt mellanled är ersatt av ett löst slutsvar.
- Filmens fortsättning med multiplikation och division i polär form hör till nästa lektion, inte här.
- Automatisk Ma4-regression och faktisk visuell kontroll i mobil- och storbildslägen krävs **efter senaste ändring** före sammanslagning. Tidigare QA-granskning visade för hög 1920px-figur; detta åtgärdades med en tredelad slutvy och ett blockerande layouttest.

**Slutstatus:** pågående tills aktuell branch-regression och nya bilder är godkända. Då uppdateras status före publicering.
