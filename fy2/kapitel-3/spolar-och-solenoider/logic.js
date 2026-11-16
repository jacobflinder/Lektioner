(() => {
"use strict";
const $=id=>document.getElementById(id),slides=[...document.querySelectorAll(".slide")];
const N=slides.length;let current=0,view="side",core=false;
function render(){
 slides.forEach((slide,i)=>slide.classList.toggle("active",i===current));
 $("counter").textContent=(current+1)+" / "+N;
 $("jump").value=String(current);
 $("prev-btn").disabled=current===0;$("next-btn").disabled=current===N-1;
 const unshown=slides[current].querySelector(".answer:not(.shown)");
 $("reveal-btn").textContent=unshown?"Visa nästa steg":current<N-1?"Nästa bild":"Allt visat";
 $("reveal-btn").disabled=!unshown&&current===N-1;
}
function clearSlideFeedback(i){
 const slide=slides[i];
 slide.querySelectorAll(".answer.shown").forEach(el=>el.classList.remove("shown"));
 slide.dispatchEvent(new Event("lesson:reset"));
 if(i===4){view="side";viewDir=1;viewShown=false;drawView()}
 if(i===5)slide.querySelector(".loop-comparison").open=false;
 if(i===7){core=false;coreDir=1;drawCore()}
 if(i===10){$("sol-reset").click()}
 if(i===12){$("flat-reset").click()}
}
function go(i){
 const next=Math.max(0,Math.min(N-1,i));
 if(next!==current&&!document.body.classList.contains("repeat"))clearSlideFeedback(next);
 current=next;
 render();window.scrollTo(0,0);
}
function reveal(){
 const a=slides[current].querySelector(".answer:not(.shown)");
 if(a){a.classList.add("shown");render();}
 else if(current<N-1)go(current+1);
}
$("prev-btn").addEventListener("click",()=>go(current-1));
$("next-btn").addEventListener("click",()=>go(current+1));
$("reveal-btn").addEventListener("click",reveal);
$("reset-btn").addEventListener("click",()=>{
 clearSlideFeedback(current);
 render();
});
document.querySelectorAll("[data-reveal]").forEach(b=>b.addEventListener("click",()=>{
 const next=b.nextElementSibling;
 if(next?.classList.contains("answer")){next.classList.toggle("shown");render()}
}));
slides.forEach((s,i)=>{
 const o=document.createElement("option");
 o.value=String(i);o.textContent=(i+1)+". "+s.dataset.title;
 $("jump").appendChild(o);
});
$("jump").addEventListener("change",e=>go(Number(e.target.value)));
function mode(repeat){
 const previouslyRepeating=document.body.classList.contains("repeat");
 document.body.classList.toggle("repeat",repeat);
 if(previouslyRepeating&&!repeat)clearSlideFeedback(current);
 $("class-btn").classList.toggle("selected",!repeat);
 $("repeat-btn").classList.toggle("selected",repeat);
 $("class-btn").setAttribute("aria-pressed",String(!repeat));
 $("repeat-btn").setAttribute("aria-pressed",String(repeat));
 syncPrediction("sol");syncPrediction("flat");
}
$("class-btn").addEventListener("click",()=>mode(false));
$("repeat-btn").addEventListener("click",()=>mode(true));
$("fullscreen-btn").addEventListener("click",()=>{
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
 else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});
});
document.addEventListener("keydown",e=>{
 if(e.target.closest("button,input,select,textarea,summary")||e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();reveal()}
 else if(e.key==="ArrowLeft"){e.preventDefault();go(current-1)}
});

let viewDir=1,viewShown=false,coreDir=1,solDir=1,flatDir=1,solShown=false,flatShown=false;
const mu0=4*Math.PI*1e-7;
const swFmt=(x,n=1)=>Number(x).toLocaleString("sv-SE",{minimumFractionDigits:n,maximumFractionDigits:n});

const ml=x=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+x+'</math>';
const mult=(n,unit,dec)=>'<mrow><mn>'+swFmt(n,dec)+'</mn><mtext> '+unit+'</mtext></mrow>';
const calc=(law,subSteps,result,note)=>'<div class="calc-chain">'+
 '<div><span class="tag">1 · Samband</span><div class="math-sm">'+ml(law)+'</div></div>'+
 '<details class="calc-ins"><summary>2 · Visa insättningar och enhetssteg</summary>'+
 '<div class="calc-steps">'+subSteps.map(x=>'<div class="math-sm">'+ml(x)+'</div>').join('')+'</div>'+
 '<details class="calc-final"><summary>3 · Visa slutsvar och tolkning</summary>'+
 '<div class="math-sm">'+ml(result)+'</div><p class="small">'+note+'</p></details></details></div>';
const unit=x=>'<mspace width="0.18em"/><mtext>'+x+'</mtext>';
const num=(n,d=2,u='')=>'<mn>'+swFmt(n,d)+'</mn>'+(u?unit(u):'');
const sciMu='<mn>4</mn><mi>π</mi><mo>·</mo><msup><mn>10</mn><mn>−7</mn></msup>'+unit('T·m/A');
const mu='<msub><mi>μ</mi><mn>0</mn></msub>';

const coreHost=$("core-svg").parentElement;
function drawView(){
 $("view-holder").innerHTML=view==="side"?
   CoilArt.coilSingleLoop({dir:viewDir,field:viewShown}):CoilArt.endViewLoop(viewDir,viewShown);
 $("view-caption").textContent=!viewShown?
  (view==="side"?"Förutsäg B: övre tråddelen går "+(viewDir>0?"ut ur":"in i")+" bilden, undre går "+(viewDir>0?"in i":"ut ur")+" bilden.":"Förutsäg B: sett från höger går strömmen "+(viewDir>0?"moturs":"medurs")+"."):
  (view==="side"?"B pekar "+(viewDir>0?"åt höger":"åt vänster")+" längs varvets axel.":"B pekar "+(viewDir>0?"ut ur":"in i")+" bilden. Det är samma fält som i sidovyn.");
 $("view-side").classList.toggle("selected",view==="side");
 $("view-right").classList.toggle("selected",view==="right");
 $("view-side").setAttribute("aria-pressed",String(view==="side"));
 $("view-right").setAttribute("aria-pressed",String(view==="right"));
 $("view-reveal").textContent=viewShown?"Dölj fältriktningen":"Visa fältriktningen";
}
$("view-side").addEventListener("click",()=>{view="side";drawView()});
$("view-right").addEventListener("click",()=>{view="right";drawView()});
$("view-flip").addEventListener("click",()=>{viewDir*=-1;viewShown=false;drawView()});
$("view-reveal").addEventListener("click",()=>{viewShown=!viewShown;drawView()});
$("view-reset").addEventListener("click",()=>{view="side";viewDir=1;viewShown=false;drawView()});
function drawCore(){
 coreHost.innerHTML=CoilArt.coilHelix({core,dir:coreDir,field:true,withP:true});
 $("core-explanation").textContent=core?
 "Samma spole och ström, nu med mjukjärnskärna. Kärnans magnetisering kan öka B, men en exakt förstärkningsfaktor kan inte räknas ut utan materialdata och geometri.":
 "Luftspole. Spolens och strömmens värden är oförändrade. Förutsäg hur en mjukjärnskärna påverkar fältet i P.";
 $("core-insert").classList.toggle("selected",core);
 $("core-remove").classList.toggle("selected",!core);
}
$("core-insert").addEventListener("click",()=>{core=true;drawCore()});
$("core-remove").addEventListener("click",()=>{core=false;drawCore()});
$("core-direction").addEventListener("click",()=>{coreDir*=-1;drawCore()});

function syncPrediction(kind){
 const root=document.querySelector('[data-inquiry="'+kind+'"]');if(!root)return;
 const active=root.querySelector("button.selected");
 const feedback=root.querySelector(".inquiry-feedback");
 if(!active){feedback.textContent="Välj ditt svar och motivera innan du visar beräkningen.";return;}
 const available=document.body.classList.contains("repeat")||(kind==="sol"?solShown:flatShown);
 if(!available){
  feedback.textContent="Ditt svar är markerat. Motivera för en kamrat innan du visar beräkningen.";
  return;
 }
 const correct=active.dataset.choice===root.dataset.correct;
 const solLaw='<mi>B</mi><mo>≈</mo><mfrac><mrow>'+mu+'<mi>N</mi><mi>I</mi></mrow><mi>L</mi></mfrac>';
 const flatLaw='<mi>B</mi><mo>≈</mo><mfrac><mrow>'+mu+'<mi>N</mi><mi>I</mi></mrow><mrow><mn>2</mn><mi>r</mi></mrow></mfrac>';
 const selected=kind==="sol"?solLaw:flatLaw;
 const rendered='<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">'+selected+'</math>';
 feedback.innerHTML=correct?(kind==="sol"?
  "Rätt. I en lång luftsolenoid är "+rendered+". Om N fördubblas vid samma I och L, fördubblas B.":
  "Rätt. I centrum av en platt luftspole är "+rendered+". Om r fördubblas, halveras B."):
  (kind==="sol"?
  "Inte riktigt. I "+rendered+" finns N i täljaren. Ändra bara N och pröva igen.":
  "Inte riktigt. I "+rendered+" står r i nämnaren. Ändra bara r och pröva igen.");
 feedback.style.fontWeight=correct?"700":"600";
}
document.querySelectorAll("[data-inquiry]").forEach(group=>{
 group.querySelectorAll("button[data-choice]").forEach(button=>button.addEventListener("click",()=>{
  group.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
  button.classList.add("selected");
  syncPrediction(group.dataset.inquiry);
 }));
});
function resetPrediction(kind){
 const group=document.querySelector('[data-inquiry="'+kind+'"]');
 if(group)group.querySelectorAll("button.selected").forEach(b=>b.classList.remove("selected"));
 syncPrediction(kind);
}
function renderSol(){
 const I=Number($("sol-i").value),N=Number($("sol-n").value),L=Number($("sol-l").value);
 const mT=mu0*N*I/L*1e3,turnDensity=N/L,arealAmp=turnDensity*I;
 const relSol=(N/300)*(I/0.8)*(0.30/L);
 const prevSteps=$("sol-result").querySelector("details.calc-ins")?.open||false;
 const prevFinal=$("sol-result").querySelector("details.calc-final")?.open||false;
 $("sol-i-value").textContent=swFmt(I,2)+" A";
 $("sol-n-value").textContent=String(N);
 $("sol-l-value").textContent=swFmt(L,2)+" m";
 $("solenoid-visual").innerHTML=CoilArt.coilHelix({core:false,dir:solDir,field:solShown,turns:12+Math.round((N-100)/42),lengthMeters:L,fieldMilliTesla:mT,withMeter:true});
 const subSteps=[
  '<msub><mi>μ</mi><mn>0</mn></msub><mo>≈</mo>'+sciMu,
  '<mi>n</mi><mo>=</mo><mfrac><mi>N</mi><mi>L</mi></mfrac>',
  '<mi>n</mi><mo>=</mo><mfrac>'+num(N,0)+'<mrow>'+num(L,2,'m')+'</mrow></mfrac>',
  '<mi>n</mi><mo>≈</mo>'+num(turnDensity,1,'m⁻¹'),
  '<mi>n</mi><mi>I</mi><mo>≈</mo>'+num(turnDensity,1)+'<mo>·</mo>'+num(I,2,'A'),
  '<mi>n</mi><mi>I</mi><mo>≈</mo>'+num(arealAmp,1,'A/m'),
  '<mi>B</mi><mo>≈</mo><msub><mi>μ</mi><mn>0</mn></msub><mi>n</mi><mi>I</mi>'
 ];
 $("sol-result").innerHTML=solShown?
 calc('<mi>B</mi><mo>≈</mo><mfrac><mrow>'+mu+'<mi>N</mi><mi>I</mi></mrow><mi>L</mi></mfrac>',subSteps,
 '<mi>B</mi><mo>≈</mo>'+num(mT,3,'mT'),
 'Idealiserad luftsolenoid långt från ändarna. Inuti pekar B '+(solDir>0?'åt höger (N till höger)':'åt vänster (N till vänster)')+
 '. Beloppet är '+swFmt(relSol,2)+' gånger utgångsfallet. Den separata blå stapeln har linjär mätskala; fältpilarna är schematiska.') :
 "Förutsäg först belopp och riktning. Ändra en storhet i taget och visa sedan sambandet.";
 if(solShown){$("sol-result").querySelector(".calc-ins").open=prevSteps;$("sol-result").querySelector(".calc-final").open=prevFinal}
 $("sol-show").textContent=solShown?"Dölj beräkning och fält":"Visa beräkning och fält";
 syncPrediction("sol");
}
for(const id of ["sol-i","sol-n","sol-l"])$(id).addEventListener("input",renderSol);
$("sol-flip").addEventListener("click",()=>{solDir*=-1;renderSol()});
$("sol-show").addEventListener("click",()=>{solShown=!solShown;renderSol()});
$("sol-reset").addEventListener("click",()=>{
 $("sol-i").value="0.8";$("sol-n").value="300";$("sol-l").value="0.3";
 solDir=1;solShown=false;resetPrediction("sol");renderSol();
});
function renderFlat(){
 const I=Number($("flat-i").value),N=Number($("flat-n").value),r=Number($("flat-r").value);
 const rMeters=r/100,NI=N*I,twor=2*rMeters,NIper2r=NI/twor;
 const B=mu0*NIper2r*1e6,relFlat=(N/5)*(I/.8)*(4/r);
 const prevSteps=$("flat-result").querySelector("details.calc-ins")?.open||false;
 const prevFinal=$("flat-result").querySelector("details.calc-final")?.open||false;
 $("flat-i-value").textContent=swFmt(I,2)+" A";
 $("flat-n-value").textContent=String(N);
 $("flat-r-value").textContent=swFmt(r,1)+" cm";
 $("flat-visual").innerHTML=CoilArt.coilPlanar({dir:flatDir,field:flatShown,turns:N,radiusCm:r,currentA:I,fieldMicroTesla:B});
 const subSteps=[
  '<msub><mi>μ</mi><mn>0</mn></msub><mo>≈</mo>'+sciMu,
  '<mi>r</mi><mo>=</mo>'+num(r,1,'cm')+'<mo>=</mo>'+num(rMeters,3,'m'),
  '<mi>N</mi><mi>I</mi><mo>=</mo>'+num(N,0)+'<mo>·</mo>'+num(I,2,'A'),
  '<mi>N</mi><mi>I</mi><mo>=</mo>'+num(NI,2,'A'),
  '<mn>2</mn><mi>r</mi><mo>=</mo><mn>2</mn><mo>·</mo>'+num(rMeters,3,'m'),
  '<mn>2</mn><mi>r</mi><mo>=</mo>'+num(twor,3,'m'),
  '<mfrac><mrow><mi>N</mi><mi>I</mi></mrow><mrow><mn>2</mn><mi>r</mi></mrow></mfrac><mo>≈</mo>'+num(NIper2r,1,'A/m'),
  '<mi>B</mi><mo>≈</mo><msub><mi>μ</mi><mn>0</mn></msub><mfrac><mrow><mi>N</mi><mi>I</mi></mrow><mrow><mn>2</mn><mi>r</mi></mrow></mfrac>'
 ];
 $("flat-result").innerHTML=flatShown?
 calc('<mi>B</mi><mo>≈</mo><mfrac><mrow>'+mu+'<mi>N</mi><mi>I</mi></mrow><mrow><mn>2</mn><mi>r</mi></mrow></mfrac>',subSteps,
 '<mi>B</mi><mo>≈</mo>'+num(B,1,'μT'),
 'I centrum pekar B '+(flatDir>0?'ut ur bilden':'in i bilden')+
 '. Beloppet är '+swFmt(relFlat,2)+' gånger utgångsfallet. Formeln gäller täta lika stora varv i luft. Den separata blå mätskalan är linjär.') :
 "Förutsäg innan facit. Varje gång r ändras måste cm först omvandlas till meter.";
 if(flatShown){$("flat-result").querySelector(".calc-ins").open=prevSteps;$("flat-result").querySelector(".calc-final").open=prevFinal}
 $("flat-show").textContent=flatShown?"Dölj beräkning och riktning":"Visa beräkning och riktning";
 syncPrediction("flat");
}
for(const id of ["flat-n","flat-i","flat-r"])$(id).addEventListener("input",renderFlat);
$("flat-flip").addEventListener("click",()=>{flatDir*=-1;renderFlat()});
$("flat-show").addEventListener("click",()=>{flatShown=!flatShown;renderFlat()});
$("flat-reset").addEventListener("click",()=>{
 $("flat-i").value="0.8";$("flat-n").value="5";$("flat-r").value="4";
 flatDir=1;flatShown=false;resetPrediction("flat");renderFlat();
});
function applyRefs(){
 const data=[[".read-ref",$("read-setting").value.trim()||"Ej angivna"],[".task-ref",$("task-setting").value.trim()||"Ej angivna"],[".next-ref",$("next-setting").value.trim()||"Ej angivna"]];
 for(const [sel,val] of data)document.querySelectorAll(sel).forEach(el=>el.textContent=val);
}
$("setting-btn").addEventListener("click",()=>{$("editor").hidden=!$("editor").hidden});
$("apply-setting").addEventListener("click",()=>{applyRefs();$("editor").hidden=true});
$("download-btn").addEventListener("click",async()=>{
 applyRefs();
 for(const id of ["read-setting","task-setting","next-setting"])$(id).setAttribute("value",$(id).value);
 try{
  const copy=document.documentElement.cloneNode(true);
  copy.querySelector("#slides").innerHTML="";
  copy.querySelector("#jump").replaceChildren(); // Rebuilt by the offline script.
  copy.querySelector("#editor").hidden=true;
  copy.querySelector("body").classList.remove("repeat");
  copy.querySelector("#class-btn").classList.add("selected");
  copy.querySelector("#repeat-btn").classList.remove("selected");
  let html="<!doctype html>\n"+copy.outerHTML;
  for(const name of ["content.js","logic.js","practice.js"]){
   const r=await fetch("./"+name);if(!r.ok)throw new Error(name);
   const src=(await r.text()).replaceAll("</"+"script>","<\\/script>");
   const anchor='<script src="./'+name+'"></'+'script>';
   if(!html.includes(anchor))throw new Error(anchor);
   html=html.replace(anchor,'<script>'+src+'</'+'script>');
  }
  const photoPath="./hogerhand-spole.webp";
  const photo=await fetch(photoPath);
  if(!photo.ok)throw new Error(photoPath);
  const blob=await photo.blob();
  const photoUrl=await new Promise((resolve,reject)=>{
   const reader=new FileReader();
   reader.onload=()=>resolve(reader.result);
   reader.onerror=()=>reject(reader.error);
   reader.readAsDataURL(blob);
  });
  html=html.replace(photoPath,photoUrl);
  const url=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"})),a=document.createElement("a");
  a.href=url;a.download="Fy2_Spolar_och_solenoider.html";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(e){alert("Kunde inte skapa fristående fil. Prova från onlineversionen.")}
});
drawView();drawCore();renderSol();renderFlat();applyRefs();mode(false);render();
})();