/* Ma4 4.1 · Komplexa tal som vektorer: matematiken uppställd i korta led.
   Huvudväg, frivillig geometriväg, interaktivitet och uppgifter bevaras. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
 'tryans':solution(
  step('1 · Punkt och positionsvektor',['w = −2 + 3i','P = (−2; 3)']),
  step('2 · Använd Pythagoras',['|w| = √((−2)² + 3²)','= √(4 + 9)']),
  answer(['|w| = √13']),
  step('Fördjupning · tolka området',['|z + i| < 2'],'Centrum är −i = (0; −1), radien 2. Randen ingår inte eftersom olikheten är strikt.'),
  step('Fördjupning · testa punkten z = i',['|i + i| = |2i| = 2','2 < 2'],'Det sista påståendet är falskt. Punkten z = i ligger på randen och ingår därför inte.')
 ),
 'exitans':solution(
  step('1 · Subtrahera koordinatvis',['u = 2 + 3i','z = −1 + i','u − z = (2 − (−1)) + (3 − 1)i']),
  answer(['u − z = 3 + 2i']),
  step('2 · Längd med Pythagoras',['|u − z| = √(3² + 2²)','= √(9 + 4)']),
  answer(['|u − z| = √13']),
  step('Fördjupning · en cirkel',['|w − 3| = 2'],'Centrum (3; 0) och radie 2. Alla randpunkter ingår.'),
  step('Fördjupning · bandets övre rand',['−1 ≤ Im w < 2','Im w = 2'],'Övre randen ingår inte, eftersom villkoret är strikt mindre än 2.')
 )
});
typesetStatic();
})();