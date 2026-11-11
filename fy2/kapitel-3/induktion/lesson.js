(()=>{
"use strict";
const {$}=window.Fy2Nav,{fmt,particle,fieldOnRod,fluxAngle,loopMotion,fluxPiece,tangent,S,A,T}=window.Fy2Physics;
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
 $("rod-result").textContent=rodShown?
 "Jämvikt vid U = BLv = "+fmt(Ueq,3)+" V (övre änden positiv när v åt höger, B inåt). "+
 (v===0?"Staven står stilla och ingen magnetisk separation byggs upp.":"Vid fullt utslag balanserar |q|E magnetkraften |q|vB."):
 "Schematiskt läge: Fₘ är konstant för vald v och B, medan det motriktade elektriska fältet växer mot jämvikt. "+
 "Beräknad del av jämviktsspänningen: "+fmt(U,3)+" V.";
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
 $("flux-angle-result").textContent=fluxShown?
 "Orienterat flöde Φ = BA cosθ = "+fmt(d.phi*1000,1)+" mWb. Vid θ=90° är flödet noll. Negativt värde betyder motsatt vald normal.":
 "Förutsäg hur flödet förändras när vinkeln mellan B och normalvektorn ökar.";
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
 $("loop-result").textContent=loopShown?
 "Φ = "+fmt(phi,1)+" mWb (in i bilden). Inducerad U = "+fmt(emf,3)+" V. "+
 (moving?"Det valda positiva omloppet är medurs; den negativa U driver ström moturs och bromsar staven.":"Slingan har flöde men ingen flödesändring just nu: U = 0."):
 "Förutsäg om U är noll eller inte. B=0,40 T, stavlängd 0,20 m, under rörelse v=0,50 m/s. Startarean 0,030 m².";
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
 $("flux-time-result").textContent=graphShown?
 "Φ = "+fmt(v.phi,2)+" mWb · U = −N dΦ/dt = "+fmt(v.U,1)+" V för N=200 varv. "+
 (v.U===0?"Horisontell graf: ingen inducerad spänning.":v.U<0?"Flödet ökar, den orienterade spänningen är negativ.":"Flödet minskar, spänningen är positiv."):
 "Förutsäg tecknet för U. Det är flödets lutning, inte dess höjd, som avgör.";
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
 $("ind-tangent-result").textContent=tangentShown?
 "Φ = "+fmt(v.phi,2)+" mWb · inducerad U = "+fmt(v.U,2)+" V. "+
 "Vid flödets maximum är tangenten horisontell och U=0.":
 "Förutsäg tangentens lutning. Vid grafens maximum blir U=0 trots att Φ är stort.";
 $("ind-tangent-show").textContent=tangentShown?"Dölj spänningen":"Visa tangentens spänning";
}
$("ind-tangent-time").oninput=()=>{tangentShown=false;renderTangent()};
$("ind-tangent-show").onclick=()=>{tangentShown=!tangentShown;renderTangent()};
function resetTangent(){tangentShown=false;$("ind-tangent-time").value=.5;renderTangent()}
$("ind-tangent-reset").onclick=resetTangent;
$("ind-tangent-graph").closest(".slide").addEventListener("lesson:reset",resetTangent);
resetRod();resetAngle();resetLoop();resetGraph();resetTangent();
})();