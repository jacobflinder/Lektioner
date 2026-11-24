# Källkontroll – 9.8 Fusion och fission

**Status: UTKAST / STOPP. Publiceras inte som färdig lektion innan uppgiftstexterna och bokteorisidorna kan granskas.**

## Faktiskt kontrollerade källor
- 231002 Fission Na22.pdf och 231002 Fission Fy1 2208.txt.
- 231003 Fusion Na22.pdf och 231003 Fusion Fy1 2208.txt.
- Planering 01. åk2 Na25 Planering Fy1.pdf: 9.8 s. 370–375, uppgifter 974–987.
- Veritasium-klippet "Where Does The Sun Get Its Energy?" https://youtu.be/Ux33-5k8cjg, bevarat. Ursprunglig fissionsförklaring https://youtu.be/wtpNxiqVAOo bevarad som valfri repetition.
- Tillgängligt originalmaterial i denna session: **PDF och full texttranskription**, inte egen bildruta-för-bildruta-kontroll av de gamla filmerna.
- **Boksidan s. 375 med uppgifternas faktiska texter och teorisidorna 370–374 kunde inte återöppnas genom den aktuella filåtkomsten**, trots att användaren hade laddat upp bilderna i en tidigare projektchatt 23 november 2026. Utdrag i planeringen anger intervall, men inte korrekta teorisidhänvisningar per uppgift. Dessa är därför markerade **"Teorisida under källkontroll"**, inte gissade.

## Original → elevwebb

| Originalidé / metod / aktivitet | Ny bild | Bedömning |
|---|---|---|
| Fission = tung kärna klyvs; U-235 tar upp neutron → U-236* → två fragment + neutroner + energi | 3 | Bevarat med tydlig egen figur |
| Ca 200 MeV per typisk klyvning | 3,4 | Bevarat och skilt från total kraftproduktion |
| Kedjereaktion: neutroner ger fler klyvningar; skillnad mellan stoppad, stabil och ökande reaktion | 4–5 | Förbättrat med synlig interaktiv generationsmodell |
| Skillnad kärnkraftverk / okontrollerad kedja; radioaktiva fissionsfragment | 5 | Bevarat begreppsligt. Inga riskabla konstruktionsexempel tillförda |
| Originalets fissionsförberedelsefilm | 3 | Bevarad som valfri repetitionslänk |
| Fusion med Veritasium-klipp före egen fusionstankekarta och frågestund | 6–7 | Bevarat; filmfrågorna används i framklickad visualisering |
| Positiva kärnor stöter bort varandra elektriskt, hög T kan underlätta nära möten | 6–7 | Bevarat utan ett nytt specialfall; visualiseringen visar hur högre rörelseenergi gör nära möten möjliga men är inte en modell för verklig reaktionssannolikhet |
| D + D → He-3 + neutron + E | 7–8 | Bevarat ordagrant som Jacobs representativa fusionsexempel |
| Jacobs massdefektmetod: m_före − m_efter (atommassor); samma antal elektroner på båda sidor | 8 steg 1–4 | Bevarat i fullständiga led |
| 2·2,014102 u = 4,028204 u; 3,016029 u + 1,008665 u = 4,024694 u; Δm=0,003510 u | 8 steg 1–4 | Bevarat, avrundat enligt källvärden |
| Δmc², 1 u·c²≈931,5 MeV; E≈3,27 MeV | 8 steg 5–6 | Bevarat som ursprunglig korta MeV-metod (eleverna har full SI-metod från 9.4) |
| Grupparbete (gamla 1158–1165 och 1166–1172) | 9 | Ersatt av nya bokens 974–987, samtliga obligatoriska |
| Separat gemensam mindmap | 3–8 | Explicit bevarad mindmap-aktivitet på bild 3 (fission) och bild 6 (fusion efter filmen), samtidigt som begreppen byggs upp stegvis |
| Tre mål, individuell utcheckning, det som inte hinns läxa | 2,9,10 | Förbättrat. Målkoppling för varje bokuppgift **blockerad av saknad verifierad uppgiftstext** |

## Särskild faktakonflikt
I transkriptionen 231002 anges att kommersiella kraftreaktorer skulle kräva cirka **90 % anrikat U-235**. Detta är felaktigt: kommersiella termiska lättvattenreaktorer använder typiskt låganrikat uran på några få procent U-235. Siffran har **inte** flyttats till elevwebben. Skillnaden mellan en kontrollerad och okontrollerad kedjereaktion förklaras i stället med neutronernas fortsättning/absorption. Detta måste redovisas öppet; lärarens fysikaliskt felaktiga tal får inte göras till undervisningsnorm.

## Interaktioner
- Ursprungliga fissionsprincipen: generationsmodell med elevval först, resultat/återkoppling sedan.
- Fusionens elektriska repulsion och möjlig sammanslagning vid högre rörelseenergi: visuellt val → demonstration → förklaring.
- Två olika skeenden, inte ett påstående att alla kollisioner leder till fusion.
- Ingen Socrative; saknas i båda originalen.

## Blockerande publiceringskrav
1. Direktgranska bokens s. 370–375 och exakt varje uppgift 974–987.
2. Koppla **varje uppgift** till relevant veriferad teorisida/figur/tabell och under rätt elevmål.
3. Jämför eventuella genomräknade uppgifter på bokunderlaget med originalets norm och återställ nödvändiga detaljer.
4. Verifiera modeller, alla svarsalternativ, mellanled och faktisk layout på 390, 768, 1280 och 1920 px med GitHub Actions.
5. Granska resultatbilder och signera att ingenting innehållsligt bortfallit.

## Visuell originalgranskning och ny layoutkontroll (24 november 2026)

- Originalvideo: representativa bildrutor från fissionsfilmen har granskats mot PDF/transkript: sekund 30, 120, 240, 360, 480, 600 och 720. Videon i sin helhet är inte omgranskad bildruta för bildruta. Fusionsvideon på 2,2 GB är inte tillgänglig som fil, men dess transkription och PDF är lästa.
- Första gröna webbläsarkörningen på granskningsgrenen gav skärmbilder i 390/768/1280/1920 px, men **visuell granskning hittade dolda delar av återkopplingen i iframe**. På mobil var även massdefektens mellanled för långa.
- Koden har nu fått en höjdrapporterande iframe-lösning som låter rutan växa efter elevval/feedback. Fusionens massdefekt har delats upp i flera **sammanhängande, fullt synliga matematiska led på samma bild**, med korrekta enheter. Ingen fysikalisk metod eller begreppsordning har bytts ut.
- Förnyat GitHub-test kräver nu fullt synliga matematiska uttryck, ingen dold iframe-återkoppling och både fissions- och fusionsdemonstration.
- Publiceringsspärren kvarstår oavsett teknisk teststatus, tills var och en av de 14 bokuppgifterna fått verifierad individuell teorisida och korrekt målkoppling.
