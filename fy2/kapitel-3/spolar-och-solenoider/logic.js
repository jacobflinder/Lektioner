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
function go(i){
 current=Math.max(0,Math.min(N-1,i));
 if(!document.body.classList.contains("repeat"))slides[current].querySelectorAll(".answer.shown").forEach(n=>n.classList.remove("shown"));
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
 slides[current].querySelectorAll(".answer.shown").forEach(el=>el.classList.remove("shown"));
 slides[current].dispatchEvent(new Event("lesson:reset"));
 if(current===4){view="side";viewDir=1;viewShown=false;drawView()}
 if(current===7){core=false;coreDir=1;drawCore()}
 if(current===10){$("sol-reset").click()}
 if(current===12){$("flat-reset").click()}
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
 document.body.classList.toggle("repeat",repeat);
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
const calc=(law,sub,result,note)=>'<div class="calc-chain">'+
 '<div><span class="tag">1 · Samband</span><div class="math-sm">'+ml(law)+'</div></div>'+
 '<details class="calc-ins"><summary>2 · Visa insättningen med enheter</summary><div class="math-sm">'+ml(sub)+'</div></details>'+
 '<div><span class="tag">3 · Resultat och fysikalisk tolkning</span><div class="math-sm">'+ml(result)+'</div><p class="small">'+note+'</p></div>'+
 '</div>';
const mu='<msub><mi>μ</mi><mn>0</mn></msub>';

const coreHost=$("core-svg").parentElement;
function endViewLoop(sign,revealed){
 const cx=325,cy=174,R=108;
 const cur=sign>0?"moturs":"medurs";
 const B=sign>0?"ut mot dig":"in från dig";
 const arrow=sign>0?"M315 67L291 70L302 49":"M315 67L340 72L328 50";
 return '<svg viewBox="0 0 650 350" role="img" aria-label="Ett cirkulärt strömvarv sett från höger. Strömmen går '+cur+'.">'+
 '<rect width="650" height="350" rx="16" fill="#f0f7f8"/>'+
 '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" stroke="#8e402a" stroke-width="9" fill="none"/>'+
 '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" stroke="#eda36b" stroke-width="3" fill="none"/>'+
 '<path d="'+arrow+'" fill="none" stroke="#713021" stroke-width="5" stroke-linejoin="round"/>'+
 (revealed?(sign>0?'<circle cx="'+cx+'" cy="'+cy+'" r="24" fill="white" stroke="#07758a" stroke-width="3"/><circle cx="'+cx+'" cy="'+cy+'" r="7" fill="#07758a"/>':'<circle cx="'+cx+'" cy="'+cy+'" r="24" fill="white" stroke="#07758a" stroke-width="3"/><path d="M308 157L342 191M342 157L308 191" stroke="#07758a" stroke-width="5"/>'):
 '<text x="314" y="187" style="font-size:38px;fill:#163b49">?</text>')+
 '<text x="466" y="93" style="font-size:20px;fill:#183a45">I: '+cur+'</text>'+
 (revealed?'<text x="466" y="130" style="font-size:19px;fill:#08758a">B: '+B+'</text>':'')+
 '<text x="26" y="322" style="font-size:17px;fill:#54707b">Betraktaren står till höger om varvet och tittar åt vänster.</text></svg>';
}
function drawView(){
 $("view-holder").innerHTML=view==="side"?
   CoilArt.coilSingleLoop({dir:viewDir,field:viewShown}):endViewLoop(viewDir,viewShown);
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
 feedback.textContent=correct?(kind==="sol"?
  "Rätt. I en lång luftsolenoid är B ≈ μ₀NI/L. Om N fördubblas vid samma I och L, fördubblas B.":
  "Rätt. I centrum av en platt luftspole är B ≈ μ₀NI/(2r). Om r fördubblas, halveras B."):
  (kind==="sol"?
  "Inte riktigt. I B ≈ μ₀NI/L finns N i täljaren. Ändra bara N och pröva igen.":
  "Inte riktigt. I B ≈ μ₀NI/(2r) står r i nämnaren. Ändra bara r och pröva igen.");
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
 const mT=(mu0*N*I/L)*1e3;
 const relSol=(N/300)*(I/0.8)*(0.30/L);
 // One immutable state per render supplies both formula and field drawing.
 $("sol-i-value").textContent=swFmt(I,2)+" A";
 $("sol-n-value").textContent=String(N);
 $("sol-l-value").textContent=swFmt(L,2)+" m";
 $("solenoid-visual").innerHTML=CoilArt.coilHelix({core:false,dir:solDir,field:solShown,turns:12+Math.round((N-100)/42),lengthMeters:L,fieldMilliTesla:mT});
 $("sol-result").innerHTML=solShown?
 calc('<mi>B</mi><mo>≈</mo><mfrac><mrow>'+mu+'<mi>N</mi><mi>I</mi></mrow><mi>L</mi></mfrac>',
 '<mi>B</mi><mo>≈</mo><mfrac><mrow><mn>4</mn><mi>π</mi><mo>·</mo><msup><mn>10</mn><mn>−7</mn></msup><mtext> T m/A</mtext><mo>·</mo><mn>'+N+'</mn><mo>·</mo>'+mult(I,'A',2)+'</mrow>'+mult(L,'m',2)+'</mfrac>',
 '<mi>B</mi><mo>≈</mo>'+mult(mT,'mT',3),
 'Luftsolenoid, idealiserat långt från ändarna. Inuti pekar B '+(solDir>0?'åt höger (N till höger)':'åt vänster (N till vänster)')+
 '. Jämfört med utgångsfallet är beloppet '+swFmt(relSol,2)+' gånger så stort. Vänd strömmen ⇒ vänd riktningen, inte beloppet.') :
 "Förutsäg först belopp och riktning. Ändra en storhet i taget och visa sedan sambandet.";
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
 const B=mu0*N*I/(2*(r/100))*1e6;
 const relFlat=(N/5)*(I/0.8)*(4/r);
 $("flat-i-value").textContent=swFmt(I,2)+" A";
 $("flat-n-value").textContent=String(N);
 $("flat-r-value").textContent=swFmt(r,1)+" cm";
 $("flat-visual").innerHTML=CoilArt.coilPlanar({dir:flatDir,field:flatShown,turns:N,radiusCm:r,currentA:I,fieldMicroTesla:B});
 $("flat-result").innerHTML=flatShown?
 calc('<mi>B</mi><mo>≈</mo><mfrac><mrow>'+mu+'<mi>N</mi><mi>I</mi></mrow><mrow><mn>2</mn><mi>r</mi></mrow></mfrac>',
 '<mi>B</mi><mo>≈</mo><mfrac><mrow><mn>4</mn><mi>π</mi><mo>·</mo><msup><mn>10</mn><mn>−7</mn></msup><mtext> T m/A</mtext><mo>·</mo><mn>'+N+'</mn><mo>·</mo>'+mult(I,'A',2)+'</mrow><mrow><mn>2</mn><mo>·</mo>'+mult(r/100,'m',3)+'</mrow></mfrac>',
 '<mi>B</mi><mo>≈</mo>'+mult(B,'μT',1),
 'Fältets riktning är '+(flatDir>0?'ut ur bilden':'in i bilden')+'. Relativt startfallet: '+swFmt(relFlat,2)+
 ' gånger så stort belopp. Detta gäller i centrum för idealiserat lika stora varv i luft.') :
 "Förutsäg innan facit. Varje gång r ändras måste cm först omvandlas till meter.";
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
  const url=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"})),a=document.createElement("a");
  a.href=url;a.download="Fy2_Spolar_och_solenoider.html";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(e){alert("Kunde inte skapa fristående fil. Prova från onlineversionen.")}
});
drawView();drawCore();renderSol();renderFlat();applyRefs();mode(false);render();
})();