# 8.4 Elektrisk effekt – granskningsrapport

Datum: 2026-11-12. Underlag: `Fy1_Effekt.pdf`, **13 originalsidor**.

## Inventering och bevarat original

| Webb-bild | Originalsida | Bevarad kärna |
|---|---|---|
| 1 | 1 | Startfrågan 500 W, syfte och samtliga tre mål |
| 2 | 2 | **Verklig doppvärmare 500 W**, enskilt→par→observation |
| 3 | 3–4 | Animation 500 W/1 000 W under 10 s, E = Pt, 5 000/10 000 J; **interaktiv modell i stället för separata GIF-bilder** |
| 4 | 5 | Härledning från E = UQ och I = Q/t till P = UI, RI² och U²/R |
| 5 | 6 | Dubbla strömmen → fyra gånger effekten (konstant R); 500 W/230 V och elevuppgift |
| 6 | 7 | 1 500 W + 1 200 W över 230 V, 11,7 A, 10 A, säkringens roll |
| 7 | 8 | Riktig seriemodell för batteriets inre resistans, ems och polspänning |
| 8 | 9–10 | Batterimodell med ℰ = 6,0 V, r = 1,0 Ω och jämförelse I = 1,0/2,0 A; färgsegment är volt |
| 9 | 11 | Genomarbetat exempel: r = 1,0 Ω, R = 5,0 Ω, ℰ = 6,0 V; I = 1,0 A och U = 5,0 V |
| 10 | 12 | Elevuppgift R = 3,0 Ω ger 1,5 A och 4,5 V, **originalets Socrative SOC-37285324** |
| 11 | 13 | Bokuppgifter **839–850, s. 298–299**; stöd **s. 294–297 och gröna rutor**; läxa och målanknuten exit |

Det finns **inga nya påstådda Socrative-aktiviteter**. Webbversionens två egna frågor är uttryckligen självkontroller, inte del av originalets Socrative. Den verkliga demonstrationen ersätts inte av en skärmmodell.

## Fysik och matematik

- Verifierade samband: P = E/t, E = Pt, P = UI, P = RI² och P = U²/R under avsedda antaganden.
- Batterimodellen: ℰ = U + rI, I = ℰ/(R + r), U = RI och P_inre = rI², med **r och R i serie**.
- Båda energistaplarna har **samma fasta skala 0–45 000 J**, och fyller skalan vid P=1500 W och t=30 s. Färgsegmenten i batteriet motsvarar **spänningsfall i V**.
- Särskilda ytterlägen kontrollerade: t=0, maximal tid och effekt; ℰ=2/12 V, r=0,5/3 Ω, R=1/10 Ω; återställning och dolda utfall.
- Kretsschema för parallella 230 V-apparater är öppet genom respektive komponent och **saknar förbikopplande kortslutningsväg**.
- I 230 V-exemplet antas resistiva apparater med angivna märkeffekter; säkringens utlösningskarakteristik är i verkligheten tidsberoende. Detta är inte en elevlaboration vid nätspänning.

## Didaktik och undervisning

- Tydligt förutsägelseläge, elever motiverar innan resultat visas. Ändrade parametrar uppdaterar figurer, resultat och beräkningar tills Återställ väljs.
- Matematiska mellanled avslöjas stegvis och ligger direkt vid sina uppgifter och figurer.
- Två klassrum-/repetitionslägen. Repetition har omedelbar förklarande återkoppling för två separat markerade webbfrågor; klassrumsläge återställer eventuell tidigare avslöjad återkoppling.
- Separat lärarstöd innehåller förväntade svar, vanliga missuppfattningar, verkliga demos, säkerhet, förkortningsalternativ och möjlig 70-minutersplan, inklusive **20 minuter skyddat bokarbete**.
- Avslutande uppgiften testar alla tre ursprungliga mål.

## Teknisk test – genomfört

Lokalt Chromium med publiceringslik HTML och inladdade lokala CSS-/JS-filer: **87/87 godkända tester** (resultat i `qa/effekt84-results.json` i arbetsmappen). Testning inkluderade bildantal, bevarade originalmoment, modellekvationer, reglage, gränsfall, dolda svar, av-/påslagning av facit, lägesväxling, navigering, tecken/positiva värden, formatering och frånvaro av JavaScript-undantag.

Sidbreddskontroll av alla **elva** bilder vid 1440, 1280, 768, 390 och 320 px: **0 px horisontell sidöverströmning** i testen. Skärmbilder kontrollerades visuellt på desktop och mobil. Lektionen kräver ingen elevinloggning, lagrar inga svar och innehåller ingen egen datainsamling.

## Avgränsning

Detta är **lokalt Chromium-testad** kod, inte en fullständig verifiering av faktiskt publicerad GitHub Pages-sida, Safari/iPad/iPhone, skärmläsare, projektor eller kunskapsutfall i klassrummet. Efter publicering ska resursvägar och live-visning kontrolleras separat, och undervisningen utvärderas med faktiska elever.