# Kapitel 8 – didaktisk kvalitetsrevision, 2026-11-12

## Vad som ändrats
- Alla sex lektioner har en frivillig knapp **Självtest** med två nya överföringsuppgifter, numerisk kontroll, svensk decimalform, ledtråd på begäran och förklarande återkoppling.
- Uppgift 1 har ett givet första steg; uppgift 2 börjar utan stöd. Därmed minskas stödet mellan uppgifterna.
- Varje självtest innehåller en fråga att lyfta vid ett senare lektionstillfälle, utan schemalagd påminnelse.
- Samtliga sex lärarstöd förklarar hur självtestet kan användas utan att minska tiden för bokarbete eller ersätta demonstrationer och befintlig Socrative.
- Upprepade inläsningar av CSS i vissa lektioner och upprepad modellskriptinläsning i Coulombs lag har tagits bort.
- PhET-labben, bokuppgifter och tidigare fysikmodeller påverkas inte.

## Design och evidens
Stegvis minskat stöd efter genomarbetade exempel motiveras av forskning om worked examples/guidance fading. Senare återkallande av kunskap motiveras av forskning om retrieval practice. Hur många uppgifter som ska visas och när är lokala undervisningsval, inte forskningsbevisade optimala doser.

Källor:
- https://doi.org/10.1007/s10648-019-09465-5
- https://eric.ed.gov/?id=EJ732331
- https://link.springer.com/article/10.1007/s10648-026-10225-5

## Verifiering
En lokalt testad prototyp av den frivilliga självtestsfunktionen klarade 288 automatiserade Chromium-kontroller över sex lektioner vid mobil- och datorbredd. Den publicerade gemensamma implementationen har separat syntaxkontrollerats och måste genomgå faktisk nätverks- och webbläsarkontroll. Ingen egen serverlagring eller inloggning används för svaren.

## Kvar att pröva
Safari/iPad, projektor och tillgänglighet för skärmläsare. Framför allt behövs verkliga elevsvar på nya uppgifter och kontroll av att det planerade bokarbetet faktiskt ryms.

**Status:** Förbättrad och kodgranskad, inte vetenskapligt bevisat perfekt.
