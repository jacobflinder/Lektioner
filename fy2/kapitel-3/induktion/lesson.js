(()=>{
"use strict";
const {$}=window.Fy2Nav,{fmt,particle,fieldOnRod,fluxAngle,loopMotion,fluxPiece,tangent,S,A,T}=window.Fy2Physics;

const m=(expr)=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+expr+'</math>';
const inlineM=(expr)=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">'+expr+'</math>';
const qty=(v,d,unit)=>'<mrow><mo>(</mo><mn>'+fmt(v,d)+'</mn><mtext> '+unit+'</mtext><mo>)</mo></mrow>';
const chain=(law,sub,result,meaning)=>'<div class="calc-chain">'+
 '<div><span class="tag">1 · Samband</span><div class="math-sm">'+m(law)+'</div></div>'+
 '<details class="calc-ins"><summary>2 · Visa insättning med enheter</summary><div class="math-sm">'+m(sub)+'</div></details>'+
 '<div><span class="tag">3 · Resultat och tolkning</span><div class="math-sm">'+m(result)+'</div><p class="small">'+meaning+'</p></div>'+
 '</div>';
const Uformula='<mi>U</mi><mo>=</mo><mi>B</mi><mi>L</mi><mi>v</mi>';
const Pformula='<mi>Φ</mi><mo>=</mo><mi>B</mi><mi>A</mi><mi mathvariant="normal">cos</mi><mi>θ</mi>';
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
 // The same physical state controls rod geometry, field appearance, speed arrow,
 // magnetic force, charge separation and the calculation. The progression
 // control is illustrative, not a clock or a calibrated transient model.
 const h=100+160*(L-.10)/.30,top=194-h/2,bottom=194+h/2;
 const direction=Math.sign(v)||1;
 const fMag=Math.min(110,53*Math.abs(v)*B/(3*.40)),fElectric=fMag*eff;
 let symbols="";
 for(let i=0;i<number;i++){
  symbols+=T(265,top+23+i*19,v<0?"−":"+","#bc5742",19);
  symbols+=T(265,bottom-13-i*19,v<0?"+":"−","#0f7992",19);
 }
 if(eff>0)symbols+=A(318,194,318,194-direction*fElectric,"#127a93",3)+T(330,186-direction*fElectric,"Fₑ","#0d7b97",17);
 if(v!==0)symbols+=A(231,194,231,194+direction*fMag,"#ba6643",3)+T(180,202+direction*fMag,"Fₘ","#b36543",17);
 let base=fieldOnRod(false,v>0,L,B,Math.abs(v));
 if(v<0)base=base.replace(/<text[^>]*>v = 0<\/text>/,'').replace('</svg>',A(440,194,350,194,'#218a73')+T(450,190,'v åt vänster','#218a73',18)+'</svg>');
 $("ind-rod-dynamic").innerHTML=base.replace("</svg>",symbols+"</svg>");
 $("charge-pct").textContent=fmt(p*100,0)+" %";
 $("rod-B-value").textContent=fmt(B,2)+" T";
 $("rod-v-value").textContent=fmt(v,1)+" m/s";
 $("rod-L-value").textContent=fmt(L*100,0)+" cm";
 $("rod-result").innerHTML=rodShown?
 chain(Uformula,
 '<mi>U</mi><mo>=</mo>'+qty(B,2,'T')+'<mo>·</mo>'+qty(L,2,'m')+'<mo>·</mo>'+qty(v,1,'m/s'),
 unitResult('U',Ueq,3,'V'),
 v===0?'När staven står stilla uppkommer ingen rörelseinducerad laddningsseparation.':'Detta är jämviktsspänningen, inte en spänning uppmätt under uppbyggnaden. '+(v<0?'Övre änden blir negativ.':'Övre änden blir positiv.')+' Vid jämvikt gäller '+inlineM('<mi>q</mi><mi>E</mi><mo>=</mo><mi>q</mi><mi>v</mi><mi>B</mi>')+'.') :
 'Förutsäg först. Det schematiska reglaget visar laddningsseparation, inte en uppmätt tidskurva. Vilket samband gäller i jämvikt?';
 $("rod-show").textContent=rodShown?"Dölj jämviktsresultatet":"Visa jämvikt och spänning";
}
function resetRod(){rodShown=false;rodShown=false;for(const [id,val] of [["charge-progress","0"],["rod-B",".4"],["rod-v","3"],["rod-L","20"]])$(id).value=val;renderRod()}
for(const id of ["charge-progress","rod-B","rod-v","rod-L"])$(id).oninput=()=>{renderRod()};
$("rod-show").onclick=()=>{rodShown=!rodShown;renderRod()};
$("rod-reset").onclick=resetRod;
$("ind-rod-dynamic").closest(".slide").addEventListener("lesson:reset",resetRod);
$("rod-start").onclick=()=>{$("rod-v").value=3;$("charge-progress").value=100;renderRod()};
$("rod-stop").onclick=()=>{$("rod-v").value=0;$("charge-progress").value=0;renderRod()};
$("rod-reverse").onclick=()=>{$("rod-v").value=-(Number($("rod-v").value)||3);$("charge-progress").value=100;renderRod()};
let fluxShown=false;
function renderAngle(){
 const theta=Number($("flux-theta").value);
 const B=Number($("flux-B").value),area=Number($("flux-A").value);
 const d=fluxAngle(B,area,theta);
 $("flux-B-value").textContent=fmt(B,2)+" T";$("flux-A-value").textContent=fmt(area,3)+" m²";
 $("ind-flux-angle").innerHTML=d.html;
 $("flux-theta-value").textContent=fmt(theta,0)+"°";
 $("flux-angle-result").innerHTML=fluxShown?
 chain(Pformula,
 '<mi>Φ</mi><mo>=</mo>'+qty(B,2,'T')+'<mo>·</mo>'+qty(area,3,'m²')+'<mo>·</mo><mi mathvariant="normal">cos</mi><mo>(</mo><mn>'+fmt(theta,0)+'</mn><mo>°</mo><mo>)</mo>',
 unitResult('Φ',Math.abs(d.phi*1000)<1e-9?0:d.phi*1000,1,'mWb'),
 'Vinkeln mäts mellan fältet och den valda normalen. Flödets tecken visar orientering, inte negativ fältstyrka.') :
 'Förutsäg flödet innan resultatet visas. Ändra en storhet i taget.';
 $("flux-angle-show").textContent=fluxShown?"Dölj flödet":"Visa flödet";
}
for(const id of ["flux-theta","flux-B","flux-A"])$(id).oninput=()=>{renderAngle()};
$("flux-angle-show").onclick=()=>{fluxShown=!fluxShown;renderAngle()};
function resetAngle(){fluxShown=false;fluxShown=false;$("flux-theta").value=0;$("flux-B").value=.4;$("flux-A").value=.08;renderAngle()}
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
 'Förutsäg när '+inlineM('<mi>U</mi>')+' är skild från noll. '+inlineM('<mi>B</mi><mo>=</mo><mn>0,40</mn><mtext> T</mtext>')+', '+inlineM('<mi>L</mi><mo>=</mo><mn>0,20</mn><mtext> m</mtext>')+', och '+inlineM('<mi>v</mi><mo>=</mo><mn>0,50</mn><mtext> m/s</mtext>')+' endast under rörelsen.';
 $("loop-show").textContent=loopShown?"Dölj Φ och U":"Visa Φ och U";
}
$("loop-t").oninput=()=>{renderLoop()};
document.querySelectorAll("[data-loop]").forEach(b=>b.onclick=()=>{$("loop-t").value=b.dataset.loop;renderLoop()});
$("loop-show").onclick=()=>{loopShown=!loopShown;renderLoop()};
function resetLoop(){loopShown=false;loopShown=false;$("loop-t").value=0;renderLoop()}
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
 atCorner?'<b>Brytpunkt vid '+inlineM('<mi>t</mi><mo>=</mo><mn>'+fmt(t,1)+'</mn><mtext> s</mtext>')+'.</b> Lutningen byts tvärt. En idealiserad '+inlineM('<mi>U</mi><mo>(</mo><mi>t</mi><mo>)</mo>')+' har inget entydigt momentant värde exakt i denna punkt; jämför lutningen före och efter.' :
 chain(Fformula,
 '<mi>U</mi><mo>=</mo><mo>−</mo><mn>200</mn><mo>·</mo><mfrac><mrow><mn>'+fmt(rise,3)+'</mn><mtext> Wb</mtext></mrow><mrow><mn>'+fmt(interval,1)+'</mn><mtext> s</mtext></mrow></mfrac>',
 unitResult('U',v.U,1,'V'),
 'Flödet '+inlineM('<mi>Φ</mi><mo>=</mo><mn>'+fmt(v.phi,2)+'</mn><mtext> mWb</mtext>')+' genom ett varv. '+(v.U===0?'Lutningen är noll, trots att flödet kan vara stort.':v.U<0?'Ökande flöde ger negativ orienterad spänning.':'Minskande flöde ger positiv orienterad spänning.')) :
 'Förutsäg spänningens tecken. Läs två punkter för att bestämma lutningen '+inlineM('<mfrac><mrow><mo>Δ</mo><mi>Φ</mi></mrow><mrow><mo>Δ</mo><mi>t</mi></mrow></mfrac>')+'.';
 $("flux-time-show").textContent=graphShown?"Dölj resultat":"Visa lutning och spänning";
}
$("flux-time").oninput=()=>{renderGraph()};
$("flux-time-show").onclick=()=>{graphShown=!graphShown;renderGraph()};
function resetGraph(){graphShown=false;graphShown=false;$("flux-time").value=.1;renderGraph()}
$("flux-time-reset").onclick=resetGraph;
$("ind-flux-graph").closest(".slide").addEventListener("lesson:reset",resetGraph);
let tangentShown=false;
function renderTangent(){
 const t=Number($("ind-tangent-time").value),v=tangent(t);
 $("ind-tangent-graph").innerHTML=v.html;
 $("ind-tangent-time-value").textContent=fmt(t,2)+" s";
 $("ind-tangent-result").innerHTML=tangentShown?
 chain('<mi>U</mi><mo>=</mo><mo>−</mo><mi>N</mi><mfrac><mrow><mi>d</mi><mi>Φ</mi></mrow><mrow><mi>d</mi><mi>t</mi></mrow></mfrac>',
 '<mi>U</mi><mo>=</mo><mo>−</mo><mn>200</mn><mo>·</mo><mn>0,003</mn><mo>·</mo><mi>π</mi><mo>·</mo><mi mathvariant="normal">cos</mi><mo>(</mo><mi>π</mi><mo>·</mo><mn>'+fmt(t,2)+'</mn><mo>)</mo><mtext> V</mtext>',
 unitResult('U',Math.abs(v.U)<1e-10?0:v.U,2,'V'),
 'Exempelkurva: '+inlineM('<mi>Φ</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo><mn>3</mn><mi mathvariant="normal">sin</mi><mo>(</mo><mi>π</mi><mi>t</mi><mo>)</mo><mtext> mWb</mtext>')+' per varv. Vid maximum är tangentens lutning noll, alltså '+inlineM('<mi>U</mi><mo>=</mo><mn>0</mn>')+'.') :
 'Förutsäg tangentens lutning och spänningens tecken. Grafens höjd är inte U.';
 $("ind-tangent-show").textContent=tangentShown?"Dölj spänningen":"Visa tangentens spänning";
}
$("ind-tangent-time").oninput=()=>{renderTangent()};
$("ind-tangent-show").onclick=()=>{tangentShown=!tangentShown;renderTangent()};
function resetTangent(){tangentShown=false;tangentShown=false;$("ind-tangent-time").value=.5;renderTangent()}
$("ind-tangent-reset").onclick=resetTangent;
$("ind-tangent-graph").closest(".slide").addEventListener("lesson:reset",resetTangent);
resetRod();resetAngle();resetLoop();resetGraph();resetTangent();

// Additions use only in-memory state. No student data is sent or persisted.
let playFrame=0,lastFrame=0,playTime=0;
function pauseLoop(){cancelAnimationFrame(playFrame);playFrame=0;$("loop-play").textContent="Spela förloppet långsamt";}
function playTick(now){if(!$("ind-loop").closest(".slide").classList.contains("active")){pauseLoop();return;}const delta=Math.min((now-lastFrame)/1000,.1);lastFrame=now;const t=playTime=Math.min(1,playTime+delta/10);$("loop-t").value=t;renderLoop();if(t>=1){pauseLoop();return;}playFrame=requestAnimationFrame(playTick);}
// Use a finer step than the manual control to avoid rounding each animation frame.
$("loop-t").step="0.001";
$("loop-play").onclick=()=>{pauseLoop();if(Number($("loop-t").value)>=1)$("loop-t").value=0;playTime=Number($("loop-t").value);lastFrame=performance.now();$("loop-play").textContent="Spelar …";playFrame=requestAnimationFrame(playTick);};
$("loop-pause").onclick=pauseLoop;
$("loop-t").addEventListener("input",pauseLoop);
$("loop-reset").addEventListener("click",pauseLoop);
document.querySelectorAll('[data-loop]').forEach(b=>b.addEventListener('click',pauseLoop));
$("ind-loop").closest(".slide").addEventListener("lesson:reset",pauseLoop);
document.addEventListener('fy2:mode',pauseLoop);
let lenzShown=false;
function drawLenz(){const state=$("lenz-case").value,up=state==='increase',still=state==='constant';let fig='<circle cx="340" cy="170" r="105" fill="none" stroke="#b46a45" stroke-width="5"/>'+T(25,35,'Yttre flöde in i bilden: '+({increase:'ökar',decrease:'minskar',constant:'konstant'}[state]),'#254655',20);for(const x of [75,145,535,605])fig+=T(x,175,'×','#80aab7',28);if(lenzShown&&!still){fig+=T(320,190,up?'⊙':'⊗','#087b91',50);fig+=up?A(375,65,310,65):A(305,65,370,65);fig+=T(220,320,up?'Eget fält ut · ström moturs':'Eget fält in · ström medurs','#254655',19);}else fig+=T(180,180,lenzShown?'Ingen induktionsström':'Förutsäg eget fält och ström','#254655',18);$("lenz-compare").innerHTML=S(fig,680,350,'Lenz lag sedd rakt framifrån');$("lenz-feedback").textContent=lenzShown?{increase:'Flödet in ökar. Strömmen skapar ett fält ut ur bilden som motverkar ökningen. Högerhandsregeln ger moturs ström.',decrease:'Flödet in minskar. Strömmen skapar ett fält in i bilden som motverkar minskningen. Högerhandsregeln ger medurs ström.',constant:'Flödet ändras inte: '+inlineM('<mi>U</mi><mo>=</mo><mn>0</mn>')+'. Ingen induktionsström i den resistiva modellen utan annan spänningskälla.'}[state]:'';$("lenz-check").textContent=lenzShown?'Dölj förklaring':'Visa förklaring';}
$("lenz-case").onchange=()=>{lenzShown=false;drawLenz()};$("lenz-check").onclick=()=>{lenzShown=!lenzShown;drawLenz()};$("lenz-case").closest('.slide').addEventListener('lesson:reset',()=>{lenzShown=false;$("lenz-case").value='increase';drawLenz()});drawLenz();
const feedbackMathFragments=[["U = −100 · (−0,003)/0,2","<mi>U</mi><mo>=</mo><mo>−</mo><mn>100</mn><mo>·</mo><mfrac><mrow><mo>−</mo><mn>0,003</mn><mtext> Wb</mtext></mrow><mrow><mn>0,2</mn><mtext> s</mtext></mrow></mfrac>"],["0,8 − 0,6 = 0,2 s","<mn>0,8</mn><mo>−</mo><mn>0,6</mn><mo>=</mo><mn>0,2</mn><mtext> s</mtext>"],["3 mWb = 0,003 Wb","<mn>3</mn><mtext> mWb</mtext><mo>=</mo><mn>0,003</mn><mtext> Wb</mtext>"],["U = −N ΔΦ/Δt","<mi>U</mi><mo>=</mo><mo>−</mo><mi>N</mi><mfrac><mrow><mo>Δ</mo><mi>Φ</mi></mrow><mrow><mo>Δ</mo><mi>t</mi></mrow></mfrac>"],["U = −2 V","<mi>U</mi><mo>=</mo><mo>−</mo><mn>2</mn><mtext> V</mtext>"],["U = +3 V","<mi>U</mi><mo>=</mo><mo>+</mo><mn>3</mn><mtext> V</mtext>"],["U = 0 V","<mi>U</mi><mo>=</mo><mn>0</mn><mtext> V</mtext>"],["ΔΦ = 0","<mo>Δ</mo><mi>Φ</mi><mo>=</mo><mn>0</mn>"],["+1,5 V","<mo>+</mo><mn>1,5</mn><mtext> V</mtext>"],["U = 0","<mi>U</mi><mo>=</mo><mn>0</mn>"]];
function formattedFeedback(input){
 const raw=String(input),esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 let html='',pos=0;
 while(pos<raw.length){
  let closest=null;
  for(const [phrase,body] of feedbackMathFragments){const at=raw.indexOf(phrase,pos);if(at>=0&&(!closest||at<closest.at||(at===closest.at&&phrase.length>closest.phrase.length)))closest={at,phrase,body}}
  if(!closest){html+=esc(raw.slice(pos));break;}
  html+=esc(raw.slice(pos,closest.at))+inlineM(closest.body);pos=closest.at+closest.phrase.length;
 }
 return html;
}
function parseVoltage(raw){const text=raw.trim().replace(/−/g,'-').replace(',','.');return text!==''&&/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)?Number(text):NaN;}
function feedback(raw,i){const n=parseVoltage(raw),right=[-2,0,3][i];if(!Number.isFinite(n))return 'Skriv ett tal i V innan du kontrollerar.';if(Math.abs(n-right)<.005)return ['Rätt: flödet ökar, alltså U = −2 V.','Rätt: konstant flöde ger U = 0 V, även när flödet är 3 mWb.','Rätt: flödet minskar, alltså U = +3 V.'][i];if(right&&Math.abs(n+right)<.005)return 'Storleken stämmer. Kontrollera tecknet i U = −N ΔΦ/Δt.';if(right&&Math.abs(Math.abs(n)-Math.abs(right)*1000)<.5)return 'Kontrollera enheten: 3 mWb = 0,003 Wb. Omvandla före beräkningen.';return ['Använd flödesändringen 0 till 3 mWb och tiden 0,3 s. Multiplicera lutningen med −200.','Du behöver förändringen av flödet, inte dess höjd. Här är ΔΦ = 0.','Flödesändringen är −3 mWb. Intervallet är 0,8 − 0,6 = 0,2 s.'][i];}
$("voltage-check").onclick=()=>{for(let i=0;i<3;i++)$("voltage-feedback-"+(i+1)).innerHTML=formattedFeedback(feedback($("voltage-"+(i+1)).value,i))};
function clearPractice(){for(let i=1;i<=3;i++){$("voltage-"+i).value='';$("voltage-feedback-"+i).textContent='';}$("graph-practice").querySelectorAll('details').forEach(d=>d.open=false);}
$("voltage-clear").onclick=clearPractice;$("graph-practice").closest('.slide').addEventListener('lesson:reset',clearPractice);
for(let i=1;i<=3;i++)$("voltage-"+i).oninput=()=>{$("voltage-feedback-"+i).textContent='';};
$("transfer-check").onclick=()=>{const v=parseVoltage($("transfer-u").value);$("transfer-feedback").innerHTML=formattedFeedback(!Number.isFinite(v)?'Skriv ett tal i V.':Math.abs(v-1.5)<.005?'Rätt: halva antalet varv ger halva spänningen, +1,5 V.':v===-1.5?'Storleken stämmer. Flödet minskar, så minustecknet i induktionslagen ger positiv U.':'Använd U = −100 · (−0,003)/0,2. Jämför med 200 varv.');};
$("transfer-u").oninput=()=>{$("transfer-feedback").textContent='';};
$("transfer-u").closest('.slide').addEventListener('lesson:reset',()=>{$("transfer-u").value='';$("transfer-feedback").textContent='';});
document.addEventListener('fy2:mode',()=>{if(!document.body.classList.contains('repeat')){clearPractice();$("transfer-u").value='';$("transfer-feedback").textContent='';}});
// One shared physical model drives geometry, flux, emf and direction.
let passGraphs=false,passCurrent=false,passForce=false,passFrame=0,passLast=0,passTime=0;
function passModel(t){const front=.5*t-.1,back=front-.2,overlap=Math.max(0,Math.min(front,.6)-Math.max(back,0));const edge=[.2,.6,1.4,1.8].some(e=>Math.abs(t-e)<1e-7),enter=t>.2&&t<.6,leave=t>1.4&&t<1.8;return {front,back,phi:.4*.2*overlap,u:edge?null:enter?-.04:leave?.04:0,enter,leave};}
function renderPass(){const t=Number($('pass-time').value),p=passModel(t),x=v=>170+v*420;let scene='<rect x="170" y="70" width="252" height="170" fill="#e0f0f1"/>';
for(let a=190;a<422;a+=42)for(let b=95;b<240;b+=45)scene+=T(a,b,'×','#50858e',20);
scene+='<rect x="'+x(p.back)+'" y="105" width="84" height="84" fill="none" stroke="#b46a45" stroke-width="5"/>';
scene+=A(x(p.front)-60,265,x(p.front)+5,265,'#218a73')+T(x(p.front)-60,295,'v →','#218a73',18)+T(130,40,'B in i bilden','#254655',20);
if(passCurrent&&p.u){scene+=p.u<0?A(x(p.back)+75,105,x(p.back)+20,105,'#137c96'):A(x(p.back)+20,105,x(p.back)+75,105,'#137c96');scene+=T(15,330,p.u<0?'Ström moturs · eget fält ut':'Ström medurs · eget fält in','#137c96',19);}
if(passForce&&p.u)scene+=A(x(p.back)+48,153,x(p.back)-18,153,'#b24d40')+T(20,365,'Magnetisk nettokraft ←','#b24d40',19);
$('pass-scene').innerHTML=S(scene,690,390,'Sluten slinga passerar ett begränsat homogent magnetfält');$('pass-clock').textContent=fmt(t,2)+' s';
let lines=[];if(passGraphs)lines.push(inlineM('<mi>Φ</mi><mo>=</mo><mn>'+fmt(p.phi*1000,1)+'</mn><mtext> mWb</mtext>')+'. '+(p.u===null?'Fältkant: jämför spänningen precis före och efter.':inlineM('<mi>U</mi><mo>=</mo><mn>'+fmt(p.u,3)+'</mn><mtext> V</mtext>')+'.'));
if(passCurrent)lines.push(p.u===null?'Vid kanten byter strömmen idealiserat värde.':p.u===0?'Ingen induktionsström: flödet ändras inte.':p.enter?'Flödet inåt ökar: ström moturs motverkar ökningen.':'Flödet inåt minskar: ström medurs motverkar minskningen.');
if(passForce)lines.push(p.u===null?'Nettokraften byter värde vid kanten.':p.u===0?'Ingen magnetisk bromskraft i denna modell.':'Den magnetiska kraften bromsar. Det yttre arbetet omvandlas till värme i slingan.');
$('pass-feedback').innerHTML=lines.join(' ')||'Förutsäg flöde, spänning, ström och kraft. Visa ett samband i taget.';
$('pass-plots').hidden=!passGraphs;
if(passGraphs){const gx=t=>60+t*245,fy=v=>130-v*5000,uy=v=>290-v*1000;
let g=T(15,25,'Φ / mWb','#137c96',18)+T(15,205,'U / V','#b24d40',18);
g+='<path d="M60 130H648 M60 50V145 M60 290H648 M60 235V345" fill="none" stroke="#8aa0aa"/>';
g+='<polyline points="'+[0,.2,.6,1.4,1.8,2.4].map(a=>gx(a)+','+fy(passModel(a).phi)).join(' ')+'" fill="none" stroke="#137c96" stroke-width="4"/>';
for(const [a,b,u] of [[0,.2,0],[.2,.6,-.04],[.6,1.4,0],[1.4,1.8,.04],[1.8,2.4,0]])g+='<path d="M'+gx(a)+' '+uy(u)+'H'+gx(b)+'" stroke="#b24d40" stroke-width="4" fill="none"/>';
for(const a of [0,.2,.6,1,1.4,1.8,2.4])g+=T(gx(a)-10,165,fmt(a,1),'#254655',14)+T(gx(a)-10,365,fmt(a,1),'#254655',14);
g+=T(12,55,'16','#137c96',15)+T(25,135,'0','#137c96',15)+T(3,255,'+0,04','#b24d40',15)+T(25,295,'0','#b24d40',15)+T(3,335,'−0,04','#b24d40',15)+T(620,190,'t / s','#254655',15)+T(620,390,'t / s','#254655',15);
g+='<path d="M'+gx(t)+' 45V345" stroke="#254655" stroke-dasharray="5 5"/><circle cx="'+gx(t)+'" cy="'+fy(p.phi)+'" r="6" fill="#137c96"/>';
if(p.u!==null)g+='<circle cx="'+gx(t)+'" cy="'+uy(p.u)+'" r="6" fill="#b24d40"/>';
$('pass-plots').innerHTML=S(g,690,410,'Samtidiga grafer: flöde ökar, är konstant och minskar; spänning negativ, noll och positiv.');}
for(const [id,show,name] of [['pass-graphs',passGraphs,'grafer'],['pass-current',passCurrent,'ström'],['pass-force',passForce,'kraft']])$(id).textContent=(show?'Dölj ':'Visa ')+name;
}
function pausePass(){cancelAnimationFrame(passFrame);passFrame=0;$('pass-play').textContent='Spela långsamt';}
function tickPass(now){if(!$('passage').open||!$('passage').closest('.slide').classList.contains('active')){pausePass();return;}passTime=Math.min(2.4,passTime+Math.min(.1,(now-passLast)/1000)/5);passLast=now;$('pass-time').value=passTime;renderPass();if(passTime>=2.4)pausePass();else passFrame=requestAnimationFrame(tickPass);}
$('pass-play').onclick=()=>{pausePass();passTime=Number($('pass-time').value);if(passTime>=2.4)passTime=0;passLast=performance.now();$('pass-play').textContent='Spelar …';passFrame=requestAnimationFrame(tickPass)};
$('pass-pause').onclick=pausePass;$('pass-time').oninput=()=>{pausePass();renderPass()};document.querySelectorAll('[data-pass]').forEach(b=>b.onclick=()=>{pausePass();$('pass-time').value=b.dataset.pass;renderPass()});
$('pass-graphs').onclick=()=>{passGraphs=!passGraphs;renderPass()};$('pass-current').onclick=()=>{passCurrent=!passCurrent;renderPass()};$('pass-force').onclick=()=>{passForce=!passForce;renderPass()};
function resetPass(){pausePass();passGraphs=passCurrent=passForce=false;$('pass-time').value=0;renderPass()}
$('pass-reset').onclick=resetPass;$('passage').closest('.slide').addEventListener('lesson:reset',resetPass);document.addEventListener('fy2:mode',resetPass);renderPass();
})();
