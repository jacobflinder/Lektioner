/* Ma4 4.2 · Multiplicera och dividera med i: separata beräkningsled.
   Elevens arbete, rotationsfiguren och bokuppgifterna behålls. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
 'startans':solution(
  step('1 · Multiplicera och använd i² = −1',
   ['z = 2 + i',
    'iz = i(2 + i)',
    '= 2i + i²',
    '= 2i − 1']),
  answer(['iz = −1 + 2i']),
  step('2 · Jämför punkterna',
   ['z = (2; 1)',
    'iz = (−1; 2)'],
   'Multiplikation med i roterar 90° moturs.'),
  step('3 · Kontrollera längden',
   ['|z| = √(2² + 1²) = √5',
    '|iz| = √((−1)² + 2²) = √5'])
 ),
 'trapans':solution(
  step('1 · Konjugera: spegla i realaxeln',
   ['z = 1 + 2i',
    'z̄ = 1 − 2i']),
  step('2 · Multiplicera med i: rotera moturs',
   ['iz = i(1 + 2i)',
    '= i + 2i²',
    '= −2 + i']),
  step('3 · Dividera med i: rotera medurs',
   ['z/i = −i(1 + 2i)',
    '= −i − 2i²',
    '= 2 − i']),
  step('Vad skiljer operationerna?',[],'Konjugering speglar i realaxeln. Multiplikation och division med i roterar 90° i olika riktningar. Alla tre resultaten har samma absolutbelopp som z.')
 ),
 'practiceans':solution(
  step('1 · Multiplicera med i',
   ['z = −3 + 2i',
    'iz = i(−3 + 2i)',
    '= −3i + 2i²',
    '= −2 − 3i']),
  step('2 · Dividera med i',
   ['z/i = −i(−3 + 2i)',
    '= 3i − 2i²',
    '= 2 + 3i']),
  step('3 · Kontrollera absolutbeloppen',
   ['|z| = √((−3)² + 2²) = √13',
    '|iz| = √((−2)² + (−3)²) = √13',
    '|z/i| = √(2² + 3²) = √13']),
  answer(['iz = −2 − 3i','z/i = 2 + 3i']),
  step('Riktning',[],'Multiplikation med i är moturs; division med i är medurs. Samtliga punkter har samma avstånd till origo.')
 ),
 'exitans':solution(
  step('1 · Multiplicera med i',
   ['z = 1 − 2i',
    'iz = i(1 − 2i)',
    '= i − 2i²',
    '= 2 + i']),
  step('2 · Dividera med i',
   ['z/i = −i(1 − 2i)',
    '= −i + 2i²',
    '= −2 − i']),
  answer(['iz = 2 + i','z/i = −2 − i']),
  step('3 · Kontrollera att längden bevaras',
   ['|z| = √(1² + (−2)²) = √5',
    '|iz| = √(2² + 1²) = √5',
    '|z/i| = √((−2)² + (−1)²) = √5']),
  step('Förklara rotationen',[],'Multiplikation med i roterar 90° moturs. Division med i roterar 90° medurs. Koordinaterna ändras, men avståndet till origo bevaras.')
 )
});
typesetStatic();
})();