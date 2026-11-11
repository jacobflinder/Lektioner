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
 if(current===4){view="side";drawView()}
 if(current===7){core=false;drawCore()}
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
function drawView(){
 const svg=$("view-svg");
 const side='<rect x="0" y="0" width="650" height="390" rx="17" fill="#f0f7f8"/>'+
  '<text x="25" y="37" style="font-size:18px">Från sidan</text>'+
  '<path d="M315 75 V309" stroke="#bc6a4d" stroke-width="4"/>'+
  '<circle cx="315" cy="89" r="29" fill="white" stroke="#b66a4a" stroke-width="3"/>'+
  '<text x="293" y="102" style="font-size:43px;fill:#a65e44">⊙</text>'+
  '<circle cx="315" cy="295" r="29" fill="white" stroke="#b66a4a" stroke-width="3"/>'+
  '<text x="293" y="308" style="font-size:43px;fill:#a65e44">⊗</text>'+
  '<path d="M200 194H474m-16 -12 16 12 -16 12" fill="none" stroke="#0d7e94" stroke-width="6"/>'+
  '<text x="400" y="178" style="font-size:23px;font-weight:750;fill:#0d738a">B åt höger</text>'+
  '<text x="24" y="355">Orange: ström i övre/undre delen · blått: fält i mitten</text>';
 const end='<rect x="0" y="0" width="650" height="390" rx="17" fill="#f0f7f8"/>'+
  '<text x="25" y="37" style="font-size:18px">Sett från höger – betraktaren tittar åt vänster längs spolens axel</text>'+
  '<circle cx="324" cy="197" r="119" fill="#fff" stroke="#b76b48" stroke-width="5"/>'+
  '<path d="M335 77 C268 73 219 114 208 186" stroke="#b76b48" stroke-width="5" fill="none"/>'+
  '<path d="M207 185 l-11 -19 m11 19 15 -16" stroke="#b76b48" stroke-width="5" fill="none"/>'+
  [245,285,325,365,405].map(x=>'<circle cx="'+x+'" cy="181" r="6" fill="#0c8096"/>').join("")+
  [265,305,345,385].map(x=>'<circle cx="'+x+'" cy="215" r="6" fill="#0c8096"/>').join("")+
  '<text x="25" y="353">Moturs ström sett från höger · B ut mot dig</text>';
 svg.innerHTML=view==="side"?side:end;
 $("view-caption").textContent=view==="side"?
  "Från sidan: översta ledardelen har ström ut ur bilden, nedersta in. B pekar åt höger.":
  "Sett från höger: samma strömvarv ses moturs. Magnetfältet pekar ut mot betraktaren, det vill säga åt höger i sidobilden.";
 $("view-side").classList.toggle("selected",view==="side");
 $("view-right").classList.toggle("selected",view==="right");
 $("view-side").setAttribute("aria-pressed",String(view==="side"));
 $("view-right").setAttribute("aria-pressed",String(view==="right"));
}
$("view-side").addEventListener("click",()=>{view="side";drawView()});
$("view-right").addEventListener("click",()=>{view="right";drawView()});
$("view-reset").addEventListener("click",()=>{view="side";drawView()});
function drawCore(){
 const svg=$("core-svg"),path=[];
 for(let i=0;i<9;i++){
  const x=135+i*44;
  path.push("M"+x+" 174 C"+(x-22)+" 83 "+(x+20)+" 83 "+(x+19)+" 174 C"+(x+20)+" 270 "+(x-20)+" 270 "+(x+44)+" 174");
 }
 const P=565,base=174,len=core?86:47;
 svg.innerHTML='<rect x="0" y="0" width="700" height="325" rx="15" fill="#eff7f8"/>'+
  '<path d="'+path.join(" ")+'" stroke="#bd7150" stroke-width="3.5" fill="none"/>'+
  (core?'<rect x="122" y="161" width="409" height="29" rx="7" fill="#90a4ad" opacity=".86"/>':'')+
  '<circle cx="'+P+'" cy="'+base+'" r="6" fill="#ca864b"/>'+
  '<text x="'+(P+15)+'" y="'+(base+4)+'">P</text>'+
  '<path d="M'+P+' '+base+' H'+(P+len)+'" stroke="#0b7e94" stroke-width="6"/>'+
  '<path d="M'+(P+len-15)+' '+(base-12)+'L'+(P+len)+' '+base+'L'+(P+len-15)+' '+(base+12)+'" fill="none" stroke="#0b7e94" stroke-width="4"/>'+
  '<text x="23" y="31">'+(core?"Mjukjärnskärnan i spolen":"Luftspole, mjukjärnskärnan utanför")+'</text>'+
  '<text x="27" y="302">Samma ström · samma spole · samma punkt P · schematiskt relativt B</text>';
 $("core-explanation").textContent=core?
  "Kärnan magnetiseras. Den kan bidra till ett starkare fält nära spolens axel. Pilens relativa längd är en kvalitativ illustration, inte en uppmätt eller beräknad förstärkningsfaktor.":
  "Samma spole och ström, utan mjukjärnskärna. Föreslå vad som bör ändras innan du sätter in kärnan.";
}
$("core-insert").addEventListener("click",()=>{core=true;drawCore()});
$("core-remove").addEventListener("click",()=>{core=false;drawCore()});
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
drawView();drawCore();applyRefs();mode(false);render();
})();