(()=>{
"use strict";
const {$}=window.Fy2Nav,{fmt,particle,fieldOnRod,fluxAngle,loopMotion,fluxPiece,tangent,S,A,T}=window.Fy2Physics;

const m=(expr)=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+expr+'</math>';
const qty=(v,d,unit)=>'<mrow><mo>(</mo><mn>'+fmt(v,d)+'</mn><mtext> '+unit+'</mtext><mo>)</mo></mrow>';
const chain=(law,sub,result,meaning)=>'<div class="calc-chain">'+
 '<div><span class="tag">1 · Samband</span><div class="math-sm">'+m(law)+'</div></div>'+
 '<div><span class="tag">2 · Insättning med enheter</span><div class="math-sm">'+m(sub)+'</div></div>'+
 '<div><span class="tag">3 · Resultat och tolkning</span><div class="math-sm">'+m(result)+'</div><p class="small">'+meaning+'</p></div>'+
 '</div>';
const Uformula='<mi>U</mi><mo>=</mo><mi>B</mi><mi>L</mi><mi>v</mi>';
const Pformula='<mi>Φ</mi><mo>=</mo><mi>B</mi><mi>A</mi><mi>cos</mi><mi>θ</mi>';
const Fformula='<mi>U</mi><mo>=</mo><mo>−</mo><mi>N</mi><mfrac><mrow><mi>Δ</mi><mi>Φ</mi></mrow><mrow><mi>Δ</mi><mi>t</mi></mrow></mfrac>';
const unitResult=(name,value,d,unit)=>'<mi>'+name+'</mi><mo>=</mo><mn>'+fmt(value,d)+'</mn><mtext> '+unit+'</mtext>';

$("ind-electron-start").innerHTML=particle(-1,0,1,1,1,false);
$("ind-electron-answer").innerHTML=particle(-1,0,1,1,1,true);
for(const id of ["ind-rod-start","ind-rod-example"])$(id).innerHTML=fieldOnRod(false);
for(const id of ["ind-rod-answer","ind-rod-result"])$(id).innerHTML=fieldOnRod(true);
let rodShown=false;
function renderRod(){
 const p=Number($("charge-progress").value)/100,B=Number($("rod-B").value),v=Number($("rod-v").value),L=Number($("rod-L").value)/100;
 const eff=v===0?0:p,Ueq=B*L*v,U=Ueq*eff,number=Math.floor(eff*4+.05);
 let symbols="";
 for(let i=0;i<number;i++)symbols+=T(265,98+i*19,"+","#bc5742",19)+T(265,249+i*19,"−","#0f7992",19);
 if(eff>0)symbols+=A(318,205,318,205-68*eff,"#127a93",3)+T(330,193-68*eff,"Fₑ","#0d7b97",17);
 if(v>0)symbols+=A(231,205,231,274,"#ba6643",3)+T(177,272,"Fₘ","#b36543",17);
 $("ind-rod-dynamic").innerHTML=fieldOnRod(false,v>0).replace("</svg>",symbols+"</svg>");
 $("charge-pct").textContent=fmt(p*100,0)+" %";
 $("rod-B-value").textContent=fmt(B,2)+" T";
 $("rod-v-value").textContent=fmt(v,1)+" m/s";
 $("rod-L-value").textContent=fmt(L*100,0)+" cm";
 $("rod-result").innerHTML=rodShown?
 chain(Uformula,
 '<mi>U</mi><mo>=</mo>'+qty(B,2,'T')+'<mo>·</mo>'+qty(L,2,'m')+'<mo>·</mo>'+qty(v,1,'m/s'),
 unitResult('U',Ueq,3,'V'),
 v===0?'När staven står stilla uppkommer ingen rörelseinducerad laddningsseparation.':'Detta är jämviktsspänningen, inte en spänning uppmätt under uppbyggnaden. Övre änden blir positiv. Vid jämvikt gäller |q|E = |q|vB.') :
 'Förutsäg först. Det schematiska reglaget visar laddningsseparation, inte en uppmätt tidskurva. Vilket samband gäller i jämvikt?';
 $("rod-show").textContent=rodShown?"Dölj jämviktsresultatet":"Visa jämvikt och spänning";
}
function resetRod(){rodShown=false;for(const [id,val] of [["charge-progress","0"],["rod-B",".4"],["rod-v","3"],["rod-L","20"]])$(id).value=val;renderRod()}
for(const id of ["charge-progress","rod-B","rod-v","rod-L"])$(id).oninput=()=>{rodShown=false;renderRod()};
$("rod-show").onclick=()=>{rodShown=!rodShown;renderRod()};
$("rod-reset").onclick=resetRod;
$("ind-rod-dynamic").closest(".slide").addEventListener("lesson:reset",resetRod);
let fluxShown=false;
function renderAngle(){
 const theta=Number($("flux-theta").value);
 const d=fluxAngle(.4,.08,theta);
 $("ind-flux-angle").innerHTML=d.html;
 $("flux-theta-value").textContent=fmt(theta,0)+"°";
 $("flux-angle-result").innerHTML=fluxShown?
 chain(Pformula,
 '<mi>Φ</mi><mo>=</mo>'+qty(.4,2,'T')+'<mo>·</mo>'+qty(.08,3,'m²')+'<mo>·</mo><mi>cos</mi><mo>(</mo><mn>'+fmt(theta,0)+'</mn><mo>°</mo><mo>)</mo>',
 unitResult('Φ',Math.abs(d.phi*1000)<1e-9?0:d.phi*1000,1,'mWb'),
 'Vinkeln mäts mellan fältet och den valda normalen. Flödets tecken visar orientering, inte negativ fältstyrka.') :
 'Förutsäg hur flödet ändras när normalen vrids. B och A hålls konstanta.';
 $("flux-angle-show").textContent=fluxShown?"Dölj flödet":"Visa flödet";
}
$("flux-theta").oninput=()=>{fluxShown=false;renderAngle()};
$("flux-angle-show").onclick=()=>{fluxShown=!fluxShown;renderAngle()};
function resetAngle(){fluxShown=false;$("flux-theta").value=0;renderAngle()}
$("flux-angle-reset").onclick=resetAngle;
$("ind-flux-angle").closest(".slide").addEventListener("lesson:reset",resetAngle);
let loopShown=false;
$("ind-loop-predict").innerHTML=loopMotion(.35);
$("ind-lenz").innerHTML=loopMotion(.45);
function renderLoop(){
 const t=Number($("loop-t").value),moving=t>=.2&&t<.65,fraction=t<=.2?0:t>=.65?1:(t-.2)/.45;
 const phi=12+18*fraction,emf=moving?-.04:0;
 $("ind-loop").innerHTML=loopMotion(t);
 $("loop-t-value").textContent=fmt(t,2)+" s";
 $("loop-result").innerHTML=loopShown?
 chain('<mi>Φ</mi><mo>=</mo><mi>B</mi><mi>A</mi><mspace width="1em"/><mi>U</mi><mo>=</mo><mo>−</mo><mi>B</mi><mi>L</mi><mi>v</mi>',
 '<mi>Φ</mi><mo>=</mo>'+qty(.4,2,'T')+'<mo>·</mo>'+qty(phi/400,4,'m²')+
 '<mspace width="1em"/><mi>U</mi><mo>=</mo><mo>−</mo>'+qty(.4,2,'T')+'<mo>·</mo>'+qty(.2,2,'m')+'<mo>·</mo>'+qty(moving?.5:0,2,'m/s'),
 '<mi>Φ</mi><mo>=</mo><mn>'+fmt(phi,1)+'</mn><mtext> mWb</mtext><mspace width="1em"/><mi>U</mi><mo>=</mo><mn>'+fmt(emf,3)+'</mn><mtext> V</mtext>',
 moving?'Positiv normal in i bilden innebär positivt omlopp medurs. När flödet ökar blir U negativ och den inducerade strömmen moturs; den bromsar staven.':'Flödet finns kvar men ändras inte: den inducerade spänningen är noll.') :
 'Förutsäg när U är skild från noll. B = 0,40 T, L = 0,20 m, och v = 0,50 m/s endast under rörelsen.';
 $("loop-show").textContent=loopShown?"Dölj Φ och U":"Visa Φ och U";
}
$("loop-t").oninput=()=>{loopShown=false;renderLoop()};
document.querySelectorAll("[data-loop]").forEach(b=>b.onclick=()=>{$("loop-t").value=b.dataset.loop;loopShown=false;renderLoop()});
$("loop-show").onclick=()=>{loopShown=!loopShown;renderLoop()};
function resetLoop(){loopShown=false;$("loop-t").value=0;renderLoop()}
$("loop-reset").onclick=resetLoop;
$("ind-loop").closest(".slide").addEventListener("lesson:reset",resetLoop);
let graphShown=false;
function renderGraph(){
 const t=Number($("flux-time").value),v=fluxPiece(t);
 $("ind-flux-graph").innerHTML=v.html;
 $("flux-time-value").textContent=fmt(t,2)+" s";
 const edges=[.3,.6,.8],atCorner=edges.some(edge=>Math.abs(t-edge)<.000001);
 const rise=t<.3?.003:t<.6?0:t<.8?-.003:0,interval=t<.3?.3:t<.6?.3:t<.8?.2:1;
 $("flux-time-result").innerHTML=graphShown?
 atCorner?'<b>Brytpunkt vid t = '+fmt(t,1)+' s.</b> Lutningen byts tvärt. En idealiserad U(t) har inget entydigt momentant värde exakt i denna punkt; jämför lutningen före och efter.' :
 chain(Fformula,
 '<mi>U</mi><mo>=</mo><mo>−</mo><mn>200</mn><mo>·</mo><mfrac><mrow><mn>'+fmt(rise*1000,0)+'</mn><mtext> mWb</mtext></mrow><mrow><mn>'+fmt(interval,1)+'</mn><mtext> s</mtext></mrow></mfrac>',
 unitResult('U',v.U,1,'V'),
 'Φ genom ett varv är '+fmt(v.phi,2)+' mWb. '+(v.U===0?'Lutningen är noll, trots att flödet kan vara stort.':v.U<0?'Ökande flöde ger negativ orienterad spänning.':'Minskande flöde ger positiv orienterad spänning.')) :
 'Förutsäg spänningens tecken. Läs två punkter för att bestämma lutningen ΔΦ/Δt.';
 $("flux-time-show").textContent=graphShown?"Dölj resultat":"Visa lutning och spänning";
}
$("flux-time").oninput=()=>{graphShown=false;renderGraph()};
$("flux-time-show").onclick=()=>{graphShown=!graphShown;renderGraph()};
function resetGraph(){graphShown=false;$("flux-time").value=.1;renderGraph()}
$("flux-time-reset").onclick=resetGraph;
$("ind-flux-graph").closest(".slide").addEventListener("lesson:reset",resetGraph);
let tangentShown=false;
function renderTangent(){
 const t=Number($("ind-tangent-time").value),v=tangent(t);
 $("ind-tangent-graph").innerHTML=v.html;
 $("ind-tangent-time-value").textContent=fmt(t,2)+" s";
 $("ind-tangent-result").innerHTML=tangentShown?
 chain('<mi>U</mi><mo>=</mo><mo>−</mo><mi>N</mi><mfrac><mrow><mi>d</mi><mi>Φ</mi></mrow><mrow><mi>d</mi><mi>t</mi></mrow></mfrac>',
 '<mi>U</mi><mo>=</mo><mo>−</mo><mn>200</mn><mo>·</mo><mn>0,003</mn><mo>·</mo><mi>π</mi><mo>·</mo><mi>cos</mi><mo>(</mo><mi>π</mi><mo>·</mo><mn>'+fmt(t,2)+'</mn><mo>)</mo><mtext> V</mtext>',
 unitResult('U',Math.abs(v.U)<1e-10?0:v.U,2,'V'),
 'Exempelkurva: Φ(t) = 3 sin(πt) mWb per varv. Vid maximum är tangentens lutning noll, alltså U = 0.') :
 'Förutsäg tangentens lutning och spänningens tecken. Grafens höjd är inte U.';
 $("ind-tangent-show").textContent=tangentShown?"Dölj spänningen":"Visa tangentens spänning";
}
$("ind-tangent-time").oninput=()=>{tangentShown=false;renderTangent()};
$("ind-tangent-show").onclick=()=>{tangentShown=!tangentShown;renderTangent()};
function resetTangent(){tangentShown=false;$("ind-tangent-time").value=.5;renderTangent()}
$("ind-tangent-reset").onclick=resetTangent;
$("ind-tangent-graph").closest(".slide").addEventListener("lesson:reset",resetTangent);
resetRod();resetAngle();resetLoop();resetGraph();resetTangent();
})();