/* Ma4 08/41 · de Moivres formel. Oavkortade mellanled efter elevförsöket.
 * Fullständiga koefficienter, insättningar, referensvinklar och exakta värden.
 * Samtliga ursprungliga elevaktiviteter, felanalys och frivillig fördjupning bevaras.
 */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
 'intro-facit':solution(
  step('1 · Identifiera längd och argument',
   ['z = cos(π/4) + i sin(π/4)','r = 1','v = π/4'],
   'Punkten ligger på enhetscirkeln: varje extra faktor har längden 1.'),
  step('2 · Kvadrera genom att multiplicera samma faktor',
   ['|z²| = 1 · 1 = 1','v₂ = π/4 + π/4','= 2π/4 = π/2',
    'z² = cos(π/2) + i sin(π/2)','= 0 + i · 1','= i']),
  step('3 · Ytterligare en faktor ger z³',
   ['|z³| = 1² · 1 = 1','v₃ = π/2 + π/4','= 3π/4',
    'z³ = cos(3π/4) + i sin(3π/4)']),
  step('4 · Fjärde faktorn ger z⁴',
   ['|z⁴| = 1³ · 1 = 1','v₄ = 3π/4 + π/4','= π',
    'z⁴ = cos(π) + i sin(π)','= −1 + 0i','= −1']),
  answer(['|z²| = 1','|z³| = 1','|z⁴| = 1']),
  step('Kontrollera principen',[],
   'Absolutbeloppet förblir 1. Argumentet ökar med π/4 för varje ytterligare faktor; det är upprepad multiplikation, inte en lös minnesregel.')
 ),
 practiceans:solution(
  step('1 · Identifiera r, v och exponenten',
   ['z = −√3 + i','r = 2','v = 150°','n = 4']),
  step('2 · Upphöj absolutbeloppet',
   ['r⁴ = 2⁴','= 2 · 2 · 2 · 2','= 16']),
  step('3 · Multiplicera argumentet',
   ['nv = 4 · 150°','= 600°','600° − 360° = 240°']),
  step('4 · Sätt in i de Moivres formel',
   ['z⁴ = r⁴(cos(4v) + i sin(4v))',
    '= 16(cos(600°) + i sin(600°))',
    '= 16(cos(240°) + i sin(240°))']),
  step('5 · Använd exakta trigonometriska värden',
   ['cos(240°) = −1/2','sin(240°) = −√3/2',
    'z⁴ = 16(−1/2 − i√3/2)',
    '= 16(−1/2) + 16(−√3/2)i']),
  answer(['z⁴ = −8 − 8√3i']),
  step('Kontrollera svaret', ['|z⁴| = 16'],
   'Realdel och imaginärdel är negativa. Svaret ska alltså ligga i tredje kvadranten.')
 ),
 errorans:solution(
  step('1 · Jämför det påstådda svaret med potensregeln',
   ['z = 2(cos(20°) + i sin(20°))','n = 3',
    'r³ = 2³','= 2 · 2 · 2','= 8','nv = 3 · 20° = 60°'],
   'Det påstådda absolutbeloppet 6 var fel. Argumentet 60° är däremot korrekt.'),
  answer(['z³ = 8(cos(60°) + i sin(60°))']),
  step('2 · Identifiera w:s värden',
   ['w = (1/2)(cos(π/2) + i sin(π/2))','r = 1/2','v = π/2','n = 3']),
  step('3 · Beräkna längd och argument var för sig',
   ['|w³| = (1/2)³','= 1/8','3v = 3 · (π/2)','= 3π/2']),
  step('4 · Sätt in och kontrollera exakta trigvärden',
   ['w³ = (1/8)(cos(3π/2) + i sin(3π/2))',
    'cos(3π/2) = 0','sin(3π/2) = −1',
    'w³ = (1/8)(0 − i)']),
  answer(['w³ = −i/8']),
  step('Rimlighetskontroll',[],
   'När 0 < r < 1 blir rⁿ mindre när exponenten n ökar. Vinkeln 3π/2 pekar längs negativa imaginära axeln.')
 ),
 optionalans:solution(
  step('1 · Utveckla kvadraten med två faktorer',
   ['P = (cos(v) + i sin(v))²',
    '= (cos(v) + i sin(v))(cos(v) + i sin(v))']),
  step('2 · Redovisa alla fyra produkter var för sig',
   ['T₁ = cos(v) · cos(v) = cos²v',
    'T₂ = (cos(v))(i sin(v))',
    '= i cos(v) sin(v)',
    'T₃ = (i sin(v))cos(v)',
    '= i sin(v) cos(v)',
    'T₄ = (i sin(v))(i sin(v))',
    '= i² sin²v']),
  step('3 · Sätt in i² = −1 och samla',
   ['T₄ = −sin²v',
    'P = T₁ + T₂ + T₃ + T₄',
    '= cos²v − sin²v + i(2sin(v) cos(v))']),
  step('4 · Samma potens med de Moivres formel',
   ['P = cos(2v) + i sin(2v)'],
   'Lika komplexa tal har lika realdelar och imaginärdelar.'),
  answer(['cos(2v) = cos²v − sin²v',
          'sin(2v) = 2sin(v) cos(v)']),
  step('Slutsats',[],
   'Påstående A är falskt. Förväxla inte cos(2v) med cos²v + sin²v = 1. Minustecknet följer av i² = −1.')
 ),
 exitans:solution(
  step('1 · Läs av de givna värdena',
   ['z = 2(cos(π/4) + i sin(π/4))','r = 2','v = π/4','n = 6']),
  step('2 · Upphöj absolutbeloppet',
   ['r⁶ = 2⁶','= 2 · 2 · 2 · 2 · 2 · 2','= 64']),
  step('3 · Multiplicera vinkeln',
   ['nv = 6 · (π/4)','= 6π/4','= 3π/2']),
  step('4 · Sätt in i formeln',
   ['z⁶ = r⁶(cos(6v) + i sin(6v))',
    '= 64(cos(3π/2) + i sin(3π/2))']),
  step('5 · Ersätt med exakta trigonometriska värden',
   ['cos(3π/2) = 0','sin(3π/2) = −1',
    'z⁶ = 64(0 + i(−1))',
    '= 64(−i)']),
  answer(['z⁶ = −64i']),
  step('Kontrollera längd och riktning',[],
   'Absolutbeloppet är 64 och argumentet 3π/2. Därför ligger resultatet på negativa imaginära axeln.')
 )
});
typesetStatic();
})();