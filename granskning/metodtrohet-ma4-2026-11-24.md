# Ma4 – riktad metodtrohetsrättning 2026-11-24

## Polynomdivision – metodtrohet mot originalfilm, slutgranskad

Originalfilm Lek2, tavla cirka 19:30 och 27:00: vanlig heltalsdivision, exakt polynomdivision och sedan division med rest; kvot ovanför dividend, divisor till höger med stolens linjer, subtraherade produkter inom parentes, tomma gradplatser. Bevarat: ursprunglig 7-motorers webbarbetsgång, kontrollsamband, felanalys, övningsuppgifter, 4421–4430, tre av fem nivåer, hemuppgift och utcheckning. Förbättrat: gemensam uppställning i rätt geometri, nolltermer lämnas tomma i stolen (nollkoefficientstöd finns kvar), 261/3 som brygga, eget nytt exakt exempel före restexemplet, utcheckningsfacit visar stolen. Nytt exakt exempel är eget, inte kopierat från läroboken. Inga övriga lektioner ändrade i denna gren.

Verifiering: utökad browser-QA, inklusive geometrisk placering och oberoende beräkning. Källmetoden har kontrollerats mot originalfilmens tavelsekvenser (exakt division med saknad grad, heltalsuppställningen, följande exakta polynomdivisioner och division med rest). Kontaktrutor från cirka 02:30–27:30 har jämförts med webbens uppställningar. Filmens liggande stol, kvot ovanför, divisor till höger och minustecken framför hela parentesprodukten styr metoden. Kursens PDF är inte metodnorm.

Kompletterad bildinventering: Lek2 börjar med ett exakt exempel med saknad grad (cirka 02:30–07:30), därefter 261/3 och 1169/7 (10:00–12:30), ytterligare exakt polynomdivision (15:00–19:30) och slutligen restexempel (20:00–27:30). Följden återställs på bild 3–4 med egna polynomtal. Produktens minustecken placeras nu direkt före dess första gradterm. 

Faktiska Chromium-bilder för 3366e6f (körning 45416246808) visade att originalbryggans flera samtidigt öppna exempel blev för långa i projektorvy, trots godkänd QA. Därför införs ett exempel i taget med tre synliga steg, två heltalsuppställningar i parallell på bred skärm, och divisionsstolen flyttas före process- och fokusblock. Den fullständiga restformen med bråk skrivs vid varje avslutad division. Ny visuell kontroll krävs.

Ny visuell inspektion av faktisk Chromium-evidens för d27520b4 (45438229574): huvudstolens geometri stämmer med tavlan vid 19:30 och 27:00, men slutläget i det exakta repetitionsexemplet sträcker sig nedanför projektorns synliga område. Ändrat: fokusläge när en uppställning öppnas (inledning och kontrollfråga återkommer när den stängs), bredare arbetsyta, slutberäkningen visas först intill stolen och delas i kontrollidentitet/restform på projektor. Ingen matematik har strukits. Ny blockerande regression för bordets och samtliga resultatformlers verkliga läge inom viewport. Slutgranskning utförd: originalstol och fullbordat exakt exempel har granskats i faktiskt Chromium på 390 px och 1920 px; samtliga rad- och resultatformler ryms. Full Ma4-webbläsarregression för testad branch SHA 25d6dba8e947254f1d66d1a3ee8326a5dd8c878c, körning 45466679817: success.


## Original → webb, slutavstämning

| Filmens steg | Webbplats | Bedömning |
|---|---|---|
| Exakt division med saknad grad och korrekt gradplats | bild 3, första flikens stol | Bevarat; uttryckligt stöd för tomma kolumner |
| Vanlig heltalsdivision (261/3 och 1169/7) som metodisk brygga | bild 3, heltalsflik | Bevarat och tydligare interaktivt |
| Exakt polynomdivision och liggande stol med kvot ovanför och divisor till höger | bild 3–4 | Bevarat; elev kan välja nästa term och se hela produkter inom parentes |
| Teckenbyte för subtraktion av hela produkten | bild 4 och felanalysen bild 6 | Bevarat; fullständiga mellanled och klickvis återkoppling |
| Division med rest | bild 4, uppföljning bild 5 och slutkontroll | Bevarat; restgrad och kontroll P=DQ+R visas |
| Elevernas egna lösningsförsök och tillämpning | bilder 7–11 | Didaktiskt förtydligat, med tre kontrollerbara mål på bild 2 och matchande exit |
| Läsbarhet i klassrum och på mobil | projektor 1920 px, mobil 390 px | Faktiska Chromium-bilder kontrollerade; inga dolda centrala mellanled |

Avvikelse: polynomkoefficienterna i de nya övningsexemplen är egna, inte avritade från tavlan eller boken; metod och ordning är oförändrade. Inga nya konkurrerande lösningsmetoder har införts. Slutstatus: metodtrohet, matematik och mobil/projektor godkända på testat branch-head. Publiceringskontroll på main görs separat efter merge.
