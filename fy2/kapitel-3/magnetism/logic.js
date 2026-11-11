(() => {
"use strict";
const $=id=>document.getElementById(id);
const slides=[...document.querySelectorAll(".slide")];
let current=0,remaining=1200,timerMinutes=20,timerId=null,deadline=0,magnetFlipped=false,compassPoint="top",domainApplied=false;
const fmt=(x,d=2)=>Number(x).toLocaleString("sv-SE",{minimumFractionDigits:d,maximumFractionDigits:d});
function render(){
 slides.forEach((s,i)=>s.classList.toggle("active",i===current));
 $("counter").textContent=(current+1)+" / "+slides.length;
 $("prev").disabled=current===0;$("next").disabled=current===slides.length-1;
 const more=slides[current].querySelector(".answer:not(.shown)");
 $("next-reveal").textContent=more?"Visa nästa steg":current<slides.length-1?"Nästa bild":"Allt visat";
 $("next-reveal").disabled=!more&&current===slides.length-1;
}
function go(i){current=Math.max(0,Math.min(slides.length-1,i));render();window.scrollTo(0,0)}
function revealNext(){
 const el=slides[current].querySelector(".answer:not(.shown)");
 if(el){el.classList.add("shown");render()}else if(current<slides.length-1){go(current+1)}
}
$("prev").addEventListener("click",()=>go(current-1));
$("next").addEventListener("click",()=>go(current+1));
$("next-reveal").addEventListener("click",revealNext);
function resetCurrent(){
 slides[current].querySelectorAll(".answer.shown").forEach(el=>el.classList.remove("shown"));
 slides[current].querySelectorAll("textarea").forEach(el=>el.value="");
 slides[current].dispatchEvent(new CustomEvent("lesson:reset",{bubbles:false}));
 render();
}
$("reset-slide").addEventListener("click",resetCurrent);
document.querySelectorAll("[data-reveal]").forEach(button=>{
 button.addEventListener("click",()=>{
  const next=button.nextElementSibling;
  if(next?.classList.contains("answer")){next.classList.toggle("shown");render()}
 })
});
function setMode(repetition){
 document.body.classList.toggle("repetition",repetition);
 $("class-mode").classList.toggle("selected",!repetition);
 $("repeat-mode").classList.toggle("selected",repetition);
 $("class-mode").setAttribute("aria-pressed",String(!repetition));
 $("repeat-mode").setAttribute("aria-pressed",String(repetition));
}
$("class-mode").addEventListener("click",()=>setMode(false));
$("repeat-mode").addEventListener("click",()=>setMode(true));
document.addEventListener("keydown",e=>{
 if(e.target.matches("button,input,textarea,summary")||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();revealNext()}
 if(e.key==="ArrowLeft"){e.preventDefault();go(current-1)}
});
const points={top:{x:300,y:81},left:{x:94,y:192},right:{x:515,y:192}};
function drawCompass(){
 const poleL=$("left-pole"),poleR=$("right-pole");
 poleL.textContent=magnetFlipped?"S":"N";poleR.textContent=magnetFlipped?"N":"S";
 const poleRects=$("magnet-svg").querySelectorAll("rect");
 poleRects[0].setAttribute("fill",magnetFlipped?"#0c7c91":"#bc6d56");
 poleRects[1].setAttribute("fill",magnetFlipped?"#bc6d56":"#0c7c91");
 const startL=magnetFlipped?420:180,endR=magnetFlipped?180:420;
 const c1=magnetFlipped?440:160,c2=magnetFlipped?160:440;
 $("loop-up").setAttribute("d","M"+startL+" 150 C"+c1+" 12 "+c2+" 12 "+endR+" 150");
 $("loop-down").setAttribute("d","M"+startL+" 230 C"+c1+" 365 "+c2+" 365 "+endR+" 230");
 $("loop-inside").setAttribute("d",magnetFlipped?"M201 217H400":"M400 217H201");
 const p=points[compassPoint],dx=(compassPoint==="top"?1:-1)*(magnetFlipped?-1:1);
 $("needle-line").setAttribute("x1",p.x-20*dx);
 $("needle-line").setAttribute("x2",p.x+20*dx);
 $("needle-line").setAttribute("y1",p.y);$("needle-line").setAttribute("y2",p.y);
 $("needle-center").setAttribute("cx",p.x);$("needle-center").setAttribute("cy",p.y);
 $("needle-caption").setAttribute("x",p.x-20);
 $("needle-caption").setAttribute("y",p.y-17);
 $("needle-caption").textContent="N-änden "+(dx>0?"→":"←");
 document.querySelectorAll("[data-point]").forEach(b=>b.classList.toggle("selected",b.dataset.point===compassPoint));
}
document.querySelectorAll("[data-point]").forEach(b=>b.addEventListener("click",()=>{compassPoint=b.dataset.point;drawCompass()}));
$("flip-magnet").addEventListener("click",()=>{magnetFlipped=!magnetFlipped;drawCompass()});
const angles=["↗","←","↓","↙","↑","→","↖","↘","←","↗","→","↓","↙","↑","←","↖","↓","↘","→","↖","↘","←","↙","↑"];
function drawDomains(){
 const grid=$("domain-grid");grid.replaceChildren();
 angles.forEach((a,i)=>{const span=document.createElement("span");span.textContent=domainApplied?"→":a;span.setAttribute("aria-label",domainApplied?"Moment ordnade åt höger":"Moment i olika riktningar");grid.appendChild(span)});
 $("domain-state").textContent=domainApplied?"Med yttre fält: schematisk ökning av nettomagnetisering åt höger. Domänernas växt och vridning visas inte i detalj.":"Utan yttre fält: olika domäners magnetiseringar kan ge liten nettomagnetisering.";
 $("domain-field").textContent=domainApplied?"Visa fältet borttaget (schematiskt)":"Lägg på yttre fält →";
}
$("domain-field").addEventListener("click",()=>{
 domainApplied=true;drawDomains();
 $("domain-field").disabled=true;
 $("domain-field").textContent="Yttre fält på";
});
$("domain-reset").addEventListener("click",()=>{
 domainApplied=false;drawDomains();
 $("domain-field").disabled=false;
});
function circle(group,x,y,r=8){
 const ns="http://www.w3.org/2000/svg";
 const c=document.createElementNS(ns,"circle"),p=document.createElementNS(ns,"circle");
 c.setAttribute("cx",x);c.setAttribute("cy",y);c.setAttribute("r",r);
 c.setAttribute("fill","#f9feff");c.setAttribute("stroke","#438b9c");c.setAttribute("stroke-width",1.5);
 p.setAttribute("cx",x);p.setAttribute("cy",y);p.setAttribute("r",2);p.setAttribute("fill","#08788e");
 group.append(c,p);
}
for(let row=0;row<6;row++)for(let col=0;col<11;col++)circle($("flux-dots"),62+col*47,39+row*43,7);
for(let row=0;row<3;row++)for(let col=0;col<5;col++)circle($("example-dots"),155+col*67,106+row*59,9);
function updateFlux(){
 const B=Number($("field-strength").value),A=Number($("flux-area-slider").value);
 const phi=B*A*1e-4;
 $("field-value").textContent=fmt(B,2)+" T";
 $("area-value").textContent=fmt(A,0)+" cm²";
 $("flux-result").textContent="Φ = "+fmt(phi*1000,2)+" mWb";
 $("flux-area").setAttribute("width",165*A/24);
}
$("field-strength").addEventListener("input",updateFlux);
$("flux-area-slider").addEventListener("input",updateFlux);
$("flux-reset").addEventListener("click",()=>{$("field-strength").value="0.4";$("flux-area-slider").value="24";updateFlux()});
function timerText(){
 const t=Math.max(0,Math.ceil(remaining));
 $("timer").textContent=String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");
}
function pauseTimer(){
 if(timerId!==null){clearInterval(timerId);timerId=null}
 $("timer-toggle").textContent="Starta";
}
document.querySelectorAll("[data-minutes]").forEach(b=>b.addEventListener("click",()=>{pauseTimer();timerMinutes=Number(b.dataset.minutes);remaining=timerMinutes*60;timerText()}));
$("timer-toggle").addEventListener("click",()=>{
 if(timerId!==null){remaining=Math.max(0,(deadline-Date.now())/1000);pauseTimer();return;}
 deadline=Date.now()+remaining*1000;$("timer-toggle").textContent="Pausa";
 timerId=setInterval(()=>{
  remaining=Math.max(0,(deadline-Date.now())/1000);timerText();
  if(remaining===0)pauseTimer();
 },200);
});
$("timer-reset").addEventListener("click",()=>{pauseTimer();remaining=timerMinutes*60;timerText()});
function refs(){
 const book=$("tasks-setting").value.trim()||"Ej angivna";
 const read=$("reading-setting").value.trim()||"Ej angivna";
 const next=$("next-setting").value.trim()||"ännu inte verifierade";
 document.querySelectorAll(".task-ref").forEach(n=>n.textContent=book);
 document.querySelectorAll(".reading-ref").forEach(n=>n.textContent=read);
 document.querySelectorAll(".next-ref").forEach(n=>n.textContent=next);
}
$("settings-toggle").addEventListener("click",()=>{$("editor").hidden=!$("editor").hidden});
$("apply-settings").addEventListener("click",()=>{refs();$("editor").hidden=true});
$("download").addEventListener("click",async()=>{
 refs();
 for(const id of ["tasks-setting","reading-setting","next-setting"])$(id).setAttribute("value",$(id).value);
 try{
  const clone=document.documentElement.cloneNode(true);
  clone.querySelectorAll(".review").forEach(el=>el.remove());
  clone.querySelectorAll(".answer.shown").forEach(el=>el.classList.remove("shown"));
  clone.querySelectorAll(".slide").forEach((el,i)=>el.classList.toggle("active",i===0));
  clone.querySelectorAll("textarea").forEach(el=>{el.value="";el.textContent=""});
  let page="<!doctype html>\n"+clone.outerHTML;
  for(const name of ["logic.js","practice.js"]){
   const r=await fetch("./"+name);if(!r.ok)throw new Error(name);
   const src=(await r.text()).replaceAll("</"+"script>","<\\/script>");
   const anchor='<script src="./'+name+'"></'+'script>';
   if(!page.includes(anchor))throw new Error("Saknar "+anchor);
   page=page.replace(anchor,'<script>'+src+'</'+'script>');
  }
  const blob=new Blob([page],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="Fy2_Magnetism_interaktiv.html";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(e){alert("Kunde inte skapa den fristående filen. Försök från den publicerade sidan.")}
});
drawCompass();drawDomains();updateFlux();timerText();refs();setMode(false);render();
})();