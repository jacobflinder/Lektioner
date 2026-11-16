(()=>{
"use strict";
const {$}=window.Fy2Nav,{fmt,compass,components,S,A,T}=window.Fy2Physics;

const math=x=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+x+'</math>';
const inlineMath=x=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">'+x+'</math>';
const chain=(law,sub,result,note)=>'<div class="calc-chain">'+
 '<div><span class="tag">1 · Samband</span><div class="math-sm">'+math(law)+'</div></div>'+
 '<details class="calc-ins"><summary>2 · Visa insättning med enheter</summary><div class="math-sm">'+math(sub)+'</div></details>'+
 '<div><span class="tag">3 · Resultat och tolkning</span><div class="math-sm">'+math(result)+'</div><p class="small">'+note+'</p></div></div>';
const val=(x,dp,unit)=>'<mrow><mn>'+fmt(x,dp)+'</mn><mspace width="0.25em"/><mtext>'+unit+'</mtext></mrow>';

const mu0=4*Math.PI*1e-7;
let componentsShown=false,compassShown=false;
function drawComponents(){
 const B=Number($("earth-B").value),i=Number($("earth-i").value),v=components(B,i);
 $("earth-components").innerHTML=v.html;
 $("earth-B-value").textContent=fmt(B,0)+" μT";
 $("earth-i-value").textContent=fmt(i,0)+"°";
 $("earth-components-result").innerHTML=componentsShown?
 '<div class="earth-component-chains">'+
 '<div class="earth-component-card"><span class="tag">Horisontell komponent Bₕ</span>'+
 '<div class="earth-math-stages"><div class="math-sm">'+math('<msub><mi>B</mi><mtext>h</mtext></msub><mo>=</mo><mi>B</mi><mi mathvariant="normal">cos</mi><mi>i</mi>')+'</div>'+
 '<details class="calc-ins"><summary>Visa insättningen för Bₕ</summary><div class="math-sm">'+math('<msub><mi>B</mi><mtext>h</mtext></msub><mo>=</mo>'+val(B,0,'μT')+'<mo>·</mo><mi mathvariant="normal">cos</mi><mo>(</mo><mn>'+fmt(i,0)+'</mn><mo>°</mo><mo>)</mo>')+'</div></details>'+
 '<div class="math-sm">'+math('<msub><mi>B</mi><mtext>h</mtext></msub><mo>≈</mo>'+val(v.Bh,1,'μT'))+'</div></div></div>'+
 '<div class="earth-component-card"><span class="tag">Vertikal komponent Bᵥ (nedåt)</span>'+
 '<div class="earth-math-stages"><div class="math-sm">'+math('<msub><mi>B</mi><mtext>v</mtext></msub><mo>=</mo><mi>B</mi><mi mathvariant="normal">sin</mi><mi>i</mi>')+'</div>'+
 '<details class="calc-ins"><summary>Visa insättningen för Bᵥ</summary><div class="math-sm">'+math('<msub><mi>B</mi><mtext>v</mtext></msub><mo>=</mo>'+val(B,0,'μT')+'<mo>·</mo><mi mathvariant="normal">sin</mi><mo>(</mo><mn>'+fmt(i,0)+'</mn><mo>°</mo><mo>)</mo>')+'</div></details>'+
 '<div class="math-sm">'+math('<msub><mi>B</mi><mtext>v</mtext></msub><mo>≈</mo>'+val(v.Bv,1,'μT'))+'</div></div></div>'+
 '<p class="small">Bᵥ anges som positiv storlek <strong>nedåt</strong> i modellen. För fast B och i från 0° till 90° minskar Bₕ och Bᵥ ökar.</p></div>' :
 'Förutsäg först: om inklinationen ökar men B är konstant, vilken komponent minskar?';
 $("earth-components-reveal").textContent=componentsShown?"Dölj värden":"Visa komponenterna";
}
$("earth-B").oninput=()=>{drawComponents()};
$("earth-i").oninput=()=>{drawComponents()};
$("earth-components-reveal").onclick=()=>{componentsShown=!componentsShown;drawComponents()};
function resetComponents(){componentsShown=false;$("earth-B").value=42;$("earth-i").value=73;drawComponents()}
$("earth-components-reset").onclick=resetComponents;
$("earth-components").closest(".slide").addEventListener("lesson:reset",resetComponents);
const Bh=42*Math.cos(73*Math.PI/180);

/* Figure review v2.1: force zero follows from parallel v and B, no force direction invented. */
function parallelProton(answer){
 const body='<path d="M106 130H546" stroke="#b9d4da" stroke-width="2" stroke-dasharray="7 7"/>'+
 '<circle data-proton cx="144" cy="208" r="22" fill="white" stroke="#bc674c" stroke-width="4"/>'+
 T(136,216,'+','#bc674c',27)+
 A(175,208,490,208,'#16836b',5)+T(510,215,'v','#16836b',25)+
 A(175,130,490,130,'#087b91',5)+T(510,137,'B','#087b91',25)+
 T(30,45,'PROTON · v OCH B ÄR PARALLELLA','#31596b',18)+
 (answer?'<g data-zero-force>'+T(260,294,'F = 0','#345a67',27)+'</g>':T(260,294,'Hur stor är F?','#345a67',21));
 return S(body,650,335,'Proton och parallella vektor-pilar för v och B, båda åt höger; pilarna ritas på olika höjder för läsbarhet. '+(answer?'Kraftens belopp är noll.':'Kraften ska förutsägas.'));
}
$('earth-proton-question').innerHTML=parallelProton(false);
$('earth-proton-feedback').innerHTML=parallelProton(true);

/* Orthographic real coil geometry, no invented current direction or final compass needle. */
function coilSetup(){
 const top='<g data-coil-top-view>'+T(18,40,'SETT UPPIFRÅN','#31596b',18)+
 '<path d="M180 69V296" stroke="#b5734d" stroke-width="9" stroke-linecap="round"/>'+
 '<path d="M180 69V296" stroke="#efba88" stroke-width="3" stroke-linecap="round"/>'+
 '<path d="M70 179H305" stroke="#93b3bd" stroke-width="2.5" stroke-dasharray="8 6"/>'+
 '<circle cx="180" cy="179" r="32" fill="white" stroke="#466a79" stroke-width="3"/>'+
 T(172,187,'?','#31596b',27)+A(180,137,180,78,'#087d96',4)+T(193,92,'Bₕ','#087d96',21)+
 T(154,60,'N ↑','#31596b',17)+T(44,170,'V','#31596b',20)+T(279,170,'Ö','#31596b',20)+
 T(44,333,'Spolens vertikala plan: N–S','#31596b',16)+'</g>';
 const side='<g data-coil-side-view>'+T(371,40,'SETT FRÅN ÖSTER','#31596b',18)+
 '<circle data-actual-coil cx="525" cy="183" r="104" fill="none" stroke="#b5734d" stroke-width="9"/>'+
 '<circle cx="525" cy="183" r="19" fill="white" stroke="#466a79" stroke-width="3"/>'+
 T(517,190,'?','#31596b',23)+
 '<path d="M368 310H659" stroke="#9ebdc4" stroke-width="2" stroke-dasharray="6 5"/>'+
 T(382,338,'Cirkelformad spole · nålen i centrum','#31596b',16)+'</g>';
 return S('<path d="M346 38V341" stroke="#c0d9df" stroke-width="2"/>'+top+side,690,360,
 'Två vyer av spolen: uppifrån syns dess vertikala nord–syd-plan från kanten, från öster syns den cirkelformad med kompassen i centrum. Strömriktning och kompassens slutriktning är ännu inte givna.');
}
$('earth-compass-predict').innerHTML=coilSetup();

function drawCompass(){
 const b=Number($("earth-coil").value),v=compass(Bh,b,compassShown);
 $("earth-compass").innerHTML=v.html;
 $("earth-coil-value").textContent=fmt(b,0)+" μT";
 $("earth-compass-result").innerHTML=compassShown?
 chain('<mi mathvariant="normal">tan</mi><mi>α</mi><mo>=</mo><mfrac><mrow><msub><mi>B</mi><mtext>sp</mtext></msub></mrow><mrow><msub><mi>B</mi><mtext>h</mtext></msub></mrow></mfrac>',
 '<mi>α</mi><mo>=</mo><mi mathvariant="normal">arctan</mi><mo>(</mo><mfrac><mrow>'+val(b,0,'μT')+'</mrow><mrow>'+val(Bh,1,'μT')+'</mrow></mfrac><mo>)</mo>',
 '<mi>α</mi><mo>≈</mo><mn>'+fmt(v.angle,1)+'</mn><mo>°</mo>',
 (b>0?'Röd nordände vrids åt öster.':b<0?'Röd nordände vrids åt väster.':'Röd nordände förblir i magnetisk nordriktning.')+
 ' Spolens fält är här vinkelrätt mot jordfältets horisontella komponent; '+inlineMath('<mi>α</mi>')+' är inte inklinationen '+inlineMath('<mi>i</mi>')+'.') :
 'Förutsäg nålens riktning innan du visar svaret. '+inlineMath('<msub><mi>B</mi><mtext>h</mtext></msub>')+' är konstant medan '+inlineMath('<msub><mi>B</mi><mtext>sp</mtext></msub>')+' ändras.';
 $("earth-compass-show").textContent=compassShown?"Dölj resultant och nål":"Visa resultant och nål";
}
$("earth-coil").oninput=()=>{drawCompass()};
$("earth-compass-show").onclick=()=>{compassShown=!compassShown;drawCompass()};
function resetCompass(){compassShown=false;$("earth-coil").value=0;drawCompass()}
$("earth-compass-reset").onclick=resetCompass;
$("earth-compass").closest(".slide").addEventListener("lesson:reset",resetCompass);
$("earth-triangle").innerHTML=compass(Bh,47.1,true).html;
const solB=mu0*3*1.5/(2*.06)*1e6;
$("earth-example-compass").innerHTML=compass(Bh,solB,true).html;
/* Prediction-only plot: B_h is the UNKNOWN of this inverse problem.
   Do not leak B_h=18 μT by scaling an unlabelled arrow to that solution. */
function compassWithUnknownBh(){
 const cx=320,cy=207;
 const base='<path d="M65 '+cy+'H625" stroke="#b6cdd4" stroke-width="2" fill="none"/>'+
 '<path d="M'+cx+' 45V318" stroke="#91b9c4" stroke-width="2" fill="none" stroke-dasharray="7 7"/>'+
 A(cx,cy,465,cy,'#bd704b',5)+T(420,241,'Bsp = 18 μT','#a56546',20)+
 '<g data-unknown-Bh>'+T(339,122,'Bₕ = ?','#087d96',23)+'</g>'+
 T(32,44,'SETT UPPIFRÅN','#3d6475',17)+
 T(474,334,'Magnetiskt N ↑','#366271',17)+
 T(35,312,'Bₕ är okänt · pilar ej skalenliga','#476b79',17);
 return S(base,690,370,'Öppen kompassuppgift: spolfältet Bsp är känt 18 mikrotesla mot öster, magnetiskt norr är uppåt, men Bh har ännu inte bestämts. Ingen påhittad skalenlig Bh-pil, resultant eller kompassnål avslöjar svaret.');
}
$("earth-example-reverse").innerHTML=compassWithUnknownBh();
$("earth-example-reverse-answer").innerHTML=compass(18,18,true).html;
resetComponents();resetCompass();
})();