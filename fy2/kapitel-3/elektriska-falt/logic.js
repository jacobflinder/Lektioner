(() => {
"use strict";
const slides=Array.from(document.querySelectorAll(".slide"));
const $=id=>document.getElementById(id);
let current=0,remaining=1200,timerMinutes=20,timerId=null,deadline=0;
function render(){
  slides.forEach((slide,i)=>slide.classList.toggle("active",i===current));
  $("counter").textContent=(current+1)+" / "+slides.length;
  $("prev").disabled=current===0;$("next").disabled=current===slides.length-1;
  const hidden=slides[current].querySelector(".answer:not(.shown), .step:not(.shown)");
  $("next-reveal").textContent=hidden?"Visa nästa steg":current<slides.length-1?"Nästa bild":"Allt visat";
  $("next-reveal").disabled=!hidden&&current===slides.length-1;
}
function showSlide(i){current=Math.max(0,Math.min(slides.length-1,i));render();window.scrollTo(0,0)}
function revealOne(){
  const hidden=slides[current].querySelector(".answer:not(.shown), .step:not(.shown)");
  if(hidden){hidden.classList.add("shown");render()}else if(current<slides.length-1)showSlide(current+1);
}
$("prev").addEventListener("click",()=>showSlide(current-1));
$("next").addEventListener("click",()=>showSlide(current+1));
$("next-reveal").addEventListener("click",revealOne);
$("reset-slide").addEventListener("click",()=>{slides[current].querySelectorAll(".answer,.step").forEach(x=>x.classList.remove("shown"));slides[current].querySelectorAll("textarea").forEach(x=>x.value="");render()});
document.querySelectorAll("[data-reveal]").forEach(btn=>btn.addEventListener("click",()=>{
  const next=btn.nextElementSibling;
  if(next&&(next.classList.contains("answer")||next.classList.contains("step"))){next.classList.toggle("shown");render()}
}));
function setMode(repetition){
 document.body.classList.toggle("repetition",repetition);
 $("class-mode").classList.toggle("active",!repetition);
 $("repeat-mode").classList.toggle("active",repetition);
 $("class-mode").setAttribute("aria-pressed",String(!repetition));
 $("repeat-mode").setAttribute("aria-pressed",String(repetition));
}
$("class-mode").addEventListener("click",()=>setMode(false));
$("repeat-mode").addEventListener("click",()=>setMode(true));
document.addEventListener("keydown",e=>{
 if(e.target.matches("input,textarea,button")||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();revealOne()}
 if(e.key==="ArrowLeft"){e.preventDefault();showSlide(current-1)}
});
const e=1.602176634e-19,me=9.1093837139e-31,d=0.030,L=0.050;
function updateTrajectory(){
 const U=Number($("voltage").value),v=Number($("speed").value)*1e6;
 const E=U/d,a=e*E/me,t=L/v,y=0.5*a*t*t,hit=y>=d/2;
 const xhit=hit?v*Math.sqrt(d/a):L;
 const upper=hit?d/2:y;
 let path="";
 for(let n=0;n<=80;n++){
  const x=xhit*n/80;
  const yy=0.5*a*Math.pow(x/v,2);
  path+=(n===0?"M":"L")+(45+425*x/L).toFixed(2)+" "+(155-117*yy/(d/2)).toFixed(2)+" ";
 }
 $("trajectory").setAttribute("d",path);
 $("u-out").textContent=String(U);
 $("v-out").textContent=(v/1e6).toLocaleString("sv-SE",{minimumFractionDigits:1,maximumFractionDigits:1});
 const vy=a*t;
 const angle=Math.atan(vy/v)*180/Math.PI;
 if(hit){
  $("trajectory-result").textContent="Elektronen träffar övre plattan efter "+(xhit*1000).toLocaleString("sv-SE",{maximumFractionDigits:1})+" mm. Ingen utgångsvinkel vid plattornas slut anges.";
 }else{
  $("trajectory-result").textContent="Avböjning vid utgången: "+(upper*1000).toLocaleString("sv-SE",{maximumFractionDigits:2})+" mm uppåt. Vinkel: "+angle.toLocaleString("sv-SE",{maximumFractionDigits:1})+"°.";
 }
}
$("voltage").addEventListener("input",updateTrajectory);
$("speed").addEventListener("input",updateTrajectory);
$("reset-model").addEventListener("click",()=>{$("voltage").value="60";$("speed").value="8";updateTrajectory()});
function timerText(){
 const t=Math.max(0,Math.ceil(remaining));
 $("timer").textContent=String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");
}
function pauseTimer(){
 if(timerId!==null){clearInterval(timerId);timerId=null;}
 $("timer-toggle").textContent="Starta";
}
document.querySelectorAll("[data-minutes]").forEach(b=>b.addEventListener("click",()=>{
 pauseTimer();timerMinutes=Number(b.dataset.minutes);remaining=timerMinutes*60;timerText();
}));
$("timer-toggle").addEventListener("click",()=>{
 if(timerId!==null){remaining=Math.max(0,(deadline-Date.now())/1000);pauseTimer();return}
 deadline=Date.now()+remaining*1000;
 $("timer-toggle").textContent="Pausa";
 timerId=setInterval(()=>{
  remaining=Math.max(0,(deadline-Date.now())/1000);timerText();
  if(remaining===0)pauseTimer();
 },200);
});
$("timer-reset").addEventListener("click",()=>{pauseTimer();remaining=timerMinutes*60;timerText()});
function updateRefs(){
 const tasks=$("tasks-setting").value.trim()||"Inte angivna";
 const reading=$("reading-setting").value.trim()||"Inte verifierade i originalunderlaget";
 const next=$("next-setting").value.trim()||"Inte angivna";
 document.querySelectorAll(".task-ref").forEach(x=>x.textContent=tasks);
 document.querySelectorAll(".reading-ref").forEach(x=>x.textContent=reading);
 document.querySelectorAll(".next-ref").forEach(x=>x.textContent=next);
}
$("settings-toggle").addEventListener("click",()=>{$("data-editor").hidden=!$("data-editor").hidden});
$("apply-settings").addEventListener("click",()=>{updateRefs();$("data-editor").hidden=true});
$("download").addEventListener("click",async()=>{
 updateRefs();
 for(const id of ["tasks-setting","reading-setting","next-setting"]){$(id).setAttribute("value",$(id).value)}
 try{
  const names=["logic.js","practice.js"];
  const copy=document.documentElement.cloneNode(true);
  copy.querySelectorAll(".practice-card,.mode-message").forEach(el=>el.remove());
  copy.querySelectorAll(".answer.shown,.step.shown").forEach(el=>el.classList.remove("shown"));
  copy.querySelectorAll("textarea").forEach(el=>{el.value="";el.textContent=""});
  copy.querySelectorAll(".slide").forEach((el,i)=>el.classList.toggle("active",i===0));
  let html="<!doctype html>\n"+copy.outerHTML;
  for(const name of names){
    const resp=await fetch("./"+name);
    if(!resp.ok)throw new Error("Kunde inte läsa skriptet "+name);
    const script=(await resp.text()).replaceAll("</"+"script>","<\\/script>");
    const anchor='<script src="./'+name+'"></'+'script>';
    if(!html.includes(anchor))throw new Error("Kunde inte packa skriptet "+name);
    html=html.replace(anchor,'<script>'+script+'</'+'script>');
  }
  const blob=new Blob([html],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="Fy2_Elektriska_falt.html";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(err){alert("Kunde inte skapa en fristående fil. Öppna webblektionen online och försök igen.");}
});
updateTrajectory();timerText();updateRefs();setMode(false);render();
})();