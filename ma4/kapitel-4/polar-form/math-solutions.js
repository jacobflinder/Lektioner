/* Ma4 4.2 · Polär form: exakta ekvationsled, kvadrantbeslut och återkoppling.
   Enhetscirkel, interaktiv punkt och elevsteg ligger kvar. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,typesetStatic}=window.Ma4Math;
insertSolutions({
 'reverse-ans':solution(
  step('1 · Real- och imaginärdel från radie och vinkel',
   ['a = r cos v','b = r sin v']),
  step('2 · Bestäm cosinus och sinus vid 150°',
   ['cos 150° = −√3/2','sin 150° = 1/2'],
   'Punkten ligger i andra kvadranten. Realdelen är negativ och imaginärdelen positiv.'),
  step('3 · Beräkna koordinaterna',
   ['a = 4 cos 150° = 4(−√3/2) = −2√3',
    'b = 4 sin 150° = 4(1/2) = 2']),
  answer(['z = −2√3 + 2i']),
  step('4 · Kontrollera avståndet',
   ['|z| = √((−2√3)² + 2²)',
    '= √(12 + 4) = 4'])
 ),
 'independent-ans':solution(
  step('1 · Bestäm avståndet',
   ['z = −2 − 2i',
    'r = √((−2)² + (−2)²)',
    '= √8 = 2√2']),
  step('2 · Bestäm argumentet',
   ['α = 45°','v = 180° + 45° = 225°'],
   'Tredje kvadranten: både cos v och sin v är negativa.'),
  step('3 · Skriv polär form och kontrollera',
   ['z = 2√2(cos 225° + i sin 225°)',
    '= 2√2(−√2/2 − i√2/2)',
    '= −2 − 2i']),
  answer(['r = 2√2','v = 225°'])
 ),
 'optional-ans':solution(
  step('Ett helt varv ändrar inte riktningen',
   ['495° = 135° + 360°',
    '−225° = 135° − 360°']),
  answer(['135°','495°','−225°']),
  step('Förklara',[],'Alla tre argumenten beskriver samma riktning. För samma absolutbelopp beskriver de därmed samma komplexa tal.')
 ),
 'exit-ans':solution(
  step('1 · Rektangulär till polär form',
   ['z = −√3 + i',
    'r = √((−√3)² + 1²)',
    '= √(3 + 1) = 2']),
  step('2 · Rätt argument',
   ['α = 30°','v = 180° − 30° = 150°'],
   'Andra kvadranten: realdelen är negativ, imaginärdelen positiv.'),
  answer(['z = 2(cos 150° + i sin 150°)']),
  step('3 · Polär till rektangulär form',
   ['w = 2(cos 240° + i sin 240°)',
    'cos 240° = −1/2',
    'sin 240° = −√3/2',
    'w = 2(−1/2 − i√3/2)']),
  answer(['w = −1 − √3i']),
  step('Kontroll',[],'Talet w ligger i tredje kvadranten och har absolutbelopp 2.')
 )
});
typesetStatic();
})();