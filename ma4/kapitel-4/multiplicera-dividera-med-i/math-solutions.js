/* Ma4, lektion 06/41 · Multiplicera och dividera med i.
 * Fullständiga tecken-, parentes- och längdkontroller bakom elevens facitknappar.
 * Rotationsfiguren, ursprungliga elevaktiviteter och NOKflex bevaras. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
 'startans':solution(
  step('1 · Skriv hela talet och multiplicera med i',
   ['z = 2 + i','iz = i(2 + i)','= i·2 + i·i','= 2i + i²']),
  step('2 · Sätt in i² = −1',
   ['= 2i + (−1)','= −1 + 2i']),
  answer(['iz = −1 + 2i']),
  step('3 · Koppla till två punkter',
   ['P = (2; 1)','Q = (−1; 2)'],
   'Från (a; b) till (−b; a) betyder en kvarts varv moturs, 90°.'),
  step('4 · Kontrollera med Pythagoras',
   ['|z| = √(2² + 1²)','= √(4 + 1)','= √5',
    '|iz| = √((−1)² + 2²)','= √(1 + 4)','= √5'],
   'Punkterna har samma avstånd till origo.')
 ),
 'trapans':solution(
  step('1 · Konjugera genom att byta imaginärdelens tecken',
   ['z = 1 + 2i','z̄ = 1 − 2i'],
   'Den geometriska speglingen sker i realaxeln, inte genom rotation.'),
  step('2 · Multiplicera med i',
   ['iz = i(1 + 2i)','= i + 2i²','= i + 2(−1)','= −2 + i']),
  step('3 · Dividera med i genom att multiplicera med −i',
   ['1/i = −i','z/i = −i(1 + 2i)','= −i − 2i²','= −i − 2(−1)','= 2 − i']),
  answer(['z̄ = 1 − 2i','iz = −2 + i','z/i = 2 − i']),
  step('4 · Varför är påståendet falskt?',
   [],
   'Konjugering ger spegling i realaxeln. Multiplikation med i roterar 90° moturs och division med i roterar 90° medurs. Alla tre bevarar avståndet till origo men ger i detta fall tre olika punkter.')
 ),
 'practiceans':solution(
  step('1 · Identifiera startvärden och kvadrant',
   ['z = −3 + 2i','a = −3','b = 2'],
   'Negativ realdel och positiv imaginärdel: startpunkten ligger i andra kvadranten.'),
  step('2 · Multiplicera med i utan att tappa tecknet',
   ['iz = i(−3 + 2i)','= −3i + 2i²','= −3i + 2(−1)','= −2 − 3i']),
  step('3 · Dividera med i genom förlängning med −i',
   ['1/i = −i','z/i = −i(−3 + 2i)','= 3i − 2i²','= 3i − 2(−1)','= 2 + 3i']),
  step('4 · Kontrollera starttalets längd',
   ['|z| = √((−3)² + 2²)','= √(9 + 4)','= √13']),
  step('5 · Kontrollera båda rotationerna',
   ['|iz| = √((−2)² + (−3)²)','= √(4 + 9)','= √13',
    '|z/i| = √(2² + 3²)','= √(4 + 9)','= √13']),
  answer(['iz = −2 − 3i','z/i = 2 + 3i']),
  step('Riktning',[],
   'Att multiplicera med i är en rotation 90° moturs. Att dividera med i är en rotation 90° medurs. Samtliga punkter ligger lika långt från origo.')
 ),
 'exitans':solution(
  step('1 · Starttal och koefficienter',
   ['z = 1 − 2i','a = 1','b = −2']),
  step('2 · Multiplicera med i',
   ['iz = i(1 − 2i)','= i − 2i²','= i − 2(−1)','= 2 + i']),
  step('3 · Dividera med i',
   ['z/i = −i(1 − 2i)','= −i + 2i²','= −i + 2(−1)','= −2 − i']),
  answer(['iz = 2 + i','z/i = −2 − i']),
  step('4 · Visa längderna var för sig',
   ['|z| = √(1² + (−2)²)','= √(1 + 4)','= √5',
    '|iz| = √(2² + 1²)','= √(4 + 1)','= √5',
    '|z/i| = √((−2)² + (−1)²)','= √(4 + 1)','= √5']),
  step('5 · Koordinat- och rimlighetskontroll',
   ['iz = 2 + i','z/i = −2 − i'],
   'Multiplikation ger punkten (2;1) efter 90° moturs rotation. Division ger (−2;−1) efter 90° medurs rotation. Båda har längden √5.')
 )
});
typesetStatic();
})();