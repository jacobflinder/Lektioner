# Systematisk ämnes- och didaktikgranskning av lektionsbiblioteket

Startdatum: **13 november 2026**. Omfattning: **41 webblektioner i fyra kurser**. Granskningen skiljer strikt mellan att matematiken är rätt, att matematiktypsättningen är läsbar och att eleven kan följa **samtliga nödvändiga mellanled**. Alla tre krävs.

## Godkännandekriterier, varje lektion

1. **Varje bild och dolt lösningssteg:** kontrollera elevfråga, insatta värden, lämpliga mellanled, förklaring, återkoppling och progression.
2. **Oberoende ämneskontroll:** räkna om uppgifterna; kontrollera algebra, riktningar, tecken, konjugat, enheter, rötter, givna villkor och relevanta specialfall.
3. **Kognitivt sammanhang:** låt eleverna försöka före återkoppling; exponera inte facit genom en annan öppen ruta; visa alla nödvändiga härledningssteg i rätt ordning.
4. **Oförändrade delar:** behåll NOKflex, Socrative om det finns, klassrumsdemos, lärarstöd, övningar, val och frivilliga aktiviteter.
5. **Teknisk verifiering:** automatiserade tester av alla bilder inklusive dolda svar, återkopplingsval, skärm och mobil. Kontrollera att både GitHub Actions och Pages passerar efter publicering.
6. **Visuellt avstånd mellan uttryck:** varje fristående ekvation eller givet tal får ett eget matematikblock. Använd aldrig enbart mellanslag eller `&nbsp;` för att skilja ekvationer i samma MathML-element. Säkerställ luft (minst 16 px i Ma4:s `.math-givens`), tydlig åtskillnad på projektor/dator/mobil, skärmbildskontroll och automatiskt regressionstest för avståndet.

## Lektioner och status

**Granskade 14/41. Återstår 27/41.** Senast färdiggranskad: lektion 14, **Polynomekvationer av högre grad**. **Nästa lektion: 15/41, Enhetscirkeln**, sökväg ma4/kapitel-4/enhetscirkeln/. Enhetscirkeln står efter de ordinarie Ma4-lektionerna som separat repetitionsverkstad och räknas in i de 41.

### Matematik 4 (Matematik – fortsättning nivå 2) · 15 lektioner

- [x] [komplexa tal och i](../ma4/kapitel-4/komplexa-tal-och-i/) — bildgranskning 9/9, korrigerade mellanled och nytt webbläsartest
- [x] [konjugat och absolutbelopp](../ma4/kapitel-4/konjugat-och-absolutbelopp/) — bildgranskning 8/8, visuellt verifierat konjugatstreck, fullständiga mellanled och separat mobilsvit
- [x] [multiplikation division komplexa](../ma4/kapitel-4/multiplikation-division-komplexa/) — 8/8 bilder, fullständiga distributiva led, synlighets- och mobilgranskning, Chromiumtest
- [x] [komplexa tal som vektorer](../ma4/kapitel-4/komplexa-tal-som-vektorer/) — djupgranskning 8/8, fullständiga algebraiska mellanled, interaktiva talplan, 390 px mobil och separat frivillig fördjupning
- [x] [polar form](../ma4/kapitel-4/polar-form/) — 9/9 bilder, alla kvadranter, fullständiga koordinatbyten, dolt facit, separata MathML-rader och mobilkontroll
- [x] [multiplicera dividera med i](../ma4/kapitel-4/multiplicera-dividera-med-i/) — 7/7 bilder, allmän härledning, tre interaktiva rotationer, fullständiga facit och 390px mobilgranskning
- [x] [polar multiplikation division](../ma4/kapitel-4/polar-multiplikation-division/) — 7/7 bilder, fullständiga r/v-mellanled, frivillig härledning, interaktiv förstoring och 390px mobil
- [x] [de moivre](../ma4/kapitel-4/de-moivre/) — djupgranskning 10/10 bilder, 9 dynamiska potenser, samtliga mellanled, korrekt MathML-bråk, separat förstoring och 390px mobil
- [x] [ekvationen zn a](../ma4/kapitel-4/ekvationen-zn-a/) — 10/10 bilder, fullständiga rot- och k-värdesberäkningar, dolda rotvinklar, korrekt k=3-låsning, mobilläsbarhet och riktad Chromiumtest
- [x] [eulers formel](../ma4/kapitel-4/eulers-formel/) — djupgranskning 15/15 bilder, fyra frivilliga spår, fullständiga Euler-/radianmellanled, 390 px mobil, projektor, separat Chromiumtest
- [x] [andragradsekvationer](../ma4/kapitel-4/andragradsekvationer/) — 14/14 bilder, fullständiga pq-insättningar, båda teckenfallen, alla egna svar, mobil utan intern formelklippning, riktad Chromiumtest, PR #19 och #20
- [x] [polynomdivision](../ma4/kapitel-4/polynomdivision/) — 11 bilder, sju divisionsmotorer, fullständiga mellanled, 16 px avstånd, mobil/projektor, grön Chromium/Pages och sammanslagen PR #21
- [x] [faktorsatsen](../ma4/kapitel-4/faktorsatsen/) — 9 bilder, tre grafer, full restsats/faktorsats, nollställen och faktorformer, 16 px ekvationsluft, mobil, oberoende beräkning, grön Chromium/Pages och PR #22
- [x] [hogre grad](../ma4/kapitel-4/hogre-grad/) — 10/10 bilder, komplex Hornerkontroll av sju polynom, 16 px matematikavstånd, handskriven polynomdivision, tre interaktiva sekvenser, mobil utan sidöverflöde, godkänd QA/Pages och PR #23
- [ ] [enhetscirkeln](../ma4/kapitel-4/enhetscirkeln/)

### Matematik – fortsättning nivå 1c (Ma3c) · 10 lektioner

- [ ] [andraderivatan](../mato1c/kapitel-3/andraderivatan/)
- [ ] [andraderivatans roll for grafen](../mato1c/kapitel-3/andraderivatans-roll-for-grafen/)
- [ ] [blandade problem](../mato1c/kapitel-3/blandade-problem/)
- [ ] [deriverbarhet](../mato1c/kapitel-3/deriverbarhet/)
- [ ] [extrempunkter och terrasspunkter](../mato1c/kapitel-3/extrempunkter-och-terrasspunkter/)
- [ ] [extremvardesproblem polynomfunktioner](../mato1c/kapitel-3/extremvardesproblem-polynomfunktioner/)
- [ ] [funktionens graf och derivatornas grafer](../mato1c/kapitel-3/funktionens-graf-och-derivatornas-grafer/)
- [ ] [modellering och fler extremvardesproblem](../mato1c/kapitel-3/modellering-och-fler-extremvardesproblem/)
- [ ] [storsta och minsta varde](../mato1c/kapitel-3/storsta-och-minsta-varde/)
- [ ] [vaxande och avtagande](../mato1c/kapitel-3/vaxande-och-avtagande/)

### Fysik 2 · 10 lektioner

- [ ] [demonstrationer elektromagnetism](../fy2/kapitel-3/demonstrationer-elektromagnetism/)
- [ ] [elektriska falt](../fy2/kapitel-3/elektriska-falt/)
- [ ] [induktion](../fy2/kapitel-3/induktion/)
- [ ] [jordens magnetfalt](../fy2/kapitel-3/jordens-magnetfalt/)
- [ ] [laddade partiklar](../fy2/kapitel-3/laddade-partiklar/)
- [ ] [magnetism](../fy2/kapitel-3/magnetism/)
- [ ] [raknestuga kraft jordfalt](../fy2/kapitel-3/raknestuga-kraft-jordfalt/)
- [ ] [raknestuga](../fy2/kapitel-3/raknestuga/)
- [ ] [spolar och solenoider](../fy2/kapitel-3/spolar-och-solenoider/)
- [ ] [strom ger magnetfalt](../fy2/kapitel-3/strom-ger-magnetfalt/)

### Fysik 1 · 6 lektioner

- [ ] [coulombs lag](../fy1/kapitel-8/coulombs-lag/)
- [ ] [effekt](../fy1/kapitel-8/effekt/)
- [ ] [elektriska falt](../fy1/kapitel-8/elektriska-falt/)
- [ ] [elektriska kretsar](../fy1/kapitel-8/elektriska-kretsar/)
- [ ] [potential](../fy1/kapitel-8/potential/)
- [ ] [serie parallell](../fy1/kapitel-8/serie-parallell/)

## Bild-för-bild-rapport · 01/41 · Komplexa tal och imaginära enheten i

| Bild | Kontroll och åtgärd |
|---|---|
| 1. Startfråga | Ekvationerna x²=9 och x²=−9 kontrollerade. Nytt facit visar både 3²=9 och (−3)²=9 före slutsatsen. |
| 2. Imaginära enheten | Insättningen −9=9i² och båda lösningarnas kontroll tydliggjord. |
| 3. Standardform | **Väsentlig brist:** svaret och definitionen var synliga innan eleverna hann resonera. Dessa visas nu först efter elevens klick. Skriv om 2−3i till 2+(−3)i för att identifiera b=−3, inte −3i. Quiz behållen. |
| 4. Räknesätten | Addition, subtraktion, multiplikation och kvadrering oberoende verifierade. **Väsentlig brist:** mellanled saknades för de fyra produkterna och kvadratens mittterm. Tydliga ekvationer insatta; även −6(−1)=+6 och +4(−1)=−4 visas stegvis. Alla sju elevstyrda steg bevaras. |
| 5. Felanalys | 4i²=−4 verifierat. Den konstruerade felaktiga lösningen, snabbkontrollen och rättningen behålls. |
| 6. Självständigt arbete | Båda slutsvaren oberoende verifierade; ett mellanled insatt mellan −2i² och +2. |
| 7. NOKflex | Uppgifter 4101–4114 och tre av fem nivåer bevarade. |
| 8. Frivillig i-potens | Verifierat att i⁴=1, i⁵=i, i⁶=−1, 2026=4·506+2 och i²⁰²⁶=−1; periodens upprepning visas uttryckligen. |
| 9. Utcheckning | −16=16i², båda rötters kontroll, a och b, och alla fyra termer vid (1+i)² är nu synliga i facit. |

### Oberoende kontrollräkning

u+z=−2−i, u−z=4−5i, uz=3+11i, (−3+2i)²=5−12i, (2+i)(1−2i)=4−3i, (1+2i)²=−3+4i, i²⁰²⁶=−1 och (1+i)²=2i.

**Riktat webbläsartest:** `node ma4/kapitel-4/qa/deep-review-ma4-01.cjs`. Status för körningen dokumenteras av GitHub Actions. Markera inte andra lektioner som granskade förrän deras samtliga bilder granskats på samma sätt.


## Bild-för-bild-rapport · 02/41 · Konjugat och absolutbelopp

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2 · moment 4.1.  
**Sökväg:** ma4/kapitel-4/konjugat-och-absolutbelopp/  
**Publicerad sida:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/konjugat-och-absolutbelopp/  
**Omfattning:** Samtliga **8 av 8 bilder**, alla dolda facit, alla fyra härledningsstegen, begreppsquiz, konjugatreglage, navigering och mobilvisning.

| Bild | Oberoende ämnesgranskning, upptäckt och genomförd åtgärd |
|---|---|
| **1. Startfråga** | z=3−4i ger Re(z)=3, Im(z)=−4, P=(3;−4), d=√(3²+(−4)²)=√25=5. Korrekt räknat. Svar fortsatt dolt; identifieringen av koordinater lades till. Målen kan visas efter startfrågan i stället för att alltid ligga öppna. |
| **2. Konjugering** | z=2−3i har konjugatet 2+3i; generellt a,b∈ℝ och z=a+bi ger konjugatet a−bi samt (a;b)↦(a;−b). **Väsentlig didaktisk brist:** regeln var synlig innan eleverna skulle förutsäga. Regeln döljs nu fram till elevens klick. Samma likskaliga talplan och elevstyrda reglage bevarade. Nytt reglagevärde döljer tidigare konjugat, och vid b=0 sammanfaller punkterna. |
| **3. Absolutbelopp** | För z=−3+4i och dess konjugat −3−4i blir både √(9+16)=√25=5. Tydligt att det är ett icke-negativt avstånd och att spegling inte ändrar beloppet. Mellanled √25 skrivs ut i båda faciten. |
| **4. Konjugatprodukt** | Allmän kontroll: (a+bi)(a−bi)=a·a+a(−bi)+(bi)a+(bi)(−bi)=a²−abi+abi−b²i²=a²−b²(−1)=a²+b²=|z|². **Väsentlig brist:** de fyra ännu inte förenklade produkterna saknades och slutsatsrutan syntes innan eleven skulle härleda resultatet. Produkterna, kvadreringen av √(a²+b²) och dold avslutande slutsats har lagts in. Alla fyra steg, bakåt/återställning samt z=0 bevarade. |
| **5. Begreppskontroll** | För z=−3+4i gäller Im(z)=4 (inte 4i), konjugatet −3−4i, beloppet 5 och produkten 25. Felalternativen −5 och 4i får bättre förklaring. Facit visar de fyra faktorerna **var för sig**, inklusive +12i, −12i och −16i², före insättningen i²=−1. Quiz och elevens förklaring bevarade. |
| **6. Självständigt arbete** | För z=1+2i gäller konjugatet 1−2i, beloppet √5 och produkten 5. Återkopplingen visar √(1+4) och 1−4(−1) så att negativa tecken inte hoppas över; elevens eget pappersförsök kommer fortfarande först. |
| **7. NOKflex** | Moment 4.1, **uppgifter 4115–4124**, val av minst tre av fem nivåer, självständigt arbete och markering av en uppgift att diskutera är **oförändrade**. |
| **8. Utcheckning** | För z=−2−3i gäller konjugatet −2+3i, beloppet √13, z gånger konjugatet =4−6i+6i−9i²=4−9(−1)=13 och |z|²=(√13)²=13. De fyra produkterna räknas även här separat så tecknen kan kontrolleras på mobil. Facit dolt före självständigt försök; slutbilden återkopplar till målen. |

### Allvarliga fel, insatta mellanled och vad som bevarats

- **Allvarligt visuellt matematikfel åtgärdat:** Chromium visade tidigare ett osynligt överstreck i MathML-konjugat, vilket gjorde att z med överstreck kunde se ut som z utan streck. Orsaken var attributet accent=true på MathML-mover i det gemensamma Ma4-renderingsskriptet. En lokal reproduktion och **före/efter-skärmbilder i Chromium** verifierar att överstrecket nu syns. Ändringen regressionsprövades mot samtliga Ma4-lektioner.
- Inga felaktiga numeriska slutsvar hittades i de fyra huvudexemplen. Den avgörande bristen var i stället **utelämnade mellanled**, för tidigt synliga slutsatser och den felaktiga renderingen av konjugatnotation.
- Oberoende beräkningar med komplex multiplikation och konjugering verifierade 3−4i, −3+4i, 1+2i, −2−3i samt specialfallen 2+0i, 0 och −5−4i. För alla dessa är z gånger konjugatet = Re(z)²+Im(z)² och beloppet lika med konjugatets belopp.
- Bevarat: alla åtta bilder, det dynamiska likskaliga talplanet, lärarstöd och klassrumsläge, elevens förutsägelse och egna arbete, begreppsquiz, NOKflex och ursprunglig uppgiftsmängd.

### Spårbar kod, automatiska tester och publicering

**Kodändringar:** [PR #5 – första djupgranskningen](https://github.com/jacobflinder/Lektioner/pull/5) och [PR #6 – synligt konjugatstreck och mobilanpassning](https://github.com/jacobflinder/Lektioner/pull/6). Båda sammanslagna till main.

**Riktat test:** node ma4/kapitel-4/qa/deep-review-ma4-02.cjs. Testar alla åtta bilder, dolt facit, ordning på bevisets fyra steg, återställning, grafens geometriska symmetri, b=0, rätt/fel-feedback, alla fyra produkter, överstreck, mobil och klassrumsläge. **Alla åtta mobilskärmbilder visuellt genomgångna.**

**Godkända körningar:**
- [Arbetsgrenens slutliga Chromiumtest](https://github.com/jacobflinder/Lektioner/actions/runs/43447051659) – success; [skärmbildsbevis](https://github.com/jacobflinder/Lektioner/actions/runs/43447051659/artifacts/14048770874).
- [Ma4-browser QA efter sista sammanslagningen på main](https://github.com/jacobflinder/Lektioner/actions/runs/43447721582) – success.
- [GitHub Pages byggning och publicering efter sista sammanslagningen](https://github.com/jacobflinder/Lektioner/actions/runs/43447720450) – success, inklusive deploy-jobbet.

**Verifieringsgräns:** Godkända GitHub Pages-deploy-jobb är direkt verifierade. Separat HTTP-avläsning av publika sidan kunde inte utföras från granskningsverktyget; publika sidans rendering har därför provats i Chromium mot motsvarande commit i lokalt serverad testmiljö.

## Bild-för-bild-rapport · 03/41 · Multiplikation och division med komplexa tal

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2 · moment 4.1.  
**GitHub-sökväg:** `ma4/kapitel-4/multiplikation-division-komplexa/`  
**Publicerad URL:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/multiplikation-division-komplexa/  
**Granskade bilder:** **8/8**, inklusive den frivilliga bilden 7. Fullständiga elevlösningar, dolda facit, stegvisa härledningar, quiz, lärarstöd, val och mobilskärmbilder har granskats.

| Bild | Oberoende ämneskontroll, brist och åtgärd |
|---|---|
| **1. Startproblem** | Kvoten (−3+2i)/(1−3i) kontrollräknad till (−9−7i)/10. Förkunskapsfrågan förtydligar nu att **hela kvoten** måste multipliceras med ū/ū=1, inte bara täljaren. Den dolda idéåterkopplingen visar nämnarkonjugatet 1+3i och beräknar (1−3i)(1+3i)=1+3i−3i−9i²=10. Lärandemålen visas efter startfrågan, inte före elevens försök. |
| **2. Varför förlängningen fungerar** | Allmänt: u=a+bi, ū=a−bi, u·ū=a²−abi+abi−b²i²=a²+b²=|u|². **Utelämnade mellanled:** de fyra produkterna och substitutionen i²=−1 är nu uppdelade och kontrollerbara. Det visas explicit att z/u multipliceras med ū/ū=1 och att u≠0 krävs; då är a²+b²>0. De tre elevstyrda stegen med backning och återställning bevaras. |
| **3. Genomarbetad division** | Sju steg kontrollerade för z=−3+2i, u=1−3i. Nämnare: (1−3i)(1+3i)=1+3i−3i−9i²=10. Täljare: (−3+2i)(1+3i)=−3−9i+2i+6i²=−9−7i. Resultat: z/u=−9/10−(7/10)i. Multiplikation tillbaka visar (1−3i)(−9−7i)/10=(−9+20i+21(−1))/10=−3+2i. **Visuella blockerare:** ursprungligen trycktes z- och u-värdena ihop till en svårtolkad rad; nu står de separat. Slutsvaret är delat i två ekvationsrader som ryms på mobil utan intern sidscroll. |
| **4. Konstruerat fel** | (2+i)(3−2i)=6−4i+3i−2i²=8−i; de avsiktligt felaktigt bortglömda korsprodukterna är −4i och +3i. Fyra faktorer, kvadreringen av i och samlingen av termer visas i dolt facit. Quizens rätt- och felåterkoppling och lärarens felanalys bevaras. |
| **5. Självständig tillämpning** | (2+i)/(1+i)=(3−i)/2=3/2−(1/2)i, kontrollerat genom att multiplicera med 1+i. **Begreppsligt fel rättat:** ursprungligt facit skrev resultatet som z trots att z inte definierats. Täljare, nämnare, i²=−1 och återkontroll har nu egna fullständiga beräkningsled. Eget arbete före facit bevarat. |
| **6. NOKflex** | **Uppgifter 4125–4142**, moment 4.1, valet av minst tre av fem nivåer, självständigt arbete och markering av en uppgift att diskutera är helt bevarade. Knappen till frivilligt spår fungerar; huvudvägen hoppar korrekt från bild 6 till bild 8. |
| **7. Frivilligt: rent imaginär nämnare** | (3+i)/(2i)=(1−3i)/2=1/2−(3/2)i kontrollerat. Förlängning med −i, varje produkt och varför 1/i=−i visas separat. Alternativet att förlänga med i är bevarat; u=2i≠0. Bilden ligger kvar som frivilligt extramoment. |
| **8. Individuell utcheckning** | Oberoende verifierat: (1+i)(2−i)=3+i samt (1+2i)/(1−i)=−1/2+(3/2)i. Facit visar alla fyra produkter, konjugatet 1+i, i²-substitution, nämnaren 2 och multiplikation tillbaka till 1+2i utan försvunna tecken- eller förenklingsled. Båda facit dolda till elevens försök; målen och självbedömningen bevarade. |

### Oberoende kontroll och didaktisk slutsats

- **Alla huvudexemplens slutsvar var numeriskt riktiga.** De allvarliga problemen var en **odefinierad beteckning i elevfacit**, bristfälligt redovisade distributiva produkter, för komprimerade kontrollberäkningar och **två verkliga visuella läsbarhetsproblem**.
- Oberoende aritmetik verifierade sex exempel: (−3+2i)/(1−3i)=−9/10−(7/10)i; (2+i)(3−2i)=8−i; (2+i)/(1+i)=3/2−(1/2)i; (3+i)/(2i)=1/2−(3/2)i; (1+i)(2−i)=3+i; (1+2i)/(1−i)=−1/2+(3/2)i.
- Dessutom testades den allmänna regeln u·ū=|u|² för flera typer av u och att division med u=0 **inte** är definierad.
- Lärandecykeln förutsäg → försök → resonera → visa fullständiga led → kontrollera är förstärkt utan att lägga till onödiga klick. Sju steg, trestegshärledningen, alla åtta bilder, läromedel, felanalys, frivilligt spår, lärarstöd, klassrumsläge och nivåval har avsiktligt bevarats.

### Kodändring, kvalitetstest och publicering

**Ändringshistorik:** [PR #7 – Ma4 bildgranskning 03/41](https://github.com/jacobflinder/Lektioner/pull/7), sammanslagen i `main` via commit `470bee7119c54a6aa2f97f3223d48e3fce6aa401`.

**Riktat Chromiumtest:** `node ma4/kapitel-4/qa/deep-review-ma4-03.cjs` i `.github/workflows/ma4-browser-qa.yml`. Kontrollerar separat beräknad komplex aritmetik, division med noll, alla 8 bilder, samtliga dolda facit, 3+7 elevstyrda steg, rätt/felåterkoppling, back/reset, frivillig väg, läromedel, klassrumsläge, MathML, och 8/8 mobilbilder. Extra regressionstester verifierar att de givna talen **z och u står separat** och att slutsvaret på mobil **inte behöver horisontell sidscroll**.

- [Arbetsgrenen – godkänt heltest](https://github.com/jacobflinder/Lektioner/actions/runs/43452109870), med [webbläsarskärmbilder](https://github.com/jacobflinder/Lektioner/actions/runs/43452109870/artifacts/14053380197).
- [`main` – godkänt Ma4 Chromiumtest](https://github.com/jacobflinder/Lektioner/actions/runs/43452657367).
- [`main` – godkänd GitHub Pages-build och driftsättning](https://github.com/jacobflinder/Lektioner/actions/runs/43452657892).

**Verifieringens gräns:** GitHub Actions bekräftar godkänd Pages-driftsättning, och riktiga Chromium-skärmbilder på exakt den publicerade kodversionen är visuellt genomgångna (alla 8 mobilbilder). En separat direkt HTTP-avläsning av den publika Pages-sidan var inte möjlig från granskningsverktyget, varför sådan direktkontroll inte påstås vara utförd.

## Tvärgående efterhandskorrigering · Visuellt åtskilda ekvationer (13 november 2026)

En bild från **Ma4 lektion 1, bild 4**, visade att två fristående definitioner `u = 1 − 3i` och `z = −3 + 2i` renderades utan synligt mellanrum som `u = 1 − 3iz = −3 + 2i`. Även lektion 3 använder samma två tal. **Orsak:** flera ekvationer låg i ett och samma `.math`-element med `&nbsp;` som enda avskiljare; MathML-renderaren normaliserar bort mellanrummet.

**Åtgärd:** Båda lektionerna visar nu varje givet komplext tal i ett eget matematiskt block i `.math-givens`. En återanvändbar CSS-regel ger minst **16 CSS-pixlars vertikalt mellanrum**. Riktade Chromiumtester kontrollerar både separata MathML-uttryck och deras uppmätta mellanrum på desktop och mobil (390 px). Dessutom är kravet permanent infört i `AGENTS.md` och som granskningskriterium ovan.

**Uppföljande kontroll av lektion 1–3:** Den första ändringen omfattade bara de stora givna talparen i lektion 1 och 3. Vid kontroll av **samtliga tre lektioner** hittades ytterligare självständiga ekvationer som fortfarande stod i ett enda matematikblock. De har nu delats upp i egna `.math-givens`-rader: standardform och `a`/`b` i lektion 1, konjugeringsregel, absolutbelopp, två tal i samma exempel samt begrepps- och utcheckningsfacit i lektion 2, och `u` och `ū` i lektion 3. Den stegvisa matematiska framställningen och alla uppgifter bevaras.

**Permanent kontroll:** `qa/equation-spacing-ma4-01-03.cjs` verifierar separata MathML-element, läsbarhet och uppmätt avstånd om minst 16 CSS-pixlar på både 1280 px dator och 390 px mobil. De individuella djupgranskningstesterna uppdateras där typografin påverkar förväntade MathML-uttryck.

**Verifierad status:** Korrigeringen ändrar inte antalet genomförda lektioner (**3/41**) eller matematiska slutsvar. [PR #9](https://github.com/jacobflinder/Lektioner/pull/9) är sammanslagen till main. [Ma4 Chromium QA på main](https://github.com/jacobflinder/Lektioner/actions/runs/43464019182) **godkänd**; [Pages byggning och driftsättning](https://github.com/jacobflinder/Lektioner/actions/runs/43464019161) **godkända**. [Skärmbildsbevis från sista Chromiumkörningen](https://github.com/jacobflinder/Lektioner/actions/runs/43464019182/artifacts/14057965933) visar separata uttryck i alla tre lektioner. Nästa ordinarie granskning är fortfarande lektion 4.

## Bild-för-bild-rapport · 04/41 · Komplexa tal som vektorer

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2 · 4.1 Aritmetik med komplexa tal.  
**GitHub-sökväg:** `ma4/kapitel-4/komplexa-tal-som-vektorer/`  
**Publicerad URL:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/komplexa-tal-som-vektorer/  
**Granskade bilder:** **8 av 8**, där bilderna 4–5 är frivilliga geometriska tillämpningar. Dolda facit, samtliga fyra algebraiska steg, tvåstegsvektorer, cirkel- och områdesfigurer, valfria fördjupningar, exit och mobilskärmbilder har kontrollerats. Ingen del av originalets NOKflex-arbete har tagits bort.

| Bild | Oberoende ämnesgranskning, upptäckt och faktisk åtgärd |
|---|---|
| **1. Startfråga** | För `u=3+i`, `z=1+4i` blir `u+z=4+5i`, slutpunkten **(4;5)**. Felalternativet (2;−3) motsvarar differensen, inte summan. **Viktigt:** målen syntes innan eleverna hade försökt; nu visas de efter elevens startfråga. Två givna tal har var sitt MathML-block med minst 16 px vertikalt mellanrum. Befintlig enskilt→par→gemensam återkoppling och begreppsförklaring bevarade. |
| **2. Vektorsumma och differens** | Korrekt additionsvektor från (3;1) och en flyttad kopia av (1;4) till (4;5), samt subtraktion via `−z=(−1;−4)` och slutpunkt (2;−3). Figurerna visar först grundvektorer, sedan hjälppilen och först därefter resultatet. **Viktigt:** dynamisk återkoppling var hoptryckt i långa likhetskedjor. Nu visas ursprunglig insättning, koordinatsamling och svar som separata ekvationer; därefter Pythagoras och kvadratsumman. Vid bytt operation/back/reset döljs svaret. **Visuell korrigering:** texten `z (flyttad)` låg intill Im-axelns etikett; flyttad och automatiskt testad mot andra SVG-etiketters faktiska rektanglar. |
| **3. Algebra och minutkontroll** | `u+z=(3+i)+(1+4i)=(3+1)+(1+4)i=4+5i`; `−z=−1−4i`; `u−z=(3+i)+(−1−4i)=(3−1)+(1−4)i=2−3i`. Längderna är **√41** respektive **√13**. Explicita mellanled för insättning, negativa tecken och kvadratsummor tillagda. **Didaktisk brist:** minutsituationen avslöjade längden √13 i frågan. Längden ska nu beräknas av eleven och facit visas separat efter försök. För minutuppgiften `u=2+3i`, `z=−1+i` kontrolleras `u−z=3+2i` med längd √13. Fyra elevstyrda steg, tillbaka och återställning bevarade. |
| **4. Cirklar (frivillig)** | `|z−z₀|=r` med `r>0` separerade i egna, läsbara matematiksatser. För `|z|=3` är centrum origo; för `|z−2i|=3` är centrum (0;2). Båda har radie 3 och endast randen ingår. Interaktiv figur och förutsägelse före visning bevarade. SVG-skalan är lika för båda axlarna och den ritade radiesträckan har exakt samma längd som cirkelradien. Centrumbyte döljer tidigare facit. |
| **5. Linjer och områden (frivillig)** | `Re(z)=2` är en vertikal linje. `−1≤Im(z)<2` är ett band där **nedre randen ingår och övre är utesluten**. `|z+i|<2` är en öppen skiva med centrum `−i` och radie 2. Kontroll av heldragen/streckad rand och skivans öppna rand i faktiskt SVG, samt rätt/fel-feedback i quiz. Matematiknotationen för `Re(z)`/`Im(z)` gjord tydligare så att funktionsnamn inte ser hoptryckta ut. Alla tre valbara figurer och frågor bevarade. |
| **6. Självständigt försök** | `w=−2+3i` motsvarar punkten (−2;3) och har längden `√((−2)²+3²)=√(4+9)=√13`. **Kognitiv förbättring:** kärnfacit visar endast detta exempel. Frivilliga lösningar öppnas separat för områdesfrågor; för `|z+i|<2` är centrum −i och punkten z=i ger `|2i|=2`, vilket **inte** uppfyller `2<2`. Ursprungliga valfria uppgifter och eget arbete bevarade. |
| **7. NOKflex** | **Uppgifter 4146–4160**, moment 4.1 och elevens val av **minst tre av fem nivåer** kvarstår ordagrant i innehåll och funktion. Digitala svar samlas inte in. Ingen onödig extrauppgift införd. |
| **8. Individuell utcheckning** | Kärnfrågan `u=2+3i`, `z=−1+i` ger `u−z=3+2i` och längd `√13`. Facit visar att subtraktion av hela parentesen ändrar tecknen, sedan insättning och kvadratsumma. Frivilliga frågor ger cirkel med centrum (3;0), radie 2, inkluderad rand för `|w−3|=2`; övre randen `Im(w)=2` ingår inte i bandet. Frivilliga facit dolda separat. Ett fel där svensk svarstext behandlades som en matematisk ekvation har rättats. Avslutningsbildens lärandemål, självbedömning och lärarstöd bevarade. |

### Matematisk, didaktisk och visuell kontroll

- **Oberoende kontrollerade resultat:** (3;1)+(1;4)=(4;5), (3;1)−(1;4)=(2;−3), `−z=−1−4i`, längd² för summan 41 och för differensen 13, samt `(2+3i)−(−1+i)=3+2i` med längd² 13. Exemplet `w=−2+3i` ger längd² 13. Geometriskt kontrollerades en radiesträcka (1,8;2,4) med längd exakt 3, centrum −i och de olika randvillkoren.
- **Inga felaktiga numeriska slutsvar hittades.** Viktigaste bristerna var bortfall av nödvändiga algebraiska mellanled, för tidigt synliga svar, visuellt hoptryckt matematik/etiketter och blandning av grund- och fördjupningsfacit.
- **Bevarat:** samtliga 8 bilder, båda frivilliga bilderna, vektoranimationen i två steg, cirkel- och områdesinteraktionerna, begreppsquiz, elevaktiva förutsägelser, lärarstöd, klassrumsläge och NOKflex-uppgifter 4146–4160. Inget Socrative-inslag har lagts till utan grund i originalet.

### Verifiering, kodändringar och publicering

**Sammanslagna kodändringar:** [PR #10 – djupgranskning och fullständiga mellanled](https://github.com/jacobflinder/Lektioner/pull/10), [PR #11 – överlappningsfri etikett i talplanet](https://github.com/jacobflinder/Lektioner/pull/11).

**Riktat automatiskt test:** `node ma4/kapitel-4/qa/deep-review-ma4-04.cjs` integrerat i Ma4:s befintliga Chromiumworkflow. Kontrollerar 8/8 bilder, facitens ordning, omstart/backning, fria navigeringsvägar, matematiskt korrekta resultat, verkliga SVG-cirklar/randvillkor, etikettkollisioner med `getBBox`, fel- och rättfeedback, MathML, CSS-avstånd och 390 px mobil. `qa/math-typography-pair-02.cjs` har anpassats utan att ta bort sakliga assertions.

**Godkänd verifiering:**
- [Ma4 Chromium QA på `main` efter sista sammanslagningen](https://github.com/jacobflinder/Lektioner/actions/runs/43469238300) — **success**.
- [GitHub Pages bygge och driftsättning efter sista sammanslagningen](https://github.com/jacobflinder/Lektioner/actions/runs/43469237294) — **success**.
- [Chromiumskärmbilder från sista körningen på `main`](https://github.com/jacobflinder/Lektioner/actions/runs/43469238300/artifacts/14059404652). Samtliga åtta mobilbilder har granskats visuellt. En separat direkt HTTP-avläsning av den publika Pages-sidan kunde inte utföras från granskningsverktyget; därför anges endast den verifierade Pages-driftsättningen och renderingen mot publicerad kod i Chromium.

## Bild-för-bild-rapport · 05/41 · Polär form

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2, moment 4.2 Komplexa tal i polär form.  
**Sökväg:** `ma4/kapitel-4/polar-form/`  
**Publicerad lektion:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/polar-form/  
**Omfattning:** **9 av 9 bilder**, varav bild 8 är frivillig. Samtliga dolda lösningar, alla fem elevstyrda modellsteg, sex interaktiva talpunkter, rätt/fel-feedback, omstart, klassrumsläge, navigering och nio mobillägen kontrollerade.

| Bild | Oberoende matematisk granskning, upptäckt och genomförd åtgärd |
|---|---|
| **1. Startfråga** | För `z=3+4i` är `r=√(3²+4²)=√25=5`; 7 och √7 är konstruerade felalternativ med förklarande respons. **Didaktisk brist:** målen var synliga före förkunskapsförsöket. De visas nu efter att eleven räknat och diskuterat. Frivilliga länken till Enhetscirkeln och tänk→par→återkoppling kvar. |
| **2. Två representationer** | Talplan och vinkelgeometri kontrollräknade för **sex fall**: `3+4i`: r=5, v≈53,13°; `−3+3i`: r=3√2, v=135°; `−1−i`: r=√2, v=225°; **nytt provfall i fjärde kvadranten** `2−2i`: r=2√2, v=315°; `3i`: r=3, v=90°; `0`: r=0, argument odefinierat. Korrekta tecken och vinklar verifierade oberoende genom `r cos v` och `r sin v`, med avrundningstolerans i första fallet. **Väsentliga brister:** omvandlingsformlerna syntes före undersökningen och `a,b` respektive `r,v` delades av enbart skiljetecken i samma matematikblock. Nu visas först punkten, sedan kateter, radie och vinkel; efter sista klicket visas formler och varje värde i ett eget MathML-block med minst 16 px verkligt avstånd. 0°≤v<360° och origos undantag förklaras. Byten, backning och reset döljer tidigare svar. |
| **3. Genomarbetat exempel** | För `z=−3+3i` identifieras separat a=−3 och b=3. Härledningen visar `r=√(a²+b²)=√(9+9)=√18=3√2`, katetlängder 3 och 3, `tan α=3/3=1`, referensvinkel 45° och, tack vare andra kvadranten, `v=180°−45°=135°`. Återkontroll visar trigonometriska värden och `z=−3+3i` utan försvunnen faktor eller tecken. **Mobilfel hittat vid skärmbildskontroll:** den långa ursprungliga polärformen klipptes i slutet. Den är ersatt med korta, fullt synliga, logiskt sammanhängande ekvationsrader för r, v, cos135°, sin135°, generell polär form, insättning och förenkling. Ett nytt Chromiumtest mäter att samtliga rader ryms på 390px mobil. Fem elevstyrda steg och egen förutsägelse bevarade. |
| **4. Från polär till rektangulär** | `z=4(cos150°+i sin150°)` ger `a=4(−√3/2)=−2√3`, `b=4(1/2)=2`, alltså `z=−2√3+2i`; `|z|=√(12+4)=4`. Facit omarbetat i fem steg med separata allmänna formler, insättning, faktorförenkling och kontroll. Eleven räknar själv före facit. |
| **5. Begreppskontroll** | `z₁=1+i` har argument 45° medan `z₂=−1−i` har 225°, trots att `b/a=1` i båda fallen. De två givna talen visas på separata rader. Quizalternativen 45°, 135° och 225° ger missuppfattningsspecifik respons. Specialfallen a=0 och z=0 samt den valda vinkelkonventionen bevarade och förtydligade. Kvadrantkontroll används som verktyg, inte huvudmål. |
| **6. Eget försök** | För `z=−2−2i` fås `r=√(4+4)=√8=2√2`, `tan α=2/2=1`, `α=45°`, `v=180°+45°=225°`. Kontroll via exakt cos225° och sin225° ger `−2−2i`. Rättad och utbyggd lösning visar alla värden och mellanled utan att ändra elevuppgiften eller avslöja facit före eget arbete. |
| **7. NOKflex** | Momentet **4.2 Polär form**, **uppgifter 4201–4216** och kravet att arbeta på **minst tre av fem nivåer** bevarade. Ingen digital elevdatainsamling eller onödiga tillägg. |
| **8. Frivilliga argument** | `495°=135°+360°` och `−225°=135°−360°`. Båda ger samma riktning som 135°; med samma positiva absolutbelopp beskriver samtliga samma komplexa tal. Frivillig fördjupning med separat dolt facit och navigering bevarad. |
| **9. Individuell utcheckning** | Uppgift 1: `z=−√3+i` har `r=2`, referensvinkel 30° och argument 150°, så `z=2(cos150°+i sin150°)`. Uppgift 2: `w=2(cos240°+i sin240°)=−1−√3i`. Härledning i sju korta steg visar allmän formel, identifiering, insättning, trigonometriska värden, tecken och kontroll av `|w|=2`. Två separata slutsvar. Facit dolt tills eleven försökt; målen visas igen i slutet. |

### Matematik, didaktik, interaktivitet och bevarande

- **Oberoende beräknat och verifierat:** alla sex talplanspunkter och deras `r`, argument och återinsättning; `−3+3i` i andra kvadranten; `−2−2i` i tredje kvadranten; omvandlingen `4(cos150°+i sin150°)=−2√3+2i`; helvarvsexemplet; båda utcheckningssvaren. För nollan gäller `r=0` men inget definierat argument.
- **Inga felaktiga numeriska slutsvar i originalet identifierades.** De viktigaste felen för lärandet var för tidigt givna samband/mål, saknade algebraiska mellanled, ihoptryckta separata matematiksatser, ett avklippt uttryck i mobilläget och frånvaron av ett konkret undersökningsfall i fjärde kvadranten.
- **Förutsäg→försök→resonera→fullständig återkoppling→kontroll** bibehålls. Regler syns efter undersökningen; elevens självständiga arbetsuppgifter har eget dolt facit. Lärarstöd, femstegsmodell, interaktiv geometri, NOKflex **4201–4216**, det fria nivåvalet, frivillig länk till Enhetscirkeln och frivillig helvarvsaktivitet är bevarade. Inget Socrative-moment har införts utan stöd i lektionens källa.

### Kod, tester och publicering

**Kodändring:** [PR #12 – systematisk djupgranskning av Polär form](https://github.com/jacobflinder/Lektioner/pull/12), sammanslagen i `main` via commit `8b9809838570c7959333eb2ba08ad29073afc277`.

**Riktat test:** `node ma4/kapitel-4/qa/deep-review-ma4-05.cjs`, integrerat i `.github/workflows/ma4-browser-qa.yml`. Testet kontrollerar alla **9/9 bilder**, svarssynlighet, sex valbara dynamiska punkter, rätt radie och argument, MathML, oberoende trigonometriska återinsättningar, 16 px mellanrum, mobilens fullständiga ekvationsbredder, quiz med rätt och fel, alla facit, navigation, klassrumsläge, lärarstöd och nio mobila skärmbilder. Även det äldre `qa/math-typography-pair-03.cjs` har anpassats till tydligare separata uttryck.

**Verklig status:** [Slutligt Chromiumtest på arbetsgrenen](https://github.com/jacobflinder/Lektioner/actions/runs/43473601921) **success**; [Ma4 browser QA på `main`](https://github.com/jacobflinder/Lektioner/actions/runs/43474387670) **success**; [GitHub Pages byggning och driftsättning för lektionen](https://github.com/jacobflinder/Lektioner/actions/runs/43474386579) **success**. [Chromium-bildbevis från `main`](https://github.com/jacobflinder/Lektioner/actions/runs/43474387670/artifacts/14062705671). Alla nio mobillägen har testats och bilden av det korrigerade, tidigare avklippta uträkningsexemplet är visuellt granskad.

**Verifieringsgräns:** Pages-build och deployment är direkt verifierade i GitHub Actions. Ett separat försök att läsa den publika Pages-sidans HTTP-innehåll med webbverktyget misslyckades; sådan direktavläsning påstås därför inte vara verifierad.

## Bild-för-bild-rapport · 06/41 · Multiplicera och dividera med i

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2, moment 4.2 Komplexa tal i polär form.  
**GitHub-sökväg:** `ma4/kapitel-4/multiplicera-dividera-med-i/`  
**Publicerad URL:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/multiplicera-dividera-med-i/  
**Omfattning:** Samtliga **7 av 7 bilder**, startfråga, fem elevstyrda generella bevissteg, alla tre starttal i interaktivt talplan, dolda facit, felanalys, eget arbete, NOKflex, utcheckning, lärarstöd, klassrumsläge och sju mobilbilder.

| Bild | Oberoende ämneskontroll, upptäckt och genomförd åtgärd |
|---|---|
| **1. Startfråga** | `z=2+i`. Oberoende kontrollerat `iz=i(2+i)=2i+i²=2i−1=−1+2i`. Startpunkten (2;1) roteras moturs till (−1;2), och båda längderna är `√5`. **Brister:** facit redovisade för många steg i samma uttryck och målen var synliga före startförsöket. Nu är det dolda facit uppdelat i fyra steg med distributiva lagen, `i²=−1`, separata punkter och två Pythagoras-beräkningar; målen öppnas efter förkunskapsfrågan. Enskilt→par och ritandet på papper bevarade. |
| **2. Algebran förklarar geometrin** | Generellt `z=a+bi`, med `a,b∈ℝ`. **Fem steg:** (1) `iz=i(a+bi)=ia+i(bi)=ai+bi²=ai+b(−1)=−b+ai`; (2) `(a;b)→(−b;a)`, 90° moturs; (3) `i(−i)=−i²=1` och `1/i=(1·(−i))/(i(−i))=(−i)/1=−i`, därför `z/i=(a+bi)(−i)=−ai−bi²=−ai−b(−1)=b−ai`; (4) `(a;b)→(b;−a)`, 90° medurs; (5) tre explicita Pythagoras-steg som visar att `|z|=|iz|=|z/i|=√(a²+b²)`. **Åtgärdat:** tidigare utelämnade distributiva produkter, insättningar och rotförenklingar samt otydlig radianformulering. Generellt tal och villkoret på a,b står i **två separata MathML-block med minst 16 px mellanrum**. `z=0` bevaras som specialfall (längden 0, argument odefinierat). Fråga→klick→ett steg, bakåt och reset fungerar. |
| **3. Interaktivt talplan** | Tre oberoende provfall: `z=2+i` ger `iz=−1+2i`, `z/i=1−2i`; `z=−1+2i` ger `iz=−2−i`, `z/i=2+i`; `z=−2−i` ger `iz=1−2i`, `z/i=−1+2i`. I samtliga fall är `|z|=|iz|=|z/i|=√5`. **Väsentlig didaktisk brist:** figuren visade rätt riktning men återkopplingen innehöll nästan enbart slutsvar. Den visar nu först **tre distributions-/teckenled** för multiplikation, därefter **fyra för division**, och slutligen **tre separata längdberäkningar**. Blå startvektor, motursbåge, medursbåge och cirkel med lika skala bevarade. Varje klick visar bara rätt nästa innehåll; byte av tal, bakåt och reset döljer tidigare facit. Visuellt kontrollerat på dator och 390px mobil utan avklippta matematikrader eller etikettkollisioner. |
| **4. Konstruerad missuppfattning** | För `z=1+2i` är `z̄=1−2i` (spegling), `iz=i+2i²=−2+i` (moturs) och `z/i=−i−2i²=2−i` (medurs). Alla resultat har samma belopp `√5`, men är olika punkter och operationer. Facit är fortsatt dolt före elevens egen felsökning. Fullständiga insättningar av `i²=−1`, tydliga konjugatstreck och tre separata slutsvar har lagts till. Konstruerat påstående har inte felaktigt presenterats som autentiskt elevsvar. |
| **5. Självständig tillämpning** | `z=−3+2i`: `iz=−3i+2i²=−2−3i`, `z/i=3i−2i²=2+3i`. `|z|=√((−3)²+2²)=√13`, och samma längd följer för de två roterade talen. Fullständigt, separat dolt facit med koefficienter, distributiv lag, tecken, kvadratsummor och två tydliga slutsvar. Elevens eget pappersarbete och kontroll genom ritning bevarade. |
| **6. NOKflex** | Moment **4.2**, **uppgifter 4232–4240**, val av **minst tre av fem nivåer**, möjlighet att byta nivå under arbetet och uppgift att markera för diskussion har bevarats utan ändringar i bokinnehållet. Inga nya digitala svarinsamlingar införda. |
| **7. Individuell utcheckning** | `z=1−2i`: `iz=i−2i²=2+i`, `z/i=−i+2i²=−2−i`. Längderna `|z|=√(1²+(−2)²)=√5`, `|iz|=√(2²+1²)=√5`, `|z/i|=√((−2)²+(−1)²)=√5`. Två slutsvar och tre längdkontroller är nu egna lättlästa matematikkedjor, med mellanled för negativa tecken; facit fortsatt dolt före elevens eget försök. Målen och den avslutande självbedömningen kvar. |

### Matematiska slutsatser, lärande och avsiktligt bevarande

- Alla numeriska slutsvar i originalet var korrekta. De viktigaste bristerna för lärandet var **för tidigt synliga mål**, **överhoppad distributiv lag och `i²=−1`-insättning**, för långa kompakta likhetskedjor samt för lite matematiskt stöd till den dynamiska rotationsfiguren.
- Oberoende beräkningar kontrollerar `iz=−b+ai`, `z/i=b−ai`, `i(−i)=1`, oförändrade kvadrerade belopp och att `i(z/i)=z`; testat på alla tre interaktiva starttal, båda elevexemplen och `z=0`. Division med **noll** är däremot inte definierad; nämnaren `i` är alltid skild från noll.
- Grundprincipen **förutsäg → försök själv → resonera → visa fullständig återkoppling → kontrollera** har förstärkts utan extra klick i talplanet. Bevarat: **alla sju originalbilder**, fem allmänna steg, tre starttal, alla rotationsbågar och figurer, konstruerad felanalys, elevens pappersarbete, lärarstöd, klassrumsläge, NOKflex 4232–4240 och nivåval. Inget Socrative-inslag har lagts till utan stöd i källan.

### Kod, automatisk testning och publicering

**Kodändring:** [PR #13 – Ma4 djupgranskning 06/41](https://github.com/jacobflinder/Lektioner/pull/13), sammanslagen till `main` via commit `519a0916ed20199440eeefec06673a11295260d8`.

**Riktat Chromiumtest:** `node ma4/kapitel-4/qa/deep-review-ma4-06.cjs`, infört i `.github/workflows/ma4-browser-qa.yml`. Oberoende komplex aritmetik (inklusive noll och återkontroll), samtliga sju bilder, fem allmänna steg, alla dolda facit, tre interaktiva punkter och medurs/motursbågar, cirkel, dynamiska mellanled, korrekta tecken, back/reset, faktiskt CSS-avstånd, 390px mobil, lärarstöd och klassrumsläge. **Alla sju mobila skärmbilder och datorbilden med det dynamiska talplanet granskades visuellt**, utöver automatiska kontroller av uttryckens bredd.

**Godkänd verifiering:**
- [Arbetsgrenens Ma4 Chromiumtest](https://github.com/jacobflinder/Lektioner/actions/runs/43482827928) – **success**; [skärmbilder](https://github.com/jacobflinder/Lektioner/actions/runs/43482827928/artifacts/14065403295).
- [`main` – fullständig Ma4 browser QA](https://github.com/jacobflinder/Lektioner/actions/runs/43483649016) – **success**.
- [GitHub Pages byggning och driftsättning efter sammanslagning](https://github.com/jacobflinder/Lektioner/actions/runs/43483646680) – **success**.

**Verifieringsgräns:** GitHub Actions bekräftar byggning/driftsättning och den sammanslagna kodversionen har testats med Chromium. Direkt HTTP-avläsning av Pages via externt webbverktyg var inte möjlig; den uppgiften påstås därför inte vara verifierad.


## Bild-för-bild-rapport · 07/41 · Multiplikation och division i polär form

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2, moment 4.2 Komplexa tal i polär form.  
**GitHub-sökväg:** `ma4/kapitel-4/polar-multiplikation-division/`.  
**Publicerad URL:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/polar-multiplikation-division/  
**Omfattning:** **7/7 bilder**, två valfria algebraiska motiveringar, fyra steg i vardera elevstyrda huvudgenomgången, dynamisk SVG-figur med både multiplikation och division, skalning och rotation, självständiga facit, utcheckning och sju mobilbilder. All matematik är omräknad oberoende.

| Bild | Upptäckt, ämneskontroll och genomförd korrigering |
|---|---|
| **1. Startfråga och mål** | För `z=4+3i` är `a=4`, `b=3`, `r=√(a²+b²)=√(16+9)=√25=5`, `tan v=3/4`, `v≈36,87°` i första kvadranten. Rektangulär återkontroll `5cos36,87°≈4`, `5sin36,87°≈3`; ≈ behövs p.g.a. avrundad vinkel. **Åtgärd:** mål dolda tills eleverna prövat startfrågan, facit kompletterat med koordinatidentifiering, insättning, Pythagoras och rimlighetskontroll. Startfrågan och enskilt→par bevarade. |
| **2. Multiplikation** | Givna `z₁=2(cos30°+isin30°)`, `z₂=3(cos60°+isin60°)` är åtskilda i egna MathML-block. I fyra förutsäg→visa-steg identifieras **separat** `r₁=2`, `v₁=30°`, `r₂=3`, `v₂=60°`, därefter `r=r₁r₂=2·3=6` och `v=v₁+v₂=30°+60°=90°`. Formeln sätts in i separata läsbara led: `z₁z₂=6(cos90°+isin90°)=6(0+i·1)=6i`. **Viktig saknad förklaring:** den frivilliga härledningen har byggts ut med korta definitioner `c₁,s₁,c₂,s₂`, de två distributiva termerna `T₁,T₂`, `i²=−1`, realdel, imaginärdel och additionsformler; varje term har en redovisad källa. Frivilligheten bevarad. |
| **3. Division** | Samma två tal, med uttryckligt giltighetsvillkor **`z₂≠0`**, motsvarande `r₂=3>0`. Givna `r₁,r₂,v₁,v₂` är separerade. Eleven ser `r=r₁/r₂=2/3`, `v=v₁−v₂=30°−60°=−30°` (eller 330°). Därefter `cos(−30°)=√3/2`, `sin(−30°)=−1/2`, `z₁/z₂=(2/3)(√3/2−i/2)=√3/3−i/3`. Alla bråk sätts i MathML och inga två oberoende ekvationer pressas ihop. Den frivilliga motiveringen utgår från `wz₂=z₁`, separerar `|w|r₂=r₁` och `arg(w)+v₂≡v₁` modulo 360°. Backning och reset fungerar. |
| **4. Interaktivt talplan** | Oberoende kontrollräkning av startvektorerna `2∠30°`, `3∠60°`, produktens skalade längd 6 och argument 90°, samt kvotens längd 2/3 och argument −30°. **Åtgärd:** efter första klicket visas bara skalningens `r` och oförändrade `v` i separata MathML-rader; efter andra klicket visas rotation och fullständigt slutresultat. Växling av operation, tillbaka och återställning döljer föregående facit. **Visuell brist hittad trots gröna tester:** divisionens korta pil och vinkeletiketter trängdes vid origo. Ett tydligt märkt **förstoringsfönster med annan skala** visas nu vid division, medan huvudfiguren behåller **identisk skala** mellan båda operationerna. Slutligen flyttades etiketterna för skalad vektor och produkten så att de inte ligger på en vektor eller Im-axeltexten. Matematiska vektorlängder och riktningar, SVG-bågar och faktiska etikettkollisioner kontrolleras automatiskt. |
| **5. Självständigt arbete** | `w₁=4(cos150°+isin150°)`, `w₂=2(cos30°+isin30°)`. **Produkt:** `r=4·2=8`, `v=150°+30°=180°`, alltså `w₁w₂=8(cos180°+isin180°)=−8`. **Kvot:** `r=4/2=2`, `v=150°−30°=120°`, alltså `w₁/w₂=2(cos120°+isin120°)=−1+√3i`. Facit utbyggt med separata givna värden, regler, explicita insättningar, exakta trigonometriska värden och kvadrantkontroll. Elevens uppgift och självständiga försök före facit bevarade. |
| **6. NOKflex** | Originalets moment **4.2 Multiplikation och division i polär form**, uppgifter **4217–4231**, och **minst tre av fem nivåer** bevarade ordagrant i funktion. Eleverna väljer nivå under arbetet, ingen digital förhandsinsamling. |
| **7. Individuell utcheckning** | För `z₁=3(cos20°+isin20°)` och `z₂=2(cos80°+isin80°)` fås `z₁z₂=6(cos100°+isin100°)` och `z₁/z₂=(3/2)(cos(−60°)+isin(−60°))`. Kvotens argument kan också skrivas 300°. Återkontroll genom multiplikation med `z₂`: `(3/2)·2=3`, `−60°+80°=20°`, vilket ger `z₁` tillbaka. Facit visar separat koefficientidentifiering, regel, insättning och slutsvar. **Begreppsfel i återkoppling rättat:** en multiplikation har en *andra faktor*, inte en *nämnare*. Målen och självbedömningsfrågan bevarade. |

### Oberoende matematik, didaktik, interaktivitet och bevarande

- Kontrollräkning genom separat implementerad komplex multiplikation och division av de rektangulära koordinaterna; produkt/kvot för huvudexempel, eget arbete och utcheckning jämförda med polär form inom flyttalstolerans. Nollnämnare ger uttryckligt fel. `z₂≠0` är ett giltighetsvillkor, inte ett valfritt specialfall.
- Ingen felaktig numerisk slutsats identifierades i de ursprungliga huvuduppgifterna. Kritiska kvalitetsbrister var **saknade distributiva mellanled**, alltför korta lösningar i elevfacit, för tidig exponering av mål, hoptryckta matematiska givna värden, överlappande SVG-etiketter och otydlig kvotpil nära origo. Ett begreppsfel (*nämnare* i en multiplikation) upptäcktes och rättades.
- **Förutsäg → försök → resonera → fullständig återkoppling → kontroll** är grundspåret. Fördjupad härledning ligger kvar bakom ett frivilligt klick. Allt ursprungligt innehåll som var relevant har bevarats: sju lektionsbilder, två elevstyrda huvudgenomgångar, lärarstöd, interaktivt talplan med två operationer, enskilt→par, pappersarbete, NOKflex **4217–4231**, nivåval och avslutande självbedömning. Inget Socrative har tillförts utan originalstöd.
- Alla fristående matematiska värden och givna tal använder egna semantiska MathML-block med minst 16 px faktiskt avstånd. De sju mobillägena och desktop med båda figurlägena har **visuellt inspekterats**, inklusive den extra förstoringen efter den första testkörningen.

### Kod, tester och publicering

**Kod:** [PR #14 – Ma4 07/41](https://github.com/jacobflinder/Lektioner/pull/14), sammanslagen i `main` via commit `eefd77722076fe1f746d2c115360242e169c6cbf`. Ändrade endast aktuell lektions HTML/JS, dess befintliga par-typografitest och den gemensamma Ma4-workflowen. Nytt riktat test `ma4/kapitel-4/qa/deep-review-ma4-07.cjs`.

**Verifiering:** [Riktad/fullständig Ma4 browser QA på arbetsgrenen](https://github.com/jacobflinder/Lektioner/actions/runs/43487225696) **success**; [Ma4 browser QA efter sammanslagning på `main`](https://github.com/jacobflinder/Lektioner/actions/runs/43487922727) **success**; [GitHub Pages byggning och driftsättning](https://github.com/jacobflinder/Lektioner/actions/runs/43487921523) **success**. [Skärmbildsartefakt från arbetsgrenens godkända körning](https://github.com/jacobflinder/Lektioner/actions/runs/43487225696/artifacts/14067419106).

**Testinnehåll:** alla 7/7 bilder och sju 390px-mobilskärmbilder; dolda facit och mål; varje klick i produkt- och kvotsekvenserna; frivillig härledning; MathML-bråk, trigonometriska värden och nollnämnarvillkor; två SVG-lägen med faktisk kontroll av radier och vinklar; förstoringsfönstrets stegvis dolda pilar; etikettkollisioner med vektorer och axeltexter; navigation, tillbaka, återställning, lärarstöd, klassrumsläge och frånvaro av JS-/resursfel. Äldre par-04-testet bevarat och anpassat, inte avstängt.

**Verifieringsgräns:** Actions verifierar den sammanslagna koden och Pages bekräftar lyckad driftsättning. En separat direkt HTTP-avläsning av den publika Pages-sidans innehåll har inte utförts, vilket inte förväxlas med godkänd deployment.


## Bild-för-bild-rapport · 08/41 · de Moivres formel

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2, **4.3 Potenser och komplexa tal**.  
**GitHub-sökväg:** `ma4/kapitel-4/de-moivre/`.  
**Publicerad URL:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/de-moivre/  
**Granskade:** **10 av 10 bilder**, varav bild 9 är frivillig. Alla förhandsdolda facit, fyra teoristeg, femstegsmodell, tre radiansteg, två felanalysdelar, navigering, elevförsök och dynamisk talplansgeometri är granskade. Alla **nio val** (r=1, √2, 1/2 kombinerade med n=2,3,4) är oberoende beräknade och webbläsartestade. Skärmbilder av alla tio mobillägen och förstoringens geometri är visuellt kontrollerade.

| Bild | Oberoende kontroll, brist och genomförd åtgärd |
|---|---|
| **1. Start: potenser på enhetscirkeln** | För `z=cos(π/4)+i sin(π/4)` är `r=1`, `v=π/4`. Upprepad multiplikation ger `z²=i`, `z³=cos(3π/4)+i sin(3π/4)`, `z⁴=−1` och absolutbelopp 1 i alla fallen. Facit visar nu längden och vinkeln för **varje** nytt multiplikationssteg och exakta cosinus-/sinusvärden när slutsvaret förenklas. **Målen syntes för tidigt**; de är nu dolda tills eleven fått försöka och jämföra. Enskilt→par och skissuppgift bevarade. |
| **2. Interaktiv geometri** | Alla **9 r/n-kombinationer** har kontrollräknats som upprepad komplex multiplikation, jämförts med exakta koordinater och testats med verklig SVG-geometri. Vid `r=√2,n=3` fås `−2+2i`, vid `r=1/2,n=3` fås `−√2/16+(√2/16)i`; vid `r=1/2,n=4` fås `−1/16`. Före klick är svar dolt; klick 1 ger endast radien `rⁿ`; klick 2 ger argument `nv`, polär insättning och exakt rektangulärt svar i **separata MathML-rader**. **Viktigt fel vid visuell kontroll:** råformen `1/16(cos180°+isin180°)` satte nämnaren över hela parentesprodukten i MathML. Rättat med **parentes kring bråkfaktorn**, t.ex. `(1/16)(cos180°+isin180°)`, och en särskild regression som mäter att nämnaren är **enbart 16**. Huvudfiguren har samma axelskala i alla val; vid mycket små potenser visas en explicit märkt förstoringsfigur, vars skala anpassas så radien syns tydligt även vid `r⁴=1/16`. Förstoringens annan skala förklaras. Back, reset och byte av radie/exponent återställer och döljer tidigare facit. |
| **3. Härledning och villkor** | **Didaktisk kärnkorrigering:** de långa raderna för två och tre faktorer var oläsliga på mobil. Nu härleds `z²=z·z`, separat `|z²|=r·r=r²` och `v₂=v+v=2v`; motsvarande för `z³=z²·z`: `|z³|=r²·r=r³`, `v₃=2v+v=3v`. Därmed motiveras `zⁿ=rⁿ(cos(nv)+i sin(nv))` genom upprepad multiplikation, inte bara en minnesregel. Trigonometriska argument skrivs med **parenteser** så `cos(v)` och `sin(v)` inte ser ut som sammanskrivna variabler. Specialfallen `z⁰=1` för `z≠0`, `z⁻¹=(cos v−i sin v)/r` för `r>0`, `0ⁿ=0` för positiva heltal n och att `0⁰` inte är definierat i detta sammanhang visas tydligt. Det matematiska bråkstrecket i inversen är bevarat och testat. |
| **4. Genomarbetat exempel** | För `z=−√3+i` fås `a=−√3`, `b=1`, `r=√(3+1)=2`, `tan α=|b|/|a|=1/√3`, `α=30°`, alltså `v=180°−30°=150°`. De Moivre ger `r⁵=2⁵=32` och `5v=750°`. Efter `750°−2·360°=30°` och explicit insättning av `cos30°=√3/2`, `sin30°=1/2` fås **`z⁵=16√3+16i`**. Identifiering, insättning, kvadrantbeslut, förenkling av koefficienterna och rimlighetskontroll är nu tydligt separerade. Femstegssekvensen och elevens prognoser finns kvar. |
| **5. Självständigt försök** | För `(−√3+i)⁴` används `r=2`, `v=150°`. `r⁴=16`, `4v=600°` motsvarar 240°. `cos240°=−1/2` och `sin240°=−√3/2`, vilket ger **`−8−8√3i`**. Facit visar alla nödvändiga steg och kontrollen att talet ligger i tredje kvadranten med absolutbelopp 16. Elevens självständiga arbete och dolt facit bevarade. |
| **6. Radianexempel** | `w=(3(cos(5π/6)+i sin(5π/6)))⁴` ger separat `r=3`, `v=5π/6`, `r⁴=81`, `4v=20π/6=10π/3`; ett helt varv `2π=6π/3` ger argumentet `4π/3`. Exakta värden i tredje kvadranten `cos(4π/3)=−1/2` och `sin(4π/3)=−√3/2` ger **`w=−81/2−(81√3/2)i`**. Tidigare sammanskrivna självständiga ekvationer är åtskilda; progressionen i tre klick bevarad. |
| **7. Konstruerad missuppfattning** | För `z=2(cos20°+i sin20°)` är `z³=8(cos60°+i sin60°)`; **2³=8, inte 2·3=6**. Själva falska påståendet visas nu separat och som ett matematiskt uttryck utan svensk löptext inne i MathML. För `w=(1/2)(cos(π/2)+i sin(π/2))` fås `|w³|=1/8`, `arg(w³)=3π/2` och `w³=−i/8`. Alla potens-, vinkel- och trigonometriska mellanled redovisas efter elevens försök. |
| **8. NOKflex** | Originalets moment **4.3 Potenser och komplexa tal – de Moivres formel**, uppgifter **4301–4314**, **minst tre av fem nivåer** och den sammanhängande arbetsfasen på cirka 20 minuter är bevarade. Ingen digital insamling av elevsvar infördes. |
| **9. Frivillig fördjupning** | De två påståendena om dubbelvinkelformlerna bevarade. Fyrledsutvecklingen av `(cos v+i sin v)²` redovisas nu som fyra **separata produkter**, därefter `i²=−1`, insamling av real-/imaginärdel och jämförelse med de Moivres formel. Korrekt är `cos(2v)=cos²v−sin²v` och `sin(2v)=2sin v cos v`; påstående A var falskt. Särskilt facit för fördjupningen och möjligheten att hoppa förbi bilden finns kvar. |
| **10. Individuell utcheckning** | Ursprungligt tal och uppgiften att beräkna sjätte potensen visas som **separata matematikrader**, utan att blanda elevuppgift och svar. `r⁶=2⁶=64`, `6·(π/4)=3π/2`, `cos(3π/2)=0`, `sin(3π/2)=−1`, alltså **`z⁶=−64i`**. Kontroll mot negativa imaginära axeln och absolutbelopp 64. Målen återkopplas på avslutningsbilden. |

### Matematisk/didaktisk slutkontroll och bevarade delar

- **Oberoende beräkningar:** samtliga nio grafval kontrollerade med upprepad multiplikation i kartesiska koordinater, uppgifter `(−√3+i)⁵`, `(−√3+i)⁴`, `(3cis(5π/6))⁴`, båda felanalysfallen och utcheckningen `(2cis(π/4))⁶`. Exponent- och nollvillkor granskade separat.
- **Ett verkligt fel i den synliga matematiken rättades:** en omarkerad bråkfaktor kunde bli en bråkform med **fel nämnare** i det dynamiska MathML-uttrycket. Exakta numeriska slutsvar i grundmaterialet var i övrigt korrekta, men flera mellanled var otillräckliga och några rader blev avklippta på mobil. Dessa är korrigerade, med automattest för verklig bredd, matematisk tolkning och avstånd.
- **Metodiken** följer förutsäg→försök→resonera→fullständig återkoppling→kontroll med stegvis stöd som minskar inför självständigt arbete. Inga extra klick har tillförts enbart för aktivitetens skull.
- **Avsiktligt bevarat:** alla tio bilder, valfri dubbelvinkelfördjupning, alla nio interaktiva val, korta elevprognoser, lärarstöd, klassrumsläge, pappersräkning, originaluppgifterna och NOKflex 4301–4314. Ingen Socrative-aktivitet har lagts till utan stöd i originalet.

### Kodändring, automatiska tester och publicering

**Kod:** [PR #15 – Ma4 08/41, de Moivres formel](https://github.com/jacobflinder/Lektioner/pull/15), sammanslagen i `main` via commit `a843398a994d46235bec4944be22fb3142f843c8`. Ändringar: den aktuella lektions-HTML-filen och facit-JavaScriptet, `qa/deep-review-ma4-08.cjs` samt Ma4-workflowen. Inga orelaterade lektionsfiler har ändrats.

**Riktat Chromiumtest:** `node ma4/kapitel-4/qa/deep-review-ma4-08.cjs` ingår i `.github/workflows/ma4-browser-qa.yml`. Kontroll av **10/10 bilder**, nio val med egna exakt omräknade komplexa potenser, det faktiska SVG-resultatets koordinater/radie i original- och förstoringsfiguren, första respektive andra klickets synlighet, back/reset, alla dolda facit, Matematik i MathML, verkligt bråkstreck och **bråkets nämnare**, 16 px luft mellan självständiga ekvationer, samtliga mobila bilder vid 390px samt en blockerande slutassertion som upptäcker varenda intern sidscroll. De befintliga Ma4-kontrollerna har bevarats och passerats.

**Godkända körningar:** [Arbetsgrenens fullständiga Chromium- och Ma4-kontroll](https://github.com/jacobflinder/Lektioner/actions/runs/43496498309) – **success**, [browser QA på sammanslagen `main`](https://github.com/jacobflinder/Lektioner/actions/runs/43497337638) – **success**, [GitHub Pages-byggning och driftsättning](https://github.com/jacobflinder/Lektioner/actions/runs/43497337077) – **success**. [Skärmbildsartefakt från arbetsgrenen](https://github.com/jacobflinder/Lektioner/actions/runs/43496498309/artifacts/14072466143), med all tio mobilbilder och var och en av de nio dynamiska varianterna. Skärmbilderna är granskade visuellt i efterhand.

**Verifieringsgräns:** lyckad driftsättning och tester av sammanslagen kod är direkt verifierade via GitHub Actions. Externt webbverktyg kunde inte läsa den publicerade Pages-sidans HTML direkt; sådan separat HTTP-kontroll påstås därför inte vara gjord.

### Eftergranskning av mobiltypografi · sista korrigering till 08/41

Den avslutade ämnes- och mobilgranskningen upptäckte efter PR #15 ännu en typografisk brist på bild **2, 3, 4 och 9**. Uttryck som `cos v` och `sin v` klistrades visuellt ihop i MathML, särskilt i den frivilliga fyrledsutvecklingen av dubbelvinkelformlerna. **Faktiska kodändringar:** `cos(v)`, `sin(v)` och parenteser även kring numeriska argument används nu konsekvent i de tio bilderna, de dolda faciten och den dynamiska potensen. Ingen uppgift eller elevaktivitet togs bort. Mobilbildens inre sidomarginaler justerades marginellt för att låta de mer läsbara parenteserna få plats utan minskad matematiktext. En separat visuell granskning av slutbilderna **2, 3, 4 och 9** visar fullständiga beräkningar och en läsbar härledning utan interna avklipp.

- **Kodändring:** [PR #16 – slutlig trigonometrisk notation](https://github.com/jacobflinder/Lektioner/pull/16), sammanslagen i `main` via `555d22c99acfb79f3c20f751d4d8fcba433d7939`.
- **Tester:** [fullständig Ma4-browser QA på arbetsgrenen](https://github.com/jacobflinder/Lektioner/actions/runs/43498843706) – **success**; [samma fullständiga testsvit på sammanslagen `main`](https://github.com/jacobflinder/Lektioner/actions/runs/43499677465) – **success**.
- **Publicering:** [GitHub Pages bygge och driftsättning av den slutliga koden](https://github.com/jacobflinder/Lektioner/actions/runs/43499676586) – **success**.
- **Skärmbildsbevis:** [Chromium-artifact från sista godkända arbetsgrenen](https://github.com/jacobflinder/Lektioner/actions/runs/43498843706/artifacts/14073447110).
- **Granskningsstatus:** fortfarande **8/41 färdiga och 33 kvar**. Nästa ofärdiga lektion är oförändrat **9/41 – Ekvationen zⁿ = a**.

## Bild-för-bild-rapport · 09/41 · Ekvationen zⁿ = a

**Kurs:** Matematik 4 / Matematik – fortsättning nivå 2, moment **4.3 Potenser och komplexa tal – Ekvationen zⁿ = a**.  
**GitHub-sökväg:** `ma4/kapitel-4/ekvationen-zn-a/`.  
**Publicerad lektion:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/ekvationen-zn-a/  
**Omfattning:** **10/10 bilder**, inklusive frivillig fördjupning. Dolda facit, stegsekvenser, k=3-beslut med felalternativ, separat rotgeometri, återställning, navigering, lärarstöd, klassrumsläge och tio mobila skärmbilder kontrollerade. Alla matematiska slutsvar har räknats oberoende.

| Bild | Brister, ämneskontroll och genomförda förändringar |
|---|---|
| **1. Startfråga och mål** | `x³=8` ger enda reella lösningen `x=∛8=2`. Detta kontrasteras med `z³=8i`, som inte kan ha någon reell lösning eftersom en reell kub är reell. **Brist:** lärandemålen avslöjades redan före elevens försök. Målen visas nu efter startuppgiften; facit förklarar varför komplexa lösningar krävs utan att ge antalet rötter i förväg. Enskilt 2 min → par 2 min bevarat. |
| **2. Aktivera de Moivre** | `z=r(cos(v)+isin(v))` ger `z³=r³(cos(3v)+isin(3v))`. Egen förutsägelse föregår dolt facit. Exakta trigonometriska funktionsargument har parenteser; `r≥0`, `r³`, `3v` och argument modulo `2π` förklaras i separata återkopplingsled. |
| **3. Två villkor** | `z³=8i` och `8i=8(cos(π/2)+isin(π/2))` jämförs med de Moivre. **Allvarlig didaktisk lucka:** tidigare visades `r³=8⇒r=2` utan separata steg, och `v=(π/2+2πk)/3` utan att förtydliga att hela högerledet divideras. Nu visas `r³=8`, `r=∛8=2`; `3v=π/2+2πk`, `k∈ℤ`, `v=(π/2+2πk)/3=(π/2)/3+(2πk)/3=π/6+(2πk)/3`. Eleverna får först motivera varför **hela varv måste läggas till före division**. Samtliga tre klicksteg, tillbaka och reset fungerar. |
| **4. Beräkna argumenten själv** | Varje k-värde och insättning är separerade från slutsvaret: `k=0` ger `π/6=30°`; `k=1`: `π/6+2π/3=π/6+4π/6=5π/6=150°`; `k=2`: `π/6+4π/3=π/6+8π/6=9π/6=3π/2=270°`. Tidigare komplicerade matematiska led var hoptryckta. Tre självstyrda förutsäg→återkoppling-steg och kvadrantkontroll bevarade. |
| **5. Interaktiv rotgeometri** | **Kritiskt upptäckt fel:** redan innan första klicket avslöjade sidan vinkeln 30°, och efter ett klick visades **nästa** rotvinkel i stället för den senast uppvisade. Det motverkade elevens förutsägelse. Numera är vinkeln helt dold vid start och visar först efter respektive klick **senast visade rot**: 30°, 150°, 270°. Figuren ritad med samma x-/y-skala; SVG-vektorernas ändkoordinater har oberoende verifierats för `√3+i`, `−√3+i`, `−2i`. Vid `k=3` får eleven först räkna `13π/6=390°`. Felalternativ ger specifik feedback men **låser inte upp nästa steg**; rätt motiverad kontroll visar att 390°=30°+360° och första roten upprepas. Byte av svar, tillbaka och återställning verifierade. Den fysiska skissa→diskutera-aktiviteten och alla rotpilar bevarade. |
| **6. Exakta rektangulära rötter** | **Brist:** originalet förenklade `2(√3/2+i/2)` direkt till slutsvar och tryckte samman alla tre rotuttryck i samma matematikrad. Nu visas för **varje rot** `r`, `v_j`, båda trigonometriska värdena, allmän polär form, explicit insättning, förenkling och separat slutsvar: `z₁=√3+i`, `z₂=−√3+i`, `z₃=−2i`. Kontroll: `r³=8`; `3v₁=π/2`, `3v₂=5π/2`, `3v₃=9π/2` – samma riktning `8i`. Motivering av exakt tre rötter: `k=0,1,2` ger olika riktningar, `k=3` upprepar den första. Den generella regeln för `a≠0` redovisar `rⁿ=R`, `nv=θ+2πk`, `v=(θ+2πk)/n` för `k=0,…,n−1`, med `a=0⇒z=0` som separat specialfall. |
| **7. Självständigt försök** | För `z²=−4`: `−4=4(cos π+isin π)`, `r²=4⇒r=2`, `2v=π+2πk`, `v=π/2+πk`, därför `z₁=2i`, `z₂=−2i`. Oberoende kontroll `(±2i)²=−4`; när k ökar med 2 upprepas riktningen. Ursprunglig egen papperstid och flerval med specifika rätt/fel-förklaringar bevarade. Facit har fått fullständig koefficientidentifiering, explicit division och kontroll. Resultaten är två egna MathML-ekvationer. |
| **8. NOKflex** | Originalmomentet **4.3 Potenser och komplexa tal – Ekvationen zⁿ = a**, uppgifter **4315–4328** samt **minst tre av fem nivåer** är bevarade. Ingen ny digital insamling, inget Socrative som saknades i originalet. Arbetsgång: polär form → längd → argument → rötter → kontroll. |
| **9. Frivillig fördjupning** | `z⁴=16`: `r⁴=16⇒r=2`, `4v=2πk`, `v=πk/2`. De fyra olika rötterna `2`, `2i`, `−2`, `−2i` redovisas i **fyra separata facitrader**, med `k=0,1,2,3`, vinklar, `2π/4=π/2=90°` och kontroll genom fjärde potens. Bilden är fortsatt frivillig och kan hoppas över i ordinarie navigering. |
| **10. Individuell utcheckning** | `z³=−8`: `−8=8(cos π+isin π)`, `r³=8⇒r=2`, `3v=π+2πk` och `v=π/3+(2πk)/3`. Insättning av k=0,1,2 ger argumenten `π/3`, `π`, `5π/3`. Alla cosinus-/sinusvärden och multiplikationer redovisas före tre **separata** slutsvar: `z₁=1+√3i`, `z₂=−2`, `z₃=1−√3i`. Vinklarna kuberade blir `π,3π,5π` och r³=8, så alla ger −8. Målen och självbedömningen återkopplas på avslutningen. |

### Oberoende matematisk kontroll, didaktik och bevarade delar

- **Oberoende kontrollräkning:** `(√3+i)³=(-√3+i)³=(-2i)³=8i` (likheten avser tre separata beräkningar); `(2i)²=(-2i)²=-4`; `(±2)⁴=(±2i)⁴=16`; `(1+√3i)³=(-2)³=(1−√3i)³=-8`. Samtliga verifierade med separat komplex multiplikation, inte med tidigare facit.
- Ursprungliga **numeriska slutsvar var korrekta**. Kritiska fel för förståelsen var att nästa rotvinkel avslöjades i förväg, att ett felaktigt k=3-val kunde låsa upp kontrollsteget, att insättningarna i argumentvillkoret inte visade alla algebraiska led och att självständiga rotuttryck låg ihoptryckta utan tydlig visuell åtskillnad.
- **Metod:** förutsäg → försök själv på papper → resonera i par → visa exakt ett nytt steg → kontrollera längd och argument → gå vidare. Förklaringar till vanliga fel ges utan att lägga till klick bara för interaktivitetens skull. Fungerande figurer och samtliga **10 bilder**, tre modelleringar, fysiska skisser och diskussioner, lärarstöd, frivillig fördjupning, NOKflex **4315–4328** och nivåval bevarade.

### Kod, automatiska tester, publicering och verifieringsgräns

**Koden:** [PR #17 – Ma4 09/41](https://github.com/jacobflinder/Lektioner/pull/17), sammanslagen i `main` via commit `a309d4feb4dd79f40f40301c4567539b2ad96028`. Ändrade enbart aktuell lektions HTML/JavaScript, den tillhörande befintliga par-05-kontrollen, den nya riktade QA-kontrollen och Ma4-workflowens testlista.

**Riktad testfil:** `ma4/kapitel-4/qa/deep-review-ma4-09.cjs`. Har körts med ordinarie Ma4-svit och verifierar **10/10 bilder**, alla dolt visade facit, tre formler för rötter, beräkningsled, fyra sjätte-/fjärde-/kub- och kvadratfallen, SVG-pilarnas faktiska slutkoordinater, k=3-beslutets rätt- och felrespons, att fel svar **inte** låser upp framtida svar, byte av val, tillbaka, reset, målstyrd utcheckning, matematik i MathML, **≥16 px verkligt mellanrum mellan självständiga matematiska uttryck**, klassrumsläge, lärarstöd och **tio mobila 390px-skärmbilder** utan intern matematikscroll. Den tidigare `math-typography-pair-05.cjs` har anpassats till fördröjt avslöjande av rotvinkel; befintliga ämneskontroller har inte stängts av.

**Faktisk status:** [Arbetsgrenens fullständiga browser QA](https://github.com/jacobflinder/Lektioner/actions/runs/43502401538) – **success**; [browser QA efter merge på `main`](https://github.com/jacobflinder/Lektioner/actions/runs/43503281134) – **success**; [GitHub Pages byggning och driftsättning](https://github.com/jacobflinder/Lektioner/actions/runs/43503280652) – **success**. [Skärmbildsartefakt från den godkända arbetsgrenen](https://github.com/jacobflinder/Lektioner/actions/runs/43502401538/artifacts/14075800017). Mobila skärmbilder för bland annat argumentberäkning, figur, rektangulära rötter och utcheckning är dessutom **visuellt öppnade och granskade**.

**Verifieringsgräns:** Publicerad HTML verifierad i GitHubs sammanslagna huvudgren och Pages-deployment är godkänd. En separat direkt HTTP-kontroll av den publika GitHub Pages-adressen kunde inte genomföras genom webbverktyget och påstås inte vara gjord.

## Bild-för-bild-rapport · 10/41 · Eulers formel

**Kurs:** Matematik 4 / Matematik – fortsättning, nivå 2 · 4.3 Potenser och komplexa tal.  
**Sökväg:** `ma4/kapitel-4/eulers-formel/`.  
**Publicerad adress:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/eulers-formel/  
**Omfattning:** samtliga **15 av 15 bilder** (10 ordinarie, fem valfria/stödbilder: kvadrantdiagnos, notation, felanalys, komplex exponentialfördjupning och potensserier), alla tre dolda utcheckningsfacit, quiz, stegvisa lösningar, navigering, talplan, återställning, klassrumsläge, projektor, 390 px mobil och fyra skilda potensseriesteg. Alla lösningar kontrollerades oberoende av lektionens facit.

| Bild | Oberoende ämnes- och kognitionsgranskning samt genomförd åtgärd |
|---|---|
| **1 · Start och mål** | Målen avgränsar sambandet polär–exponentialform, omvandling av negativa argument och multiplikation/Eulers identitet. Ingen matematisk förhandslösning; arbetssättet förutsäg → försök → parmotivering → kontroll finns kvar. 10 ordinarie bilder (15 med frivilliga), inte ett felaktigt ”1/11”-förhandsvärde. |
| **2 · Polär form** | \(z=r(\cos(v)+i\sin(v))\), \(r=|z|\), \(v\) argument. Realdel \(r\cos(v)\) och imaginärdel \(r\sin(v)\) kontrollerade. Förklaring dold tills eleverna resonerat. |
| **3 · Frivillig kvadrantdiagnos** | \(120^\circ=2\pi/3\) i andra kvadranten; \(\cos120^\circ=-1/2<0\), \(\sin120^\circ=\sqrt3/2>0\). Tre val med återkoppling och först valt svar. Inget nytt obligatoriskt moment. |
| **4 · Enhetscirkeln** | Dynamisk enhetscirkel för \(v=120^\circ\), \(90^\circ\), \(180^\circ\), \(-90^\circ\): \(x=\cos v\), \(y=\sin v\), \(r=1\); SVG-linjer, punkter och återställning kontrollerade. Eleven förutsäger före visning. |
| **5 · Frivilligt skrivformsmotiv** | \(z_1=2(\cos(\pi/6)+i\sin(\pi/6))\), \(z_2=3(\cos(\pi/3)+i\sin(\pi/3))\). **Rättat utelämnade nämnarled**: \(r=2\cdot3=6\), \(v=\pi/6+\pi/3=\pi/6+2\pi/6=3\pi/6=\pi/2\). Slutpunkt \(6i\). Exponentiallagarna presenteras som motiv, uttryckligen inte som bevis. |
| **6 · Eulers formel** | \(e^{iv}=\cos(v)+i\sin(v)\), \(z=r e^{iv}\) för \(r>0\), argument \(v\) i **radianer**, argument modulo \(2\pi\). För \(z=0\) finns inte något bestämt argument. Fristående trigonometriska argument med parenteser; begreppsquiz och dold förklaring bevarade. |
| **7 · Multiplikation** | **Betydande komplettering:** tidigare sammanfogades givna \(z_1,z_2\) i ett enda MathML-element. De ligger nu i skilda block med minst 16 px avstånd. Lösningen visar \(r_1,r_2,v_1,v_2\), \(2\cdot3=6\), hela bråkförlängningen för vinkeln, \((2e^{i\pi/6})(3e^{i\pi/3})\), separat exponentiallag, \(6e^{i\pi/2}=6(\cos(\pi/2)+i\sin(\pi/2))=6i\) och korrekt heltalspotensregel för \(r>0\). Facit dolt före elevens eget försök. |
| **8 · Omvandling till rektangulär form** | \(2e^{i\pi/3}=2(\cos(\pi/3)+i\sin(\pi/3))\), \(\cos(\pi/3)=1/2\), \(\sin(\pi/3)=\sqrt3/2\). **Fyra** kontrollerbara elevstyrda steg: identifiera belopp/argument, sätt in Eulers formel, multiplicera in \(2\) inklusive \((2/2)+i(2\sqrt3/2)\), sedan separat belopps- och kvadrantkontroll: \(|1+i\sqrt3|=\sqrt{1+3}=2\). Backa och börja om testade. |
| **9 · Negativt argument** | \(3e^{-i\pi/2}=3(0-i)=-3i\) med synlig Eulers insättning, två exakta trigvärden, tecken och slutled. **Ämnesdidaktiskt fel rättat:** \(-3\) har också beloppet \(3\); det utesluts **på grund av fel riktning**, inte på grund av beloppet. Quiz, enhetscirkel, försök före återkoppling bevarade. |
| **10 · Eulers identitet** | \(e^{i\pi}=\cos(\pi)+i\sin(\pi)=-1+i\cdot0=-1\), alltså \(e^{i\pi}+1=0\). Första steget visas efter förutsägelse; knappen med den färdiga identiteten låses tills första steget öppnats. Mellanled och Eulers slutsats separat uppställda. |
| **11 · Eget NOKflex-arbete** | **Bevarat oförändrat:** NOKflex → 4.3 → Eulers formel, **uppgifter 4329–4338**, välj minst tre av fem nivåer, rätta själv, diskutera med kamrat. Frivilliga spår hoppar huvudvägen över; inga påhittade Socrative-moment. |
| **12 · Frivillig felanalys** | Konstruerat fel \(e^{-i\pi}=1\) rättas med negativt halvvarv, \(\cos(-\pi)=-1\), \(\sin(-\pi)=0\), alltså \(e^{-i\pi}=-1\). Ingen påstådd elevavsikt. Försök före dold återkoppling. |
| **13 · Frivillig komplex exponent** | \(e^{2-3i}=e^2e^{-3i}=e^2(\cos(-3)+i\sin(-3))=e^2\cos3-i e^2\sin3\). Realdel \(e^2\cos3<0\), imaginärdel \(-e^2\sin3<0\), belopp \(e^2\), argument \(-3\) rad. Exponentiallagar och symmetri visas separat; tidigare fristående real- och imaginärdelar bevarade. |
| **14 · Frivillig potensseriehärledning** | Potensserierna för \(e^x,\cos(v),\sin(v)\) och \(e^{iv}\) oberoende granskade. Tydliga **parenteser kring \((iv)^2,(iv)^3,\dots\)**, sex separata MathML-uttryck för \(i^0,\dots,i^5\), korrekt växling mellan jämna reella och udda imaginära termer, reella och imaginära färgkoder. Fyra steg, återställning, frivillighetsmarkering och uttryckligt konvergensförbehåll bevarade. Äldre test anpassat till förbättrad typografi utan att avaktiveras. |
| **15 · Utcheckning och mål** | **Tre tidigare komprimerade facit utökade till fullständiga steg och dolda från början.** (1) \(2e^{-i\pi/2}=-2i\): \(r,v\), insättning, trigvärden, produkt och riktning. (2) \((2e^{i\pi/3})(3e^{-i\pi/3})=6e^0=6\): identifiera storheter, multiplicera, addera motstående vinklar, exponentiallag, slutsvar. (3) \(e^{i\pi}+1=0\): Eulers formel, cosinus/sinus, substitution, addition av 1. Tre återkopplade mål och självbedömning bevarade. |

### Oberoende kontrollräkningar, giltighetsvillkor och bevarat innehåll

1. \(2e^{i\pi/6}=\sqrt3+i\) och \(3e^{i\pi/3}=3/2+(3\sqrt3/2)i\). Rektangulärt:
   \((\sqrt3+i)(3/2+(3\sqrt3/2)i)=(3\sqrt3/2-3\sqrt3/2)+(9/2+3/2)i=6i\).
2. \(2e^{i\pi/3}=2(1/2+i\sqrt3/2)=1+i\sqrt3\), med \(|z|=\sqrt{1^2+(\sqrt3)^2}=2\).
3. \(\cos(-\pi/2)=0\), \(\sin(-\pi/2)=-1\), följaktligen \(3e^{-i\pi/2}=-3i\) och \(2e^{-i\pi/2}=-2i\).
4. \(\cos(\pi)=\cos(-\pi)=-1\) och \(\sin(\pi)=\sin(-\pi)=0\), så \(e^{i\pi}+1=0\), \(e^{-i\pi}=-1\).
5. \((2e^{i\pi/3})(3e^{-i\pi/3})=6e^{i(\pi/3-\pi/3)}=6e^0=6\).
6. \(e^{2-3i}=e^2\cos3-i e^2\sin3\); båda delarna negativa därför att \(\cos3<0,\sin3>0\). Beloppet är \(e^2\), inte \(2\).
7. Potensserier: \((iv)^{2k}=(-1)^kv^{2k}\), \((iv)^{2k+1}=i(-1)^kv^{2k+1}\). Detta ger \(\cos(v)+i\sin(v)\) genom gruppering där konvergens och termvis omgruppering är giltiga. För \(r=0\) saknas argument; negativa heltalspotenser kräver \(r\neq0\).

**Bevarat:** alla 15 bilder, ursprunglig kärnväg och valfria spår, NOKflex och uppgifterna 4329–4338, quiz med svarsalternativ och återkoppling, lärarstöd och klassrumsläge, interaktiv enhetscirkel med återställning, negativ vinkel-visualisering, felförklaring, transferuppgift, potensserier, lärandemål, utcheckning och lokalt arbete utan elevdata. Inga nya Socrative-inslag eller kopierade läroboksexempel.

### Ändringar, riktade tester, skärmbilder och verifierad publicering

- **Kod och PR:** [PR #18 – djupgranskning och test](https://github.com/jacobflinder/Lektioner/pull/18), sammanslagen till `main` som [commit 11454e1ae4ba3f45c5abd279b10eb8f1bc666747](https://github.com/jacobflinder/Lektioner/commit/11454e1ae4ba3f45c5abd279b10eb8f1bc666747). Påverkat: `ma4/kapitel-4/eulers-formel/index.html`, `math-polish.js`, nytt `ma4/kapitel-4/qa/deep-review-ma4-10.cjs`, uppdaterat tidigare `math-typography-pair-05.cjs` samt workflowfil.
- **Riktat Chromiumtest:** `node ma4/kapitel-4/qa/deep-review-ma4-10.cjs`, ingår i full `ma4-browser-qa.yml`. Testet verifierar 15/15 bilder, samtliga dolda lösningar, quiz, klassrum/projektor, aktiv navigation och reset, radianer/MathML, minst 16 px mellan fristående givna uttryck, 390 px mobil utan övergripande sidscroll samt alla fyra seriesteg. **15 desktopskärmbilder, 15 mobilskärmbilder, fyra serielägen och projektor skärmbild** har framställts och visuellt granskats.
- **Arbetsgren Chromium + Ma4-regression:** [run 43513783226 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43513783226), [skärmbildsartefakt](https://github.com/jacobflinder/Lektioner/actions/runs/43513783226/artifacts/14079702231).
- **`main` efter merge, full Ma4-regression:** [run 43514310798 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43514310798).
- **GitHub Pages för den sammanslagna lektionskoden:** [run 43514310596 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43514310596). En ytterligare Pages-körning kan uppstå genom denna granskningsloggs uppdatering och ska då kontrolleras separat.
- **Ärligt verifieringsläge:** Godkänd Chromium-rendering mot arbetsgren/`main` och godkänd GitHub Pages-deployment verifierade. Separat direkt HTTP-avläsning av exakt den offentliga Pages-adressen misslyckades med cache miss och har **inte** påståtts genomförd. Inga kända blockerande ämnes-, interaktions- eller testfel kvarstår.

## Bild-för-bild-rapport · Lektion 11/41 · Andragradsekvationer

**Kurs/moment:** Matematik 4, 4.4 Polynomekvationer – Andragradsekvationer med komplexa tal.  
**GitHub-sökväg:** `ma4/kapitel-4/andragradsekvationer/`  
**Webb:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/andragradsekvationer/  
**Omfattning:** **14/14 bilder** inklusive tre frivilliga (alternativ metod, felanalys, bygg en ekvation), alla dolda lösningar och metodsteg, quiz, tre digitala komplexa rotkontroller, lärarstöd/klassrumsläge, förutsägelsestyrt SVG-talplan, NOKflex, 390px mobil och projektor. Genomräkningar nedan är gjorda oberoende av lektionsfacit.

| Bild | Ämnesmässig kontroll, didaktik, kognition och konkret korrigering |
|---|---|
| **1 · Start och mål** | Startfrågan ”Är komplexa rötter alltid konjugerade?” kommer **före** målvisning. Målen kan öppnas efter individuellt/parvis tänkande. Begrepp och mål är giltiga: alla rötter, metodval, motsatta rötter till \(z^2=w\neq0\) samt konjugatregeln vid reella koefficienter. |
| **2 · Återkalla** | \((2i)^2=4i^2=-4\), \((1-i)^2=1-2i+i^2=-2i\). Ekvationen \(z^2+4z+8=0\) får nu hela kedjan \(p=4,q=8\), **allmän pq-formel**, insättning \(-4/2\pm\sqrt{(4/2)^2-8}\), \(-2\pm\sqrt{-4}\), slutsvaren \(-2\pm2i\) och explicit insättningskontroll. Facit dolt före försök. |
| **3 · Komplexa koefficienter** | För \(z^2+2iz+8=0\) syns \(p=2i,q=8\), formeln \(-p/2\pm\sqrt{(p/2)^2-q}\), **full insättning av båda koefficienterna**, \((p/2)^2-q=-9\), \(z=-i\pm3i\), \(2i\) och \(-4i\), kontroll av båda. Kvadratkompletteringen ger begreppsstöd utan att avslöja facit i förtid. Egen variant \(z^2-4iz+5=0\) kontrolleras digitalt med rötterna \(5i,-i\), rimlig hint och facit efter försök. |
| **4 · Konjugerade eller motsatta** | För \(2i,-4i\) är de **varken konjugerade eller motsatta**; båda relationerna till \(2i\) skulle kräva \(-2i\). Geometriska speglingar och återkoppling på fel svar kontrollerade. |
| **5 · Förutsäg rötterna till \(z^2=8i\)** | Rätt villkor \(r^2=8\) och \(2v=\pi/2+2\pi k,\ k\in\mathbb Z\), inte \(r=8/2\). Separata matematikblock för de två villkoren samt \(k\)-domän, minst 16 px mellan oberoende uttryck. Stödtrappan bevarad. |
| **6 · Interaktivt talplan** | Första roten \(2+2i\), andra \(-2-2i\). Belopp \(2\sqrt2\), argument \(\pi/4\) respektive \(5\pi/4\); vid kvadrering fås \(8i\) i båda fallen. Utökad kontroll visar även att \((2-2i)^2=-8i\). Tre förutsägelser med öppna steg, bakåtknapp och reset testade; figuren visar punkter, inte en fiktiv rörelsebana. |
| **7 · Polär huvudmetod** | Hela kedjan \(r^2=8\Rightarrow r=\sqrt8=2\sqrt2\), \(2v=\pi/2+2\pi k\Rightarrow v=\pi/4+\pi k\), \(k=0,1\), exakta värden \(\cos(\pi/4)=\sin(\pi/4)=\sqrt2/2\), omvandling \(2+2i\) och \(-2-2i\), kvadreringskontroll. För \(z^2=-32i\): \(r=4\sqrt2,\ v=-\pi/4+\pi k\), rötterna \(4-4i,-4+4i\), båda kontrollerade. Full lösning låses tills digitalt försök (eller lärarens pappersförsök). |
| **8 · Frivillig rektangulär metod** | Kvadreringen utvecklas med **alla fyra produkter**: \((a+bi)^2=a^2+abi+abi+b^2i^2=(a^2-b^2)+2abi\), med \(a,b\) typograferade som faktorer, inte en variabel \(\text{abi}\). Från \(a^2-b^2=0,\ ab=4\) prövas \(b=a\) och \(b=-a\) explicit; \(b=-a\) förkastas eftersom \(-a^2=4\) saknar reell lösning. Rötterna blir \(\pm(2+2i)\). Egen uppgift \(z^2=-18i\) ger \(3-3i,-3+3i\), digital felåterkoppling och full teckenfallsprövning. |
| **9 · Välj metod** | Fyra oberoende kontroller: A \(z^2-9=0\Rightarrow z=\pm3\), B \(z^2+6z+13=0\Rightarrow z=-3\pm2i\) efter full pq-insättning och kontroll, C \(z^2=-2i\Rightarrow z=\pm(1-i)\), D \((z-1)^2=-4\Rightarrow z=1\pm2i\). Metodmotiveringen och pararbete bevarade. Oberoende ekvationer/rotfall får egna MathML-rader. |
| **10 · Frivillig felanalys** | Den konstruerade lösningen \(3-3i\) till \(z^2=-18i\) är **en** korrekt rot men inte fullständig. Kvadrering verifieras; \(-3+3i\) visas som andra rot med \((-z)^2=z^2\). Felet diskuteras utan att tillskriva eleven avsikter. |
| **11 · Begreppskontroll** | Quiz om reella polynomkoefficienter och dubbla relationen till \(2i,-2i\) kontrollerade. Varför högst två rötter: \(z^2=z_0^2\Rightarrow(z-z_0)(z+z_0)=0\Rightarrow z=\pm z_0\); när \(w=0\) sammanfaller de i dubbelroten \(z=0\). Motsatta rötter och konjugat förklaras som olika generella påståenden. |
| **12 · NOKflex** | **Bevarat:** NOKflex → 4.4 Polynomekvationer → Andragradsekvationer, **uppgifter 4401–4420**, minst tre av fem nivåer, välj/byt nivå, kontrollera genom insättning, jämför metod med kamrat. Ingen påhittad Socrative-aktivitet och inget bokexempel kopierat. |
| **13 · Frivilligt: bygg ekvationen** | För en rot \(2+3i\) och **reella koefficienter** måste den andra vara \(2-3i\); faktorerna \((z-(2+3i))(z-(2-3i))\) utvecklas genom \((z-2)^2+9\) till \(z^2-4z+13=0\), med summa \(4\) och produkt \(13\). Hela faktoriseringen visas efter elevförsök. |
| **14 · Individuell utcheckning** | A \(z^2-2iz+8=0\): \(p=-2i,q=8,D=-9\), \(z=i\pm3i\Rightarrow 4i,-2i\), båda kontrollerade. B \(z^2=18i\): \(r=3\sqrt2,\ v=\pi/4+\pi k\), \(k=0,1\), \(z=3+3i,-3-3i\) och båda kvadreringarna. C relationen motsatt kontra konjugat visas med \((3-3i)^2=-18i\), inte \(18i\). Tre facit från början dolda, målen återkopplas, självständigt skrivande på papper bevarat. |

### Oberoende kontrollräkningar och matematiska villkor

- \(z^2+4z+8=0\): \(D=(4/2)^2-8=-4\), så \(z=-2\pm2i\). En rot ger \((-2+2i)^2+4(-2+2i)+8=-8i-8+8i+8=0\).
- \(z^2+2iz+8=0\): \(D=i^2-8=-9\), så \(z=-i\pm3i=\{2i,-4i\}\). Kontroll \( (2i)^2+2i(2i)+8=0\) och \((-4i)^2+2i(-4i)+8=0\).
- \(z^2-4iz+5=0\): \(D=(-2i)^2-5=-9\), så \(z=2i\pm3i=\{5i,-i\}\); båda ger vänsterled \(0\).
- \(z^2=8i\): \((2+2i)^2=4+8i-4=8i\), medan konjugatets kvadrat \((2-2i)^2=-8i\); den andra korrekta roten är **motsatt**: \(-2-2i\).
- \(z^2=-32i\): \((4-4i)^2=16-32i-16=-32i\), andra roten \(-4+4i\). \(z^2=-18i\): \((3-3i)^2=-18i\), andra roten \(-3+3i\).
- Metodval B: \((-3+2i)^2+6(-3+2i)+13=(5-12i)+(-18+12i)+13=0\); den andra är konjugatet. Metodval D: \(z=1\pm2i\).
- Exit A: \((4i)^2-2i(4i)+8=-16+8+8=0\); \((-2i)^2-2i(-2i)+8=-4-4+8=0\). Exit B: \((3+3i)^2=9+18i-9=18i\). Konstruktionen: \((2+3i)(2-3i)=13\), rötternas summa \(4\).
- **Villkor:** För \(z^2=w\neq0\) finns två olika motsatta rötter; för \(w=0\) en dubbelrot. Konjugerade icke-reella rötter garanteras för polynom med **reella** koefficienter, inte för godtyckliga komplexa koefficienter. Argument behandlas modulo \(2\pi\); för kvadratrötter räcker två värden \(k=0,1\).

### Förändrat och bevarat

**Åtgärdat:** utelämnade pq-koefficientinsättningar och rottecken, steg mellan allmän regel och specifika svar, nödvändiga distributiva produkter, utelämnad prövning av båda teckenfallen, svag kontrollerbarhet hos de dolda faciten, för tidigt avslöjad lösning i valfritt kvadratkompletteringsstöd, felaktigt ihopskrivna uttryck, sammanfogade variabelnamn som borde vara produkter, radbrytning i lång svensk rubrik. Separata mobila MathML-kedjor ersätter alltför breda formler **utan att minska textstorlek eller ta bort desktopberäkningarna**.

**Bevarat:** alla 14 bilder; 11 ordinarie och tre frivilliga; polär huvudmetod; frivillig jämförelse med real- och imaginärdelar; förutsäg → försök → resonera → återkoppla; tre digitala komplexa rotkontroller med orsaksspecifik feedback; interaktiv SVG, bakåt/reset; quiz; lärarstöd; klassrumsläge; NOKflex 4401–4420; arbete på papper; tydligt avslut med mål. Ingen elevdata skickas till server av denna fristående lektion.

### Riktade tester, skärmbilder, PR och publicering

- [PR #19 – fullständig ämnes- och didaktikgranskning](https://github.com/jacobflinder/Lektioner/pull/19), sammanslagen kodcommit [`9bd96fac721e0ece351182e506ba1ef1fddf8719`](https://github.com/jacobflinder/Lektioner/commit/9bd96fac721e0ece351182e506ba1ef1fddf8719).
- [PR #20 – läsbara matematikled på 390 px mobil](https://github.com/jacobflinder/Lektioner/pull/20), sammanslagen kodcommit [`694e7c70672968fc34042cf17ba8b3b463779b03`](https://github.com/jacobflinder/Lektioner/commit/694e7c70672968fc34042cf17ba8b3b463779b03).
- Nytt `ma4/kapitel-4/qa/deep-review-ma4-11.cjs` ingår i hela `ma4-browser-qa.yml`; befintliga tester ligger kvar (inget avaktiverat). Testet går igenom 14/14 bilder, alla dolda facit och frivilliga tillstånd, båda rötterna, digital korrekta/felaktiga svar, lärares klassrumsvy, projektor, 390 px mobil, SVG-visning, back/reset, korrekt MathML, minst 16 px för fristående matematikblock samt **ingen intern sidscroll för någon synlig matematikrad** på alla 14 mobilbilder.
- [Arbetsgrenskörning PR #19: 43519619450 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43519619450); [arbetsgrenskörning PR #20: 43522404304 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43522404304) med [skärmbildsartefakt](https://github.com/jacobflinder/Lektioner/actions/runs/43522404304/artifacts/14083336987). Visuell skärmbildsgranskning inkluderade 14 desktopbilder, 14 mobilbilder, lång utcheckning, matematikblock i den frivilliga metoden samt projektor.
- **Hela Ma4-regressionen på slutlig `main`:** [run 43522933251 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43522933251). **GitHub Pages-deployment på samma commit:** [run 43522932531 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43522932531).
- **Verifieringsgräns:** Chromiumtest och screenshots kördes mot GitHub-checkout; Pages Actions bekräftar godkänd publicering. Den offentliga URL:en kunde inte oberoende läsas direkt med tillgänglig webbtjänst (otillgängligt svar), vilket inte ska påstås vara verifierat. Ingen känd blockerande matematisk, didaktisk eller teknisk brist kvarstod efter slutkörningen.

## Bild-för-bild-rapport · Lektion 12/41 · Polynomdivision

**Kurs:** Matematik 4, 4.4 Polynomekvationer – Polynomdivision.  
**GitHub-sökväg:** `ma4/kapitel-4/polynomdivision/`  
**Elevsida:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/polynomdivision/  
**Omfattning:** **11/11 bilder**, där bild 10 är frivillig. Alla öppningsbara lösningar och sju interaktiva divisioner har granskats. Kvot och rest har verifierats med separat polynommultiplikation, inte bara mot befintliga facit. Samtliga interaktiva tillstånd har prövats genom riktat Chromiumtest.

| Bild | Matematik, didaktik, metodik, kognition och konkret korrigering |
|---|---|
| **1 · Startfråga** | Eleverna förutsäger kvottermen till \((2x^3+3x^2-5x+6):(x+2)\). Första termen måste vara \(2x^2\) eftersom \(x\cdot 2x^2=2x^3\). Enskild tänketid (20 sekunder), parsamtal (40 sekunder) och start före förklaringen bevarade. |
| **2 · Lärandemål** | Fyra handlingssteg är tydliga: välj kvotterm, multiplicera med **hela** divisorn, subtrahera **hela** produkten och avgör stoppvillkoret. Eleverna förklarar varför man inte bara får multiplicera med \(x\). Inga nya passiva lärarmoment har lagts till. |
| **3 · Koppla till heltalsdivision** | \(17=5\cdot3+2\) och \(P(x)=D(x)Q(x)+R(x)\) ligger i separata MathML-block med **minst 16 px** faktisk luft. Rest till en divisor av grad 1 får vara en konstant eller 0; båda felalternativen i begreppsquizet ger specifik återkoppling. |
| **4 · Interaktiv liggande stolen** | Huvudexemplet \(P=2x^3+3x^2-5x+6\), divisor \(x+2\), kvot \(Q=2x^2-x-3\), rest \(R=12\). Förutsägelse före klick, samtliga 10 steg, alla produkt- och subtraktionsrader, tillbaka, reset och stoppvillkor kontrollerade. Slutkontrollen visar \(Q\), \(R\), \(P=DQ+R\), produkten med resten och täljaren i **separata** matematikrader; tidigare för breda mobila slutraden delad utan att dölja någon beräkning. |
| **5 · Återskapa täljaren** | Tidigare kortfattad kontroll har kompletterats: \(x(2x^2-x-3)=2x^3-x^2-3x\) och \(2(2x^2-x-3)=4x^2-2x-6\); sedan samlas \(-x^2+4x^2=3x^2\), \(-3x-2x=-5x\), \(-6+12=6\). Kvot, rest och divisor visas var för sig. Bråkuttrycket \(P(x)/(x+2)\) har villkoret \(x\neq-2\), medan polynomidentiteten gäller för alla \(x\). Extra stoppkontrast visar \((3x+1)-3(x+2)=-5\). |
| **6 · Teckenfällan** | Det konstruerade felet \(-5x-(-2x)=-7x\) rättas via \(-5x-(-2x)=-5x+2x=-3x\). För den fullständiga raden fås \((-x^2-5x+6)-(-x^2-2x)=-3x+6\). Varje teckenbyte visas före resultatet och följs av kort orsaksförklaring, efter enskilt → par → klass. |
| **7 · Guidad uppgift** | \(P=x^3+2x^2-5x-6\) och divisor \(x+3\) ger \(Q=x^2-x-2\), \(R=0\). Fullständiga kvotval, produkter, subtraktioner och kontroll utvecklade i det dolda facit. **Faktiskt interaktionsfel rättat:** tillbaka-knappen kunde gå förbi det förvalda stödläget där första kvottermen redan är given. Den stannar nu vid avsedd startpunkt; tillbaka/framåt/reset fungerar i övrigt. |
| **8 · Självständig uppgift** | \((x^3-4x+3):(x-1)\) ger \(Q=x^2+x-3\), \(R=0\). Frivilligt stöd lyfter \(x^3+0x^2-4x+3\): nollkoefficienten håller kvar rätt gradkolumn utan att ändra polynomet. Det frivilliga divisionsstödet och kontrollen visar varje multiplikation och subtraktion; elevernas pappersträning bevarad. |
| **9 · NOKflex** | **Oförändrat:** NOKflex → 4.4 Polynomekvationer → Polynomdivision → Övningslista; uppgifter **4421–4430**, minst tre av fem nivåer, val och byte av nivå samt redovisning av mellanled och kontroll med \(P=DQ+R\). Inget nytt Socrative-inslag, ingen kopierad uppgiftstext. |
| **10 · Frivillig extraträning** | Alla fyra divisioner har fullständiga facit och separat interaktiv uppställning: A \((x^2+5x+6):(x+2)\Rightarrow Q=x+3,R=0\); B \((2x^3+x^2-5x+4):(x-1)\Rightarrow Q=2x^2+3x-2,R=2\); C \((x^3-2x+5):(x+2)\Rightarrow Q=x^2-2x+2,R=1\); D \((x^3-3x^2+4x-12):(x-3)\Rightarrow Q=x^2+4,R=0\). Varje produkt/subtraktion visas före slutkontrollen, lång formel i B har delats i tydliga mobilrader. Bilden kan fortfarande hoppas över vid ordinarie navigering. |
| **11 · Individuell utcheckning** | \((x^2+x-5):(x+3)\Rightarrow Q=x-2,R=1\). Först \(x^2/x=x\) och \(x(x+3)=x^2+3x\); därefter resten \(-2x-5\); nästa kvotterm \(-2\) och produkten \(-2x-6\); slutrest \((-2x-5)-(-2x-6)=1\). Kontroll \((x+3)(x-2)+1=x^2+x-5\). Stoppvillkor grad \(0<1\), självbedömning, återkoppling till målen, repetition som hemuppgift och framåtblick till faktorsatsen bevarade. |

### Oberoende kontrollräkningar

Alla sju interaktiva fall kontrollerades separat i testfilen genom \((x+d)Q(x)+R=P(x)\), dels med koefficientbaserad polynommultiplikation, dels genom insättning av flera \(x\)-värden. Detta bekräftar både rätt kvot och korrekt rest, inklusive fall med nollrest och rest skild från noll.

| Division | Kvot | Rest |
|---|---|---:|
| \((2x^3+3x^2-5x+6):(x+2)\) | \(2x^2-x-3\) | 12 |
| \((x^3+2x^2-5x-6):(x+3)\) | \(x^2-x-2\) | 0 |
| \((x^3-4x+3):(x-1)\) | \(x^2+x-3\) | 0 |
| \((x^2+5x+6):(x+2)\) | \(x+3\) | 0 |
| \((2x^3+x^2-5x+4):(x-1)\) | \(2x^2+3x-2\) | 2 |
| \((x^3-2x+5):(x+2)\) | \(x^2-2x+2\) | 1 |
| \((x^3-3x^2+4x-12):(x-3)\) | \(x^2+4\) | 0 |

Utcheckningen är dessutom kontrollerad oberoende: \((x+3)(x-2)+1=x^2+x-5\). Det matematiska stoppvillkoret används korrekt i alla fall; resten **måste inte** vara noll, men dess grad ska vara lägre än divisorns.

### Ändringar, bevarat innehåll, tester och publicering

- **Matematisk typografi:** fristående givna värden och uttryck är separata semantiska MathML-block med minst **16 px verkligt mätt vertikalt avstånd** på desktop och 390px mobil. Kvot/rest, oberoende förklaringsled och kontrolluppställningar skiljs åt. Saknade distributiva mellanled är tillagda. En olämpligt kursivsatt fyrbokstavsbeteckning för grad ersattes med riktig förklaring och en matematisk olikhet.
- **Mobil:** alla 11 bilder granskade i 390 px; inga generella horisontella sidöverflöden eller internt avklippta matematikrader i de öppnade faciten. Den interaktiva gradkolumntabellen tillåts fortfarande rulla inom sin egen behållare, eftersom den bevarar en korrekt liggande division. Desktop/projektor och långa, öppnade lösningar har även inspekterats med Chromium-skärmbilder.
- **Bevarat:** samtliga 11 bilder, huvudaktiviteten, de sju divisionsmotorerna, frivilliga övningar, quiz, lärarstöd och klassrumsläge, elevernas arbete för hand och NOKflex 4421–4430. Facit öppnas först efter elevens försök. Inga elevidentiteter samlas in.
- **Ny riktad testfil:** `ma4/kapitel-4/qa/deep-review-ma4-12.cjs`. Den testas först i den befintliga Ma4-regressionen, utan att någon tidigare kontroll avaktiverats. Den granskar 11/11 bilder, 7/7 divisioner, alla öppningsbara facit och frivilliga steg, när de avslöjas, back/reset, samtliga kvoter och rester, 16px-krav, fullständig 390px mobil, klassrumsläge, 11 desktopscreenshots, 11 mobilscreenshots, sju divisionsslutbilder och lärarvy.
- **Sammanslagning:** [PR #21](https://github.com/jacobflinder/Lektioner/pull/21) är sammanslagen; kodcommit [`50a68738bed8a1703ee3e1b238da4f8b18ab099d`](https://github.com/jacobflinder/Lektioner/commit/50a68738bed8a1703ee3e1b238da4f8b18ab099d).
- **Godkända kontroller:** [riktad/full Chromium-QA på arbetsgren, run 43527324184](https://github.com/jacobflinder/Lektioner/actions/runs/43527324184) med [skärmbildsartefakt](https://github.com/jacobflinder/Lektioner/actions/runs/43527324184/artifacts/14086415956); [full Ma4-regression på sammanslagen main, run 43527901367](https://github.com/jacobflinder/Lektioner/actions/runs/43527901367); [Pages-publicering på samma kodcommit, run 43527900602](https://github.com/jacobflinder/Lektioner/actions/runs/43527900602). Samtliga **success**.
- **Verifieringsgräns:** Chromium verifierade den kod som GitHub testade; Pages Actions verifierar att driftsättningen lyckades. En separat direkt HTTP-kontroll av den publika sidans innehåll är inte utförd och ska inte förväxlas med den godkända Pages-körningen.

## Bild-för-bild-rapport · Lektion 13/41 · Faktorsatsen

**Kurs/moment:** Matematik 4 (Gy25 Matematik – fortsättning nivå 2), 4.4 Polynomekvationer – Restsatsen och faktorsatsen.  
**GitHub-sökväg:** `ma4/kapitel-4/faktorsatsen/`  
**Elevsida:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/faktorsatsen/  
**Omfattning:** **9/9 bilder** inklusive frivillig dubbelrot. Samtliga öppningsbara facit, båda fyrastegssekvenserna, tre grafområden, rörlig grafpunkt, två nollställesknappar, skalfaktorreglage, quiz med två felalternativ, klassrumsläge/lärarstöd, utcheckning och hemfacit granskade. Svaren har beräknats oberoende av sidans MathML och renderingskod. Hela NOKflex-momentet är bevarat.

| Bild | Oberoende ämneskontroll, didaktisk analys och genomförd förbättring |
|---|---|
| **1 · Start och mål** | För \(f(x)=x^2-x-2\) är \(f(2)=2^2-2-2=0\). Eleverna arbetar först **45 sekunder individuellt och 30 sekunder i par**. Tidigare exponerades alla mål ovanför startfrågan; nu visas de först på elevens/lärarens initiativ efter starten, i egen öppningsbar panel med begriplig knapptext. Beräkningen visas efter försök, med synliga mellanled \(2^2=4\), \(4-2-2=0\). Tolkning: punkten \((2,0)\) ligger på grafen. Begreppet faktor förebådas, men bevisas på bild 3. |
| **2 · Nollställen och graf** | Funktionen \(x^2-x-2=(x+1)(x-2)\) har nollställena \(x=-1\) och \(x=2\). Både \(f(-1)=1+1-2=0\) och \(f(2)=4-2-2=0\) redovisas efter att eleven först förutsett det andra nollstället. Den flyttbara SVG-punkten ger samma funktionsvärden som algebran. Nollställemarkeringarna är **dolda tills de begärs**; två beräknade cirklars faktiska \(x,y\)-koordinater har kontrollmätts mot grafens axeltransformation. Nollställe och funktionsvärde förväxlas inte. |
| **3 · Härledning av rest- och faktorsatsen** | Fyra steg med elevfråga innan varje avslöjande: \(f(x)=(x-a)q(x)+r\), insättning av \(x=a\), förenklingen \(f(a)=0\cdot q(a)+r=r\), och likvärdigheten \(f(a)=0\Leftrightarrow r=0\). Därav följer att \(x-a\) är en faktor **om och endast om** \(f(a)=0\). Båda riktningarna och skillnaden mellan rester som är noll respektive andra tal finns kvar. Nästa, föregående, börja om, dold initial lösning och texten efter sista steget har testats. |
| **4 · Samma polynom, olika rester** | \(f(x)=x^3-2x^2-5x+6\). För divisorn \(x-1\) fås \(f(1)=1-2-5+6=0\). För \(x-2\) fås \(f(2)=8-8-10+6=-4\), alltså **inte** en faktor. För \(x+2\) måste \(a=-2\), och \(f(-2)=-8-8+10+6=0\). Quizet ger omedelbar, orsaksinriktad respons vid fel tecken. Den sista insättningen var tidigare för lång på 390px mobil: nu beräknas \((-2)^3=-8\), \(-2(-2)^2=-8\) och \(-5(-2)=10\) var för sig, sedan \(-8-8=-16\), \(10+6=16\) och \(f(-2)=0\). Ingen matematik utelämnad. |
| **5 · Nollställen → faktorer → punkt** | \(g(x)=k(x+1)(x-1)(x-3)\) med nollställena \(-1,1,3\) och punkten \((0,3)\). Insättning: \(3=k(1)(-1)(-3)=3k\), alltså **\(k=1\)**. Grafens tre nollställen och punkt \((0,3)\) har verifierats både numeriskt och som faktiska SVG-positioner. Fyra separata, elevstyrda lösningssteg bevarade. **Matematiktypografiskt fel rättat:** den gamla raden kombinerade fyra separata ekvationer med semikolon och `&nbsp;` i samma MathML-element. Nu finns **fyra självständiga MathML-block**, \(g(-1)=0\), \(g(1)=0\), \(g(3)=0\), \(g(0)=3\), med **minst 16 px uppmätt avstånd**. |
| **6 · Samma nollställen, ny skala** | Med \((0,6)\) och samma nollställen fås \(6=3k\), alltså **\(k=2\)** och \(g(x)=2(x+1)(x-1)(x-3)\). Det dolda facit visar numera insättning, de tre produktfaktorerna och \(3k\) separat. Den klickbara grafen är kvar inuti facitrutan; regressionskontrollen prövade \(k=0{,}5\), \(2\), \(2{,}5\), återställning till \(1\), korrekta beräknade \(g(0)=3k\), samma tre SVG-nollställen och korrekt flyttad punkt för vart och ett av k-värdena. Positiva k-värden ändrar den vertikala skalan men inte rötterna. |
| **7 · NOKflex** | **Oförändrat originalinnehåll:** NOKflex → 4.4 Polynomekvationer → Faktorsatsen, **uppgifter 4431–4443**, minst tre av fem nivåer och möjlighet att byta under arbetet. Eleverna ska ange rätt insättningsvärde, beräkna resten och **motivera** faktorkriteriet, inte bara svara ja/nej. Knappen till frivillig dubbelrotsaktivitet är kvar; huvudnavigeringen hoppar automatiskt över den frivilliga bilden. Inga påhittade Socrative-frågor eller kopierade bokexempel. |
| **8 · Frivillig dubbelrot** | \(F(x)=(x-2)^2(x+1)\) har nollställena \(2\) (dubbelrot) och \(-1\) (enkelrot). \(F(2)=0\) men grafen **tangerar** x-axeln vid \(2\); numerisk kontroll \(F(1{,}9)>0\) och \(F(2{,}1)>0\) visar att inget teckenbyte krävs. Båda markerade SVG-punkterna ligger på rätt koordinater. Den frivilliga aktiviteten, grafen, det dolda facit och länken direkt till utcheckningen bevarade. |
| **9 · Individuell utcheckning** | **Uppgift 1:** \(p(x)=x^3+2x^2-5x-6\) ger \(p(-1)=-1+2+5-6=0\), alltså \(x+1\) faktor. **Uppgift 2:** vid \(x-1\) blir resten \(p(1)=1+2-5-6=-8\), direkt av restsatsen. **Uppgift 3:** nollställena \(-2,0,1\) ger \(h(x)=k(x+2)x(x-1)\). Punkten \((2,8)\) ger \(8=k\cdot4\cdot2\cdot1\), alltså \(k=1\), \(h(x)=x(x+2)(x-1)\). Den tidigare ofullständiga notation \(x=-2\Rightarrow x+2\) har ersatts med en **fullständig likhet**, \(x=-2\Rightarrow x+2=0\), och motsvarande för \(x=1\). **Hemuppgift:** för \(x^3+x^2-4x-4\) fås \(h(-1)=0\), \(h(3)=27+9-12-4=20\). Insättningar vid \(-1\) delas i egna potens-, produkt- och summeringsled på mobil, inte i en för bred formel. Alla fyra facit förblir dolda tills eleven öppnar dem. |

### Oberoende matematisk kontroll

- **Start/graf:** \(f(-1)=0\), \(f(2)=0\), \(f(x)=(x+1)(x-2)\).
- **Tre faktorprövningar:** För \(x-1\) blir rest 0, för \(x-2\) rest **\(-4\)**, för \(x+2\) rest 0. Det sista fallet kräver \(a=-2\); plus i divisorn innebär minus i insättningen.
- **Skalfaktor:** \(g(-1)=g(1)=g(3)=0\), \(g(0)=3\); ny skala \(2g(0)=6\). Separata räknade grafkoordinater testades i både original- och skalgraferna.
- **Dubbelrot:** \(F(2)=F(-1)=0\); \(F(x)>0\) på båda sidor tillräckligt nära \(x=2\), vilket bekräftar tangering utan teckenbyte.
- **Utcheckning:** \(p(-1)=0\), \(p(1)=-8\), \(h(-2)=h(0)=h(1)=0\) och \(h(2)=8\). **Hemuppgift:** \(h(-1)=0\), \(h(3)=20\). Beräkningarna har kontrollerats separat från de författade MathML-faciten.

### Kognitions- och interaktionsprinciper

Eleverna får först **återkalla och förutsäga** (egen beräkning/papper), därefter diskutera med kamrat, och först sedan öppna stegvis återkoppling. Skillnaden mellan ett nollställe (x-värde), funktionsvärdet 0, resten 0 och faktorkriteriet hålls isär. Aktivitetstiden fördelas mellan kort startfråga, dynamisk undersökning, motiverat algebraiskt bevis, tre kontrasterande faktorprövningar, självständigt faktorformsarbete, NOKflex och individuella utcheckningsuppgifter. Datorn levererar inte färdiga lösningar förrän eleven själv väljer återkoppling. Läraren kan följa klassens resonemang och skriva på Notability.

### Teknisk och visuell verifiering

- **Ekvationsavstånd:** minst **16 px faktisk vertikal separation** mellan på varandra följande matematiska uttryck i alla öppningsbara lösningssteg, svarsfält samt de fyra givna grafkontrollerna. Inga självständiga ekvationer separeras med `&nbsp;` inuti samma matematikblock. Kontrollerat med Chromium i desktop och 390px mobil.
- **Responsiv matematik:** samtliga **9 mobilbilder** i 390px har testats med relevanta facit och sekvenser öppnade. Ingen generell sidscroll och inget överlångt matematikblock som kräver intern sidledsrullning. Tre påträffade alltför breda insättningsrader rättades genom **fler fullständiga mellanled**, inte mindre tecken. Del av den avslutande visuella skärmbildsgranskningen.
- **Grafer och aktivitet:** totalt tre grafytor (dynamisk parabel, ursprunglig faktorform och skalgraf, samt frivillig dubbelrotsgraf), faktisk SVG-geometri, val av nollställe \(-1\)/\(2\), markeringar först på klick, skalfaktorreglagets värden, reset, öppen/stängd återkoppling, två fyrastegssekvenser med tillbaka och återställning, klassrumsläge med lärarstöd samt frivilligt spår är testade.
- **Riktad testfil:** `ma4/kapitel-4/qa/deep-review-ma4-13.cjs` finns i hela `.github/workflows/ma4-browser-qa.yml`. Alla äldre Ma4-tester behållna. Den oberoende polynomkontrollen använder funktioner/kontrollvärden utanför lektionssidans beräkningskod. **9 desktopbilder, 9 mobilbilder och projektorskärmbild** finns i körningens skärmbildsartefakt.
- **PR och commit:** [PR #22](https://github.com/jacobflinder/Lektioner/pull/22) sammanslagen i `main`, kodcommit [`8e873bb9c5d65f565e0b5426c18c3d119cd50a9d`](https://github.com/jacobflinder/Lektioner/commit/8e873bb9c5d65f565e0b5426c18c3d119cd50a9d).
- **Verifierad full Ma4-regression:** [Arbetsgren, GitHub Actions 43562194371 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43562194371) med [skärmbildsartefakt](https://github.com/jacobflinder/Lektioner/actions/runs/43562194371/artifacts/14100817879); [sammanslagen `main`, GitHub Actions 43562608278 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43562608278) med [slutliga skärmbilder](https://github.com/jacobflinder/Lektioner/actions/runs/43562608278/artifacts/14101281335).
- **Verifierad Pages-publicering av samma kodcommit:** [GitHub Actions 43562607925 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43562607925).
- **Verifieringsgräns:** automatiska webbläsartester på arbetsgren och `main` samt Pages-deployment är direkt verifierade. Separat extern HTTP-avläsning av exakt innehåll på den offentliga Pages-adressen har inte gjorts; den ska inte förväxlas med godkänd driftsättning.

## Bild-för-bild-rapport · Lektion 14/41 · Polynomekvationer av högre grad

**Kurs/moment:** Matematik 4, Gy25 Matematik – fortsättning nivå 2, 4.4 Polynomekvationer – Polynomekvationer av högre grad.  
**GitHub-sökväg:** `ma4/kapitel-4/hogre-grad/`  
**Elevsida:** https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/hogre-grad/  
**Omfattning:** **10/10 bilder**, inklusive bild 9 som frivillig fördjupning. Alla dolda facit, tre elevstyrda sekvenser om 6, 3 och 7 steg, quiz, konjugatbeslut med fel-/rättåterkoppling, SVG-grafens faktiska nollställeskoordinater, frivillig fördjupning, elevens utcheckning och hemuppgift. Varje polynom har även kontrollerats separat med komplex Hornerberäkning, frikopplad från lektionssidans beräkningar och de författade faciten.

| Bild | Matematisk, didaktisk, metodisk och teknisk granskning |
|---|---|
| **1 · Start och mål** | Enskilt → par med två återkallningsfrågor: `f(1)=0` ger faktorn `z−1`; `z²+4=0` ger `z=2i` och `z=−2i`. Eleven ser nu först frågorna och kan öppna **dagens mål efter startfrågorna**, i stället för att mötas av målen före aktivitet. Facit förblir dolt tills det begärs. Denna start knyter ihop föregående faktorsats med komplexa rötter utan att lösa dagens huvudexempel i förväg. |
| **2 · Graden och multiplicitet** | Grafen för `f(x)=(x−1)²(x+2)` har reella nollställena `−2` och `1`. Roten `1` har multiplicitet två; de tre rötterna räknade med multiplicitet är alltså `1,1,−2`. Oberoende teckenkontroll visar att kurvan tangerar vid `1` och korsar vid `−2`; två markerade SVG-koordinater har verifierats. Snabbquiz med specifik felåterkoppling behållet. Extra elevfråga `(z−3)³(z+1)=0` har grad 4, trippelroten 3 och enkelroten −1. Algebrans fundamentalsats är frivillig teoretisk förklaring, inte tidigt krav. |
| **3 · Känd rot → faktor → polynomdivision** | `p(z)=z³−z²+4z−4` har given rot `z=1` och faktorn `z−1`. Den handskrivna liggande stolen, **alla ursprungliga sex elevstyrda beslut**, alternativa grupperingarna och gradkolumnerna inklusive kvotens nollterm `0z` är bevarade. Kvoten är `q(z)=z²+4` och resten `r=0`; alltså `p(z)=(z−1)(z²+4)`, med rötterna `1` och `±2i`. Fler detaljerade distributiva och subtraktiva mellanled visas efter elevens eget försök. Kvot, rest och tre enskilda rötter presenteras i **separata semantiska matematikblock**. **Verkligt mobilfel upptäcktes och åtgärdades:** tabellens min-innehållsbredd pressade tidigare hela sidan till 546px vid 390px skärm. Gridens minbredd är nu begränsad: *bara tabellen* får ha avsiktlig intern horisontell rullning; resten av sidan förblir 390px. |
| **4 · Självständig tredjegradsekvation** | `z³+z²+4z+4=0` grupperas som `z²(z+1)+4(z+1)=0`, därmed `(z+1)(z²+4)=0`. Rötterna `−1`, `2i` och `−2i` verifierade oberoende med Hornerberäkning. Den egna uppgiften, parjämförelsen och det dolt öppningsbara facitet finns kvar. De tre rötterna är nu var sitt matematikblock, i stället för flera självständiga ekvationer i en enda rad. |
| **5 · Konjugatregeln** | Polynom `p(z)=z⁴+2z³+6z²+2z+5` har reella koefficienter och given rot `i`. Då måste `−i` också vara en rot och `(z−i)(z+i)=z²+1` en faktor. Det aktiva **trealternativsbeslutet** är kvar: eleven behöver välja innan kontrollknappen aktiveras och får olika orsaksförklaringar för fel respektive rätt svar. Alla tre förutsägelse- och återkopplingsstegen är bevarade. Den algebraiska kontrollen `p(i)=1−2i−6+2i+5=0` är uppdelad i komplex real- och imaginärdel före slutsatsen. |
| **6 · Bestäm kvoten och hitta alla fyra rötter** | Efter division med `z²+1` är kvoten `q(z)=z²+2z+5`. Koefficientjämförelsen ger `b=2` och `c=5`, och kontrollen `(z²+1)(z²+2z+5)=z⁴+2z³+6z²+2z+5` stämmer. Den ursprungliga sjudelade elevstyrda sekvensen och kvadratkompletteringen `(z+1)²=−4` finns kvar, alltså `z=−1±2i` tillsammans med `z=±i`. **Mobilförbättring:** de för långa expansionsraderna ersattes med de två faktiska distributiva produkterna `z²(z²+2z+5)` och `1(z²+2z+5)`, deras respektive termer, kontrollen `5z²+z²=6z²` och en explicit jämförelse av alla fem koefficienter. Textstorleken minskades inte. Alla fyra komplexa rötter får varsitt block med minst 16px luft. |
| **7 · Eget fjärdegradsexempel** | `z⁴+5z²+4=0` med given rot `2i`. Konjugatregeln ger `−2i` och faktorn `z²+4`, och faktoriserat polynom är `(z²+4)(z²+1)`. De fyra rötterna är `±2i` och `±i`. Elevernas självständiga arbete och dolda facit är kvar. Facit har utökats med faktisk utveckling `z⁴+z²+4z²+4=z⁴+5z²+4` och med de två andragradsekvationerna separat. |
| **8 · Eget arbete i NOKflex** | Originalhänvisningen **NOKflex → 4.4 Polynomekvationer → Polynomekvationer av högre grad, uppgifter 4447–4460** är oförändrad. Eleverna ska välja minst tre av fem nivåer och får byta svårighetsgrad under arbetet. Arbetsprincipen är känd rot → faktor → lägre grad → nollproduktmetod → kontroll av alla rötter och multiplicitet. Ingen digital inloggning, elevrapportering, påhittad Socrative eller kopierad bokuppgift har tillkommit. Frivillig fördjupning nås via den befintliga knappen men hoppas över i ordinarie nästa-navigering. |
| **9 · Frivillig udda grad** | Ett **reellt** polynom av **udda grad** måste ha minst en reell rot: icke-reella rötter bildar konjugatpar med samma multiplicitet, alltså är antalet icke-reella rötter jämnt. Det ursprungliga resonemanget och den frivilliga karaktären är bevarade; matematikstödet visar nu en fullständig typisk parbild `z=a+bi`, `z̄=a−bi`, med reella a, b och `b≠0`, i stället för två lösa symboler. Därigenom visas tydligare *varför* de icke-reella rötterna paras ihop. |
| **10 · Individuell utcheckning och läxa** | Utcheckningens `f(z)=z³+2z²+9z+18=(z+2)(z²+9)` har rötter `−2`, `3i` och `−3i`. Endast `x=−2` syns på den reella grafen, eftersom `x²+9>0` för alla reella x. Ekvationen `(z−1)²(z+3)=0` har `1` som dubbelrot och `−3` som enkelrot. Läxans två polynom är också kontrollräknade: `z³−3z²+4z−12=(z−3)(z²+4)` med rötterna `3`, `±2i`; `z⁴+10z²+9=(z²+1)(z²+9)` med rötterna `±i`, `±3i`. Läxans dolda facit visar nu fler kontroll- och faktoriseringsled. Alla fyra facit förblir dolda tills eleven öppnar dem. |

### Oberoende verifiering av komplexa rötter

Testfilen `ma4/kapitel-4/qa/deep-review-ma4-14.cjs` innehåller en fristående implementation av **komplex addition, komplex multiplikation och Horners metod**. Alla påstådda rötter kontrollerades genom direkt insättning i originalpolynomet, och antalet rötter (med multiplicitet) prövades mot graden. Varken sidans facitsträngar eller MathML-konverteraren användes för den algebraiska kontrollen.

| Polynom | Oberoende verifierade rötter |
|---|---|
| `z³−z²+4z−4` | `1`, `2i`, `−2i` |
| `z³+z²+4z+4` | `−1`, `2i`, `−2i` |
| `z⁴+2z³+6z²+2z+5` | `i`, `−i`, `−1+2i`, `−1−2i` |
| `z⁴+5z²+4` | `2i`, `−2i`, `i`, `−i` |
| `z³+2z²+9z+18` | `−2`, `3i`, `−3i` |
| `z³−3z²+4z−12` | `3`, `2i`, `−2i` |
| `z⁴+10z²+9` | `i`, `−i`, `3i`, `−3i` |

**Multiplicitet och reell graf:** `(x−1)²(x+2)` har dubbelt nollställe 1 och enkelt nollställe −2. Tydlig skillnad mellan antalet *olika* nollställen och det totala antalet rötter med multiplicitet. Den reella grafen visar bara reella rötter.

### Typografi, kognition och teknisk regressionskontroll

- **Studentens matematiska aktivitet:** enskilt försök → parförklaring → stegvis återkoppling. Tre elevstyrda sekvenser med **6, 3 och 7 förutsägelsefrågor** bevarade. Tillbaka/reset har testats; lösningar döljs före elevens val. Polynomdivisionen sker fortfarande handskrivet i klassrummet eller Notability; en interaktiv tabell ersätter inte tänkandet.
- **Matematiktypsättning:** separata semantiska MathML-block för oberoende rötter, kvot/rest och andra matematiska utsagor. Chromium mäter **minst 16 px faktiskt vertikalt avstånd** mellan separata matematikrader i lösningssteg, grupperade uttryck och svar. Ingen förvirrande sammanslagning med `&nbsp;` eller förminskad mobiltext.
- **Mobil och klassrum:** samtliga **10 mobilbilder på 390px**, 10 desktopbilder och projektorvy granskade med relevanta facit och sekvenser öppnade. Inget horisontellt dokumentöverflöde, inte ens med den breda liggande stolen, och inget avklippt synligt matematikblock. Den uttryckligt rullbara polynomdivisionstabellen är enda avsiktliga horisontella underkomponenten. Mobilbild 3 och 6 har dessutom granskats visuellt efter sista korrigeringen.
- **Tekniskt:** nytt riktat test körs först i `.github/workflows/ma4-browser-qa.yml` och samtliga tidigare Ma4-kontroller finns kvar utan avaktiverade assertioner. Testar SVG-nollställen, quizets fel/rätt, konjugatbeslutets aktivering och feedback, alla dolda facit, tre sekvenser med back/reset, alternativ gruppering, NOKflex, frivilligt spår, lärarstöd och inga JavaScript/resursfel.
- **Sammanslagning:** [PR #23](https://github.com/jacobflinder/Lektioner/pull/23) sammanslagen till `main` med kodcommit [`d4abad7760088ed9c018dd0b55bb0acbf172ba7c`](https://github.com/jacobflinder/Lektioner/commit/d4abad7760088ed9c018dd0b55bb0acbf172ba7c).
- **Godkänd full Ma4-regression på arbetsgrenen:** [GitHub Actions 43565994490 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43565994490) med [skärmbildsartefakt](https://github.com/jacobflinder/Lektioner/actions/runs/43565994490/artifacts/14102720586).
- **Godkänd full Ma4-regression på sammanslagen main:** [GitHub Actions 43566465093 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43566465093).
- **Godkänd Pages-publicering av samma kodcommit:** [GitHub Actions 43566464446 – success](https://github.com/jacobflinder/Lektioner/actions/runs/43566464446).
- **Verifieringsgräns:** GitHub har verifierat browser-QA, Pages-bygge och driftsättning på rätt kodcommit. Ett separat externt webbförsök att läsa den publicerade sidans HTTP-innehåll gick inte att genomföra med den tillgängliga webbläsaren; det påverkar inte den observerat godkända Pages-körningen men ger inte heller ett separat bevis på det publikserverade innehållet.

### FORTSÄTT HÄR I NÄSTA CHATT

- **SENAST FÄRDIG:** **14 av 41 – Matematik 4, Polynomekvationer av högre grad**. GitHub-sökväg: `ma4/kapitel-4/hogre-grad/`. **10/10 bilder** (inklusive en frivillig), fullständig polynomdivision med liggande stolen, alla dolda facit, 6/3/7 stegvisa beslutssekvenser, konjugatval, 7 oberoende komplexa polynomkontroller, NOKflex 4447–4460 och utcheckning/läxa granskade. Alla matematikrader har ≥16px verklig luft, 390px mobil fungerar utan sidöverflöde, endast divisionstabellen tillåter intern vågrät rullning. **PR #23 sammanslagen** i `main` med kodcommit `d4abad7760088ed9c018dd0b55bb0acbf172ba7c`. **Full Ma4-regression på main: 43566465093 success** och **Pages på samma kodcommit: 43566464446 success**. Permanent bild-för-bild-rapport uppdaterad.
- **NÄSTA LEKTION:** **15 av 41 – Matematik 4, Enhetscirkeln** (separat repetitionsverkstad). Sökväg: `ma4/kapitel-4/enhetscirkeln/`. URL: https://jacobflinder.github.io/Lektioner/ma4/kapitel-4/enhetscirkeln/.
- **EVENTUELLA ÖPPNA PROBLEM:** Inga kända blockerande algebra-, MathML-, interaktions-, mobil- eller regressionsfel i lektion 14 efter godkänd version och Pages. Direkt extern HTTP-läsning av Pages-HTML kunde inte verifieras, men GitHub Pages-körning på korrekt commit är godkänd. Kontrollera eventuell Pages-körning utlöst av denna loggändring, därefter nyaste main.
- **INSTRUKTION:** Läs först `AGENTS.md` och hela `granskning/README.md`. Kontrollera senaste `main`, öppna PR, samtidiga ändringar och Pages. Fortsätt **endast** med **15/41 – Enhetscirkeln**. Läs alla lektionsbilder och dolda svar; räkna oberoende och granska komplexa tal, trigonometri, vinkelargument, kvadranter och rätt matematisk notation. Elevförsök innan återkoppling, minst 16px verkligt avstånd mellan oberoende MathML-block, korrekt grafisk geometri, mobil 390px och projektor. Bevara befintliga NOKflex/Socrative och ursprungliga frivilliga aktiviteter. Gör riktad Chromium-QA med skärmbilder, full Ma4-regression, PR och merge, Pages-kontroll och en fullständig permanent bild-för-bild-rapport. Stanna efter en lektion och invänta nästa 'Nästa'.
