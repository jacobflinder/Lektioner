/* Ma4 4.3 · de Moivres formel: alla facit blir uppställd matematik.
   Fullständiga mellanled och exakta uttryck, utan nya elevdata. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
 'intro-facit':solution(
  step('1 · Grundtalet på enhetscirkeln',
   ['z = cos(π/4) + i sin(π/4)','|z| = 1']),
  step('2 · Multiplicera argumentet för varje potens',
   ['z² = cos(π/2) + i sin(π/2) = i',
    'z³ = cos(3π/4) + i sin(3π/4)',
    'z⁴ = cos(π) + i sin(π) = −1']),
  answer(['|z²| = |z³| = |z⁴| = 1']),
  step('Förklara',[],'Alla faktorer har absolutbeloppet 1. Varje ytterligare faktor ger därför samma längd men 45° större argument.')
 ),
 practiceans:solution(
  step('1 · Upphöj absolutbeloppet',
   ['z = −√3 + i','r = 2','r⁴ = 2⁴ = 16']),
  step('2 · Multiplicera argumentet',
   ['v = 150°','4v = 4 · 150° = 600°',
    '600° − 360° = 240°']),
  step('3 · Skriv polär form',
   ['z⁴ = 16(cos 240° + i sin 240°)']),
  step('4 · Exakta värden',
   ['cos 240° = −1/2','sin 240° = −√3/2',
    'z⁴ = 16(−1/2 − i√3/2)']),
  answer(['z⁴ = −8 − 8√3i'])
 ),
 errorans:solution(
  step('1 · Hitta felet i den konstruerade lösningen',
   ['r = 2','r³ = 2³ = 8',
    '3 · 20° = 60°'],'Vinkeln 60° var rätt. Det var absolutbeloppet 6 som var fel.'),
  answer(['(2(cos 20° + i sin 20°))³ = 8(cos 60° + i sin 60°)']),
  step('2 · Beräkna w³',
   ['w = (1/2)(cos(π/2) + i sin(π/2))',
    '|w³| = (1/2)³ = 1/8',
    'arg(w³) = 3π/2']),
  step('3 · Gå till rektangulär form',
   ['w³ = (1/8)(cos(3π/2) + i sin(3π/2))']),
  answer(['w³ = −i/8']),
  step('Förklara',[],'När 0 < r < 1 blir rⁿ mindre när exponenten ökar.')
 ),
 optionalans:solution(
  step('1 · Kvadrera med distributiva lagen',
   ['(cos v + i sin v)²',
    '= cos²v + 2i sin v cos v + i² sin²v']),
  step('2 · Använd i² = −1 och samla delarna',
   ['= cos²v − sin²v + i(2sin v cos v)']),
  step('3 · Jämför med de Moivres formel',
   ['(cos v + i sin v)² = cos(2v) + i sin(2v)']),
  answer(['cos(2v) = cos²v − sin²v',
          'sin(2v) = 2sin v cos v']),
  step('Slutsats',[],'Alternativ A i frågan är fel. Det negativa tecknet kommer från i² = −1.')
 ),
 exitans:solution(
  step('1 · Upphöj absolutbeloppet',
   ['r = 2','r⁶ = 2⁶ = 64']),
  step('2 · Multiplicera argumentet',
   ['v = π/4','6v = 6π/4 = 3π/2']),
  step('3 · Använd de Moivres formel',
   ['z⁶ = 64(cos(3π/2) + i sin(3π/2))']),
  step('4 · Bestäm exakta värden',
   ['cos(3π/2) = 0','sin(3π/2) = −1']),
  answer(['z⁶ = −64i']),
  step('Rimlighetskontroll',[],'Absolutbeloppet är 64 och riktningen är rakt nedåt längs negativa imaginära axeln.')
 )
});
typesetStatic();
})();