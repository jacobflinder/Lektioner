/* Ma4 4.1, lektion 03/41. Fullständiga, men först på begäran synliga, elevlösningar.
 * Ingen elevdata lämnar webbläsaren. */
(()=>{'use strict';
const {step,answer,solution,insertSolutions,setFormula,typesetStatic}=window.Ma4Math;
insertSolutions({
 'd-idea':solution(
  step('1 · Bestäm nämnarens konjugat',['u = 1 − 3i','ū = 1 + 3i']),
  step('2 · Multiplicera med 1',['(1 + 3i)/(1 + 3i) = 1'],'Vi multiplicerar hela kvoten med ett uttryck lika med 1, inte bara täljaren. Eftersom u inte är noll är inte heller dess konjugat noll.'),
  step('3 · Visa varför nämnaren blir reell',['(1 − 3i)(1 + 3i)','= 1 + 3i − 3i − 9i²','= 1 − 9(−1)','= 1 + 9 = 10']),
  step('Nästa fråga',[],'Hur ser den nya täljaren ut när du också multiplicerar med 1 + 3i?')
 ),
 'd-error':solution(
  step('1 · Skriv alla fyra produkter',['(2 + i)(3 − 2i)','= 2·3 + 2(−2i) + i·3 + i(−2i)','= 6 − 4i + 3i − 2i²']),
  step('2 · Samla termerna och sätt in i² = −1',['= 6 − i − 2i²','= 6 − i − 2(−1)','= 6 − i + 2']),
  answer(['(2 + i)(3 − 2i) = 8 − i']),
  step('Förklara felet',[],'Det felaktiga exemplet lämnade bort båda korsprodukterna −4i och +3i. De tar inte ut varandra.')
 ),
 'd-selfans':solution(
  step('1 · Identifiera nämnaren och dess konjugat',['u = 1 + i','ū = 1 − i','(2 + i)/(1 + i) = ((2 + i)(1 − i))/((1 + i)(1 − i))']),
  step('2 · Utveckla täljaren',['(2 + i)(1 − i)','= 2 − 2i + i − i²','= 2 − i − (−1)','= 3 − i']),
  step('3 · Utveckla nämnaren',['(1 + i)(1 − i)','= 1 − i + i − i²','= 1 − (−1)','= 2'],'Nämnaren är reell och skild från noll.'),
  step('4 · Skriv svaret i rektangulär form',['(2 + i)/(1 + i) = (3 − i)/2','= 3/2 − (1/2)i']),
  answer(['(2 + i)/(1 + i) = 3/2 − (1/2)i']),
  step('5 · Kontrollera genom multiplikation tillbaka',['(1 + i)(3/2 − (1/2)i)','= 3/2 − (1/2)i + (3/2)i − (1/2)i²','= 3/2 + i − (1/2)(−1)','= 3/2 + i + 1/2','= 2 + i'],'Produkten ger exakt den ursprungliga täljaren.')
 ),
 'd-extraans':solution(
  step('1 · Välj faktorn −i',['u = 2i','ū = −2i','(3 + i)/(2i) = ((3 + i)(−i))/((2i)(−i))'],'Att multiplicera med −i i både täljare och nämnare ändrar inte kvotens värde.'),
  step('2 · Beräkna täljaren med i² = −1',['(3 + i)(−i)','= −3i − i²','= −3i − (−1)','= 1 − 3i']),
  step('3 · Beräkna nämnaren',['(2i)(−i) = −2i²','= −2(−1)','= 2']),
  step('4 · Dividera varje term med 2',['(3 + i)/(2i) = (1 − 3i)/2','= 1/2 − (3/2)i']),
  answer(['(3 + i)/(2i) = 1/2 − (3/2)i']),
  step('Varför är 1/i = −i?', ['1/i = (1·(−i))/(i·(−i))','= (−i)/(−i²)','= (−i)/1 = −i'],'Alternativt kan du förlänga ursprungskvoten med i och få samma resultat. Nämnaren 2i är inte noll.')
 ),
 'd-exitfacit':solution(
  step('1 · Multiplicera alla fyra produkter',['(1 + i)(2 − i)','= 1·2 + 1(−i) + i·2 + i(−i)','= 2 − i + 2i − i²','= 2 + i − (−1)','= 3 + i']),
  answer(['(1 + i)(2 − i) = 3 + i']),
  step('2 · Välj konjugatet och förläng',['u = 1 − i','ū = 1 + i','(1 + 2i)/(1 − i) = ((1 + 2i)(1 + i))/((1 − i)(1 + i))'],'Eftersom 1 − i inte är noll får vi förlänga med dess konjugat.'),
  step('3 · Utveckla täljaren',['(1 + 2i)(1 + i)','= 1 + i + 2i + 2i²','= 1 + 3i + 2(−1)','= −1 + 3i']),
  step('4 · Utveckla nämnaren',['(1 − i)(1 + i)','= 1 + i − i − i²','= 1 − (−1) = 2']),
  step('5 · Skriv rektangulär form',['(1 + 2i)/(1 − i) = (−1 + 3i)/2','= −1/2 + (3/2)i']),
  answer(['(1 + 2i)/(1 − i) = −1/2 + (3/2)i']),
  step('6 · Multiplicera tillbaka',['(1 − i)(−1/2 + (3/2)i)','= −1/2 + (3/2)i + (1/2)i − (3/2)i²','= −1/2 + 2i − (3/2)(−1)','= −1/2 + 3/2 + 2i','= 1 + 2i'],'Kontrollen ger den ursprungliga täljaren. Produkten av en nämnare och dess konjugat är alltid reell och positiv när nämnaren inte är noll.')
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
// Behåll originalets frågor och elevstyrda steg, men gör de synliga bråken till semantisk MathML.
document.querySelectorAll('.slide .math').forEach(el=>{
 if(!el.querySelector('.fraction'))return;
 const formula=flatten(el).replaceAll('ū','u\u0304');
 setFormula(el,formula,el.tagName==='SPAN'?'inline':'block');
});
typesetStatic();
})();
