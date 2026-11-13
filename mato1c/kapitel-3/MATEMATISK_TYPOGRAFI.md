# Matematisk typografi · Matematik fortsättning nivå 1c

**Status:** Tredje kvalitetsronden för tio publicerade lektioner. Granskningen omfattar synliga matematikgenomgångar, stegvisa facit och lösningar bakom ”Visa lösning” och ”Visa nästa steg”.

## Gemensam standard

1. **En beräkning per logisk rad.** Matematisk härledning, testvärden, ekvationskedjor och gränsvärden skiljs från förklarande meningar. Den redan befintliga kursuppsättningen med matematikklasser får gemensam visuell standard i assets/lesson.css.
2. **Löptext där löptext fungerar.** Korta uttryck som f′(x)>0 får finnas i en mening som förklarar deras betydelse. Däremot packas inte flera uträkningar och slutsatser i samma textstycke.
3. **Beräkningar före slutsats.** Grupper av matematiska rader har en sammanhållen typografi. Ett tydligt resultatelement används där det hjälper eleven att skilja maximum, minimum, x-värde och enhet.
4. **Korrekt matematik:** exponenter, index, vertikalt satta bråk och gränsvärden behålls eller förbättras. När en ungefärlig extrempunkt anger teckengräns använder vi den exakta kandidaten och avrundar först i det praktiska svaret.
5. **Mobil och projektor:** jämna, läsbara matematikrader med egna begränsade ytor; långa uttryck får intern sidrullning i stället för att hela lektionssidan behöver rulla i sidled.
6. **Inga externa beroenden:** ingen MathJax- eller KaTeX-CDN, ingen inloggning, ingen insamling av elevuppgifter.

## Genomförda typografiska förbättringar

| Lektion | Exempel på ändring |
| --- | --- |
| 1. Växande och avtagande | Testvärden för derivatans tecken ligger på varsin matematikrad. |
| 2. Extrempunkter och terrasspunkter | Stationära testvärden, värdet på funktionen och punkttypen visas tydligt åtskilda. |
| 3. Andraderivatan | Första/andra derivatan och exempelvärden skiljs från tolkningen i löptext. |
| 4. Andraderivatans roll för grafen | Första- och andraderivatan av två funktioner får egna rader. |
| 5. Funktionens graf och derivatornas grafer | Tre exempel med samma värde och första derivata men olika andraderivata visas som separata matematiska uppställningar. |
| 6. Största och minsta värde | Kandidatvärden och största/minsta värden får egna tydligt avskilda rader. |
| 7. Extremvärdesproblem med polynomfunktioner | Repetitionsuppgift, sålda biljetter, raketens möjliga tider och ändvärden får tydliga separata rader. |
| 8. Modellering och fler extremvärdesproblem | Derivatans tecken per intervall och exakt gräns för den stationära kandidaten före avrundning. |
| 9. Blandade problem | Vattenmodellens andraderivata och största inflöde får separata uttryck; även robot, bråkrepetition och terrassargument är uppställda. |
| 10. Deriverbarhet | Ensidiga kvotvärden, grenvärden och skarvvillkor får egna matematiska rader. |

## Teknisk uppföljning

- Kursens tio tidigare Chromium-tester skyddar interaktivitet, bokuppgifter, läxor och matematik.
- Nytt test: qa/math-typography-browser.cjs öppnar en stegvis matematisk lösning i **alla tio** lektioner, kontrollerar läsbara separata ekvationsblock samt gör dator- och mobilskärmbilder.
- GitHub Actions arbetsflöde mato1c-browser-qa.yml kör testet efter de tio befintliga.
- Automatisk funktionalitet och typografisk kontroll är **inte** ett bevis för bättre lärandeeffekt. Resultaten behöver fortfarande prövas på projektor och med elevlösningar.

**Källtrohet:** Endast presentation och typografi justeras. Originalens matematiska exempel, konkreta uppgiftsnummer, läxor, Socrative och undervisningens innehåll ändras inte.
