(() => {
"use strict";
const $=id=>document.getElementById(id),slides=[...document.querySelectorAll(".slide")],MAIN=18,OPTIONAL=18,mu02pi=2e-7;
let current=0,remaining=1200,timerMinutes=20,timerId=null,deadline=0;
const fmt=(n,d=1)=>Number(n).toLocaleString("sv-SE",{minimumFractionDigits:d,maximumFractionDigits:d});
function render(){
 slides.forEach((s,i)=>s.classList.toggle("active",i===current));
 $("counter").textContent=current===OPTIONAL?"Fördjupning":(current+1)+" / "+MAIN;
 $("jump").value=String(current);
 $("prev-btn").disabled=current===0;$("next-btn").disabled=current>=MAIN-1;
 const next=slides[current].querySelector(".answer:not(.shown)");
 $("reveal-btn").textContent=next?"Visa nästa steg":current<MAIN-1?"Nästa bild":"Allt visat";
 $("reveal-btn").disabled=!next&&current>=MAIN-1;
}
function refreshDiagram(){
 const el=slides[current].querySelector("[data-wire-plot]");
 if(el){el.dataset.shown=String(!!slides[current].querySelector(".answer.shown"));drawDiagram(el);}
}
function go(i){
 const n=Math.max(0,Math.min(OPTIONAL,i));
 if(!document.body.classList.contains("repeat")){
  slides[n].querySelectorAll(".answer.shown").forEach(a=>a.classList.remove("shown"));
 }
 current=n;refreshDiagram();render();window.scrollTo(0,0);
}
function revealNext(){
 const a=slides[current].querySelector(".answer:not(.shown)");
 if(a){a.classList.add("shown");refreshDiagram();render()}
 else if(current<MAIN-1)go(current+1);
}
$("prev-btn").addEventListener("click",()=>go(current===OPTIONAL?MAIN-1:current-1));
$("next-btn").addEventListener("click",()=>go(current+1));
$("reveal-btn").addEventListener("click",revealNext);
$("reset-btn").addEventListener("click",()=>{
 slides[current].querySelectorAll(".answer.shown").forEach(a=>a.classList.remove("shown"));
 slides[current].querySelectorAll("textarea").forEach(a=>a.value="");
 slides[current].dispatchEvent(new Event("lesson:reset"));
 refreshDiagram();render();
});
document.querySelectorAll("[data-reveal]").forEach(b=>b.addEventListener("click",()=>{
 const a=b.nextElementSibling;
 if(a&&a.classList.contains("answer")){a.classList.toggle("shown");refreshDiagram();render();}
}));
slides.forEach((slide,i)=>{
 const o=document.createElement("option");o.value=String(i);
 o.textContent=i<MAIN?(i+1)+". "+slide.dataset.title:"Fördjupning: Ampères lag";
 $("jump").appendChild(o);
});
$("jump").addEventListener("change",e=>go(Number(e.target.value)));
$("open-optional").addEventListener("click",()=>go(OPTIONAL));
$("return-main").addEventListener("click",()=>go(MAIN-1));
function setMode(repeat){
 document.body.classList.toggle("repeat",repeat);
 $("class-btn").classList.toggle("selected",!repeat);$("repeat-btn").classList.toggle("selected",repeat);
 $("class-btn").setAttribute("aria-pressed",String(!repeat));
 $("repeat-btn").setAttribute("aria-pressed",String(repeat));
}
$("class-btn").addEventListener("click",()=>setMode(false));
$("repeat-btn").addEventListener("click",()=>setMode(true));
$("fullscreen-btn").addEventListener("click",()=>{
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
 else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});
});
document.addEventListener("keydown",e=>{
 if(e.target.closest("input,textarea,select,button,summary")||e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();revealNext();}
 else if(e.key==="ArrowLeft"){e.preventDefault();go(current===OPTIONAL?MAIN-1:current-1);}
});
function wireSVG(dir,point,shown,radius=108,fieldAtPointUT=null){
 const cx=251,cy=185,sign=dir==="out"?-1:1,measured=fieldAtPointUT!==null;
 let s='<rect x="0" y="0" width="520" height="370" fill="#edf6f7" rx="14"/>';
 [46,95,151].forEach(r=>{s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" stroke="#a4c2c9" stroke-width="2" fill="none"/>';});
 // Tangent arrows have identical lengths: they show direction, never field magnitude.
 function tangent(theta,r,label,includeArrow){
  const x=cx+r*Math.cos(theta),y=cy+r*Math.sin(theta);
  let p='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#c46c4a"/>';
  if(label)p+='<text x="'+(x+10)+'" y="'+(y-11)+'" style="font-weight:800">'+label+'</text>';
  if(includeArrow){
   const tx=-Math.sin(theta)*sign,ty=Math.cos(theta)*sign;
   const localUT=measured?fieldAtPointUT*(radius/r):30;
   const arrowHalf=measured?10+29*localUT/(localUT+30):23;
   const x0=x-arrowHalf*tx,y0=y-arrowHalf*ty,x1=x+arrowHalf*tx,y1=y+arrowHalf*ty;
   p+='<path d="M'+x0+' '+y0+' L'+x1+' '+y1+'" stroke="#c15f43" stroke-width="4" stroke-linecap="round"/>';
   p+='<path d="M'+(x1-11*tx-7*ty)+' '+(y1-11*ty+7*tx)+' L'+x1+' '+y1+' L'+(x1-11*tx+7*ty)+' '+(y1-11*ty-7*tx)+'" fill="none" stroke="#c15f43" stroke-width="3"/>';
  }
  return p;
 }
 // Static slides: arrows only show direction. In the interactive model their lengths vary with calculated local field magnitude.
 if(shown) [46,95,151].forEach((r,k)=>{
  const th=k*2.2+.6;
  const x=cx+r*Math.cos(th),y=cy+r*Math.sin(th);
  const tx=-Math.sin(th)*sign,ty=Math.cos(th)*sign;
  const localUT=measured?fieldAtPointUT*(radius/r):30;
  const half=measured?7+19*localUT/(localUT+30):15;
  const xx=x+half*tx,yy=y+half*ty;
  s+='<path d="M'+(x-half*tx)+' '+(y-half*ty)+' L'+xx+' '+yy+'" stroke="#0b8195" stroke-width="'+(measured?(2+2*localUT/(localUT+30)).toFixed(2):3)+'"/>';
  s+='<path d="M'+(xx-9*tx-5*ty)+' '+(yy-9*ty+5*tx)+' L'+xx+' '+yy+' L'+(xx-9*tx+5*ty)+' '+(yy-9*ty-5*tx)+'" stroke="#0b8195" stroke-width="3" fill="none"/>';
 });
 s+='<circle cx="'+cx+'" cy="'+cy+'" r="20" fill="white" stroke="#0b798f" stroke-width="3"/>';
 s+='<text x="'+(cx-14)+'" y="'+(cy+10)+'" style="font-size:33px;fill:#0b798f">'+(dir==="out"?"⊙":"⊗")+'</text>';
 s+='<text x="24" y="29">I '+(dir==="out"?"ut ur bilden":"in i bilden")+'</text>';
 if(point==="four"){
  [["A",-Math.PI/2],["B",0],["C",Math.PI/2],["D",Math.PI]].forEach(q=>{s+=tangent(q[1],109,q[0],shown);});
 }else s+=tangent(0,radius,"P",shown);
 return s;
}
function drawDiagram(el){
 const svg=el.querySelector("svg");
 svg.innerHTML=wireSVG(el.dataset.direction||"out",el.dataset.point||"right",el.dataset.shown==="true");
}
document.querySelectorAll("[data-wire-plot]").forEach(drawDiagram);
function updateModel(){
 const I=Number($("i-slider").value),r=Number($("r-slider").value),dir=$("dir-select").value;
 const microTesla=mu02pi*I/(r/100)*1e6;
 $("i-value").textContent=fmt(I)+" A";$("r-value").textContent=fmt(r)+" cm";
 $("model-result").innerHTML='<div style="font-family:Cambria,Georgia,serif;font-size:1.22rem"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>B</mi><mo>=</mo><mfrac><mrow><msub><mi>μ</mi><mn>0</mn></msub><mi>I</mi></mrow><mrow><mn>2</mn><mi>π</mi><mi>r</mi></mrow></mfrac><mo>≈</mo><mn>'+fmt(microTesla,1)+'</mn><mtext> μT</mtext></math></div>'+
 '<details style="margin-top:8px;font-size:.84rem;font-weight:500"><summary>Visa insättningen med enheter</summary><div style="font-family:Cambria,Georgia,serif;font-size:1.12rem;overflow-x:auto"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>B</mi><mo>=</mo><mfrac><mrow><mn>2</mn><mo>·</mo><msup><mn>10</mn><mn>−7</mn></msup><mtext> T m/A</mtext><mo>·</mo><mn>'+fmt(I,1)+'</mn><mtext> A</mtext></mrow><mrow><mn>'+fmt(r/100,3)+'</mn><mtext> m</mtext></mrow></mfrac></math></div></details>'+
 '<p style="font-family:system-ui;font-size:.86rem;margin:5px 0 0">Fältriktning i P till höger: <b>'+(dir==="out"?"uppåt":"nedåt")+'</b>. Pilarna är längre vid större B och mindre vid större avstånd; deras längder är inte linjärt skalenliga.</p>';
 $("model-svg").innerHTML=wireSVG(dir,"right",true,55+(r-2)*10,microTesla);
}
["i-slider","r-slider","dir-select"].forEach(id=>$(id).addEventListener("input",updateModel));
$("model-reset").addEventListener("click",()=>{
 $("i-slider").value=6;$("r-slider").value=4;$("dir-select").value="out";updateModel();
});
function timerText(){
 const t=Math.max(0,Math.ceil(remaining));
 $("timer").textContent=String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");
}
function pauseTimer(){if(timerId!==null){clearInterval(timerId);timerId=null;}$("timer-toggle").textContent="Starta";}
document.querySelectorAll("[data-minutes]").forEach(b=>b.addEventListener("click",()=>{
 pauseTimer();timerMinutes=Number(b.dataset.minutes);remaining=60*timerMinutes;timerText();
}));
$("timer-toggle").addEventListener("click",()=>{
 if(timerId!==null){remaining=Math.max(0,(deadline-Date.now())/1000);pauseTimer();return;}
 deadline=Date.now()+remaining*1000;$("timer-toggle").textContent="Pausa";
 timerId=setInterval(()=>{remaining=Math.max(0,(deadline-Date.now())/1000);timerText();if(remaining===0)pauseTimer();},200);
});
$("timer-reset").addEventListener("click",()=>{pauseTimer();remaining=timerMinutes*60;timerText()});
function applyRefs(){
 const data=[[".homework-ref",$("homework-setting").value.trim()||"Ej angivna"],[".task-ref",$("task-setting").value.trim()||"Ej angivna"],[".read-ref",$("read-setting").value.trim()||"Sidor ännu inte verifierade"],[".next-ref",$("next-setting").value.trim()||"ännu inte verifierade"],[".topic-ref",$("topic-setting").value.trim()||"Ämne ännu inte angivet"]];
 data.forEach(q=>document.querySelectorAll(q[0]).forEach(x=>x.textContent=q[1]));
}
$("setting-btn").addEventListener("click",()=>{$("editor").hidden=!$("editor").hidden;});
$("apply-setting").addEventListener("click",()=>{applyRefs();$("editor").hidden=true;});
$("download-btn").addEventListener("click",async()=>{
 applyRefs();
 ["task-setting","read-setting","next-setting","topic-setting","homework-setting"].forEach(id=>$(id).setAttribute("value",$(id).value));
 try {
  const clone=document.documentElement.cloneNode(true);
  clone.querySelector("#slides").innerHTML="";
  clone.querySelector("#jump").replaceChildren(); // Repopulate only once when saved document runs.
  clone.querySelector("#editor").hidden=true;
  clone.querySelector("body").classList.remove("repeat");
  clone.querySelector("#class-btn").classList.add("selected");
  clone.querySelector("#repeat-btn").classList.remove("selected");
  clone.querySelectorAll("textarea").forEach(x=>{x.value="";x.textContent=""});
  let html="<!doctype html>\n"+clone.outerHTML;
  for(const name of ["content.js","logic.js","practice.js"]){
   const r=await fetch("./"+name);if(!r.ok)throw new Error(name);
   const code=(await r.text()).replaceAll("</"+"script>","<\\/script>");
   const tag='<script src="./'+name+'"></'+'script>';
   if(!html.includes(tag))throw new Error(tag);
   html=html.replace(tag,'<script>'+code+'</'+'script>');
  }
  const blob=new Blob([html],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="Fy2_Strom_ger_magnetfalt.html";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(err){alert("Kunde inte skapa fristående fil. Försök från onlineversionen.");}
});

function updateCurrentComparison(){
 const ratio=Number($("current-factor").value);
 $("current-factor-value").textContent=fmt(ratio,1);
 const p=(x,m,label)=>{
  const bottom=215, len=48*m;
  return '<circle cx="'+x+'" cy="'+bottom+'" r="5" fill="#c7883f"/>'+
  '<path d="M'+x+' '+bottom+'V'+(bottom-len)+'" stroke="#077e8f" stroke-width="6"/>'+
  '<path d="M'+(x-11)+' '+(bottom-len+14)+'L'+x+' '+(bottom-len)+'L'+(x+11)+' '+(bottom-len+14)+'" stroke="#077e8f" stroke-width="5" fill="none"/>'+
  '<text x="'+(x-50)+'" y="248" style="font-size:18px">'+label+'</text>';
 };
 $("current-comparison").innerHTML='<rect x="0" y="0" width="660" height="260" fill="#f0f7f8"/>'+
  p(190,1,"I = I₀, B = B₀")+p(455,ratio,"I = "+fmt(ratio,1)+" I₀")+
  '<text x="265" y="28" style="font-size:22px;font-weight:700">B/B₀ = '+fmt(ratio,1)+'</text>';
 $("current-conclusion").textContent="B = "+fmt(ratio,1)+" B₀ i samma punkt; riktningen är oförändrad.";
}
$("current-factor").addEventListener("input",updateCurrentComparison);
$("current-reset").addEventListener("click",()=>{$("current-factor").value="1";updateCurrentComparison()});
function updateDistanceComparison(){
 const ratio=Number($("distance-factor").value);
 $("distance-factor-value").textContent=fmt(ratio,1);
 const x=185+ratio*102,bottom=220,len=118/ratio;
 $("distance-comparison").innerHTML='<rect x="0" y="0" width="690" height="270" fill="#f0f7f8"/>'+
  '<circle cx="145" cy="144" r="23" fill="#fff" stroke="#0c7085" stroke-width="3"/>'+
  '<text x="134" y="156" style="font-size:34px;fill:#0b7888">⊙</text>'+
  '<line x1="168" y1="'+bottom+'" x2="'+x+'" y2="'+bottom+'" stroke="#7598a5" stroke-width="2"/>'+
  '<circle cx="'+x+'" cy="'+bottom+'" r="6" fill="#c7883f"/>'+
  '<path d="M'+x+' '+bottom+'V'+(bottom-len)+'" stroke="#087d90" stroke-width="6"/>'+
  '<path d="M'+(x-11)+' '+(bottom-len+14)+'L'+x+' '+(bottom-len)+'L'+(x+11)+' '+(bottom-len+14)+'" stroke="#087d90" stroke-width="5" fill="none"/>'+
  '<text x="'+(x-16)+'" y="250" style="font-size:17px">P</text>'+
  '<text x="385" y="38" style="font-size:21px;font-weight:700">B/B₀ = '+fmt(1/ratio,2)+'</text>';
 $("distance-conclusion").textContent="r = "+fmt(ratio,1)+" r₀ ger B = "+fmt(1/ratio,2)+" B₀. Samma radiella riktning på P ger B uppåt.";
}
$("distance-factor").addEventListener("input",updateDistanceComparison);
$("distance-reset").addEventListener("click",()=>{$("distance-factor").value="1";updateDistanceComparison()});

setMode(false);updateModel();updateCurrentComparison();updateDistanceComparison();timerText();applyRefs();render();
})();