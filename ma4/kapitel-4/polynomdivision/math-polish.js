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
    'R(x) = −5','D(x) = x + 2','0 < 1'
  ],'Restens grad är 0 och divisorns grad är 1. Den nya resten har därför lägre grad än divisorn. Även resterna 12 och 0 är tillåtna. Man får inte stanna med en rest av grad 1 eller högre.')
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
    'x(2x² + 3x − 2)','= 2x³ + 3x² − 2x',
    '−1(2x² + 3x − 2)','= −2x² − 3x + 2',
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

/* Visual comprehension: these visuals are attached AFTER insertSolutions()
   replaces the answer bodies, so they stay tied to the correct hidden
   solution and never leak into the question before reveal. */
const visualFeedback={
  a5: "<div class=\"coefficient-check\"><table aria-label=\"Kolumnvis kontroll av x gånger kvoten, 2 gånger kvoten och resten. Summan ger ursprungspolynomet.\"><caption>Kontroll i samma gradkolumner – addera lodrätt</caption><thead><tr><th scope=\"col\">Del</th><th scope=\"col\">x³</th><th scope=\"col\">x²</th><th scope=\"col\">x</th><th scope=\"col\">Konstant</th></tr></thead><tbody><tr><th scope=\"row\">x · Q</th><td>2</td><td>−1</td><td>−3</td><td>0</td></tr><tr><th scope=\"row\">2 · Q</th><td>0</td><td>4</td><td>−2</td><td>−6</td></tr><tr><th scope=\"row\">R</th><td>0</td><td>0</td><td>0</td><td>12</td></tr><tr class=\"result\"><th scope=\"row\">Summa = P</th><td>2</td><td>3</td><td>−5</td><td>6</td></tr></tbody></table></div><p class=\"muted\">Exempel: x-kolumnen ger −3 − 2 + 0 = −5. Siffrorna är koefficienter till graden ovanför.</p>",
  a6: "<svg class=\"sign-line-figure\" viewBox=\"0 0 520 192\" role=\"img\" aria-label=\"Koefficienternas tallinje visar felaktigt steg minus 2 från minus 5 till minus 7 och korrekt steg plus 2 från minus 5 till minus 3.\">\n<rect x=\"0\" y=\"0\" width=\"520\" height=\"192\" rx=\"10\" fill=\"#f8fbfd\"/>\n<text x=\"17\" y=\"24\" font-size=\"17\" font-weight=\"750\" fill=\"#204456\">Vad händer med koefficienten −5?</text>\n<path d=\"M60 136H442\" stroke=\"#668596\" stroke-width=\"2.5\"/>\n<g font-size=\"15\" text-anchor=\"middle\" fill=\"#304b5a\">\n<path d=\"M65 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"65\" y=\"163\">-8</text><path d=\"M109 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"109\" y=\"163\">-7</text><path d=\"M153 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"153\" y=\"163\">-6</text><path d=\"M197 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"197\" y=\"163\">-5</text><path d=\"M241 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"241\" y=\"163\">-4</text><path d=\"M285 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"285\" y=\"163\">-3</text><path d=\"M329 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"329\" y=\"163\">-2</text><path d=\"M373 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"373\" y=\"163\">-1</text><path d=\"M417 130v12\" stroke=\"#688694\" stroke-width=\"2\"/><text x=\"417\" y=\"163\">0</text>\n</g>\n<circle cx=\"197\" cy=\"136\" r=\"6.5\" fill=\"#254e65\"/><text x=\"197\" y=\"187\" text-anchor=\"middle\" font-size=\"14\" fill=\"#254e65\">Start: −5</text>\n<path d=\"M197 68H109\" stroke=\"#bb5b48\" stroke-width=\"5\" fill=\"none\"/>\n<path d=\"M124 57L108 68L124 79\" stroke=\"#bb5b48\" stroke-width=\"5\" fill=\"none\"/>\n<text x=\"153\" y=\"54\" text-anchor=\"middle\" font-size=\"14\" fill=\"#873c2e\">Fel: −2 → −7</text>\n<path d=\"M197 100H285\" stroke=\"#137e6a\" stroke-width=\"5\" fill=\"none\"/>\n<path d=\"M270 89L286 100L270 111\" stroke=\"#137e6a\" stroke-width=\"5\" fill=\"none\"/>\n<text x=\"247\" y=\"90\" text-anchor=\"middle\" font-size=\"14\" fill=\"#0e6352\">Rätt: +2 → −3</text>\n</svg><p class=\"muted\">Tallinjen gäller koefficienterna. Eftersom vi subtraherar <b>−2x</b> flyttar vi koefficienten två steg åt höger, och <b>x</b> följer med.</p>",
  'zero-help': "<div class=\"degree-place-map\" role=\"img\" aria-label=\"Fyra gradkolumner med x kubik, noll x kvadrat, minus fyra x och plus tre. Den saknade x kvadrat-termen har koefficient noll.\"><div class=\"degree-cell\"><strong>Grad 3</strong><span>x³</span></div><div class=\"degree-cell degree-zero\"><strong>Grad 2</strong><span>0x²</span></div><div class=\"degree-cell\"><strong>Grad 1</strong><span>−4x</span></div><div class=\"degree-cell\"><strong>Grad 0</strong><span>+3</span></div></div>"
};
for(const [id,markup] of Object.entries(visualFeedback)){
 const answer=document.getElementById(id);
 if(!answer)throw new Error('Visual feedback target missing: '+id);
 answer.insertAdjacentHTML('beforeend',markup);
}

})();