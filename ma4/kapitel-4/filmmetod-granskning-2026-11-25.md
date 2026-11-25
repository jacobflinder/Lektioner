# Ma4, kapitel 4 — omgranskning av metodtrohet mot film (2026-11-25)

**Norm:** Filmernas faktiskt visade matematiska metod, uppställning, ordningsföljd och avgörande mellanled styr. PDF och läromedel används för uppgiftsområden, inte för att ersätta filmens metod.

## Granskningsunderlag

Elva originalfilmer tillgängliga lokalt: 230403–230406 (introduktion), 230424–230428 Lek1–3 (polär form, multiplikation/division, avläsning/rotation), 230503–230508 Lek1–3 (de Moivre, potensekvationer, Euler), 230510–230511 Lek1–2 (andragrad och polynomdivision), 230515–230517 Lek1–2 (faktorsatsen och högre grad). Tavelfaser och algebraiska mellanled har jämförts med motsvarande 12 publicerade HTML-lektioner. Bilder från flera tidpunkter per film har använts, kompletterat av de redan framtagna kontaktkartorna. Denna granskning avser **metodtrohet**; den påstår inte en ny fullständig ord-för-ord-transkribering.

## Film → webblektion

| Webblektion | Avgörande filmmetod och ordning | Bedömning / åtgärd |
| --- | --- | --- |
| `komplexa-tal-och-i` | Introduktion med `i² = −1`, skilj real- och imaginärdel, räkna sedan med vanliga algebraiska regler och `i²`. | **Bevarat.** Förtydligat med aktivering och utskrivna led. |
| `konjugat-och-absolutbelopp` | Filmens konjugat `a + bi ↔ a − bi`, spegling i realaxeln och avstånd i talplanet. | **Bevarat.** Ytterligare kontrollberäkning `z z̄ = |z|²` är ett samband, inte en ny konkurrerande lösningsmetod. |
| `andragradsekvationer` | Normalisera `2z²−z+1=0`. Använd **pq-formeln** på `z²−2iz+3=0`, därefter **ansats `z=a+bi` med `b>0` från start**, separera real-/imaginärdel, faktorisera `2a(b−1)=0`, pröva båda fallen och förkasta omöjliga värden. | **Klar metodavvikelse hittad och rättad i ändringsförslaget.** Tidigare låg polär metod för `z²=w` som huvudspår, ansatsens positiva-`b`-villkor kom sist och ett annat exempel användes. Den nya versionen har filmen i två sammanhängande huvudgenomgångar, inga polära rötter, och ett slutprov på just pq/ansats/konjugat. |
| `polynomdivision` | **Liggande stolen**: högsta term → multiplikation med hela divisorn → subtraktion av hela uttrycket med synligt teckenbyte → nästa gradkolumn → kvot och rest. Filmen visar även polynom med saknad grad. | **Bevarat i publicerad version** efter tidigare rättningar. Granskad uppställning, nollkoefficient, rest och kontroll. Ingen syntetisk division används som standard. |
| `faktorsatsen` | Restsatsen före faktorsatsen: resten vid division med `x−a` är `f(a)`; pröva föreslagna faktorer genom insättning och förklara `f(a)=0`. | **Bevarat.** Filmens uppdelning mellan rest och faktor finns före tillämpningar. |
| `hogre-grad` | Bryt först ut `x`, använd given rot och **liggande stolen**, lös återstående andragrad. För reella koefficienter och en komplex rot: ta konjugatet, bilda reell andragradsfaktor, dividera och bestäm kvarvarande reell rot. | **Bevarat**, inklusive filmens `x⁴+2x³−5x²−6x=0` och `x³−3x²+16x−48=0`. |
| `polar-form` | `z=r(cos v+i sin v)`, `r=|z|`, `tan v=b/a` med kvadrantkontroll. Rita först punkt; därefter riktning/längd i grader, bl.a. `5,45°` och `8,120°`. | **Bevarat.** Kvadrantkontroll är stöd, inte ny huvudmetod. |
| `multiplicera-dividera-med-i` | Multiplikation med `i` roterar `+π/2`, division med `i` `−π/2`; samma absolutbelopp. | **Bevarat.** Algebraisk kontroll följer figur. |
| `polar-multiplikation-division` | Filmens först genomräknade par: `z₁=12(cos(2π/3)+i sin(2π/3))`, `z₂=6(cos(π/3)+i sin(π/3))`; multiplicera belopp och **addera radianargument**, dividera belopp och **subtrahera radianargument**. | **Avvikelse i exempelordning hittad och rättad i ändringsförslaget.** Webben började med `2,3,30°,60°`; nu blir filmens radianpar huvudexempel i båda operationerna (`72,π` respektive `2,π/3`). Gradexemplen finns kvar som elevövning och geometrisk representation. |
| `de-moivre` | `[r(cos v+i sin v)]ⁿ=rⁿ(cos nv+i sin nv)`; jämför även fjärdepotens genom upprepad kvadrering med de Moivre. | **Bevarat**, med fulla steg. |
| `ekvationen-zn-a` | Skriv **båda leden på polär form**, jämför `rⁿ=|a|` och `nv=arg a+2πk`, räkna fram alla argument och placera rötterna; filmerna visar tredje- och femtegradsexempel. | **Bevarad metod** i både huvudexemplet `z³=8i` och extra femtegradsexempel; talvärdena i den senare övningen är didaktiskt ändrade, inte lösningsmetoden. |
| `eulers-formel` | `e^{iv}=cos v+i sin v`, `e^{iπ}+1=0`, **bryt ut absolutbeloppet** innan `z=re^{iv}`; argument i radianer. | **Bevarat** i webblektionens huvudspår; enhetscirkeln används som stöd, inte en alternativ lösningsmetod. |

### Avgränsningar och stoppläge

- `komplexa-tal-som-vektorer` är ett separat **utkast**, inte verifierat mot relevant film: **STOPP** enligt projektets metodregel. Ingen färdigpublicering.
- `enhetscirkeln` och `multiplikation-division-komplexa` omfattas inte av den här 12-lektionsjämförelsen med de elva filmerna. Ingen metodtrohetsstämpel sätts utan en motsvarande originalfilm.
- Originalvideons och webbens exempel behöver inte ha samma talvärden för att bevara *metoden*, men ett ändrat villkor eller en ny huvudmetod räknas som en saklig metodavvikelse och åtgärdas.

### Verifiering för de två korrigeringarna

- Andragrad: pq-rötterna `3i` och `−i`; med `z=a+bi, b>0` fås `2a(b−1)=0`, `a=0, b=3` och `b=1 ⇒ a²=−4` omöjligt. Alla avgörande led finns i webbtexten.
- Polär multiplikation: `12·6=72`, `2π/3+π/3=π`; division: `12/6=2`, `2π/3−π/3=π/3`.
- HTML-struktur: andragrad 10 bilder varav 1 frivillig, polär multiplikation/division 7 bilder; inga dubbla ID eller saknade facitmål. JavaScript syntaxkontrollerad.
- **Kvar före godkänd sammanslagning:** automatiska webbläsartester, projektor-/mobilvy och slutkontroll i publicerad miljö. Detta är ännu ett ändringsförslag, inte en verifierad publicerad rättning.
