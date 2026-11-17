# Laddningsnotation – inventering Fy1 och Fy2, v2.3

Datum: 17 november 2026. Källor: samtliga sex lektionskataloger i `fy1/kapitel-8/` samt tio i `fy2/kapitel-3/`, inklusive elev-HTML, interaktiva JS-filer, lärarstöd och fristående versioner där sådana finns.

## Lärarens symbolbeslut

**Elektrisk laddning är `q`** (eller `Q` för tydligt definierad nettoladdning), uttryckt i coulomb (C). För en krafts eller en positiv energiändrings **belopp** används `|q|` endast när det verkligen är ett beloppssamband med angivna villkor. **`e` betyder elementarladdningens positiva belopp** och används vid beräkning av antal elementarladdningar, exempelvis `N=Q/e` för beloppet `Q`. Elektronmassan `m_e` är en legitim massbeteckning och får **inte** ändras till `m_|q|`.

## Inventering och konkreta beslut

| Kurs och lektion | Roller för laddningssymbolerna och beslut |
| --- | --- |
| Fy1 Coulombs lag | Nettoladdning `Q`; `e` förekommer när antalet tillförda elektroner beräknas med `Q-Ne=0` och `N=Q/e`. Korrekt sammanhang, behåll. |
| Fy1 Effekt | Inga nya uttryck med `e` som elektrisk laddning. Energistorheten `E` och Eulertal får inte förväxlas med `e`. |
| Fy1 Elektriska fält | **Rättat:** `eU` ersatt med `|q|U` i fyra MathML-uttryck för acceleration från vila. I frågan visas elektronens **laddning q** numeriskt med negativt tecken i stället för `q=-e`. Den närliggande förklaringen och lärarstödet anger att U är ett positivt accelererande spänningsbelopp. Elektronmassan `m_e` behålls. |
| Fy1 Elektriska kretsar | Korrekt `N=Q/e` för antal elektroner. Förklarat explicit att `e` är elementarladdningens **positiva** belopp och `Q` den passerade laddningens belopp. Dynamisk MathML beräknar fortfarande rätt elektronantal. |
| Fy1 Potential | `E_p=qV` använder tecknad laddning; ingen felaktig `e`-användning konstaterad. |
| Fy1 Serie och parallell | Inga nya laddningssymbolfel konstaterade. Här avser `E` energi eller elektriskt fält beroende på sammanhang, inte elementarladdning. |
| Fy2 Demonstrationer elektromagnetism | Ingen felaktig `e`-notation; magnetisk kraft på **strömförande ledare** skrivs som ledarkraft, inte partikelkraft. |
| Fy2 Elektriska fält | `q` för partikelns laddning, `|q|` för positivt belopp i den aktuella energiberäkningen; `m_e` elektronmassa. Tidigare uppdaterat i v2.3. |
| Fy2 Induktion | `|q|vB=|q|E` i kraftbeloppshärledningen; tecknad laddning och krafter behandlas med riktning. Tidigare uppdaterat i v2.3. |
| Fy2 Jordens magnetfält | Inga felaktiga uttryck med `e` för laddning. |
| Fy2 Laddade partiklar | `q` betecknar partikelns tecknade laddning och `|q|` kraft-/banbelopp där tillämpligt. Tidigare uppdaterat i v2.3. |
| Fy2 Magnetism (material och flöde) | Inga felaktiga uttryck med `e` för laddning. |
| Fy2 Räknestuga – kraft och jordfält | `|q|` används för kraftbelopp, tecknet styr riktning. Tidigare uppdaterat i v2.3. |
| Fy2 Räknestuga – elektriska fält och magnetism | **Rättat:** MathML för `m_e` i den dolda elektronberäkningen hade oavsiktligt blivit `m_|q|` i en tidigare ändring. Återställt elektronmassan utan att röra `|q|` i täljaren. |
| Fy2 Spolar och solenoider | Ingen felaktig `e`-notation. |
| Fy2 Ström ger magnetfält | Ingen felaktig `e`-notation. |

## Verifiering och gränser

Regressionstestet `fy1/kapitel-8/qa/charge-q-v23-all-16.cjs` går igenom **alla 16 kataloger** och deras HTML/JS-filer samt laddar alla 16 sidor i Chromium. Det analyserar även dynamisk MathML och undantar explicit de **legitima** `e`-användningarna för elektronantal samt `m_e` för massa. Fy2 använder samma test via `fy2/kapitel-3/qa/charge-q-v23-all-16.cjs`. Källskanningen är ett komplement till, **inte en ersättning för**, kursens tidigare figur- och interaktionstester.

**Grenverifiering 17 november 2026:** [Fy1-QA #44061825484](https://github.com/jacobflinder/Lektioner/actions/runs/44061825484) och [Fy2-QA #44061857417](https://github.com/jacobflinder/Lektioner/actions/runs/44061857417) **SUCCESS**. Den delade inventeringen rapporterar **16 lektioner, 61 HTML-/JS-filer, 339/339 riktade kontroller, 11 individuellt klassificerade MathML-e-symboler och fyra nya skärmbilder**. Samtliga ordinarie Fy1- och Fy2-regressioner passerade, inklusive signaturfall för negativa laddningar, MathML, lärarstöd, fristående HTML och interaktioner. Skärmbilder har inspekterats vid 390 och 1280 px; Fy1:s elektronenergisamband W=|q|U och Fy2:s återställda m_e i den **utvecklade**, inte bara dolda, steglösningen har kontrollerats visuellt. **Publicerad och slutverifierad:** [PR #91](https://github.com/jacobflinder/Lektioner/pull/91) är sammanslagen på kodcommit `307fbdba8d4f67c1c9dafd840807c9a0e5c4730f`. [Fy1-main-QA #44063051613](https://github.com/jacobflinder/Lektioner/actions/runs/44063051613), [Fy2-main-QA #44063051642](https://github.com/jacobflinder/Lektioner/actions/runs/44063051642) och [Pages #44063049367](https://github.com/jacobflinder/Lektioner/actions/runs/44063049367) är samtliga **SUCCESS på samma kodcommit**. Denna ämnesinventering **höjer inte** figurgranskningens antal från 11/41.

