(()=>{
"use strict";
const {$}=window.Fy2Nav,{fmt,compass,components}=window.Fy2Physics;

const math=x=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+x+'</math>';
const inlineMath=x=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">'+x+'</math>';
const chain=(law,sub,result,note)=>'<div class="calc-chain">'+
 '<div><span class="tag">1 · Samband</span><div class="math-sm">'+math(law)+'</div></div>'+
 '<details class="calc-ins"><summary>2 · Visa insättning med enheter</summary><div class="math-sm">'+math(sub)+'</div></details>'+
 '<div><span class="tag">3 · Resultat och tolkning</span><div class="math-sm">'+math(result)+'</div><p class="small">'+note+'</p></div></div>';
const val=(x,dp,unit)=>'<mrow><mn>'+fmt(x,dp)+'</mn><mtext> '+unit+'</mtext></mrow>';

const mu0=4*Math.PI*1e-7;
let componentsShown=false,compassShown=false;
function drawComponents(){
 const B=Number($("earth-B").value),i=Number($("earth-i").value),v=components(B,i);
 $("earth-components").innerHTML=v.html;
 $("earth-B-value").textContent=fmt(B,0)+" μT";
 $("earth-i-value").textContent=fmt(i,0)+"°";
 $("earth-components-result").innerHTML=componentsShown?
 chain('<msub><mi>B</mi><mtext>h</mtext></msub><mo>=</mo><mi>B</mi><mi mathvariant="normal">cos</mi><mi>i</mi><mspace width="1em"/><msub><mi>B</mi><mi>v</mi></msub><mo>=</mo><mi>B</mi><mi mathvariant="normal">sin</mi><mi>i</mi>',
 '<msub><mi>B</mi><mtext>h</mtext></msub><mo>=</mo>'+val(B,0,'μT')+'<mo>·</mo><mi mathvariant="normal">cos</mi><mo>(</mo><mn>'+fmt(i,0)+'</mn><mo>°</mo><mo>)</mo><mspace width="1em"/>'+
 '<msub><mi>B</mi><mi>v</mi></msub><mo>=</mo>'+val(B,0,'μT')+'<mo>·</mo><mi mathvariant="normal">sin</mi><mo>(</mo><mn>'+fmt(i,0)+'</mn><mo>°</mo><mo>)</mo>',
 '<msub><mi>B</mi><mtext>h</mtext></msub><mo>=</mo>'+val(v.Bh,1,'μT')+'<mspace width="1em"/><msub><mi>B</mi><mi>v</mi></msub><mo>=</mo>'+val(v.Bv,1,'μT'),
 ''+inlineMath('<msub><mi>B</mi><mi>v</mi></msub>')+' är här komponenten nedåt. Om B hålls konstant och i ökar från 0° till 90° minskar '+inlineMath('<msub><mi>B</mi><mtext>h</mtext></msub>')+'.') :
 'Förutsäg först: om inklinationen ökar men B är konstant, vilken komponent minskar?';
 $("earth-components-reveal").textContent=componentsShown?"Dölj värden":"Visa komponenterna";
}
$("earth-B").oninput=()=>{drawComponents()};
$("earth-i").oninput=()=>{drawComponents()};
$("earth-components-reveal").onclick=()=>{componentsShown=!componentsShown;drawComponents()};
function resetComponents(){componentsShown=false;componentsShown=false;$("earth-B").value=42;$("earth-i").value=73;drawComponents()}
$("earth-components-reset").onclick=resetComponents;
$("earth-components").closest(".slide").addEventListener("lesson:reset",resetComponents);
const Bh=42*Math.cos(73*Math.PI/180);
$("earth-compass-predict").innerHTML=compass(Bh,30,false).html;
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
function resetCompass(){compassShown=false;compassShown=false;$("earth-coil").value=0;drawCompass()}
$("earth-compass-reset").onclick=resetCompass;
$("earth-compass").closest(".slide").addEventListener("lesson:reset",resetCompass);
$("earth-triangle").innerHTML=compass(Bh,47.1,true).html;
const solB=mu0*3*1.5/(2*.06)*1e6;
$("earth-example-compass").innerHTML=compass(Bh,solB,true).html;
$("earth-example-reverse").innerHTML=compass(18,18,true).html;
resetComponents();resetCompass();
})();