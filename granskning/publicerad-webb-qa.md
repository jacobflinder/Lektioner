# Kontroll av publicerad elevwebb

Kontrollen `Verify published lesson site` körs separat från kursernas ordinarie, detaljerade webbläsartester. Den använder HTTPS-adressen https://jacobflinder.github.io/Lektioner/ och aldrig en lokal webbserver.

- Vid ändring i huvudgrenen används exakt commit-SHA. Vid PR som ändrar själva kontrollen jämförs den redan publicerade huvudgrenen, inte en opublicerad PR.
- Publicerade HTML-, JS-, CSS- och bildresurser jämförs byte för byte via SHA-256 med källversionen. CDN-fördröjning hanteras med omprov i upp till tio minuter.
- Alla lektionssidor identifieras från Git-trädet. Chromium öppnar varje faktisk elevsida på 1280×800 och 390×844. Den verifierar dokumentet, de mottagna resursernas version, JS- och HTTP-fel samt standardnavigation eller repetitionsverkstadens flikar där de finns.
- Resultat, eventuella fel, breddvarningar och skärmbilder sparas som Actions-artifakt. En grön körning är bevis för den specifika commit som anges i rapporten. Breddvarningar kräver granskning och är inte ett nytt godkännande av layout.
- Detta ersätter inte original-till-webb-granskningen eller de detaljerade matematik-, fysik-, figur- och interaktionstesterna före publicering. Ingen elevdata samlas in.

Om en senare version publiceras under kontrollen kan den äldre verifieringen misslyckas; huvudgrenen startar en ny kontroll för den nya versionen.
