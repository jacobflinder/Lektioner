/* Ma4 09/41 · zⁿ = a. Varje beräkningsled visas först efter elevens försök.
 * Två riktningar: högerledets längd och argument; hela varv före division.
 */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,setFormula,typesetStatic}=window.Ma4Math;
insertSolutions({
 introans:solution(
  step('1 · Lös den reella ekvationen',
   ['x³ = 8','x = ∛8','= 2']),
  step('2 · Jämför med det komplexa högerledet',
   ['z³ = 8i'],
   'Om z är reellt blir z³ också reellt. För att få 8i måste z vara ett komplext tal med imaginärdel. Vi behöver undersöka både längd och riktning och om det finns flera olika rötter.')
 ),
 recallans:solution(
  step('1 · Utgå från det komplexa talets polära form',
   ['z = r(cos(v) + i sin(v))','r ≥ 0']),
  step('2 · Använd de Moivres formel',
   ['z³ = r³(cos(3v) + i sin(3v))']),
  step('3 · Tolka och förklara',[],
   'Absolutbeloppet upphöjs till tre. Argumentet multipliceras med tre, men riktningar som skiljer ett helt varv (2π) är ekvivalenta.')
 ),
 selfans:solution(
  step('1 · Skriv högerledet i polär form',
   ['z² = −4','−4 = 4(cos(π) + i sin(π))']),
  step('2 · Jämför absolutbelopp och beräkna r',
   ['r² = 4','r = √4','= 2'],
   'Absolutbeloppet måste vara icke-negativt.'),
  step('3 · Bestäm alla möjliga argument',
   ['2v = π + 2πk','k ∈ ℤ',
    'v = (π + 2πk)/2',
    '= π/2 + πk']),
  step('4 · Sätt in k = 0 och k = 1',
   ['k = 0','v₁ = π/2','z₁ = 2i',
    'k = 1','v₂ = 3π/2','z₂ = −2i']),
  answer(['z₁ = 2i','z₂ = −2i']),
  step('5 · Kontrollera och förklara varför det är exakt två',
   ['(2i)² = 4i²','= −4',
    '(−2i)² = 4i²','= −4',
    'v₂ − v₁ = π'],
   'När k ökar med 2 växer vinkeln med 2π, vilket är samma riktning. Vi har redan två olika rötter, så inga fler tillkommer.')
 ),
 optionalans:solution(
  step('1 · Skriv högerledet och bestäm längden',
   ['z⁴ = 16','16 = 16(cos(0) + i sin(0))',
    'r⁴ = 16','r = 2']),
  step('2 · Bestäm alla vinklar',
   ['4v = 0 + 2πk','k ∈ ℤ',
    'v = (2πk)/4','= πk/2']),
  step('3 · De fyra olika värdena',
   ['k = 0','v₁ = 0','z₁ = 2',
    'k = 1','v₂ = π/2','z₂ = 2i',
    'k = 2','v₃ = π','z₃ = −2',
    'k = 3','v₄ = 3π/2','z₄ = −2i']),
  answer(['z₁ = 2','z₂ = 2i','z₃ = −2','z₄ = −2i']),
  step('4 · Kontroll och geometrisk slutsats',
   ['2⁴ = 16','(2i)⁴ = 16',
    '(−2)⁴ = 16','(−2i)⁴ = 16',
    '2π/4 = π/2 = 90°'],
   'Rötterna ligger på cirkeln med radie två. När k ökar med fyra upprepas den första riktningen.')
 ),
 exitans:solution(
  step('1 · Polär form för det givna högerledet',
   ['z³ = −8','−8 = 8(cos(π) + i sin(π))']),
  step('2 · Bestäm rotens absolutbelopp',
   ['r³ = 8','r = ∛8','= 2']),
  step('3 · Lägg till hela varv före division',
   ['3v = π + 2πk','k ∈ ℤ',
    'v = (π + 2πk)/3',
    '= π/3 + (2πk)/3']),
  step('4 · Beräkna alla tre olika argument',
   ['k = 0','v₁ = π/3',
    'k = 1','v₂ = π',
    'k = 2','v₃ = 5π/3']),
  step('5 · Sätt in de exakta trigonometriska värdena',
   ['cos(π/3) = 1/2','sin(π/3) = √3/2',
    'z₁ = 2(1/2 + i√3/2)',
    '= 1 + √3i',
    'cos(π) = −1','sin(π) = 0',
    'z₂ = 2(−1 + 0i)','= −2',
    'cos(5π/3) = 1/2','sin(5π/3) = −√3/2',
    'z₃ = 2(1/2 − i√3/2)',
    '= 1 − √3i']),
  answer(['z₁ = 1 + √3i','z₂ = −2','z₃ = 1 − √3i']),
  step('6 · Kontrollera riktning och antal',
   ['r³ = 2³ = 8',
    '3v₁ = π','3v₂ = 3π = π + 2π',
    '3v₃ = 5π = π + 4π'],
   'Alla tre ger vid upphöjning till tre samma längd 8 och samma riktning som −8. När k ökar från 0 till 3 har vinkeln ökat ett helt varv, alltså inga ytterligare olika rötter.')
 )
});
typesetStatic();
window.ma4RootMathTypeset=(el,formula)=>setFormula(el,formula);
})();