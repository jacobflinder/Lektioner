(()=>{
"use strict";
const {$}=window.Fy2Nav,{fmt,compass,components}=window.Fy2Physics;
const mu0=4*Math.PI*1e-7;
let componentsShown=false,compassShown=false;
function drawComponents(){
 const B=Number($("earth-B").value),i=Number($("earth-i").value),v=components(B,i);
 $("earth-components").innerHTML=v.html;
 $("earth-B-value").textContent=fmt(B,0)+" μT";
 $("earth-i-value").textContent=fmt(i,0)+"°";
 $("earth-components-result").textContent=componentsShown?
 "Bₕ = "+fmt(v.Bh,1)+" μT och Bᵥ = "+fmt(v.Bv,1)+" μT nedåt. Bₕ=B cos i, Bᵥ=B sin i.":
 "Förutsäg först: om inklinationen ökar och B är konstant, vad händer med Bₕ?";
 $("earth-components-reveal").textContent=componentsShown?"Dölj värden":"Visa komponenterna";
}
$("earth-B").oninput=()=>{componentsShown=false;drawComponents()};
$("earth-i").oninput=()=>{componentsShown=false;drawComponents()};
$("earth-components-reveal").onclick=()=>{componentsShown=!componentsShown;drawComponents()};
function resetComponents(){componentsShown=false;$("earth-B").value=42;$("earth-i").value=73;drawComponents()}
$("earth-components-reset").onclick=resetComponents;
$("earth-components").closest(".slide").addEventListener("lesson:reset",resetComponents);
const Bh=42*Math.cos(73*Math.PI/180);
$("earth-compass-predict").innerHTML=compass(Bh,30,false).html;
function drawCompass(){
 const b=Number($("earth-coil").value),v=compass(Bh,b,compassShown);
 $("earth-compass").innerHTML=v.html;
 $("earth-coil-value").textContent=fmt(b,0)+" μT";
 $("earth-compass-result").textContent=compassShown?
 "Kompassens nordände följer Bₕ+Bsp. α = "+fmt(v.angle,1)+"°. "+
 (b>0?"Den vrids åt öster.":b<0?"Den vrids åt väster.":"Nålen pekar mot magnetiskt norr."):
 "Förutsäg nålens riktning. Bₕ hålls konstant, medan Bsp kan vara positivt eller negativt.";
 $("earth-compass-show").textContent=compassShown?"Dölj resultant och nål":"Visa resultant och nål";
}
$("earth-coil").oninput=()=>{compassShown=false;drawCompass()};
$("earth-compass-show").onclick=()=>{compassShown=!compassShown;drawCompass()};
function resetCompass(){compassShown=false;$("earth-coil").value=0;drawCompass()}
$("earth-compass-reset").onclick=resetCompass;
$("earth-compass").closest(".slide").addEventListener("lesson:reset",resetCompass);
$("earth-triangle").innerHTML=compass(Bh,47.1,true).html;
const solB=mu0*3*1.5/(2*.06)*1e6;
$("earth-example-compass").innerHTML=compass(Bh,solB,true).html;
$("earth-example-reverse").innerHTML=compass(18,18,true).html;
resetComponents();resetCompass();
})();