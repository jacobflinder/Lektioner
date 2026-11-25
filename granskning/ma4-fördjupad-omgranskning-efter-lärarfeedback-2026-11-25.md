# Ma4 2627 – fördjupad omgranskning efter lärarfeedback

**Datum:** 25 november 2026

**Omfattning:** 15 webblektioner, 11 originalfilmer och den särskilt godkända vektor-PDF:en.
**Prioritet:** Jacobs senare beslut går före äldre didaktiska idéer om felanalys. Filmens standardmetod, notation och lösningsordning ska styra.

## Vad lärarens kontroll faktiskt upptäckte

1. **För hög kognitiv belastning av felanalyser.** Särskilda bilder för att granska konstruerade fel hade förts in i flera lektioner. Även om uppgifterna hade ett matematiskt syfte störde de framåtrörelsen mot dagens tre mål. De ska inte finnas som självständiga lektionsmoment.
2. **Fel notation för polynomdivision.** Den tidigare webben betonade `P = DQ + R` och använde kvotbokstaven `Q`, trots att Jacob skriver

   \[
   \frac{p(x)}{q(x)} = k(x) + \frac{\mathrm{rest}}{q(x)},\qquad q(x)\ne 0.
   \]

   Lärarens film 09, omkring 26:40–28:40, visar en färdig liggande stol med en icke-noll rest och ett slututtryck av denna typ. Detta är en central metod- och notationsskillnad, inte en kosmetisk detalj.
3. **Dolda, genererade facit.** Synlig HTML räcker inte som kontroll: flera svar ersätts vid laddning av `math-solutions.js`, `math-polish.js` och andra lektionsegna skript. De måste granskas separat för att ändringarna ska gälla det eleverna faktiskt ser.

## Genomförda ändringar

- **Fem fristående felanalysbilder har tagits bort** ur `komplexa-tal-och-i`, `multiplikation-division-komplexa`, `multiplicera-dividera-med-i`, `de-moivre` och `polynomdivision`.
- **Två frivilliga felanalysbilder har tagits bort** ur `eulers-formel` och `andragradsekvationer`. Deras särskilda klickhändelser och genererade facit har städats bort.
- I **polynomdivision** syns Jacobs divisionsekvation direkt efter målbilden, först med heltalsexemplet `17/5 = 3 + 2/5`. Samma bokstäver används i genomgång, uppgifter, stöd, kontroll, utcheckning, interaktiv liggande stol och dynamiska facit. Hela produkten subtraheras fortfarande med korrekt tecken; både division utan rest och med rest ingår. Felanalysbilden tas bort utan att ta bort den vanliga metoden.
- I **faktorsatsen** har återblicken och beviskedjan kopplats till `k(x)` och `rest`, så att eleven inte får byta notation direkt efter föregående lektion.
- I **polynomekvationer av högre grad** har två detaljerade sidospår om att gruppera termer och jämföra koefficienter tagits bort. Filmens förlopp given rot → liggande stol → lägre grad → pq-formel kvarstår.
- Figur-/interaktions-/typografitesterna har omindexerats mot de nya lektionerna. Ett nytt statiskt metodestriktionsprov kontrollerar samtliga 14 bildspel, målbokstavsnotationen, vektor-PDF:ens villkor, borttagna felbilder, Javascript-syntax och facitknapparnas målelement. Enhetscirkeln är en separat repetitionsverkstad och omfattas av sitt egna webbläsartest.

## Ny metodkarta, lektion för lektion

Bedömningen **ingen saknad kärnmetod** betyder att den tidigare film–webb-kartans beräkningssätt finns kvar efter denna ändring. Den innebär inte att bok-/filmunits, varenda exempelssiffra eller alla tillägg är identiska. Frågor om exakt källtrohet står öppet angivna.

| Nr | Lektion | Film → webb: saknad central metod? | Webb → film: extra belastning/avvikelse | Åtgärd i denna omgång |
|---|---|---|---|---|
| 01 | Komplexa tal och `i` | Ingen identifierad. `i²=−1`, real-/imaginärdel, multiplikation, kvadrering, pq med komplexa rötter finns. | Fristående kontroll av vanliga misstag tog upp tid. | Felanalysbild och genererat facit bort. Fullständiga algebraiska led kvar. |
| 02 | Konjugat och absolutbelopp | Ingen identifierad. Spegling, längd, konjugatprodukt finns. | Talplansfigur och elevstyrda steg är didaktiska hjälpmedel, inte ny metod. | Bevarad; kontroll av mål och uppgifter. |
| 03 | Multiplikation och division med komplexa tal | Ingen identifierad. Distributiv lag och förlängning med nämnarens konjugat finns. | En separat bild om felaktigt metodval bromsade genomgången. | Bild, svar och beroende klickkod bort; huvudlösning bevarad. |
| 04 | Komplexa tal som vektorer | Film och särskilt anvisad PDF: addition/subtraktion, längd och geometriska villkor finns. | PDF:ens cirklar och områden är **godkänd komplettering**; inte sidospår. | Ingen ny ändring. Kontroll att alla geometribilder är obligatoriska och kan nås. |
| 05 | Enhetscirkeln | Saknar separat fullständig originalfilm; repetitionsstoff stöttar polarformen. | Självständig repetitionsverkstad; inte en alternativ huvudmetod. | Ingen förändring. Separat källbegränsning kvar. |
| 06 | Polär form | Ingen identifierad. Från `r,v` till rektangulär form föregår nu omvänd metod, i filmens ordning. | Visualisering och kontrollfrågor; ingen annan standardmetod. | Ordningen bevarad från föregående rättning. |
| 07 | Multiplicera och dividera med `i` | Ingen identifierad. Rotation ±90° och algebraiska motiveringar finns. | Extra fel-/teckenjämförelse och därtill hörande figur. | Separat felbild, facit och den ovidkommande grafkoden bort. |
| 08 | Multiplikation och division i polär form | **Räkneprinciperna finns**, produkt av längder/summa av vinklar respektive kvot/differens. | Webbens huvudtal är i grader, medan filmens tydliga huvudexempel har radianerna `2π/3` och `π/3`. Webbens radianfall finns på samma lektionsspår men senare. | Inte ändrat för att undvika att samtidigt bryta den interaktiva figuren. **Exakt exempel-/representationsordning bör verifieras mot Jacobs önskemål.** |
| 09 | de Moivres formel | Ingen identifierad. `rⁿ`, `nv` och fjärdepotens i rektangulär kontra polär form finns. | En fristående missuppfattningsanalys och figur. | Bild/figur/facit bort. **Korrigering av äldre granskningsrapport:** jämförelsen med upprepad kvadrering fanns redan i det Javascript-genererade facit som faktisk visades, även när den var mindre tydlig i statisk HTML. |
| 10 | `zⁿ=a` | Ingen identifierad. Filmens `z³=8i`, `2πk`, tre rötter och talplanet används i huvudspåret; `z³=−8` i exit. | Interaktiv rotfigur och andra övningstal. | Bevarad. |
| 11 | Eulers formel | Ingen identifierad. `e^{iv}=cos v+i sin v`, radianer, `e^{iπ}+1=0` finns. | Frivilligt felmoment och flera andra valfria fördjupningsbilder. | Felmoment och dess uppkoppling bort; valfria extrasaker hålls skilda från huvudspåret. |
| 12 | Andragradsekvationer med komplexa tal | Filmens pq-formel och ansatsen `z=a+bi` finns och är standardväg. | Fristående felmoment samt valfri polär jämförelse. | Felmoment, båda genererade förklaringsblocken och kopplingar bort. Polär jämförelse står kvar endast som markerat extra. |
| 13 | Polynomdivision | **Liggande stolen och hela produktparenteser finns. Notationsbristen är nu åtgärdad** med `p(x)/q(x)=k(x)+rest/q(x)`. | Fristående analys av teckenfällor samt konkurrerande bokstäver för kvot/rest. | Båda felen bort över **all** synlig och dynamisk matematik, även övergången till nästa lektion. |
| 14 | Faktorsatsen | Ingen identifierad. Rest `f(a)`, faktorkriterium och prövning av nollställen finns. | Grafkoppling och övningar i faktorform. | Återblickens bokstäver och facit justerade till lektion 13. |
| 15 | Polynomekvationer av högre grad | Ingen identifierad. Bryta ut, given rot, liggande stol, pq och konjugatpar finns. | Två extra detaljerade alternativa angreppssätt i utfällbara PDF-rutor. | Alternativspåren bort; filmen styr huvudlösningen. |

## Kontroller – vad är gjort och vad återstår?

| Kontroll | Läget efter ändring |
|---|---|
| Filmens polynomdivision och slutskrivning | Återkontrollerad mot filmruta 09, cirka 21–29 min. Filmens exempelsiffror skiljer sig från webbens, men metoden, stolsformen och restuttrycket är samma. |
| Lärarmetoden och dynamiska facit | Statisk kontroll godkänd. `math-polish.js` och lektionsskriptet använder nu `k(x)`/`rest`. |
| Antal bilder, facitknappar och Javascript-syntax | Statiskt test godkänt: 14 bildspel, `enhetscirkeln` separat. Alla Javascript-testfiler syntaxkontrollerade. |
| Matematiken i varje steg och återställning | Flera mekaniska och visuella jämförelser genomförda. Fullständig interaktiv exekvering behöver fortfarande Playwright/Chromium. |
| Mobil, projektor, skärmbild för varje slide | **Ej slutverifierad i denna körning.** Lokal Chromium saknas och den separata molnwebbläsaren når inte lokal förhandsserver. GitHub Actions kan genomföra den. |
| NOKflex-intervall | Alla 14 ordinarie bildspel har de aktuella intervallen. Enhetscirkelverkstaden har inget eget uppgiftsintervall. |
| Publicerad webb | **Inte uppdaterad av denna rapport.** Ingen version får betecknas färdig förrän grön webbläsar-QA och publiceringskontroll är genomförda. |

## Stoppvillkor och slutbeslut

**Slutgranskning är ännu inte godkänd för publicering.** Utöver den tekniska webbläsarkontrollen är huvudexemplets grader/radianer i lektion 08 en kvarvarande exakt källskillnad. Den är inte en alternativ multiplikationsalgoritm, men eftersom Jacobs original ska styra även representation och ordning måste den antingen justeras källtroget eller accepteras uttryckligen. Ingen ”klar och publicerad” märkning innan dess.
