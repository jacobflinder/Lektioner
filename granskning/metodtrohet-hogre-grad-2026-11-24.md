# Ma4 Polynomekvationer av högre grad: originaltrohet 2026-11-24

Underlag: originalfilm ”230515–230517 Faktorsatsen samt Polynomekvationer av högre grad Ma4 2303 Lek2”, 36:44 (kontrollerade kontaktbilder från hela filmen), samt sexsidig PDF ”261120 4.4 Polynomekvationer Polynomekvationer av högre grad”. Den senare PDF:en använder delvis andra faktoriseringar; både dess exempel och filmens faktiska metod måste bevaras.

## Original → elevsida, bild för bild

| Originalinnehåll | Plats | Åtgärd |
| --- | --- | --- |
| Film 00:00–05:00: repetera förstagrad, ansats z = a + bi vid konjugat, pq, polär potensekvation, konjugat och liggande stolen | 01 | Bevarad metodöversikt före nya exemplen |
| Film ca 06:30–09:30: GeoGebra Faktorisera och graf | 01 | Bevarad lärarledd demonstration; CAS kontroll, inte huvudmetod |
| PDF s. 1–2: elevmål, algebrans fundamentalsats, multiplicitet, grafiska reella nollställen | 01–02 | Tydligare elevmål samt utfällbara kontroll- och grafmoment |
| PDF s. 3: z³−z²+4z−4, känd rot 1, faktor och komplexa rötter | 03 | Huvudmetod från filmen: liggande stolen med fulla restled; PDF:ens gruppering följer endast som en särskild kontroll i nästa exempel |
| Film ca 11:00–24:30: x⁴+2x³−5x²−6x, bryt ut x, känd rot −1, liggande stolen, pq och positiv rot | 04 | **Exakt filmequation och lösningskedja återställd.** Rötterna 0, −1, 2, −3, med positiv rot 2. |
| PDF s. 3: själv z³+z²+4z+4 | 04 | Bevarad; liggande stolen som synlig standardlösning, PDF:ens gruppering frivillig kontroll |
| PDF s. 4: given rot i, reella koefficienter, konjugatpar, faktor z²+1 | 05 | Bevarad som beslut före faktor/uträkning, med komplexplansfigur |
| Film ca 25:30–36:30: x³−3x²+16x−48, rot 4i, konjugat −4i, faktor x²+16, division ger x−3 | 06 | **Exakt filmequation och fullständiga division återställd;** reell rot 3 |
| PDF s. 4: z⁴+2z³+6z²+2z+5, kvot z²+2z+5 | 06 | Bevarad; division som standard enligt film, PDF:ens koefficientjämförelse i utfällbar efterkontroll |
| PDF s. 4: själv z⁴+5z²+4, given rot 2i | 07 | Bevarad med utfällbar lösning och gradkontroll |
| PDF s. 5: NOKflex 4447–4460 och nivåval | 08 | Bevarad; minst tre av fem nivåer |
| Frivillig konsekvens av konjugatregeln: reellt nollställe vid udda grad | 09 | Tydligt extramaterial, inte obligatorisk metod |
| PDF s. 6: slutkontroll och läxor z³−3z²+4z−12 samt z⁴+10z²+9 | 10 | Bevarade; exitfacit visar liggande stolen och nollproduktmetoden |

## Särskilda metod- och sakgranskningar

- Filmens metodordning är **bryt ut x → använd given rot/faktorsatsen → liggande stolen → pq**, respektive **reella koefficienter → konjugat → reell andragradsfaktor → liggande stolen → reell rot**. Varken gruppering eller koefficientjämförelse tar över huvudmetoden.
- Filmens uppgift uttrycker ”en positiv och tre negativa rötter”, men ekvationen har faktiskt rötterna 0, −1, 2 och −3. Webbsidan anger därför korrekt att 0 varken är positivt eller negativt. Detta är en **saklig rättelse**, inte ändrat metodval.
- PDF:ens gruppering och koefficientjämförelse är **bevarade som separata kontrollsätt efter genomförd division**. De introduceras inte som konkurrerande huvudmetoder.
- Polynomdivisionens hela mellanled, inklusive nollrest och tomma gradplatser, skapas med samma uppställningskomponent i båda originalexemplen och i dolda facit. Den tidigare felaktiga likhetskedjan i ett subtraktionssteg har korrigerats.
- Tre kontrollerbara mål knyts till utcheckningen. Huvudlektion 01–08 och 10; bild 09 är tydligt frivillig. Filmens GeoGebra-aktivitet och PDF:ens NOKflex samt läxor är kvar.

## Kontrollvillkor

Matematiska rötter testas separat med Horner i QA. Det finns regressionstester för dolda facit, divisionens placering, komplexplansfigur, uppgiftsnummer och fyra webbläsarstorlekar (390, 768, 1280, 1920). **Publicering tillåts först efter grön CI, manuellt granskade skärmbilder, kursregression samt samstämmig QA och Pages på samma main-SHA.**
