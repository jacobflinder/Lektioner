/* Ma4 4.1 · Multiplikation och division: stegvis matematik, riktiga bråk.
   Originalets elevfrågor och knappar förblir styrande. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,setFormula,typesetStatic}=window.Ma4Math;
insertSolutions({
 'd-idea':solution(
  step('1 · Välj nämnarens konjugat',['u = 1 − 3i','ū = 1 + 3i']),
  step('2 · Förläng med ett tal som är 1',['(1 + 3i)/(1 + 3i) = 1']),
  step('3 · Nämnaren blir reell',['(1 − 3i)(1 + 3i) = 1 + 9 = 10'],'Förlängningen kräver att nämnaren inte är noll.'),
  step('Nästa fråga',[],'Hur ser den nya täljaren ut när du också multiplicerar med 1 + 3i?')
 ),
 'd-error':solution(
  step('1 · Alla fyra produkter behövs',['(2 + i)(3 − 2i)','= 6 − 4i + 3i − 2i²']),
  step('2 · Samla och använd i² = −1',['= 6 − i − 2(−1)','= 6 − i + 2']),
  answer(['(2 + i)(3 − 2i) = 8 − i']),
  step('Förklara felet',[],'Den felaktiga lösningen saknar korsprodukterna −4i och +3i.')
 ),
 'd-selfans':solution(
  step('1 · Förläng med nämnarens konjugat',['(2 + i)/(1 + i) = ((2 + i)(1 − i))/((1 + i)(1 − i))']),
  step('2 · Utveckla båda produkterna',['= (2 − 2i + i − i²)/(1 − i²)','= (3 − i)/2']),
  step('3 · Skriv rektangulär form',['= 3/2 − (1/2)i']),
  answer(['z = 3/2 − (1/2)i']),
  step('4 · Multiplicera tillbaka',['(1 + i)(3/2 − (1/2)i)','= 3/2 + i − (1/2)i²','= 3/2 + i + 1/2 = 2 + i'],'Vi återfår den ursprungliga täljaren.')
 ),
 'd-extraans':solution(
  step('1 · Förläng med −i',['(3 + i)/(2i) = ((3 + i)(−i))/((2i)(−i))']),
  step('2 · Använd i² = −1',['= (−3i − i²)/(−2i²)','= (1 − 3i)/2']),
  answer(['= 1/2 − (3/2)i']),
  step('Alternativ',[],'Det fungerar också att förlänga med i. Då blir nämnaren −2 och resultatet detsamma.')
 ),
 'd-exitfacit':solution(
  step('1 · Multiplicera med distributiva lagen',['(1 + i)(2 − i)','= 2 − i + 2i − i²','= 2 + i + 1']),
  answer(['(1 + i)(2 − i) = 3 + i']),
  step('2 · Förläng kvoten med konjugatet',['(1 + 2i)/(1 − i) = ((1 + 2i)(1 + i))/((1 − i)(1 + i))']),
  step('3 · Utveckla täljare och nämnare',['= (1 + i + 2i + 2i²)/(1 − i²)','= (−1 + 3i)/2']),
  step('4 · Skriv rektangulär form',['= −1/2 + (3/2)i']),
  answer(['(1 + 2i)/(1 − i) = −1/2 + (3/2)i']),
  step('5 · Kontrollera genom multiplikation',['(1 − i)(−1/2 + (3/2)i)','= −1/2 + 2i − (3/2)i²','= −1/2 + 2i + 3/2 = 1 + 2i'],'Nämnarens konjugat gör nämnaren reell: 1 − i² = 2.')
 )
});
function flatten(node){
 if(node.nodeType===Node.TEXT_NODE)return node.textContent;
 if(node.nodeType!==Node.ELEMENT_NODE)return '';
 if(node.classList.contains('fraction')){
  const numerator=node.children[0]?.textContent.trim(),denominator=node.children[1]?.textContent.trim();
  if(!numerator||!denominator)throw Error('Matematikbråk saknar täljare eller nämnare');
  return '('+numerator+')/('+denominator+')';
 }
 return [...node.childNodes].map(flatten).join('');
}
// Bråk som tidigare låg i två dekorativa HTML-rader blir semantisk MathML.
// Behåll originalets struktur och låt resten av lösningarna uppenbaras stegvis.
document.querySelectorAll('.slide .math').forEach(el=>{
 if(!el.querySelector('.fraction'))return;
 const formula=flatten(el).replaceAll('ū','u\u0304');
 setFormula(el,formula,el.tagName==='SPAN'?'inline':'block');
});
typesetStatic();
})();