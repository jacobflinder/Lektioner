/* Ma4 4.4 Polynomdivision – matematiktypografi för kontroll och felanalys.
   Berör inte elevens stegvisa divisionsmotor eller textinstruktioner. */
(()=>{'use strict';
const M=window.Ma4Math;
if(!M)throw new Error('Lokalt MathML-stöd saknas');
const {eq,step,answer,solution,insertSolutions,typesetStatic}=M;
insertSolutions({
 a5:solution(
  step('1 · Kontrollera kvot och rest',['Q(x) = 2x² − x − 3','R(x) = 12']),
  step('2 · Multiplicera tillbaka och lägg till resten',[
    '(x + 2)(2x² − x − 3) + 12',
    '= 2x³ − x² − 3x + 4x² − 2x − 6 + 12',
    '= 2x³ + 3x² − 5x + 6'
  ]),
  answer(['P(x) = (x + 2)(2x² − x − 3) + 12']),
  step('3 · Skriv som bråkuttryck där nämnaren är skild från noll',[
    'P(x)/(x + 2) = 2x² − x − 3 + 12/(x + 2)',
    'x ≠ −2'
  ],'Polynomidentiteten P = DQ + R gäller för alla x. Bråkuttrycket är bara definierat när x inte är −2. Resten har grad 0, lägre än divisorns grad 1.')
 ),
 'stop-answer':solution(
  step('1 · Kan 3x + 1 vara rest?',['3x + 1','(3x + 1) − 3(x + 2) = −5'],
    'Nej. Vi kan lägga till 3 i kvoten och få en konstant rest.'),
  step('2 · När stannar divisionen?',[],
    'Vi avslutar vid resten 0 eller när restens grad är mindre än divisorns grad. Resten −5 eller 12 fungerar när divisorn har grad 1.')
 ),
 a6:solution(
  step('1 · Rätta det konstruerade teckenfelet',[
    '−5x − (−2x) = −5x + 2x',
    '= −3x'
  ],'Minustecknet framför den negativa termen gör termen positiv.'),
  step('2 · Subtrahera hela polynomet',[
    '(−x² − 5x + 6) − (−x² − 2x)',
    '= −x² − 5x + 6 + x² + 2x',
    '= −3x + 6'
  ]),
  answer(['−3x + 6'])
 ),
 a7:solution(
  step('Kontrollera genom multiplikation',[
    '(x + 3)(x² − x − 2)',
    '= x³ − x² − 2x + 3x² − 3x − 6',
    '= x³ + 2x² − 5x − 6'
  ]),
  answer(['Q(x) = x² − x − 2','R(x) = 0']),
  step('Varför?',[],'Varje kvotterm ska multipliceras med båda termerna i divisorn.')
 ),
 'zero-help':solution(
  step('Sätt in nollkoefficienten',['x³ − 4x + 3 = x³ + 0x² − 4x + 3'],
    'Det gör att varje grad hamnar i rätt kolumn. Polynomet ändras inte.')
 ),
 a8:solution(
  step('Kontrollera divisionen',[
    '(x − 1)(x² + x − 3)',
    '= x³ + x² − 3x − x² − x + 3',
    '= x³ − 4x + 3'
  ]),
  answer(['Q(x) = x² + x − 3','R(x) = 0'])
 ),
 'extra-a':solution(
  step('Multiplicera tillbaka',['(x + 2)(x + 3) = x² + 5x + 6']),
  answer(['Q(x) = x + 3','R(x) = 0'])
 ),
 'extra-b':solution(
  step('Multiplicera och lägg till resten',[
    '(x − 1)(2x² + 3x − 2) + 2',
    '= 2x³ + x² − 5x + 2 + 2',
    '= 2x³ + x² − 5x + 4'
  ]),
  answer(['Q(x) = 2x² + 3x − 2','R(x) = 2'])
 ),
 'extra-c':solution(
  step('Multiplicera och lägg till resten',[
    '(x + 2)(x² − 2x + 2) + 1',
    '= x³ − 2x + 4 + 1',
    '= x³ − 2x + 5'
  ]),
  answer(['Q(x) = x² − 2x + 2','R(x) = 1'])
 ),
 'extra-d':solution(
  step('Multiplicera tillbaka',['(x − 3)(x² + 4) = x³ − 3x² + 4x − 12']),
  answer(['Q(x) = x² + 4','R(x) = 0']),
  step('Varför saknas x i kvoten?',[],
    'Efter den första kvottermen x² återstår 4x − 12. Nästa kvotterm är därför konstanten 4; koefficienten framför x i kvoten är noll.')
 ),
 a10:solution(
  step('1 · Välj första kvottermen',['x²/x = x'],
    'Multiplicera den högsta termen i divisorn med x för att eliminera x².'),
  step('2 · Subtrahera den första produkten',[
    'x² + x − 5 − x(x + 3)',
    '= x² + x − 5 − (x² + 3x)',
    '= −2x − 5'
  ]),
  step('3 · Välj nästa kvotterm',[
    '(−2x)/x = −2',
    '(−2x − 5) − (−2)(x + 3) = 1'
  ]),
  answer(['Q(x) = x − 2','R(x) = 1']),
  step('4 · Kontrollera och förklara stoppet',[
    '(x + 3)(x − 2) + 1',
    '= x² + x − 6 + 1',
    '= x² + x − 5'
  ],'Resten är konstant och har därför lägre grad än divisorn x + 3.')
 )
});
// Bevara boketiketter, knappar och begreppstext; gör bara rena algebrauttryck till matematik.
typesetStatic();
// Vid genererade tabeller skapas nya celler för varje steg. Den befintliga
// divisionsmotorn anropar M.setFormula i sina renderingsfunktioner.
})();