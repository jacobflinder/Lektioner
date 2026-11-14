/* Ma4 4.4 · Restsatsen och faktorsatsen.
   Enbart semantisk matematiktypografi och tydliga lösningsled.
   Fråga → egen beräkning → återkoppling, övningsval och grafer behålls. */
(()=>{'use strict';
const M=window.Ma4Math;
if(!M)throw new Error('MathML-stöd för faktorsatsen saknas');
const {step,answer,solution,insertSolutions,typesetStatic,setFormula}=M;
insertSolutions({
 'start-answer':solution(
  step('1 · Sätt in x = 2 och beräkna',['f(x) = x² − x − 2','f(2) = 2² − 2 − 2','= 4 − 2 − 2','= 0']),
  answer(['f(2) = 0']),
  step('Tolka',[],'Grafen skär x-axeln vid (2; 0). Det betyder också att x − 2 är en faktor – förklara varför med faktorsatsen.')
 ),
 'graf-answer':solution(
  step('1 · Pröva det andra nollstället',['f(−1) = (−1)² − (−1) − 2','= 1 + 1 − 2','= 0']),
  step('2 · Kontrollera det första',['f(2) = 2² − 2 − 2','= 4 − 2 − 2','= 0']),
  answer(['x₁ = −1','x₂ = 2']),
  step('Skilj begreppen åt',[],'Nollställena är x-värdena −1 och 2. Funktionsvärdet är 0 i båda punkterna.')
 ),
 rest1:solution(
  step('1 · Hitta insättningsvärdet',['x − 1 = 0','a = 1']),
  step('2 · Beräkna resten',['f(1) = 1³ − 2 · 1² − 5 · 1 + 6','= 1 − 2 − 5 + 6','= 0']),
  answer(['r = f(1) = 0']),
  step('Slutsats',[],'x − 1 är en faktor, eftersom resten är noll.')
 ),
 rest2:solution(
  step('1 · Hitta insättningsvärdet',['x − 2 = 0','a = 2']),
  step('2 · Beräkna resten',['f(2) = 2³ − 2 · 2² − 5 · 2 + 6','= 8 − 8 − 10 + 6','= −4']),
  answer(['r = f(2) = −4']),
  step('Slutsats',[],'x − 2 är inte en faktor, eftersom resten inte är noll.')
 ),
 rest3:solution(
  step('1 · Plustecken i divisorn – negativt insättningsvärde',['x + 2 = 0','a = −2']),
  step('2 · Beräkna potenser och produkter var för sig',['(−2)³ = −8','−2(−2)² = −8','−5(−2) = 10']),
  step('3 · Samla och jämför med noll',['−8 − 8 = −16','10 + 6 = 16','f(−2) = −16 + 16','= 0']),
  answer(['r = f(−2) = 0']),
  step('Slutsats',[],'x + 2 är en faktor. Det avgörs av f(−2), inte f(2).')
 ),
 'dubbel-answer':solution(
  step('1 · Sätt in x = 2',['F(x) = (x − 2)²(x + 1)','F(2) = (2 − 2)²(2 + 1)','= 0² · 3 = 0']),
  step('2 · Faktorn förekommer två gånger',['F(x) = (x − 2)(x − 2)(x + 1)']),
  answer(['x = 2']),
  step('Grafisk betydelse',[],'x = 2 är en dubbelrot. Grafen tangerar x-axeln där, men nollstället och faktorn finns ändå.')
 ),
 'exit-check1':solution(
  step('1 · Välj rätt insättningsvärde',['x + 1 = 0','a = −1']),
  step('2 · Beräkna de enskilda termerna',['(−1)³ = −1','2(−1)² = 2','−5(−1) = 5']),
  step('3 · Summera resten',['p(−1) = −1 + 2 + 5 − 6','= 0']),
  step('4 · Motivera med restsatsen',['p(x) = (x + 1)q(x) + r','p(−1) = 0 · q(−1) + r = r']),
  answer(['r = 0']),
  step('Slutsats',[],'x + 1 är en faktor eftersom p(−1) = 0.')
 ),
 'exit-check2':solution(
  step('Använd restsatsen utan polynomdivision',['x − 1 = 0','a = 1','p(1) = 1³ + 2 · 1² − 5 · 1 − 6','= 1 + 2 − 5 − 6']),
  answer(['r = p(1) = −8']),
  step('Varför räcker det?',[],'Vid division med x − a är resten alltid p(a).')
 ),
 'exit-check3':solution(
  step('1 · Nollställena bestämmer faktorerna',['x = −2 ⇒ x + 2','x = 0 ⇒ x','x = 1 ⇒ x − 1','h(x) = k(x + 2)x(x − 1)']),
  step('2 · Punkten (2; 8) bestämmer k',['h(2) = 8','8 = k(2 + 2)·2·(2 − 1)','= k·4·2·1','= 8k','k = 1']),
  answer(['h(x) = x(x + 2)(x − 1)']),
  step('Kontroll',[],'Funktionen är noll vid −2, 0 och 1 och har funktionsvärdet 8 då x = 2.')
 ),
 homefacit:solution(
  step('1 · Beräkna varje term när x = −1',['h(x) = x³ + x² − 4x − 4',
    '(−1)³ = −1','(−1)² = 1','−4(−1) = 4']),
  step('2 · Summera och jämför med noll',['h(−1) = −1 + 1 + 4 − 4','= 0']),
  answer(['h(−1) = 0']),
  step('Slutsats',[],'x + 1 är en faktor enligt faktorsatsen.'),
  step('3 · Beräkna resten vid division med x − 3',['h(3) = 3³ + 3² − 4·3 − 4','= 27 + 9 − 12 − 4','= 20']),
  answer(['r = 20'])
 )
});
// En lång stegvis grafkontroll ligger inuti svaret och får INTE tas bort.
const updated=document.getElementById('newk');
if(!updated)throw Error('Interaktivt skalfaktorsvar saknas');
const preserved=updated.querySelector('.interactive-check');
if(!preserved)throw Error('Skalfaktorns klickbara figur saknas');
for(const node of Array.from(updated.children)){
 if(node===preserved)break;
 node.remove();
}
const prelude=solution(
 step('1 · Bestäm skalfaktorn med den nya punkten',['g(x) = k(x + 1)(x − 1)(x − 3)',
  'g(0) = 6','6 = k(0 + 1)(0 − 1)(0 − 3)','= k·1·(−1)·(−3)','= 3k']),
 answer(['k = 2']),
 step('2 · Skriv det nya polynomet',['g(x) = 2(x + 1)(x − 1)(x − 3)'],
  'Nollställena förblir −1, 1 och 3. Funktionsvärdena fördubblas.')
);
updated.insertAdjacentHTML('afterbegin',prelude);
updated.dataset.mathPresentation='true';
// I satsens bevis ligger slutsatsen tidigare blandad med löptext.
// Separationen gör likvärdigheten tydligare och matematiskt entydig.
const finalStep=document.querySelector('#f-sats [data-seq-item]:last-child');
if(!finalStep)throw Error('Satsens sista bevissteg saknas');
const mixed=finalStep.querySelector('.math');
if(!mixed)throw Error('Blandad matematik i faktorsatsens bevis saknas');
setFormula(mixed,'f(a) = 0 ⇔ r = 0','block');
const why=document.createElement('p');
why.textContent='Detta gäller om och endast om x − a är en faktor i f(x).';
mixed.after(why);
typesetStatic();
})();