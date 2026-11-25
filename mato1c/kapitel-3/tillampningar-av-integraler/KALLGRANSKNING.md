# Källgranskning – Tillämpningar av integraler, Ma fortsättning 1c

**Datum:** 25 november 2026  
**Kapitel:** 3.3, avslutande tillämpningar  
**Webb:** `mato1c/kapitel-3/tillampningar-av-integraler/`  
**Omfattning:** 10 huvudbilder + 2 frivilliga extrabilder.

## Studerade original

1. **Lärarens originalfilm:** `240115 Tillämpningar Ma3c 2308.mp4`, 13 minuter 38 sekunder. Kontrollerad mot bildrutor och en kontaktkarta av inspelningen, inklusive originalets handskrivna matematik.
2. **Transkription:** `240115 Tillämpningar Ma3c 2308.txt`. Språk-/avskriftsfel har tolkats mot filmen. Transkriptionens ”argan”, ”deltics”, ”S” och muntliga decimaler ändrar inte den visuella matematiska normen.
3. **Lärarens original-PDF:** `240116 Tillämpningar integraler NaTe22.pdf` (en sida). Detta är en arbetsplan: *Tillämpningar 186–190*, uppgifter *3416–3436*, arbeta sedan med *Kunskapsmatrisen*, nästa lektion repetition/prov. Gammalt läromedels uppgiftsnummer har **inte** använts på webben.
4. **Nuvarande lärobok, foton uppladdade av läraren:** s. 200–202. Sid. 200 behandlar bestämd integral av förändringshastighet och tolkning av enheten (hastighet/sträcka, tillväxt/antal, acceleration/hastighetsändring, effekt/energi). Sid. 201–202 innehåller uppgift 3381 som genomarbetat exempel och numrerade uppgifter 3382–3395 på tre nivåer.
5. **Didaktisk projektkälla:** `Ma3c_2627_Didaktisk_grund_och_lektionsstruktur_v1.4(1).md`, samt senare överordnad projektinstruktion/AGENTS.md.

## Original → webb: obligatorisk innehållskarta

| Originalelement | Webb | Status |
| --- | --- | --- |
| Inledning: tidigare integraler används för tillämpningar | 1 | Bevarat och målpreciserat |
| En krökt positiv graf med rektanglar | 2 | Bevarat, egen exakt SVG-graf |
| Nio rektanglar `A₁` till `A₉`, bredd `Δx`, höjd `f(xᵢ)` | 2 | Bevarat, interaktiv ökning till 18 och 36 |
| `A ≈ ∑ Aᵢ = ∑ f(xᵢ)·Δx` och därefter integral när rektanglarna blir smala | 2–3 | Bevarat; tydligare matematiskt övergångsled |
| Förklara varför symbolen `dx` finns; om den horisontella variabeln är tid används `dt` | 3 | Bevarat; eleven får uttryckligen förklara detta |
| Integraler beskriver sträcka från hastighet | 3–5 | Bevarat; enheter lyfts fram |
| **Lärarens algebraiska norm:** primitiv funktion, `[F(t)]ₐᵇ`, övre värde minus undre värde med alla substitutionsled | 4–8, 10–12 | Bevarat i alla visade fullständiga beräkningar; satsen före första uträkningen |
| Boll rakt upp med en linjärt avtagande positiv hastighet, `0` till given tid, uttryck med integral och fullt svar i meter | 5 | Bevarad exempeltyp. Bokens/originalets `17−10t`, `0,9` är med avsikt **utbytta** mot `16−8t`, `1,5` så att det inte kopierar bokuppgift 3382. |
| Tolkning av svaret och rimlig avrundning/enhet | 5 | Bevarat; svar i meter och kontroll av positiv hastighet |
| Arbeta med **nya** bokens uppgifter på minst två **hela** nivåer | 10 | Anpassat: 3382–3386 / 3387–3393 / 3394–3395, alla deluppgifter på valda nivåer |
| Kunskapsmatrisen efter bokuppgifterna | 10 | Bevarat i synlig elevtext |
| Socrative | — | Fanns inte i detta original och har därför **inte** lagts till |
| ”Rädda en kattunge” som läraren presenterar som *nästa dags* gruppuppgift | — | Avgränsat till framtida lektion; inte infört i denna eftersom uppgiftshäftet inte finns i källorna och aktiviteten uttryckligen avser nästa tillfälle |
| Tidigare upplagas framtidsnotis ”repetition/prov” | — | Inte som elevinstruktion: aktuell provplanering är inte bekräftad och ska inte uppfinnas |

## Didaktiskt förbättrat utan metodbyte

- Bild 1: tre observerbara mål; startfråga knyter an till vardaglig flödesberäkning.
- Bild 2: korrekt rektangelsumma med **mittpunktsvärden** och möjlighet att jämföra nio, arton och trettiosex rektanglar. Kurvan är egen och inte kopierad ur boken.
- Bild 3: kopplar grafens vågräta variabel och notation till fysiska enheter utan att ersätta beräkningsmetoden.
- Bild 4: formulerar redan inlärda **integralkalkylens fundamentalsats** före det ursprungliga bollräknesättet.
- Bild 5: en enda synlig sammanhängande kedja, i lärarens ordning, med beräkningsvärde och enhet.
- Bild 6: självständig överföring till vätskeflöde med samma kedja; inte lärobokens tal.
- Bild 7: lärobokens fyra kategorier (hastighet, acceleration, effekt, population) kopplas tydligt till rätt enheter. Algebraiskt accelerationsexempel använder exakt samma metod.
- Bild 8: startvärdet läggs till *efter* den med fundamentalsatsen beräknade förändringen, för att förbereda 3385–3386; egen fiskmodell.
- Bild 9: individuell kontroll av tolkning och enheter innan arbetstid.
- Bild 10: fullständig bokarbetsinstruktion, tre synliga mål med hänvisningar till redan valda bokuppgifter, därefter Kunskapsmatrisen. Den tidigare separata slutkontrollen med nya räkneuppgifter har tagits bort efter lärarens återkoppling 25 november.
- Bilder 11–12: märkta extra, med energi/effekt och valbar digital kontroll. Ingen av dem behövs för att nå bokarbetet.

## Matematiska kontrollpunkter

- Mittpunktsrektanglar på den egna grafen `f(x)=3+2x−0,5x²`, `0≤x≤4`: `f(x)>0`, rektangelbredden är `4/n`. Exakt integral `52/3 ≈ 17,333`, summorna närmar sig detta värde för ökat `n`.
- Boll: `∫₀^1,5(16−8t)dt = [16t−4t²]₀^1,5 = (24−9)−0 = 15 m`, och `v(t)>0` på intervallet.
- Vatten: `∫₀⁴(12+3t)dt=[12t+(3/2)t²]₀⁴=(48+24)−0=72 liter`.
- Acceleration: `∫₀⁴ 3dt=[3t]₀⁴=12 m/s`.
- Fiskar: `∫₀³ (6+2t)dt=[6t+t²]₀³=27`; `90+27=117` fiskar.
- Effekt: `∫₀²⁰ (300+10t)dt = 8 000 J`; valbar modell `∫₀⁶⁰(100+4t+0,05t²)dt=16 800 J`.
- Målåterkoppling: mål 1 hänvisar till **3383, 3388 a–c och 3392**, mål 2 till **3382, 3383, 3384 b och 3393**, mål 3 till **3385 b och 3386 b**. Dessa är befintliga bokuppgifter och innebär ingen extra elevbelastning.

## Justering av matematisk typografi

- Arbetsgången på bild 4 använder samma symmetriskt satta `msubsup`-notation för gränserna på `[F(t)]` som själva fundamentalsatsen, i stället för två separata HTML-taggar `sub` och `sup`. Matematiken och räkneordningen är oförändrade.

## Redaktionell gräns

Inga av lärobokens fyra exempel, dess ordval eller originalets/nya bokens exakt sammanfallande bolltal kopieras som nytt genomgångsexempel. **Uppgifts- och sidnummer är däremot avsiktligt exakta.** Kapitel 3 avslutas här i bokmaterialet som har lämnats; ingen återstående sida efter 202 kan bekräftas utan nytt underlag.
