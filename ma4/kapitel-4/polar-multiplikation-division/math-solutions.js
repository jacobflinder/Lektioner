/* Ma4 07/41 · Multiplikation och division i polär form.
 * Självständigt kontrollräknade lösningar: givna värden → regel → insättning
 * → mellanled → slutsvar → kontroll. Facit öppnas först efter elevens försök. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,setFormula,typesetStatic}=window.Ma4Math;
insertSolutions({
 startans:solution(
  step('1 · Identifiera koordinaterna',['z = 4 + 3i','a = 4','b = 3'],
   'Båda koordinaterna är positiva, alltså ligger punkten i första kvadranten.'),
  step('2 · Beräkna avståndet till origo',['r = √(a² + b²)','= √(4² + 3²)','= √(16 + 9)','= √25','= 5']),
  step('3 · Beräkna argumentet och kontrollera kvadranten',
   ['tan v = b/a','= 3/4','v = arctan(3/4) + n · π','n = 0','v = arctan(3/4)','v ≈ 0,64'],
   'Första kvadranten gör att vinkeln från arctan är rätt argument.'),
  answer(['z ≈ 5(cos(0,64) + i sin(0,64))']),
  step('4 · Kontrollera den avrundade vinkeln',
   ['a ≈ 5 cos(0,64) ≈ 4','b ≈ 5 sin(0,64) ≈ 3'],
   'Tecknet ≈ behövs eftersom argumentet är avrundat.')
 ),
 'source-polar-radians-answer':solution(
  step('1 · Absolutbeloppet för produkten',['|u₁u₂| = r₁r₂','= 8 · 4','= 32']),
  step('2 · Argumentet för produkten',['arg(u₁u₂) = v₁ + v₂','= 2π/3 + π/6','= 4π/6 + π/6','= 5π/6']),
  answer(['u₁u₂ = 32(cos(5π/6) + i sin(5π/6))']),
  step('3 · Absolutbeloppet för kvoten',['|u₁/u₂| = r₁/r₂','= 8/4','= 2']),
  step('4 · Argumentet för kvoten',['arg(u₁/u₂) = v₁ − v₂','= 2π/3 − π/6','= 4π/6 − π/6','= 3π/6','= π/2']),
  answer(['u₁/u₂ = 2(cos(π/2) + i sin(π/2))']),
  step('5 · Kontroll',['(2) · 4 = 8','π/2 + π/6 = 4π/6','= 2π/3'],'Multiplikation med nämnaren återger täljaren.')
 ),
 selfans:solution(
  step('1 · Läs av de två talens värden',
   ['r₁ = 4','v₁ = 150°','r₂ = 2','v₂ = 30°'],
   'Eftersom r₂ = 2 är division med w₂ tillåten.'),
  step('2 · Produktens längd: regel och insättning',
   ['r = r₁r₂','= 4 · 2','= 8']),
  step('3 · Produktens argument: regel och insättning',
   ['v = v₁ + v₂','= 150° + 30°','= 180°']),
  answer(['w₁w₂ = 8(cos 180° + i sin 180°)']),
  step('4 · Kontrollera produktens läge',
   ['cos 180° = −1','sin 180° = 0','w₁w₂ = 8(−1 + 0i)','= −8'],
   'Produkten ligger på negativa realaxeln, 8 enheter från origo.'),
  step('5 · Kvotens längd: regel och insättning',
   ['r = r₁/r₂','= 4/2','= 2']),
  step('6 · Kvotens argument: regel och insättning',
   ['v = v₁ − v₂','= 150° − 30°','= 120°']),
  answer(['w₁/w₂ = 2(cos 120° + i sin 120°)']),
  step('7 · Kontrollera kvotens kvadrant',
   ['cos 120° = −1/2','sin 120° = √3/2','w₁/w₂ = 2(−1/2 + i√3/2)','= −1 + √3i'],
   'Kvoten ligger i andra kvadranten och har längden 2.')
 ),
 exitans:solution(
  step('1 · Identifiera de fyra givna storheterna',
   ['r₁ = 3','v₁ = 20°','r₂ = 2','v₂ = 80°'],
   'Divisorn är inte noll eftersom r₂ = 2.'),
  step('2 · Produkt: beräkna absolutbeloppet',
   ['r = r₁r₂','= 3 · 2','= 6']),
  step('3 · Produkt: beräkna argumentet',
   ['v = v₁ + v₂','= 20° + 80°','= 100°']),
  answer(['z₁z₂ = 6(cos 100° + i sin 100°)']),
  step('4 · Kvot: beräkna absolutbeloppet',
   ['r = r₁/r₂','= 3/2']),
  step('5 · Kvot: beräkna argumentet',
   ['v = v₁ − v₂','= 20° − 80°','= −60°','−60° + 360° = 300°']),
  answer(['z₁/z₂ = (3/2)(cos(−60°) + i sin(−60°))']),
  step('6 · Kontrollera kvoten med omvänd multiplikation',
   ['(3/2) · 2 = 3','−60° + 80° = 20°'],
   'Multiplicerar vi kvoten med z₂ får vi tillbaka både absolutbeloppet 3 och argumentet 20° hos z₁.'),
  step('7 · Förklara skillnaden',[],
   'Multiplikation skalar med den andra faktorns absolutbelopp och adderar dess vinkel. Division gör den omvända förändringen: delar längderna och subtraherar vinklarna. −60° och 300° beskriver samma riktning.')
 )
});
// Äldre dekorativa bråk görs till riktiga MathML-bråk i statiska uppgifter.
function flatten(node){
 if(node.nodeType===Node.TEXT_NODE)return node.textContent;
 if(node.nodeType!==Node.ELEMENT_NODE)return '';
 if(node.classList.contains('fraction')){
  const numerator=node.children[0]?.textContent.trim();
  const denominator=node.children[1]?.textContent.trim();
  if(!numerator||!denominator)throw new Error('Bråk utan täljare/nämnare');
  return '('+numerator+')/('+denominator+')';
 }
 return [...node.childNodes].map(flatten).join('');
}
document.querySelectorAll('.slide .math').forEach(el=>{
 if(!el.querySelector('.fraction'))return;
 setFormula(el,flatten(el),el.tagName==='SPAN'?'inline':'block');
});
typesetStatic();
})();