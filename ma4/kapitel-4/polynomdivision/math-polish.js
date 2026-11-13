/* Ma4 12/41: varje kontroll har alla relevanta matematiska mellanled
 * och fristående ekvationer med projektets ≥16 px vertikala avstånd.
 * Den stegvisa interaktiva divisionsmotorn, NOKflex och originaluppgifter bevaras. */
(()=>{'use strict';
const M=window.Ma4Math;
if(!M)throw new Error('Lokalt MathML-stöd saknas');
const {step,answer,solution,insertSolutions,typesetStatic}=M;
insertSolutions({
 a5:solution(
  step('1 · Identifiera kvot, rest och divisor',['D(x) = x + 2','Q(x) = 2x² − x − 3','R(x) = 12']),
  step('2 · Multiplicera varje term med hela kvoten',[
    'x(2x² − x − 3)','= 2x³ − x² − 3x',
    '2(2x² − x − 3)','= 4x² − 2x − 6'
  ]),
  step('3 · Samla termer av samma grad och addera resten',[
    '−x² + 4x² = 3x²','−3x − 2x = −5x','−6 + 12 = 6',
    '2x³ + 3x² − 5x + 6'
  ]),
  answer(['P(x) = (x + 2)(2x² − x − 3) + 12']),
  step('4 · Bråkuttrycket har ett extra villkor',[
    'P(x) = (x + 2)Q(x) + 12',
    'P(x)/(x + 2)',
    '= Q(x) + 12/(x + 2)',
    'Q(x) = 2x² − x − 3','x ≠ −2'
  ],'Polynomidentiteten P = DQ + R gäller för alla reella x. Kvoten som bråkuttryck är inte definierad vid x = −2; resten 12 har grad 0, lägre än divisorns grad 1.')
 ),
 'stop-answer':solution(
  step('1 · Högsta termen går fortfarande att eliminera',[
    '3x + 1','3(x + 2) = 3x + 6',
    '(3x + 1) − (3x + 6)',
    '= 3x + 1 − 3x − 6','= −5'
  ]),
  answer(['R(x) = −5']),
  step('2 · Stoppvillkoret',[
    'grad(−5) = 0','grad(x + 2) = 1'
  ],'Den nya resten har lägre grad än divisorn. Även resterna 12 och 0 är tillåtna när divisorn har grad 1. Man får inte stanna med en rest av grad 1 eller högre.')
 ),
 a6:solution(
  step('1 · Subtraktion av negativ term',[
    '−5x − (−2x)','= −5x + 2x','= −3x'
  ]),
  step('2 · Subtrahera båda termerna i produkten',[
    '(−x² − 5x + 6) − (−x² − 2x)',
    '= −x² − 5x + 6 + x² + 2x',
    '−x² + x² = 0','−5x + 2x = −3x'
  ]),
  answer(['−3x + 6']),
  step('3 · Varför uppstod felet?',[],'Ett yttre minustecken framför parentesen byter tecken på varje term inne i parentesen, även på en negativ term.')
 ),
 a7:solution(
  step('1 · Välj och multiplicera första kvottermen',[
    'x³/x = x²','x²(x + 3) = x³ + 3x²',
    '2x² − 3x² = −x²'
  ]),
  step('2 · Fortsätt med nästa högsta term',[
    '−x²/x = −x','−x(x + 3) = −x² − 3x',
    '−5x − (−3x) = −2x'
  ]),
  step('3 · Avsluta divisionen',[
    '−2x/x = −2','−2(x + 3) = −2x − 6',
    '(−2x − 6) − (−2x − 6) = 0'
  ]),
  step('4 · Kontrollera hela produkten',[
    'x(x² − x − 2) = x³ − x² − 2x',
    '3(x² − x − 2) = 3x² − 3x − 6',
    '−x² + 3x² = 2x²',
    '−2x − 3x = −5x'
  ]),
  answer(['Q(x) = x² − x − 2','R(x) = 0']),
  step('5 · Bekräfta slutsatsen',['P(x) = (x + 3)(x² − x − 2)'],'Alla termer från första divisionens täljare återfås och resten är noll.')
 ),
 'zero-help':solution(
  step('Placera alla grader, även med koefficienten noll',[
    'x³ − 4x + 3','= x³ + 0x² − 4x + 3'
  ],'Nolltermen ändrar inte polynomet utan visar x²-kolumnen i den liggande stolen.')
 ),
 a8:solution(
  step('1 · Välj första kvottermen',['x³/x = x²','x²(x − 1) = x³ − x²','0x² − (−x²) = x²']),
  step('2 · Välj den andra kvottermen',['x²/x = x','x(x − 1) = x² − x','−4x − (−x) = −3x']),
  step('3 · Bestäm den sista kvottermen',['−3x/x = −3','−3(x − 1) = −3x + 3','(−3x + 3) − (−3x + 3) = 0']),
  step('4 · Kontrollera genom multiplikation',[
    'x(x² + x − 3) = x³ + x² − 3x',
    '−1(x² + x − 3) = −x² − x + 3',
    'x² − x² = 0','−3x − x = −4x'
  ]),
  answer(['Q(x) = x² + x − 3','R(x) = 0'])
 ),
 'extra-a':solution(
  step('1 · Första kvottermen',['x²/x = x','x(x + 2) = x² + 2x','5x − 2x = 3x']),
  step('2 · Andra kvottermen',['3x/x = 3','3(x + 2) = 3x + 6','(3x + 6) − (3x + 6) = 0']),
  step('3 · Kontrollera',['x(x + 3) = x² + 3x','2(x + 3) = 2x + 6','3x + 2x = 5x']),
  answer(['Q(x) = x + 3','R(x) = 0'])
 ),
 'extra-b':solution(
  step('1 · Första kvottermen',['2x³/x = 2x²','2x²(x − 1) = 2x³ − 2x²','x² − (−2x²) = 3x²']),
  step('2 · Andra kvottermen',['3x²/x = 3x','3x(x − 1) = 3x² − 3x','−5x − (−3x) = −2x']),
  step('3 · Tredje kvottermen och rest',['−2x/x = −2','−2(x − 1) = −2x + 2','(−2x + 4) − (−2x + 2) = 2']),
  step('4 · Kontrollera genom multiplikation',[
    'x(2x² + 3x − 2) = 2x³ + 3x² − 2x',
    '−1(2x² + 3x − 2) = −2x² − 3x + 2',
    '3x² − 2x² = x²','−2x − 3x = −5x','2 + 2 = 4'
  ]),
  answer(['Q(x) = 2x² + 3x − 2','R(x) = 2'])
 ),
 'extra-c':solution(
  step('1 · Skriv nollkoefficienten',['x³ − 2x + 5','= x³ + 0x² − 2x + 5']),
  step('2 · Första kvottermen',['x³/x = x²','x²(x + 2) = x³ + 2x²','0x² − 2x² = −2x²']),
  step('3 · Andra kvottermen',['−2x²/x = −2x','−2x(x + 2) = −2x² − 4x','−2x − (−4x) = 2x']),
  step('4 · Tredje kvottermen och rest',['2x/x = 2','2(x + 2) = 2x + 4','(2x + 5) − (2x + 4) = 1']),
  step('5 · Kontrollera',['x(x² − 2x + 2) = x³ − 2x² + 2x','2(x² − 2x + 2) = 2x² − 4x + 4','2x − 4x = −2x','4 + 1 = 5']),
  answer(['Q(x) = x² − 2x + 2','R(x) = 1'])
 ),
 'extra-d':solution(
  step('1 · Första kvottermen',['x³/x = x²','x²(x − 3) = x³ − 3x²','(x³ − 3x²) − (x³ − 3x²) = 0']),
  step('2 · Nästa högsta term och kvotterm',['4x/x = 4','4(x − 3) = 4x − 12','(4x − 12) − (4x − 12) = 0']),
  step('3 · Kontrollera genom multiplikation',['x(x² + 4) = x³ + 4x','−3(x² + 4) = −3x² − 12']),
  answer(['Q(x) = x² + 4','R(x) = 0']),
  step('Varför saknas x i kvoten?',[],'Efter x² finns ingen återstående x²-term att eliminera, så kvotens x-koefficient är noll. Nästa kvotterm är i stället konstanten 4.')
 ),
 a10:solution(
  step('1 · Välj första kvottermen',['x²/x = x','x(x + 3) = x² + 3x']),
  step('2 · Subtrahera hela första produkten',[
    'x² + x − 5 − (x² + 3x)',
    '= x² − x² + x − 3x − 5',
    'x² − x² = 0','x − 3x = −2x','= −2x − 5'
  ]),
  step('3 · Välj sista kvottermen',['−2x/x = −2','−2(x + 3) = −2x − 6']),
  step('4 · Beräkna resten med teckenkontroll',[
    '(−2x − 5) − (−2x − 6)',
    '= −2x − 5 + 2x + 6','= 1'
  ]),
  answer(['Q(x) = x − 2','R(x) = 1']),
  step('5 · Kontrollera genom multiplikation',['x(x − 2) = x² − 2x','3(x − 2) = 3x − 6','−2x + 3x = x','−6 + 1 = −5','P(x) = x² + x − 5'],
    'Restens grad är 0 och divisorns grad är 1. Ett nytt polynomled i kvoten behövs alltså inte.')
 )
});
typesetStatic();
})();