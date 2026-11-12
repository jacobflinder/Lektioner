# 8.6 Potential – kvalitetssäkring, reviderad webblektion

Datum: 2026-11-12. Original: `Fy1_Potential.pdf` (16 sidor). Publiceringsmål: `fy1/kapitel-8/potential/`.

## Källinventering och bevarande

| Webb-bild | Original-PDF | Bevarat moment |
|---|---|---|
| 1 | 1 | Potential i en punkt mot spänning mellan två; mål och start 12 V/8 V |
| 2 | 2 | **Verklig demonstration med kateder, bänk och golv**, 12/8/0 V som analogi |
| 3 | 3 | **Voltmeter, mätordning**, U_AB och U_BA; −3/+2 V som elevuppgift |
| 4 | 4 | Plattor +100/0 V, elektriskt fält och elektronens riktning, E_p=qV |
| 5–6 | 5–6 | Byte av referens till 0/−100 V; ingen ändring av spänning, fält, kraft |
| 7 | 7–9 | Potentialvandring med 12 V, 2 Ω, 4 Ω, 2 A; originalets före/animation/efter ersatt av stegstyrd modell |
| 8 | 10 | Ohms lag, 12→8→0, Kirchhoffs spänningslag med tecken |
| 9 | 11 | Byt vald referens från A till C utan att ändra kretsen |
| 10 | 12 | Negativa potentialer och skillnaden mellan referens och fysisk jordledning |
| 11 | 13 | Motverkande/samverkande 10 V och 6 V-källor, 2 Ω, 2/8 A |
| 12 | 14 | **Befintlig Socrative 905: SOC-37397534**, enskilt → par → ompröva |
| 13 | 15 | **Boken 861–870, s. 313–314**, stöd **8.6, s. 309–312**, gröna rutorna och målanknuten exit |
| 14 | 16 | Frivillig fördjupning: två källgrenar, V=7 V och I₁+I₂=1,75 A |

Webbens tre nya frågemoment är tydligt skilda från originalets Socrative. Ingen ny Socrative har tillskrivits originalet. Den verkliga höjddemonstrationen har inte ersatts av en skärmsimulering.

## Fysik och matematik

- U_AB = V_A − V_B med definierad mätordning. 12−8=+4 V; −3−(+2)=−5 V.
- Plattornas potentiella skillnad är 100 V oavsett om potentialerna ges som +100/0 V, 0/−100 V eller annan gemensam förskjutning. Elektronens kraft pekar mot högre potential i originalets fält.
- Ideala seriekretsen har R_tot=6 Ω, I=2 A, och A/B/C/D/A = 0/12/8/0/0 V vid A=0. Vid C=0 blir A/B/C/D = −8/+4/0/−8 V. U_BC är +4 V i båda fallen. Slutna slingan ger +12−4−8=0 V.
- I tvåbatterifallet ger idealmodellens riktade ems 10−6 respektive 10+6 V, och med 2 Ω erhålls 2 respektive 8 A. Symbolernas långa streck anger pluspol, korta minuspol.
- Fördjupningsgrenar: I₁=(10−V)/2, I₂=(8−V)/4 och I=V/4 i A, med V=7 V; I₁=1,5 A, I₂=0,25 A, I=1,75 A. Även där saknas ledning som förbikopplar resistorerna.
- Visuellt kontrollerat att figurernas resistorledningar har avbrott vid komponenten, och att referensval inte ritas som en ny fysisk kabel.

## Didaktik och genomförande

- Originalets mål kontrolleras i exit: potential/spänning, tecken i potentialvandring och nollnivå.
- **14 webb-bilder, nio statiska figurer, tre styrbara modeller** (plattornas referens, potentialtrappa, två batterier), tre åtskilda självkontroller. Övriga frågor genomförs muntligt eller på papper.
- Dynamiskt avslöjande för potentialvandring visar enbart undersökta steg; resultaten fortsätter följa ändrade parametrar efter första avslöjandet. Återställ döljer resultaten.
- Matematik visas i MathML där bråk är centrala, kompletterat med stegvisa mellanled och enheter nära figurerna. Annat kort numeriskt innehåll använder tydlig typografi.
- Lärarstöd prioriterar enskilt → par → gemensam återkoppling och en möjlig 70-minutersram med 21 minuter skyddat bokarbete. Batterifördjupning och sista komplexa exemplet kan kortas vid tidsbrist.

## Genomförd teknisk test

- **119/119 automatiserade lokala Chromium-kontroller** i `qa/potential86-results.json`: bildantal, originalhänvisningar, navigation, klassrum/repetition, återställning, MathML, numerik och referensbyten, tvåbatterifall och typiska felvägar.
- Parametergränser: referensförskjutning −100, −50, 0, +75 och +100 V; potentialvandring steg 0–4 och både nollnivå A/C; batteri mot/med. Alla ger konsekventa utdata utan undantag.
- Samtliga 14 bilder vid bredd **1440, 1280, 768, 390, 320 px**: ingen horisontell sidöverströmning i testmiljön. Ett urval bilder visuellt granskat via Chromium-skärmbilder.
- Ingen egen dataöverföring, elevinloggning eller svarslagring finns i denna lektionskod. Gemensam app för andra lektioner ändras inte.

## Viktig avgränsning

Detta avser **källgranskning, kodgranskning, lokala Chromium-tester och visuell skärmbildskontroll**. Det är inte en fullständig kontroll av faktiskt publicerad GitHub Pages-URL i Safari, iPad, projektor, skärmläsare eller klassrum. Vetenskaplig grund avser undervisningsprinciperna, inte ett bevis för att just denna webbdesign förbättrat lärandet.
