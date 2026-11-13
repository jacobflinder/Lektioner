/* Ma4 4.2 · Multiplikation och division i polär form.
   Färdiga, kontrollerade matematiksteg; elevens förutsägelser och klick bevaras. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,setFormula,typesetStatic}=window.Ma4Math;
insertSolutions({
 startans:solution(
  step('1 · Absolutbelopp',['z = 4 + 3i','r = √(4² + 3²)','= √25 = 5']),
  step('2 · Argument',['tan v = 3/4','v ≈ 36,87°'],'Båda koordinaterna är positiva, så argumentet ligger i första kvadranten.'),
  answer(['z ≈ 5(cos 36,87° + i sin 36,87°)'])
 ),
 selfans:solution(
  step('1 · Multiplicera absolutbeloppen',['|w₁w₂| = 4 · 2 = 8']),
  step('2 · Addera argumenten',['v = 150° + 30° = 180°']),
  answer(['w₁w₂ = 8(cos 180° + i sin 180°) = −8']),
  step('3 · Dividera absolutbeloppen',['|w₁/w₂| = 4/2 = 2']),
  step('4 · Subtrahera argumenten',['v = 150° − 30° = 120°']),
  answer(['w₁/w₂ = 2(cos 120° + i sin 120°)']),
  step('Rimlighetskontroll',[],'Produkten ligger på negativa realaxeln, medan kvoten ligger i andra kvadranten.')
 ),
 exitans:solution(
  step('1 · Produktens absolutbelopp',['|z₁z₂| = 3 · 2 = 6']),
  step('2 · Produktens argument',['v = 20° + 80° = 100°']),
  answer(['z₁z₂ = 6(cos 100° + i sin 100°)']),
  step('3 · Kvotens absolutbelopp',['|z₁/z₂| = 3/2']),
  step('4 · Kvotens argument',['v = 20° − 80° = −60°','−60° + 360° = 300°']),
  answer(['z₁/z₂ = (3/2)(cos(−60°) + i sin(−60°))']),
  step('Förklara',[],'Multiplikation innebär att argumenten adderas. Vid division subtraheras nämnarens argument. Vinkeln −60° kan också anges som 300°.')
 )
});
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
// Alla gamla dekorativa bråk får ett matematiskt bråkstreck, inklusive den valfria härledningen.
document.querySelectorAll('.slide .math').forEach(el=>{
 if(!el.querySelector('.fraction'))return;
 setFormula(el,flatten(el),el.tagName==='SPAN'?'inline':'block');
});
typesetStatic();
})();