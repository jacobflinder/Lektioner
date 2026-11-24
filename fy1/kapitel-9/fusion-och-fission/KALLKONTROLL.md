# Källkontroll – 9.8 Fusion och fission

**Status 24 november: Boktext och samtliga uppgiftstexter verifierade. Utökad webbläsar- och fysikgranskning återstår före merge/publicering.**

## Faktiskt kontrollerade källor
- 231002 Fission Na22.pdf och 231002 Fission Fy1 2208.txt.
- 231003 Fusion Na22.pdf och 231003 Fusion Fy1 2208.txt.
- Planering 01. åk2 Na25 Planering Fy1.pdf: 9.8 s. 370–375, uppgifter 974–987.
- Veritasium-klippet "Where Does The Sun Get Its Energy?" https://youtu.be/Ux33-5k8cjg, bevarat. Ursprunglig fissionsförklaring https://youtu.be/wtpNxiqVAOo bevarad som valfri repetition.
- Tillgängligt originalmaterial i denna session: **PDF och full texttranskription**, inte egen bildruta-för-bildruta-kontroll av de gamla filmerna.
- Direkt återfunna bokfoton i det befintliga källmaterialet: `IMG_6544.jpg`–`IMG_6549.jpg` (s. 370–375). Uppgift 974–987, deras deluppgifter och samtliga tilldelade teorisidor har granskats mot bokfotona. Användaren har även bifogat tydliga bilder av s. 370–374 under denna granskning.

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
| Grupparbete (gamla 1158–1165 och 1166–1172) | 9 | Nya bokens 974–987, samtliga obligatoriska, grupperade per mål med individuel teorisida |
| Separat gemensam mindmap | 3–8 | Explicit bevarad mindmap-aktivitet på bild 3 (fission) och bild 6 (fusion efter filmen), samtidigt som begreppen byggs upp stegvis |
| Tre mål, individuell utcheckning, det som inte hinns läxa | 2,9,10 | Förbättrat. Samtliga 14 bokuppgifter står under sitt primärmål och sin teorisida på både uppgiftsbilden och slutbilden |
| Radioaktivt bränsle efter avslutad klyvning; U-235/U-238 över tid; solens balans | 5–6 | Återinfört efter bokens frågor 977, 980 och 984. Ursprungligt innehåll kompletterat med bokstyrt stoff utan metodbyte |

## Särskild faktakonflikt
I transkriptionen 231002 anges att kommersiella kraftreaktorer skulle kräva cirka **90 % anrikat U-235**. Detta är felaktigt: kommersiella termiska lättvattenreaktorer använder typiskt låganrikat uran på några få procent U-235. Siffran har **inte** flyttats till elevwebben. Skillnaden mellan en kontrollerad och okontrollerad kedjereaktion förklaras i stället med neutronernas fortsättning/absorption. Detta måste redovisas öppet; lärarens fysikaliskt felaktiga tal får inte göras till undervisningsnorm.

## Interaktioner
- Ursprungliga fissionsprincipen: generationsmodell med elevval först, resultat/återkoppling sedan.
- Fusionens elektriska repulsion och möjlig sammanslagning vid högre rörelseenergi: visuellt val → demonstration → förklaring.
- Två olika skeenden, inte ett påstående att alla kollisioner leder till fusion.
- Ingen Socrative; saknas i båda originalen.

## Bokuppgift → mål → teorisida (verifierat mot s. 375)

| Mål | Uppgifter (stöd i teorin) |
|---|---|
| 1 Fission och kärnkraft | 974 (371), 975 (371), 976 (371–372), 977 (372), 979 (371), 980 (371–372) |
| 2 Fusion och dess förutsättningar | 982 (372–373), 983 (373), 984 (373), 986 (373) |
| 3 Kärnreaktioner och energi | 978 (370, repetera 9.3), 981 (370, repetera 9.3), 985 (373), 987 (373) |

## Publiceringskontroll

1. **Klart:** Direktgranskat teori s. 370–374 och 14 uppgifter på s. 375; varje uppgift kopplad till mål och relevant teorisida.
2. **Klart:** Lärarens D+D-massdefekt, figur, mellanled och elektronbokföring bevarade; de nya bokuppgifterna använder vid behov repetition från 9.3.
3. **Återstår:** Visuell kontroll i 390, 768, 1280, 1920 px, båda interaktiva modellerna och återkopplingar i senaste PR-commit.
4. **Återstår:** Oberoende kontroll av alla fysikaliska påståenden och jämförelse av slutresultat med originalen innan publiceringsspärren lyfts.

## Visuell originalgranskning och ny layoutkontroll (24 november 2026)

- Originalvideo: representativa bildrutor från fissionsfilmen har granskats mot PDF/transkript: sekund 30, 120, 240, 360, 480, 600 och 720. Videon i sin helhet är inte omgranskad bildruta för bildruta. Fusionsvideon på 2,2 GB är inte tillgänglig som fil, men dess transkription och PDF är lästa.
- Första gröna webbläsarkörningen på granskningsgrenen gav skärmbilder i 390/768/1280/1920 px, men **visuell granskning hittade dolda delar av återkopplingen i iframe**. På mobil var även massdefektens mellanled för långa.
- Koden har nu fått en höjdrapporterande iframe-lösning som låter rutan växa efter elevval/feedback. Fusionens massdefekt har delats upp i flera **sammanhängande, fullt synliga matematiska led på samma bild**, med korrekta enheter. Ingen fysikalisk metod eller begreppsordning har bytts ut.
- Förnyat GitHub-test kräver nu fullt synliga matematiska uttryck, ingen dold iframe-återkoppling och både fissions- och fusionsdemonstration.
- **Tidigare stopporsak borttagen:** bokens s. 375 har återfunnits i `source_book/Fy N1b 2627/IMG_6549.jpg`. Slutligt godkännande kräver fortfarande ny visuell QA och original-till-webb-granskning.
