/* Ma4 4.1 – lektion 04/41. Självständigt skrivande före facit.
 * Kärnuppgifternas återkoppling skiljs från frivillig fördjupning.
 * Alla insättningar, negativa tecken och kvadratsummor visas i egna led. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
 'v-minute':solution(
  step('1 · Givna tal',['u = 2 + 3i','z = −1 + i']),
  step('2 · Subtrahera hela det andra talet',['u − z = (2 + 3i) − (−1 + i)','= 2 + 3i + 1 − i']),
  step('3 · Samla reella och imaginära delar',['= (2 + 1) + (3 − 1)i','= 3 + 2i']),
  step('4 · Pythagoras med båda koordinaterna',['|u − z| = √(3² + 2²)','= √(9 + 4)']),
  answer(['u − z = 3 + 2i','|u − z| = √13']),
  step('Kontrollera tolkningen',[],'Punkten (3; 2) är spetsen på positionsvektorn. Avståndet från origo är dess längd, inte en av koordinaterna.')
 ),
 'tryans':solution(
  step('1 · Punkt och positionsvektor',['w = −2 + 3i','P = (−2; 3)'],'Positionsvektorn går från origo till punkten i andra kvadranten.'),
  step('2 · Sätt in koordinaterna i Pythagoras',['|w| = √((−2)² + 3²)','= √(4 + 9)']),
  answer(['|w| = √13'])
 ),
 'tryextra':solution(
  step('1 · Identifiera cirkelns centrum',['|z + i| < 2','|z − (−i)| < 2','z₀ = −i = 0 − i'],'Centrum är punkten (0; −1). Olikheten beskriver en öppen cirkelskiva, inte bara randcirkeln.'),
  step('2 · Radie och rand',['r = 2'],'Alla punkter med avstånd mindre än 2 ingår. Randpunkterna på avstånd 2 ingår inte.'),
  step('3 · Pröva punkten z = i',['|i + i| = |2i|','= √(0² + 2²)','= √4 = 2','2 < 2'],'Det sista villkoret är falskt. Punkten z = i ligger på randen och ingår inte.'),
  answer(['z₀ = −i','r = 2'],'Strikt olikhet: cirkelskivans rand ingår inte.')
 ),
 'exitans':solution(
  step('1 · Läs av de givna talen',['u = 2 + 3i','z = −1 + i']),
  step('2 · Sätt in hela talet som subtraheras',['u − z = (2 + 3i) − (−1 + i)','= 2 + 3i + 1 − i']),
  step('3 · Samla koordinatvis',['= (2 + 1) + (3 − 1)i','= 3 + 2i']),
  answer(['u − z = 3 + 2i']),
  step('4 · Beräkna längden',['|u − z| = √(3² + 2²)','= √(9 + 4)']),
  answer(['|u − z| = √13']),
  step('Rimlighetskontroll',[],'Realdelen ökar från 2 till 3 när du subtraherar −1. Den imaginära delen minskar från 3 till 2 när du subtraherar +i.')
 ),
 'exitextra':solution(
  step('2 · Cirkeln och dess centrum',['|w − 3| = 2','w₀ = 3 + 0i','r = 2'],'Cirkeln har centrum (3; 0) och radie 2. Alla randpunkter ingår eftersom det står likhet.'),
  step('3 · Tolka den övre randlinjen',['−1 ≤ Im(w) < 2','Im(w) = 2','2 < 2'],'Det sista villkoret är falskt; den övre randen ingår inte. Den nedre gränsen −1 ingår eftersom ≤ används.'),
  '<div class="ma4-final"><span>SVAR</span><p class="ma4-note">Nej. Den övre randlinjen ingår inte.</p></div>'
 )
});
typesetStatic();
})();