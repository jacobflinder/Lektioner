/* Ma4 4.4 · Polynomekvationer av högre grad.
   Ekvationerna ligger i riktiga matematikrader. Lektionsordning,
   handskriven polynomdivision, konjugatbeslut, NOKflex och dolda facit bevaras. */
(()=>{'use strict';
const M=window.Ma4Math;
if(!M)throw new Error('MathML-stöd för polynomekvationer saknas');
const {step,answer,solution,insertSolutions,typesetStatic,setFormula}=M;
insertSolutions({
 'h-startanswer':solution(
  step('1 · Använd faktorsatsen',['f(1) = 0']),
  answer(['z − 1']),
  step('2 · Lös andragradsekvationen',['z² + 4 = 0','z² = −4']),
  answer(['z = 2i','z = −2i']),
  step('Framåtblick',[],'En känd rot ger en faktor och en lägre grad. Vi behöver också kontrollera komplexa rotpar och multiplicitet.')
 ),
 'h-multans':solution(
  step('Räkna rötter med multiplicitet',['f(x) = (x − 1)²(x + 2)','z₁ = z₂ = 1','z₃ = −2']),
  answer(['2 + 1 = 3']),
  step('Grafisk tolkning',[],'Det finns två olika reella nollställen: 1 och −2. Roten 1 är dubbel, så grafen tangerar x-axeln där.')
 ),
 'h-multtry':solution(
  step('1 · Läs av faktorer och multiplicitet',['(z − 3)³(z + 1) = 0','z₁ = z₂ = z₃ = 3','z₄ = −1']),
  answer(['3 + 1 = 4']),
  step('Slutsats',[],'Polynomet har grad 4, men bara två olika rötter. Roten 3 är tredubbel och −1 enkel.')
 ),
 'h-cubictry':solution(
  step('1 · Gruppera två par',['z³ + z² + 4z + 4 = 0','z²(z + 1) + 4(z + 1) = 0']),
  step('2 · Bryt ut gemensam faktor',['(z + 1)(z² + 4) = 0']),
  step('3 · Lös de två faktorerna',['z + 1 = 0','z² + 4 = 0','z² = −4']),
  answer(['z₁ = −1','z₂ = 2i','z₃ = −2i']),
  step('Kontrollera',[],'Tre olika enkla rötter stämmer med polynomets grad 3. Utveckling av faktorerna ger ursprungspolynomet.')
 ),
 'h-quartictry':solution(
  step('1 · Använd konjugatregeln',['z = 2i','z = −2i']),
  step('2 · Bygg en faktor med reella koefficienter',['(z − 2i)(z + 2i) = z² + 4']),
  step('3 · Sänk graden och kontrollera faktoriseringen',[
    'z⁴ + 5z² + 4',
    '= (z² + 4)(z² + 1)',
    '= z⁴ + (4 + 1)z² + 4'
  ]),
  step('4 · Lös båda andragradsfaktorerna',['z² + 4 = 0 ⇒ z = ±2i','z² + 1 = 0 ⇒ z = ±i']),
  answer(['z = ±2i','z = ±i']),
  step('Kontrollera antalet',[],'Fyra olika enkla komplexa rötter – precis lika många som graden.')
 ),
 'h-oddans':solution(
  step('1 · Konjugatregeln',['z','z̄'],
   'Om ett polynom har reella koefficienter förekommer varje icke-reell rot tillsammans med sitt konjugat, med samma multiplicitet.'),
  step('2 · Räkna bidragen',[
    '2m',
    'n = 2m + 1'
  ],'Icke-reella rotpar bidrar alltid med ett jämnt antal. Ett udda totalt antal kan inte bestå enbart av sådana par.'),
  step('Slutsats',[],'Minst en rot till ett reellt polynom av udda grad måste vara reell.')
 ),
 'h-exit-1':solution(
  step('1 · Gruppera polynomets termer',[
    'f(z) = z³ + 2z² + 9z + 18',
    '= (z³ + 2z²) + (9z + 18)',
    '= z²(z + 2) + 9(z + 2)'
  ]),
  step('2 · Bryt ut en gemensam faktor',['f(z) = (z + 2)(z² + 9)']),
  step('3 · Använd nollproduktmetoden',['z + 2 = 0 ⇒ z = −2','z² + 9 = 0 ⇒ z² = −9']),
  answer(['z₁ = −2','z₂ = 3i','z₃ = −3i']),
  step('Kontrollera antalet',[],'Tre olika enkla rötter är precis det antal som graden kräver.')
 ),
 'h-exit-2':solution(
  step('1 · Bara reella x syns i grafen',['f(x) = (x + 2)(x² + 9)']),
  step('2 · Den andra faktorn kan inte bli noll för reella x',[
    'x² ≥ 0',
    'x² + 9 > 0'
  ]),
  answer(['x = −2']),
  step('Tolka',[],'På den reella grafen finns bara ett nollställe. De två icke-reella rötterna är inte skärningar med x-axeln.')
 ),
 'h-exit-3':solution(
  step('1 · Titta på faktorerna och deras exponenter',['(z − 1)²(z + 3) = 0']),
  answer(['z₁ = z₂ = 1','z₃ = −3']),
  step('Multiplicitet',[],'Roten 1 har multiplicitet 2, roten −3 har multiplicitet 1. Tillsammans räknas tre rötter.')
 ),
 'h-homeans':solution(
  step('1 · Använd den givna roten och faktorisera',['z³ − 3z² + 4z − 12',
    '= (z − 3)(z² + 4)']),
  answer(['z = 3','z = 2i','z = −2i']),
  step('2 · Använd konjugatet till den givna roten',['z⁴ + 10z² + 9',
    '= (z² + 1)(z² + 9)']),
  answer(['z = ±i','z = ±3i']),
  step('Kontrollera',[],'Första polynomet har tre enkla rötter och det andra fyra enkla rötter. Antalen stämmer med respektive grad.')
 )
});
// De författade sju delstegen i kvotlösningen och de sex i
// polynomdivisionen blir MathML utan att nästa svar visas i förväg.
// Klassrummets handskrivna liggande stol behåller exakt gradkolumnerna.
typesetStatic();
document.querySelectorAll('#h-kand .longdiv-demo td').forEach(cell=>{
 const source=cell.textContent.trim();
 if(!source)return;
 setFormula(cell,source,'inline');
});
// Dagens huvudidé är ett matematiskt påstående blandat med prosa.
// Sätt själva matematiken separat från dess villkor och tolkning.
const degreeIdea=document.querySelector('#h-rakna .math.math-big');
if(!degreeIdea)throw Error('Huvudidén om antalet rötter saknas');
degreeIdea.innerHTML='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="grad p = n"><mrow><mi mathvariant="normal">grad</mi><mi>p</mi><mo>=</mo><mi>n</mi></mrow></math>';
degreeIdea.dataset.mathPresentation='true';
const theorem=document.createElement('p');
theorem.className='ma4-note';
theorem.textContent='Ett polynom av grad n har n komplexa rötter, räknade med multiplicitet.';
degreeIdea.after(theorem);
})();