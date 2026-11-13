/* Matematik 4 · 4.3 Ekvationen zⁿ=a.
   Författade facit, exakt notation, bara elevstyrd visning, utan elevdata. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,setFormula,typesetStatic}=window.Ma4Math;
insertSolutions({
 introans:solution(
  step('Börja med det reella talområdet',['x³ = 8','x = 2']),
  step('Vad förändras för komplexa tal?',['z³ = 8i'],'Nu söker vi tal vars tredje potens får rätt belopp och riktning. Hur många olika komplexa rötter finns det? Undersök det under lektionen.')
 ),
 recallans:solution(
  step('Använd de Moivres formel',['z = r(cos v + i sin v)','z³ = r³(cos 3v + i sin 3v)']),
  step('Tolka',[],'Beloppet upphöjs till tre och argumentet multipliceras med tre. Argument som skiljer ett helt varv beskriver samma riktning.')
 ),
 selfans:solution(
  step('1 · Högerledet i polär form',['−4 = 4(cos π + i sin π)']),
  step('2 · Bestäm rötternas belopp',['r² = 4','r = 2']),
  step('3 · Bestäm argumenten',['2v = π + 2πk','v = π/2 + πk','k ∈ ℤ']),
  step('4 · Skriv båda rötterna',['k = 0 ⇒ z₁ = 2i','k = 1 ⇒ z₂ = −2i']),
  answer(['z₁ = 2i','z₂ = −2i']),
  step('Kontrollera och motivera antalet',['(2i)² = −4','(−2i)² = −4'],
    'Rötterna har samma längd och motsatta riktningar. När k ökar med två upprepas den första riktningen.')
 ),
 optionalans:solution(
  step('1 · Bestäm beloppet',['z⁴ = 16','r⁴ = 16','r = 2']),
  step('2 · Bestäm vinkelsteget',['4v = 2πk','v = πk/2','2π/4 = π/2 = 90°']),
  answer(['z₁ = 2','z₂ = 2i','z₃ = −2','z₄ = −2i']),
  step('Geometrisk förklaring',[],'De fyra punkterna ligger på cirkeln med radie 2 och är jämnt fördelade med 90° mellan grannrötterna.')
 ),
 exitans:solution(
  step('1 · Högerledet i polär form',['z³ = −8','−8 = 8(cos π + i sin π)']),
  step('2 · Bestäm beloppet',['r³ = 8','r = 2']),
  step('3 · Bestäm samtliga argument',['3v = π + 2πk','v = π/3 + 2πk/3','k = 0, 1, 2']),
  step('4 · Sätt in k-värden',['k = 0 ⇒ v₁ = π/3','k = 1 ⇒ v₂ = π','k = 2 ⇒ v₃ = 5π/3']),
  answer(['z₁ = 1 + √3i','z₂ = −2','z₃ = 1 − √3i']),
  step('Varför exakt tre?',[],'De tre riktningarna är olika modulo 2π. När k ökar med tre upprepas den första riktningen.')
 )
});
typesetStatic();
window.ma4RootMathTypeset=(el,formula)=>setFormula(el,formula);
})();